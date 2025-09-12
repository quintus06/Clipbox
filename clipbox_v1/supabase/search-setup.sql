-- Configuration de la recherche Full-Text pour ClipBox
-- À exécuter dans l'éditeur SQL de Supabase

-- ============================================
-- 1. CAMPAGNES - Configuration de la recherche
-- ============================================

-- Ajouter la colonne de vecteur de recherche si elle n'existe pas
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Créer l'index GIN pour la recherche rapide
CREATE INDEX IF NOT EXISTS campaigns_search_idx 
ON campaigns USING GIN(search_vector);

-- Fonction pour mettre à jour le vecteur de recherche
CREATE OR REPLACE FUNCTION update_campaigns_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('french', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(NEW.brand, '')), 'C') ||
    setweight(to_tsvector('french', coalesce(NEW.category, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le vecteur
DROP TRIGGER IF EXISTS campaigns_search_vector_trigger ON campaigns;
CREATE TRIGGER campaigns_search_vector_trigger
BEFORE INSERT OR UPDATE ON campaigns
FOR EACH ROW
EXECUTE FUNCTION update_campaigns_search_vector();

-- Fonction de recherche pour les campagnes
CREATE OR REPLACE FUNCTION search_campaigns(search_term text, result_limit int DEFAULT 10)
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  brand text,
  budget numeric,
  status text,
  created_at timestamptz,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    c.brand,
    c.budget,
    c.status,
    c.created_at,
    ts_rank(c.search_vector, plainto_tsquery('french', search_term)) as rank
  FROM campaigns c
  WHERE c.search_vector @@ plainto_tsquery('french', search_term)
  ORDER BY rank DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 2. UTILISATEURS - Configuration de la recherche
-- ============================================

-- Ajouter la colonne de vecteur de recherche
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Créer l'index GIN
CREATE INDEX IF NOT EXISTS users_search_idx 
ON users USING GIN(search_vector);

-- Fonction pour mettre à jour le vecteur de recherche
CREATE OR REPLACE FUNCTION update_users_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('french', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(NEW.email, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(NEW.bio, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement
DROP TRIGGER IF EXISTS users_search_vector_trigger ON users;
CREATE TRIGGER users_search_vector_trigger
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_search_vector();

-- Fonction de recherche pour les utilisateurs
CREATE OR REPLACE FUNCTION search_users(search_term text, result_limit int DEFAULT 10)
RETURNS TABLE(
  id uuid,
  name text,
  email text,
  role text,
  created_at timestamptz,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.created_at,
    ts_rank(u.search_vector, plainto_tsquery('french', search_term)) as rank
  FROM users u
  WHERE u.search_vector @@ plainto_tsquery('french', search_term)
  ORDER BY rank DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. TICKETS SUPPORT - Configuration de la recherche
-- ============================================

-- Créer la table support_tickets si elle n'existe pas
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  message text NOT NULL,
  category text NOT NULL,
  priority text DEFAULT 'normal',
  status text DEFAULT 'open',
  assigned_to uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  search_vector tsvector
);

-- Créer l'index GIN
CREATE INDEX IF NOT EXISTS tickets_search_idx 
ON support_tickets USING GIN(search_vector);

-- Fonction pour mettre à jour le vecteur de recherche
CREATE OR REPLACE FUNCTION update_tickets_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('french', coalesce(NEW.subject, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(NEW.message, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(NEW.category, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement
DROP TRIGGER IF EXISTS tickets_search_vector_trigger ON support_tickets;
CREATE TRIGGER tickets_search_vector_trigger
BEFORE INSERT OR UPDATE ON support_tickets
FOR EACH ROW
EXECUTE FUNCTION update_tickets_search_vector();

-- Fonction de recherche pour les tickets
CREATE OR REPLACE FUNCTION search_tickets(search_term text, result_limit int DEFAULT 10)
RETURNS TABLE(
  id uuid,
  subject text,
  category text,
  status text,
  priority text,
  created_at timestamptz,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.subject,
    t.category,
    t.status,
    t.priority,
    t.created_at,
    ts_rank(t.search_vector, plainto_tsquery('french', search_term)) as rank
  FROM support_tickets t
  WHERE t.search_vector @@ plainto_tsquery('french', search_term)
  ORDER BY rank DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. RECHERCHE GLOBALE - Fonction unifiée
-- ============================================

CREATE OR REPLACE FUNCTION global_search(
  search_term text,
  search_type text DEFAULT 'all',
  result_limit int DEFAULT 10
)
RETURNS json AS $$
DECLARE
  campaigns_result json;
  users_result json;
  tickets_result json;
BEGIN
  -- Recherche dans les campagnes
  IF search_type IN ('all', 'campaigns') THEN
    SELECT json_agg(row_to_json(c))
    INTO campaigns_result
    FROM (
      SELECT * FROM search_campaigns(search_term, result_limit)
    ) c;
  ELSE
    campaigns_result := '[]'::json;
  END IF;

  -- Recherche dans les utilisateurs
  IF search_type IN ('all', 'users') THEN
    SELECT json_agg(row_to_json(u))
    INTO users_result
    FROM (
      SELECT * FROM search_users(search_term, result_limit)
    ) u;
  ELSE
    users_result := '[]'::json;
  END IF;

  -- Recherche dans les tickets
  IF search_type IN ('all', 'tickets') THEN
    SELECT json_agg(row_to_json(t))
    INTO tickets_result
    FROM (
      SELECT * FROM search_tickets(search_term, result_limit)
    ) t;
  ELSE
    tickets_result := '[]'::json;
  END IF;

  -- Retourner les résultats combinés
  RETURN json_build_object(
    'campaigns', COALESCE(campaigns_result, '[]'::json),
    'users', COALESCE(users_result, '[]'::json),
    'tickets', COALESCE(tickets_result, '[]'::json)
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. MISE À JOUR DES DONNÉES EXISTANTES
-- ============================================

-- Mettre à jour les vecteurs de recherche pour les données existantes
UPDATE campaigns 
SET search_vector = 
  setweight(to_tsvector('french', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('french', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('french', coalesce(brand, '')), 'C') ||
  setweight(to_tsvector('french', coalesce(category, '')), 'D')
WHERE search_vector IS NULL;

UPDATE users 
SET search_vector = 
  setweight(to_tsvector('french', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('french', coalesce(email, '')), 'B') ||
  setweight(to_tsvector('french', coalesce(bio, '')), 'C')
WHERE search_vector IS NULL;

UPDATE support_tickets 
SET search_vector = 
  setweight(to_tsvector('french', coalesce(subject, '')), 'A') ||
  setweight(to_tsvector('french', coalesce(message, '')), 'B') ||
  setweight(to_tsvector('french', coalesce(category, '')), 'C')
WHERE search_vector IS NULL;

-- ============================================
-- 6. PERMISSIONS (Row Level Security)
-- ============================================

-- Activer RLS sur les tables
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Politique pour les tickets (les utilisateurs voient leurs propres tickets)
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'support')
  ));

CREATE POLICY "Users can create own tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tickets" ON support_tickets
  FOR UPDATE USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'support')
  ));

-- ============================================
-- 7. INDEXES ADDITIONNELS POUR PERFORMANCE
-- ============================================

-- Index sur les colonnes fréquemment filtrées
CREATE INDEX IF NOT EXISTS campaigns_status_idx ON campaigns(status);
CREATE INDEX IF NOT EXISTS campaigns_created_at_idx ON campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS tickets_status_idx ON support_tickets(status);
CREATE INDEX IF NOT EXISTS tickets_priority_idx ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS tickets_user_id_idx ON support_tickets(user_id);

-- ============================================
-- INSTRUCTIONS D'UTILISATION
-- ============================================

-- Pour rechercher dans toutes les tables:
-- SELECT * FROM global_search('terme de recherche');

-- Pour rechercher uniquement dans les campagnes:
-- SELECT * FROM search_campaigns('terme de recherche');

-- Pour rechercher uniquement dans les utilisateurs:
-- SELECT * FROM search_users('terme de recherche');

-- Pour rechercher uniquement dans les tickets:
-- SELECT * FROM search_tickets('terme de recherche');
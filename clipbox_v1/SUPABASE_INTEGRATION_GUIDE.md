# 🚀 Guide d'Intégration Supabase pour ClipBox

## 📋 Étapes d'Intégration Complète

### Étape 1: Créer un Projet Supabase

1. **Allez sur [Supabase.com](https://supabase.com)**
2. **Créez un compte gratuit** ou connectez-vous
3. **Cliquez sur "New Project"**
4. **Configurez votre projet** :
   - Project name: `clipbox`
   - Database Password: *Choisissez un mot de passe fort*
   - Region: *Choisissez la région la plus proche*
   - Pricing Plan: Free (pour commencer)

### Étape 2: Récupérer les Clés API

1. **Dans votre dashboard Supabase**, allez dans **Settings → API**
2. **Copiez ces valeurs** :
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   Anon/Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Étape 3: Configurer les Variables d'Environnement

1. **Créez un fichier `.env.local`** à la racine du projet :
   ```bash
   cp .env.local.example .env.local
   ```

2. **Éditez `.env.local`** avec vos clés :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Étape 4: Installer les Dépendances

```bash
npm install @supabase/supabase-js
```

### Étape 5: Créer les Tables dans Supabase

1. **Allez dans SQL Editor** dans votre dashboard Supabase
2. **Exécutez ces scripts SQL dans l'ordre** :

#### Script 1: Créer les Tables de Base
```sql
-- Table des utilisateurs
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('clipper', 'advertiser', 'admin')) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des campagnes
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  requirements TEXT,
  advertiser_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des soumissions
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  clipper_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  feedback TEXT,
  views INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des paiements
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clipper_id UUID REFERENCES users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des tickets de support (déjà dans search-setup.sql)
-- Sera créée par le script de recherche
```

#### Script 2: Configurer la Recherche Full-Text
```sql
-- Copiez et exécutez tout le contenu du fichier supabase/search-setup.sql
-- Ce script configure la recherche full-text pour toutes les tables
```

### Étape 6: Configurer l'Authentification

1. **Dans Supabase Dashboard**, allez dans **Authentication → Providers**
2. **Activez Email** pour l'authentification par email
3. **Configurez les templates d'email** dans **Authentication → Email Templates**

#### Créer le Hook d'Authentification
```sql
-- Fonction pour créer automatiquement un profil utilisateur après inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'clipper')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour exécuter la fonction après inscription
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Étape 7: Configurer les Politiques de Sécurité (RLS)

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table users
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Politiques pour la table campaigns
CREATE POLICY "Anyone can view active campaigns" ON campaigns
  FOR SELECT USING (status = 'active');

CREATE POLICY "Advertisers can create campaigns" ON campaigns
  FOR INSERT WITH CHECK (
    auth.uid() = advertiser_id AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'advertiser')
  );

CREATE POLICY "Advertisers can update own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = advertiser_id);

-- Politiques pour la table submissions
CREATE POLICY "Clippers can view own submissions" ON submissions
  FOR SELECT USING (auth.uid() = clipper_id);

CREATE POLICY "Clippers can create submissions" ON submissions
  FOR INSERT WITH CHECK (
    auth.uid() = clipper_id AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'clipper')
  );

-- Politiques pour la table payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = clipper_id);
```

### Étape 8: Ajouter des Données de Test

```sql
-- Insérer des utilisateurs de test
INSERT INTO users (email, name, role, bio) VALUES
  ('clipper1@test.com', 'Jean Clipper', 'clipper', 'Créateur de contenu passionné'),
  ('clipper2@test.com', 'Marie Creator', 'clipper', 'Spécialiste TikTok'),
  ('advertiser1@test.com', 'Nike France', 'advertiser', 'Compte officiel Nike France'),
  ('advertiser2@test.com', 'Adidas Team', 'advertiser', 'Équipe marketing Adidas'),
  ('admin@clipbox.com', 'Admin ClipBox', 'admin', 'Administrateur de la plateforme');

-- Insérer des campagnes de test
INSERT INTO campaigns (title, description, brand, category, budget, status, advertiser_id) VALUES
  ('Lancement Air Max 2024', 'Promouvoir les nouvelles Air Max', 'Nike', 'Sport', 5000, 'active', 
   (SELECT id FROM users WHERE email = 'advertiser1@test.com')),
  ('Collection Printemps', 'Nouvelle collection Adidas', 'Adidas', 'Mode', 3500, 'active',
   (SELECT id FROM users WHERE email = 'advertiser2@test.com'));

-- Insérer des tickets de support de test
INSERT INTO support_tickets (user_id, subject, message, category, priority, status) VALUES
  ((SELECT id FROM users WHERE email = 'clipper1@test.com'), 
   'Problème de paiement', 'Je n\'ai pas reçu mon paiement', 'Paiement', 'high', 'open'),
  ((SELECT id FROM users WHERE email = 'clipper2@test.com'),
   'Question sur les campagnes', 'Comment postuler à une campagne?', 'Général', 'normal', 'open');
```

### Étape 9: Tester l'Intégration

1. **Redémarrez votre serveur de développement** :
   ```bash
   npm run dev
   ```

2. **Testez la recherche** :
   - Ouvrez votre application
   - Appuyez sur `Cmd/Ctrl + K`
   - Tapez "Nike" ou "Paiement"
   - Vous devriez voir les résultats de la base de données

3. **Vérifiez dans Supabase Dashboard** :
   - Allez dans **Table Editor**
   - Vérifiez que les tables sont créées
   - Vérifiez que les données de test sont présentes

### Étape 10: Implémenter l'Authentification (Optionnel)

#### Créer les Pages d'Authentification

1. **Page de Connexion** (`src/app/auth/login/page.tsx`)
2. **Page d'Inscription** (`src/app/auth/register/page.tsx`)
3. **Hook d'Authentification** (`src/hooks/useAuth.ts`)

#### Exemple de Hook d'Authentification
```typescript
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
```

## 🔍 Vérification de l'Intégration

### Checklist de Vérification

- [ ] **Variables d'environnement** configurées dans `.env.local`
- [ ] **Dépendances installées** (`@supabase/supabase-js`)
- [ ] **Tables créées** dans Supabase
- [ ] **Script de recherche** exécuté (search-setup.sql)
- [ ] **Données de test** insérées
- [ ] **RLS configuré** pour la sécurité
- [ ] **Recherche fonctionnelle** (Cmd/Ctrl + K)
- [ ] **API de recherche** retourne des données réelles

## 🛠️ Dépannage

### La recherche ne fonctionne pas
1. Vérifiez les variables d'environnement
2. Vérifiez que le script SQL a été exécuté
3. Consultez les logs dans la console du navigateur
4. Vérifiez les logs dans Supabase Dashboard → Logs

### Erreur 401 Unauthorized
- Vérifiez que `NEXT_PUBLIC_SUPABASE_ANON_KEY` est correct
- Vérifiez les politiques RLS

### Erreur de connexion à la base de données
- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` est correct
- Vérifiez votre connexion internet
- Vérifiez le statut de votre projet Supabase

## 📚 Ressources Utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Guide d'Authentification Supabase](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Full-Text Search](https://supabase.com/docs/guides/database/full-text-search)

## 🎉 Félicitations !

Votre application ClipBox est maintenant **complètement intégrée avec Supabase** ! 

Vous avez :
- ✅ Une base de données PostgreSQL complète
- ✅ Une recherche full-text performante
- ✅ Un système d'authentification prêt
- ✅ Des politiques de sécurité configurées
- ✅ Des données de test pour commencer

---

*Pour toute question, consultez la documentation Supabase ou contactez le support.*
# ClipBox - Guide de Configuration de la Recherche

## 📋 Vue d'ensemble

Ce document explique comment configurer et utiliser le système de recherche global de ClipBox avec Supabase.

## 🚀 Configuration Rapide

### 1. Installation des dépendances

```bash
npm install @supabase/supabase-js
```

### 2. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Configuration de la base de données

Exécutez le script SQL fourni dans `supabase/search-setup.sql` dans l'éditeur SQL de Supabase :

1. Connectez-vous à votre dashboard Supabase
2. Allez dans SQL Editor
3. Copiez et collez le contenu de `supabase/search-setup.sql`
4. Exécutez le script

## 🔍 Fonctionnalités de Recherche

### Recherche Globale

Le composant de recherche globale (`src/components/ui/global-search.tsx`) offre :

- **Recherche en temps réel** : Résultats instantanés avec debounce de 300ms
- **Raccourci clavier** : `Cmd/Ctrl + K` pour ouvrir la recherche
- **Historique** : Sauvegarde des 5 dernières recherches
- **Catégories** : Résultats organisés par type (Campagnes, Utilisateurs, Tickets)
- **Navigation au clavier** : Support complet des raccourcis clavier

### Types de Recherche

1. **Campagnes** : Recherche par titre, description, marque, catégorie
2. **Utilisateurs** : Recherche par nom, email, bio
3. **Tickets Support** : Recherche par sujet, message, catégorie

## 📁 Structure des Fichiers

```
clipbox_v1/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── search/
│   │           └── route.ts          # API endpoint pour la recherche
│   ├── components/
│   │   └── ui/
│   │       └── global-search.tsx     # Composant de recherche global
│   └── lib/
│       └── supabase.ts               # Client Supabase (à créer)
├── supabase/
│   └── search-setup.sql             # Script SQL pour configurer la recherche
└── README_SEARCH.md                 # Ce fichier
```

## 🛠️ Configuration Détaillée

### Création du Client Supabase

Créez le fichier `src/lib/supabase.ts` :

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client public pour le côté client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin pour le côté serveur (API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
```

### Intégration dans les Pages

Pour ajouter la recherche globale dans vos layouts :

```tsx
import GlobalSearch from '@/components/ui/global-search';

export default function Layout({ children }) {
  return (
    <div>
      <header>
        <GlobalSearch />
      </header>
      {children}
    </div>
  );
}
```

## 🔧 Personnalisation

### Modifier les Poids de Recherche

Dans `supabase/search-setup.sql`, ajustez les poids (A, B, C, D) pour prioriser certains champs :

```sql
setweight(to_tsvector('french', coalesce(NEW.title, '')), 'A')  -- Poids maximum
setweight(to_tsvector('french', coalesce(NEW.description, '')), 'B')
```

### Changer la Langue de Recherche

Remplacez `'french'` par votre langue dans les fonctions SQL :

```sql
to_tsvector('english', coalesce(NEW.title, ''))
plainto_tsquery('english', search_term)
```

### Ajuster le Debounce

Dans `src/components/ui/global-search.tsx`, modifiez la valeur du debounce (ligne 82) :

```typescript
}, 300),  // Changez 300 pour ajuster le délai (en ms)
```

## 📊 Performance

### Optimisations Appliquées

1. **Index GIN** : Recherche ultra-rapide sur les vecteurs
2. **Debounce** : Réduit les requêtes API
3. **Limite de résultats** : 10 résultats par défaut
4. **Cache localStorage** : Pour l'historique des recherches

### Recommandations

- **Mise à jour régulière** : Les vecteurs de recherche sont mis à jour automatiquement via triggers
- **Monitoring** : Surveillez les performances dans Supabase Dashboard > Database > Query Performance
- **Scaling** : Pour de gros volumes, considérez la pagination des résultats

## 🐛 Dépannage

### La recherche ne retourne aucun résultat

1. Vérifiez que le script SQL a été exécuté correctement
2. Assurez-vous que les tables contiennent des données
3. Vérifiez les variables d'environnement
4. Consultez les logs dans la console du navigateur

### Erreur 401 Unauthorized

- Vérifiez que `NEXT_PUBLIC_SUPABASE_ANON_KEY` est correctement configuré
- Assurez-vous que les politiques RLS permettent la lecture

### Performance lente

1. Vérifiez que les index GIN sont créés :
```sql
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('campaigns', 'users', 'support_tickets');
```

2. Analysez les tables pour optimiser les statistiques :
```sql
ANALYZE campaigns;
ANALYZE users;
ANALYZE support_tickets;
```

## 📝 Notes Importantes

1. **Sécurité** : N'exposez jamais `SUPABASE_SERVICE_ROLE_KEY` côté client
2. **RLS** : Les politiques Row Level Security sont configurées dans le script SQL
3. **Backup** : Sauvegardez votre base de données avant d'exécuter le script SQL
4. **Test** : Testez d'abord en environnement de développement

## 🤝 Support

Pour toute question ou problème :
1. Consultez la documentation Supabase : https://supabase.com/docs
2. Vérifiez les logs dans Supabase Dashboard
3. Contactez l'équipe de développement

## 📚 Ressources

- [Supabase Full-Text Search](https://supabase.com/docs/guides/database/full-text-search)
- [PostgreSQL Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Hooks](https://react.dev/reference/react)

---

*Dernière mise à jour : Janvier 2025*
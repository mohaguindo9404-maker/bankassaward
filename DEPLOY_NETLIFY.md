# Déploiement Netlify

## 1. Prérequis
- Compte Netlify
- Git installé
- Node.js 18+

## 2. Configuration
Le fichier `netlify.toml` est déjà configuré.

## 3. Déploiement

### Option A: Drag & Drop
1. `npm run build`
2. Glisser le dossier `out` sur netlify.com

### Option B: Git
```bash
git init
git add .
git commit -m "Deploy"
git remote add origin https://github.com/votre-username/bkss-award.git
git push -u origin main
```

Puis connecter Netlify à GitHub.

## 4. Variables d'environnement
Dans Netlify Dashboard > Site settings > Environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=votre_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service
```

## 5. API Routes
Les routes API seront déployées comme fonctions Netlify automatiquement.

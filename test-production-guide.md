# 🚀 GUIDE DE TEST EN PRODUCTION

## 📋 Méthodes pour tester avant le push

### 1️⃣ **Test Local en Mode Production**
```bash
# Build et test local
npm run build
npm start

# Accès: http://localhost:3000
# Simule l'environnement de production
```

### 2️⃣ **Test avec Environment Variables**
```bash
# Créer .env.local pour tester
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://bankassaward.org

# Lancer en mode production
npm run build
npm start
```

### 3️⃣ **Test avec Vercel Preview**
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer en preview
vercel --no-deployment-protection

# Obtenez une URL temporaire pour tester
# Ex: https://your-app-abc123.vercel.app
```

### 4️⃣ **Test avec Netlify Drop**
1. Allez sur https://app.netlify.com/drop
2. Glissez votre dossier `build` ou `.next`
3. Testez l'URL temporaire

### 5️⃣ **Test avec Docker**
```bash
# Créer Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

# Build et run
docker build -t bkss-award .
docker run -p 3000:3000 bkss-award
```

---

## 🧪 **Tests Automatisés à Lancer**

### Script de Test Complet
```bash
# Lancer tous les tests
npm run test
npm run build
npm run start
```

### Tests API en Production
```bash
# Tester les endpoints
curl -X GET https://bankassaward.org/api/categories
curl -X GET https://bankassaward.org/api/votes
curl -X GET https://bankassaward.org/api/voting-config
```

### Test d'Upload en Production
```bash
# Tester l'upload d'image
curl -X POST \
  -F "file=@test-image.png" \
  https://bankassaward.org/api/simple-upload
```

---

## 🔍 **Checklist Avant Push**

### ✅ **Tests Fonctionnels**
- [ ] Connexion admin fonctionne
- [ ] Vote fonctionne avec modal de confirmation
- [ ] Upload d'images fonctionne
- [ ] Notifications s'envoient
- [ ] Pages responsive sur mobile

### ✅ **Tests Techniques**
- [ ] Build réussi sans erreurs
- [ ] Variables d'environnement configurées
- [ ] APIs retournent status 200
- [ ] Images uploadées avec URLs correctes
- [ ] Base de données accessible

### ✅ **Tests de Sécurité**
- [ ] Validation UUID fonctionne
- [ ] Authentification sécurisée
- [ ] Pas de données sensibles exposées
- [ ] CORS configuré correctement

---

## 🛠️ **Commandes de Test Rapides**

### Test Complet Automatisé
```bash
npm run build && npm run start &
sleep 5
curl -f http://localhost:3000/api/categories || echo "❌ API Categories failed"
curl -f http://localhost:3000/api/votes || echo "❌ API Votes failed"
curl -f http://localhost:3000/api/voting-config || echo "❌ API Config failed"
```

### Test Upload Image
```bash
# Créer image de test
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > test.png

# Tester upload
curl -X POST \
  -F "file=@test.png" \
  http://localhost:3000/api/simple-upload
```

---

## 🌐 **Services de Test en Ligne**

### 1️⃣ **Vercel (Recommandé)**
```bash
# Installation
npm i -g vercel

# Login
vercel login

# Preview deployment
vercel --no-deployment-protection
```

### 2️⃣ **Netlify**
```bash
# Installation
npm i -g netlify-cli

# Login
netlify login

# Deploy preview
netlify deploy --dir=.next --prod=false
```

### 3️⃣ **GitHub Actions**
```yaml
# .github/workflows/test.yml
name: Test Production
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
```

---

## 📊 **Monitoring en Production**

### Logs et Erreurs
```bash
# Vercel logs
vercel logs

# Netlify logs
netlify functions:logs

# Vérifier le statut
curl -I https://bankassaward.org
```

### Performance
```bash
# Test de charge
npm install -g artillery
artillery run load-test.yml
```

---

## 🎯 **Recommandation**

**Méthode la plus simple : Vercel Preview**

1. `npm i -g vercel`
2. `vercel login`
3. `vercel --no-deployment-protection`
4. Testez l'URL temporaire
5. Si tout fonctionne ✅ → Push vers production

Cela vous donne une URL temporaire pour tester toutes les fonctionnalités avant de mettre en production !

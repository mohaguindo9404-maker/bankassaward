# 🚫 Contrôle d'Accès - Blocage de Plateforme

## 📋 Description
Ce système permet de bloquer l'accès à la plateforme BANKASS AWARDS en attente de paiement.

## 🔧 Configuration

### 📍 Fichier de configuration
`lib/access-control.ts`

```typescript
export const ACCESS_CONFIG = {
  // Mettre à true pour bloquer l'accès
  isBlocked: true,
  
  // Message affiché lors du blocage
  blockMessage: "🔒 Plateforme temporairement inaccessible",
  
  // Message détaillé
  blockDetails: "La plateforme est actuellement en maintenance en attente de paiement...",
  
  // Contact pour débloquer
  contactInfo: "Contact: admin@bkss-award.com",
  
  // Code d'activation
  activationCode: "bkss2024",
  
  // Date limite (optionnel)
  deadline: null
}
```

## 🎯 Utilisation

### 1️⃣ **Bloquer la plateforme**
```typescript
// Dans lib/access-control.ts
export const ACCESS_CONFIG = {
  isBlocked: true,  // ✅ Mettre à true
  // ... autres configurations
}
```

### 2️⃣ **Débloquer la plateforme**
```typescript
// Dans lib/access-control.ts
export const ACCESS_CONFIG = {
  isBlocked: false,  // ✅ Mettre à false
  // ... autres configurations
}
```

### 3️⃣ **Code d'activation temporaire**
- Code par défaut : `bkss2024`
- Permet un déblocage temporaire
- Redirection automatique après validation

## 🔐 Sécurité

### 🛡️ **Points de sécurité**
- ✅ Contrôle côté client
- ✅ Code d'activation requis
- ✅ Message de contact personnalisé
- ✅ Design professionnel et sécurisé

### 📞 **Contact pour déblocage**
- Email : `admin@bkss-award.com`
- Téléphone : `+223 XX XX XX XX`

## 🎨 Interface utilisateur

### 🚫 **Page bloquée**
- Design avec cadenas rouge
- Message clair de maintenance
- Formulaire d'activation
- Informations de contact

### ✅ **Page débloquée**
- Message de succès
- Redirection automatique
- Accès complet à la plateforme

## 🔄 Déploiement

### 📦 **Mettre en production**
1. Modifier `lib/access-control.ts`
2. Changer `isBlocked: true`
3. Faire `git add` et `git push`
4. Vercel déploie automatiquement

### 🚀 **Déblocage rapide**
1. Utiliser le code `bkss2024`
2. Ou modifier `isBlocked: false`
3. Push sur GitHub

## 📝 Notes importantes

- ⚠️ Le contrôle est côté client (peut être contourné)
- 🔐 Pour une sécurité renforcée, ajouter un contrôle côté serveur
- 💰 Le système est conçu pour la gestion de paiement
- 🎯 Idéal pour les SaaS et plateformes payantes

## 🛠️ Maintenance

### 🔧 **Personnalisation**
- Modifier les messages dans `ACCESS_CONFIG`
- Changer le code d'activation
- Ajouter une date limite
- Personnaliser le design dans `AccessBlocked.tsx`

### 📞 **Support**
Pour toute question sur le système de blocage :
- Email : `admin@bkss-award.com`
- Documentation complète dans ce fichier

---

**⚠️ Important** : Ce système est une première couche de sécurité. Pour une protection complète, implémentez également des contrôles côté serveur.

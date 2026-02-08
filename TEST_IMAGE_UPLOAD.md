# 🧪 Guide de Test - Upload d'Images

## ✅ **Corrections Appliquées**

### **Problème Identifié**
- ❌ Les infos personnelles se modifiaient mais PAS l'image
- ❌ `handleSave` était synchrone au lieu d'asynchrone

### **Solution Appliquée**
- ✅ `handleSave` rendu asynchrone avec `await`
- ✅ Interface mise à jour pour `Promise<void>`
- ✅ État de chargement ajouté
- ✅ Logging détaillé pour diagnostiquer

---

## 🔧 **Comment Tester**

### **1. Ouvrir la Console**
- `F12` → Onglet "Console"
- Cherchez les logs avec 🔄, 📸, 📤

### **2. Test d'Upload**
1. **Aller en Admin** → Super Admin
2. **Modifier un candidat** → Cliquez "Modifier"
3. **Changer l'image** :
   - Glissez une nouvelle image
   - OU collez une URL
4. **Vérifier la console** :
   ```
   🔄 Mise à jour candidat: [ID] [Nom]
   📸 Image URL: [URL ou base64]
   📤 Données complètes envoyées: {...}
   ```

### **3. Sauvegarder**
1. **Cliquez "Enregistrer"**
2. **Bouton devient** : "Enregistrement..." avec spinner
3. **Vérifier la console API** :
   ```
   📤 Données reçues pour mise à jour: {...}
   📤 Données converties pour DB: {...}
   ✅ Candidat mis à jour: {...}
   ```

---

## 🔍 **Dépannage**

### **Si l'image ne s'enregistre pas :**

#### **1. Vérifier la Console**
```javascript
// Cherchez ces logs :
🔄 Mise à jour candidat: [ID] [Nom]
📸 Image URL: [doit être non vide]
📤 Données complètes envoyées: [doit contenir l'image]
```

#### **2. Vérifier l'API**
```javascript
// Dans la console réseau (F12 → Network)
/api/candidates (PUT)
Status: 200 OK
Response: { id, name, image, ... }
```

#### **3. Vérifier la Base de Données**
- L'image doit être dans la colonne `image`
- Format : `data:image/jpeg;base64,...` ou URL

---

## 📊 **Cas de Test**

### **✅ Test 1 : Upload Fichier**
1. Glissez une image JPG
2. Vérifiez : `📸 Image URL: data:image/jpeg;base64,...`
3. Sauvegardez
4. **Résultat attendu** : Image sauvegardée en base64

### **✅ Test 2 : URL Externe**
1. Collez : `https://example.com/photo.jpg`
2. Vérifiez : `📸 Image URL: https://example.com/photo.jpg`
3. Sauvegardez
4. **Résultat attendu** : URL sauvegardée directement

### **✅ Test 3 : Modification**
1. Changez nom + bio + image
2. Sauvegardez
3. **Résultat attendu** : Tout est sauvegardé

---

## 🚨 **Messages d'Erreur**

### **Si vous voyez :**
```
❌ Erreur lors de la mise à jour du candidat
```
**Vérifiez :**
- Taille de l'image (< 2MB)
- Format (JPG, PNG, WebP)
- Connexion internet

### **Si vous voyez :**
```
❌ Erreur Supabase: column "image" does not exist
```
**Solution :** La colonne `image` n'existe pas dans la table

---

## 🎯 **Vérification Finale**

### **Après sauvegarde :**
1. **Rafraîchir la page**
2. **Vérifier l'image** : Doit être la nouvelle
3. **Vérifier les infos** : Doivent être les nouvelles
4. **Console** : Doit montrer "✅ Candidat mis à jour"

---

## 📞 **Support**

Si le problème persiste :
1. **Ouvrez la console** (F12)
2. **Faites une capture d'écran** des logs
3. **Notez l'URL de l'image** dans les logs
4. **Vérifiez l'onglet Network** pour la requête API

**Le système est maintenant corrigé et testé !** 🚀

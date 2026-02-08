# 🧪 GUIDE DE TEST COMPLET

## ✅ **Corrections Appliquées**

### **1. Upload d'Images**
- ✅ API `/api/simple-upload` avec logging détaillé
- ✅ Fichiers sauvegardés dans `public/uploads/candidates/`
- ✅ URLs simples : `/uploads/candidates/123456_abc.jpg`
- ✅ Logging dans la console pour diagnostiquer

### **2. Système de Votes**
- ✅ API `/api/voting-config` avec logging
- ✅ Ouverture/fermeture des votes
- ✅ Messages de blocage personnalisés
- ✅ État récupérable en temps réel

---

## 🚀 **COMMENT TESTER**

### **ÉTAPE 1 : Démarrer l'application**
```bash
npm run dev
```

### **ÉTAPE 2 : Ouvrir la console**
- `F12` → Onglet "Console"
- Cherchez les logs avec 📸, 🗳️, ✅, ❌

### **ÉTAPE 3 : Test Upload Images**
1. **Aller en Admin** → Super Admin
2. **Modifier un candidat** → Cliquez "Modifier"
3. **Glisser une image** :
   ```
   📸 Fichier sélectionné: image.jpg image/jpeg 123456
   📤 Envoi vers /api/simple-upload...
   ✅ Fichier uploadé: /uploads/candidates/123456_abc.jpg
   🎉 Image appliquée: /uploads/candidates/123456_abc.jpg
   ```
4. **Sauvegarder** → Vérifiez le dossier `public/uploads/candidates/`

### **ÉTAPE 4 : Test Votes**
1. **Aller en Admin** → Section votes
2. **Ouvrir les votes** :
   ```
   🗳️ Mise à jour configuration votes: {currentEvent: "Test", isVotingOpen: true}
   ✅ Configuration votes mise à jour: {...}
   ```
3. **Fermer les votes** :
   ```
   🗳️ Mise à jour configuration votes: {isVotingOpen: false, blockMessage: "Votes fermés"}
   ✅ Configuration votes mise à jour: {...}
   ```

---

## 🔧 **SCRIPT DE TEST AUTOMATISÉ**

### **Exécuter le test complet**
```bash
node test-complet.js
```

### **Ce que le script teste**
1. ✅ Récupération état actuel
2. ✅ Ouverture des votes
3. ✅ Vérification état (ouvert)
4. ✅ Fermeture des votes
5. ✅ Vérification état (fermé)
6. ✅ Upload d'image

---

## 📁 **Vérifications Manuelles**

### **1. Dossier Upload**
```
public/uploads/candidates/
├── 123456_abc123.jpg
├── 123457_def456.png
└── 123458_ghi789.webp
```

### **2. Base de Données**
```sql
-- Table candidates
SELECT id, name, image FROM candidates;
-- image doit contenir: /uploads/candidates/123456_abc.jpg

-- Table voting_config
SELECT * FROM voting_config;
-- is_voting_open doit changer entre true/false
```

### **3. Console Navigateur**
- **Upload** : 📸, 📤, ✅, 🎉
- **Votes** : 🗳️, ✅
- **Erreurs** : ❌ avec détails

---

## 🚨 **DÉPANNAGE**

### **Si l'upload ne marche pas**
1. **Vérifiez la console** :
   ```
   📸 Fichier sélectionné: [nom] [type] [taille]
   📤 Envoi vers /api/simple-upload...
   📥 Réponse API: 200 OK
   ✅ Résultat upload: {success: true, url: "..."}
   ```
2. **Vérifiez le dossier** : `public/uploads/candidates/`
3. **Vérifiez Network** : Requête `/api/simple-upload`

### **Si les votes ne marchent pas**
1. **Vérifiez la console** :
   ```
   🗳️ Mise à jour configuration votes: {...}
   ✅ Configuration votes mise à jour: {...}
   ```
2. **Vérifiez la base** : Table `voting_config`
3. **Vérifiez Network** : Requête `/api/voting-config`

---

## 📊 **RÉSULTATS ATTENDUS**

### **Upload Images**
- ✅ Fichier créé dans `public/uploads/candidates/`
- ✅ URL retournée : `/uploads/candidates/...`
- ✅ Image visible dans l'interface
- ✅ Base de données mise à jour avec l'URL

### **Votes**
- ✅ Bouton "Ouvrir les votes" fonctionne
- ✅ Bouton "Fermer les votes" fonctionne
- ✅ Message de blocage affiché
- ✅ État synchronisé partout

---

## 🎯 **VALIDATION FINALE**

### **✅ Upload OK**
- [ ] Fichier uploadé dans le bon dossier
- [ ] URL retournée correcte
- [ ] Image visible dans l'admin
- [ ] Base de données mise à jour

### **✅ Votes OK**
- [ ] Ouverture des votes fonctionne
- [ ] Fermeture des votes fonctionne
- [ ] Message de blocage affiché
- [ ] État cohérent

---

## 📞 **SUPPORT**

Si quelque chose ne marche pas :
1. **Ouvrez la console** (F12)
2. **Faites une capture** des logs
3. **Vérifiez les dossiers** créés
4. **Exécutez le script** de test automatique

**Tous les systèmes sont maintenant corrigés et testés !** 🚀

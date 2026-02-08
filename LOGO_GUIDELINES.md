# Bankass Awards - Logo Guidelines

## 🎨 Logo Professionnel

### Versions disponibles

#### 1. Logo Moderne (Principal)
- **Fichier** : `/public/logo-modern.svg`
- **Dimensions** : 200x60px
- **Usage** : Navigation principale, en-têtes
- **Style** : Moderne avec dégradé et ombres

#### 2. Logo Compact
- **Fichier** : `/public/logo-compact.svg`
- **Dimensions** : 180x50px
- **Usage** : Espaces réduits, mobile
- **Style** : Simplifié et épuré

#### 3. Favicon
- **Fichier** : `/public/favicon.svg`
- **Dimensions** : 32x32px
- **Usage** : Onglets de navigateur, favoris
- **Style** : Icône avec trophée

### Couleurs de la marque

#### Primaire
- **Orange** : `#FF6B35` (RGB: 255, 107, 53)
- **Doré** : `#F7931E` (RGB: 247, 147, 30)

#### Secondaire
- **Sombre** : `#1E293B` (RGB: 30, 41, 59)
- **Gris** : `#64748B` (RGB: 100, 116, 139)

#### Dégradés
```css
/* Dégradé principal */
background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);

/* Dégradé texte */
background: linear-gradient(90deg, #1E293B 0%, #334155 100%);
```

### Typographie

#### Police principale
- **Famille** : 'Segoe UI', Arial, sans-serif
- **Poids** : 700 (bold) pour "BANKASS"
- **Poids** : 500 (medium) pour "AWARDS"

#### Espacement
- **Lettres** : 0.5px pour "BANKASS"
- **Lettres** : 2px pour "AWARDS"

### Éléments du logo

#### Trophée
- **Symbolisme** : Récompense, excellence, victoire
- **Couleur** : Dégradé orange
- **Style** : Moderne avec reflets

#### Texte
- **BANKASS** : Nom principal, gras
- **AWARDS** : Catégorie, espacé
- **2026** : Année de l'édition

### Règles d'utilisation

#### ✅ Bonnes pratiques
- Utiliser le SVG pour la qualité optimale
- Maintenir l'espace minimum autour du logo
- Respecter les proportions originales
- Utiliser sur fond clair ou sombre approprié

#### ❌ À éviter
- Déformer ou étirer le logo
- Modifier les couleurs
- Ajouter des ombres supplémentaires
- Utiliser sur des fonds trop chargés

### Formats et tailles

#### Web
- **SVG** : Pour tous les usages web (recommandé)
- **PNG** : Pour compatibilité maximale
- **Tailles** : 200x60px (standard), 100x30px (petit)

#### Print
- **Vectoriel** : AI, EPS, PDF
- **Hauteur minimale** : 20mm
- **Résolution** : 300 DPI minimum

### Intégration technique

#### HTML
```html
<!-- Logo principal -->
<img src="/logo-modern.svg" alt="Bankass Awards" class="h-10 w-auto">

<!-- Logo compact -->
<img src="/logo-compact.svg" alt="Bankass Awards" class="h-8 w-auto">
```

#### CSS
```css
.logo {
  height: 40px;
  width: auto;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.05);
}
```

#### React/Next.js
```jsx
<img 
  src="/logo-modern.svg" 
  alt="Bankass Awards" 
  className="h-10 w-auto"
  priority
/>
```

### Variations

#### Thème sombre
- Le logo reste inchangé
- Bon contraste garanti
- Aucune adaptation nécessaire

#### Thème clair
- Version standard utilisée
- Excellent lisibilité
- Dégradés bien visibles

### Fichiers sources

#### Originaux
- **Format** : SVG vectoriel
- **Logiciel** : Adobe Illustrator ou équivalent
- **Calques** : Organisés et nommés

#### Export
- **Optimisation** : SVGO pour le web
- **Compression** : Sans perte de qualité
- **Compatibilité** : Tous navigateurs modernes

---

## 🎯 Recommandations

1. **Utiliser toujours le SVG** pour la meilleure qualité
2. **Maintenir la cohérence** sur toutes les plateformes
3. **Tester le rendu** sur différents fonds
4. **Respecter les espacements** minimum
5. **Mettre à jour** les dérivés si modification

Pour toute question ou demande de variation, contacter le designer.

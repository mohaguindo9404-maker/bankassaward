@echo off
echo 🚀 Déploiement Bankass Awards sur Netlify...
echo.

echo 1. Nettoyage du build précédent...
if exist out rmdir /s /q out
if exist .next rmdir /s /q .next

echo 2. Installation des dépendances...
npm install

echo 3. Build du projet...
npm run build

echo 4. Vérification du build...
if exist out (
    echo ✅ Build réussi!
    echo 📁 Dossier 'out' créé avec succès
) else (
    echo ❌ Erreur de build!
    pause
    exit /b
)

echo.
echo 🎯 Prochaines étapes:
echo 1. Allez sur netlify.com
echo 2. Glissez le dossier 'out' dans la zone de déploiement
echo 3. Configurez les variables d'environnement:
echo    - NEXT_PUBLIC_SUPABASE_URL
echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
echo    - SUPABASE_SERVICE_ROLE_KEY
echo.
echo 🌐 Votre site sera disponible à: https://votre-site.netlify.app
echo.
pause

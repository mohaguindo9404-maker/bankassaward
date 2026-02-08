-- CORRECTION DE LA TABLE candidates
-- Ajout de la colonne image manquante

-- 1. Ajouter la colonne image à la table candidates
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS image TEXT;

-- 2. Mettre à jour les candidats existants avec une image par défaut si nécessaire
UPDATE candidates 
SET image = '/uploads/candidates/default-avatar.png'
WHERE image IS NULL OR image = '';

-- 3. Vérification
SELECT id, name, image 
FROM candidates 
ORDER BY created_at DESC 
LIMIT 5;

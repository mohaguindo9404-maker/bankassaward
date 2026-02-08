-- CORRECTION DES URLs D'IMAGES
-- Transformer les URLs relatives en URLs complètes

-- 1. Mettre à jour toutes les URLs relatives en URLs complètes
UPDATE candidates 
SET image = 
  CASE 
    WHEN image LIKE '/uploads/%' 
    THEN 'http://localhost:3000' || image
    WHEN image IS NULL OR image = '' 
    THEN 'http://localhost:3000/uploads/candidates/default-avatar.png'
    ELSE image
  END;

-- 2. Vérification
SELECT id, name, image 
FROM candidates 
ORDER BY created_at DESC 
LIMIT 5;

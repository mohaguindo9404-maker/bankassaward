-- CORRECTION DE LA TABLE voting_config
-- Résout les problèmes de colonnes manquantes et d'ID

-- 1. Ajouter la colonne manquante current_event
ALTER TABLE voting_config 
ADD COLUMN IF NOT EXISTS current_event TEXT;

-- 2. Mettre à jour les enregistrements existants avec un ID valide
UPDATE voting_config 
SET id = 'main' 
WHERE id NOT LIKE 'main%';

-- 3. Insérer une configuration par défaut si nécessaire
INSERT INTO voting_config (id, current_event, is_voting_open, block_message, created_at, updated_at)
VALUES (
    'main',
    NULL,
    false,
    'Votes temporairement indisponible. Les votes sont actuellement fermés. Ils seront ouverts très bientôt. Pour plus d''information contactez le 70359104 (WhatsApp)',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    current_event = EXCLUDED.current_event,
    is_voting_open = EXCLUDED.is_voting_open,
    block_message = EXCLUDED.block_message,
    updated_at = NOW();

-- 4. Nettoyer les anciens enregistrements (garder seulement le main)
DELETE FROM voting_config 
WHERE id != 'main';

-- Vérification
SELECT * FROM voting_config WHERE id = 'main';

-- CORRECTION DE voting_config POUR LES VOTES
-- Utiliser l'UUID existant au lieu de 'main'

-- 1. Récupérer l'UUID existant et l'utiliser pour les mises à jour
-- L'API doit utiliser l'UUID existant au lieu de 'main'

-- Mettre à jour l'enregistrement existant avec le bon message
UPDATE voting_config 
SET 
    current_event = NULL,
    is_voting_open = false,
    block_message = 'Votes temporairement indisponible. Les votes sont actuellement fermés. Ils seront ouverts très bientôt. Pour plus d''information contactez le 70359104 (WhatsApp)',
    updated_at = NOW()
WHERE id = '66c822a3-798c-493f-8490-4d13d378231b';

-- Vérification
SELECT id, is_voting_open, block_message 
FROM voting_config 
WHERE id = '66c822a3-798c-493f-8490-4d13d378231b';

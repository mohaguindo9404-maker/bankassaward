-- Table pour la configuration des votes
CREATE TABLE IF NOT EXISTS voting_config (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'main',
    is_voting_open BOOLEAN DEFAULT false,
    block_message TEXT DEFAULT 'Les votes sont actuellement fermés. Ils seront ouverts le jour de l''événement.',
    current_event JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les notifications aux utilisateurs
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Insérer la configuration par défaut
INSERT INTO voting_config (id, is_voting_open, block_message) 
VALUES ('main', false, 'Les votes sont actuellement fermés. Ils seront ouverts le jour de l''événement.')
ON CONFLICT (id) DO NOTHING;

-- Commentaires pour la documentation
COMMENT ON TABLE voting_config IS 'Configuration du système de vote - contrôle l''ouverture/fermeture des votes et les messages associés';
COMMENT ON TABLE notifications IS 'Notifications envoyées aux utilisateurs - votes ouverts, alertes, etc.';
COMMENT ON COLUMN voting_config.is_voting_open IS 'Statut d''ouverture des votes (true = ouverts, false = fermés)';
COMMENT ON COLUMN voting_config.block_message IS 'Message affiché aux utilisateurs quand les votes sont fermés';
COMMENT ON COLUMN notifications.type IS 'Type de notification: VOTING_OPENED, ALERT, INFO, etc.';
COMMENT ON COLUMN notifications.read IS 'Statut de lecture de la notification (true = lue, false = non lue)';

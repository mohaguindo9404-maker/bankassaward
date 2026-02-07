-- Ajouter les colonnes manquantes pour le Prix Leadership
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS is_leadership_prize BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS special BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pre_assigned_winner TEXT,
ADD COLUMN IF NOT EXISTS pre_assigned_winner_image TEXT,
ADD COLUMN IF NOT EXISTS pre_assigned_winner_bio TEXT,
ADD COLUMN IF NOT EXISTS pre_assigned_winner_achievements TEXT[];

-- Insérer la catégorie Prix Leadership
INSERT INTO categories (
    id,
    name, 
    description,
    is_leadership_prize,
    special,
    pre_assigned_winner,
    pre_assigned_winner_image,
    pre_assigned_winner_bio,
    pre_assigned_winner_achievements,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Prix d''Honneur Leadership',
    '- Révéler à la fin du vote',
    true,
    true,
    'Kassim Guindo',
    '/kassim-guindo-portrait-leadership.jpg',
    'Kassim Guindo, figure emblématique de Bankass, demeure une légende vivante dans le cœur de tous ceux qui l''ont connu. Visionnaire et leader naturel, il a consacré sa vie à l''émancipation de sa communauté, croyant fermement que chaque jeune de Bankass portait en lui les graines de la grandeur.',
    ARRAY[
        'Fondateur du mouvement Winner Boys',
        'Mentor de centaines de jeunes de Bankass',
        'Pionnier du développement communautaire local',
        'Symbole d''espoir et de résilience pour toute une génération',
        'Bâtisseur de ponts entre tradition et modernité'
    ],
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

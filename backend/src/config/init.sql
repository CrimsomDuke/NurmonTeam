
INSERT INTO "Types" (name, "createdAt", "updatedAt") VALUES
 ( 'Normal',       NOW(), NOW()),
 ( 'Fire',         NOW(), NOW()),
 ( 'Water',        NOW(), NOW()),
 ( 'Electric',     NOW(), NOW()),
 ( 'Grass',        NOW(), NOW()),
 ( 'Ice',          NOW(), NOW()),
 ( 'Fighting',     NOW(), NOW()),
 ( 'Poison',       NOW(), NOW()),
 ( 'Ground',       NOW(), NOW()),
 ('Flying',       NOW(), NOW()),
 ('Psychic',      NOW(), NOW()),
 ('Bug',          NOW(), NOW()),
 ('Rock',         NOW(), NOW()),
 ('Ghost',        NOW(), NOW()),
 ('Dragon',       NOW(), NOW()),
 ('Dark',         NOW(), NOW()),
 ('Steel',        NOW(), NOW()),
 ('Fairy',        NOW(), NOW()),
 ('Stellar',      NOW(), NOW());


INSERT INTO "Nature" (
  name, buff_stat, nerf_stat,
  hp_multiplier, def_multiplier, attack_multiplier,
  special_attack_multiplier, special_def_multiplier, speed_multiplier,
  "createdAt", "updatedAt"
) VALUES
-- Neutral natures (no effect)
('Hardy',  NULL, NULL, 1,1,1,1,1,1, NOW(), NOW()),
('Docile', NULL, NULL, 1,1,1,1,1,1, NOW(), NOW()),
('Bashful',NULL, NULL, 1,1,1,1,1,1, NOW(), NOW()),
('Quirky', NULL, NULL, 1,1,1,1,1,1, NOW(), NOW()),
('Serious',NULL, NULL, 1,1,1,1,1,1, NOW(), NOW()),

-- Attack+ / Sp. Atk−
('Adamant', 'attack', 'special_attack', 1,1,1.1,0.9,1,1, NOW(), NOW()),
('Lonely',  'attack', 'defense',        1,1,1.1,1,1,1, NOW(), NOW()),
('Brave',   'attack', 'speed',          1,1,1.1,1,1,0.9, NOW(), NOW()),
('Naughty', 'attack', 'special_defense',1,1,1.1,1,0.9,1, NOW(), NOW()),

-- Defense+ / Attack−
('Bold',    'defense', 'attack',        1,1.1,1,1,1,1, NOW(), NOW()),
('Relaxed', 'defense', 'speed',         1,1.1,1,1,1,0.9, NOW(), NOW()),
('Impish',  'defense', 'special_attack',1,1.1,1,0.9,1,1, NOW(), NOW()),
('Lax',     'defense', 'special_defense',1,1.1,1,1,0.9,1, NOW(), NOW()),

-- Speed+ / Attack−
('Timid',   'speed',   'attack',        1,1,1,1,1,1.1, NOW(), NOW()),
('Hasty',   'speed',   'defense',       1,1,1,1,1,1.1, NOW(), NOW()),
('Jolly',   'speed',   'special_attack',1,1,1,1,1,1.1, NOW(), NOW()),
('Naive',   'speed',   'special_defense',1,1,1,1,1,1.1, NOW(), NOW()),

-- Sp. Atk+ / Attack−
('Modest',  'special_attack', 'attack',     1,1,1,1.1,1,1, NOW(), NOW()),
('Mild',    'special_attack', 'defense',    1,1,1,1.1,1,1, NOW(), NOW()),
('Quiet',   'special_attack', 'speed',      1,1,1,1.1,1,0.9, NOW(), NOW()),
('Rash',    'special_attack', 'special_defense',1,1,1,1.1,0.9,1, NOW(), NOW()),

-- Sp. Def+ / Attack−
('Calm',    'special_defense', 'attack',    1,1,1,1,1.1,1, NOW(), NOW()),
('Gentle',  'special_defense', 'defense',   1,1,1,1,1.1,1, NOW(), NOW()),
('Careful', 'special_defense', 'special_attack',1,1,1,1,1.1,1, NOW(), NOW()),
('Sassy',   'special_defense', 'speed',     1,1,1,1,1.1,0.9, NOW(), NOW());


INSERT INTO "Abilities" (id, "name", description, "createdAt", "updatedAt") VALUES
(1, 'Levitate', 'Gives full immunity to all Ground-type moves.', NOW(), NOW()),
(2, 'Intimidate', 'Lowers the opposing Pokémon''s Attack stat.', NOW(), NOW()),
(3, 'Overgrow', 'Powers up Grass-type moves when the Pokémon''s HP is low.', NOW(), NOW()),
(4, 'Blaze', 'Powers up Fire-type moves when the Pokémon''s HP is low.', NOW(), NOW()),
(5, 'Torrent', 'Powers up Water-type moves when the Pokémon''s HP is low.', NOW(), NOW()),
(6, 'Sturdy', 'The Pokémon cannot be knocked out with one hit.', NOW(), NOW());

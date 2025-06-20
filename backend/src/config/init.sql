
INSERT INTO "Types"("name", "createdAt", "updatedAt")
VALUES ('Test Type', CURRENT_DATE, CURRENT_DATE);

INSERT INTO "Abilities" (id, "name", description, "createdAt", "updatedAt") VALUES
(1, 'Levitate', 'Gives full immunity to all Ground-type moves.', NOW(), NOW()),
(2, 'Intimidate', 'Lowers the opposing Pokémon''s Attack stat.', NOW(), NOW()),
(3, 'Overgrow', 'Powers up Grass-type moves when the Pokémon''s HP is low.', NOW(), NOW()),
(4, 'Blaze', 'Powers up Fire-type moves when the Pokémon''s HP is low.', NOW(), NOW()),
(5, 'Torrent', 'Powers up Water-type moves when the Pokémon''s HP is low.', NOW(), NOW()),
(6, 'Sturdy', 'The Pokémon cannot be knocked out with one hit.', NOW(), NOW());

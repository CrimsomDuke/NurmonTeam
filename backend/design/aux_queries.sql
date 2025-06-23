SELECT id, "name", description, "createdAt", "updatedAt" 
FROM "Abilities";

SELECT id, "name", description, image_path, "createdAt", "updatedAt" 
FROM "Items";

SELECT id, team_member_id, nurmon_movement_id, 
	"createdAt", "updatedAt" 
FROM "MemberNurmonMovements";

SELECT id, "name", is_physical, power, type_id, "createdAt", 
	"updatedAt" 
FROM "Movements";

SELECT id, "name", buff_stat, nerf_stat, hp_multiplier,
	def_multiplier, attack_multiplier, special_attack_multiplier, 
	special_def_multiplier, speed_multiplier, "createdAt", "updatedAt" 
FROM "Nature";

SELECT id, nurmon_id, movement_id, "createdAt", "updatedAt"
FROM "NurmonMovements";

SELECT id, "name", image_path, hp, def, attack, special_attack, 
	special_def, speed, type_id, first_ability_id, 
	second_ability_id, third_ability_id, "createdAt", "updatedAt"
FROM "Nurmons";

SELECT id, nickname, nurmon_id, team_id, nature_id, 
	selected_ability_id, item_id, hp_ev, attack_ev, 
	def_ev, special_attack_ev, special_def_ev, speed_ev, 
	hp_iv, attack_iv, def_iv, special_attack_iv, 	
	special_def_iv, speed_iv, "createdAt", "updatedAt" 
FROM "TeamMembers";

SELECT id, "name", user_id, "createdAt", "updatedAt" 
FROM "Teams";

SELECT id, "name", "createdAt", "updatedAt" 
FROM "Types";

SELECT id, username, "password", email, "createdAt", "updatedAt", "is_admin"
FROM "Users";

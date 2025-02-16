"use strict";


function handleKeyDown(evt) {
    Keyboard.keyDown[evt.keyCode] = true;
}

function handleKeyUp(evt) {
    Keyboard.keyDown[evt.keyCode] = false;
}
var Keyboard = { keyDown : {} };

var Keys = {
    A: 65,     B: 66,      C: 67,      D: 68,       E: 69,      F: 70,
    G: 71,     H: 72,      I: 73,      J: 74,       K: 75,      L: 76,
    M: 77,     N: 78,      O: 79,      P: 80,       Q: 81,      R: 82,
    S: 83,     T: 84,      U: 85,      V: 86,       W: 87,      X: 88,
    Y: 89,     Z: 90
};

var Game = {
    canvas : undefined,
    canvasContext : undefined,
	player_sprite1 : undefined,
	player_sprite2 : undefined,
	left_arrow : undefined,
	statetime : undefined,
	active_arrows_W : [],
	active_arrows_A : [],
	active_arrows_S : [],
	active_arrows_D : [],
	enemy_active_arrows_W : [],
	enemy_active_arrows_A : [],
	enemy_active_arrows_S : [],
	enemy_active_arrows_D : [],
	cur_window_x_size : undefined,
	cur_window_y_size : undefined,
	player_health : 12,
	time_of_last_input : undefined,
	W_held : false,
	A_held : false,
	S_held : false,
	D_held : false,
	P_held : false,
	idle_index : 0,
	enemy_idle_index : 0,
	cringe_alert : false,
	looking_good : true,
	enemy_last_input_time : 0,
	enemy_last_input : 0,
	death_index : 0,
	game_over : false,
	RECORDED_ARRAY : []
};

Game.start = async function () {
    Game.canvas = document.getElementById("myCanvas");
    Game.canvasContext = Game.canvas.getContext("2d");
	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
	Game.load_arrows();
	Game.last_correct_pressed_key = 1;
	Game.load_player_sprites();
	Game.load_astrid();
	Game.load_UI_elements();
	Game.load_DEATHING();
	var d = new Date();
    Game.start_time = d.getTime();
	Game.load_musix();
	await Game.loadGameData();
	Game.compensator();
	//Game.resize_window();
	//window.addEventListener('resize', Game.resize_window);
    window.setTimeout(Game.mainLoop, 500);
};

Game.compensator = function() {
	for(let index = 0; index < Game.arrow_sequence.length; ++index) {
		Game.arrow_sequence[index][0] -= 690 / (Game.arrow_speed * 60);
	}
	for(let index = 0; index < Game.enemy_arrow_sequence.length; ++index) {
		Game.enemy_arrow_sequence[index][0] -= 690 / (Game.arrow_speed * 60);
	}	
	//Game.arrow_sequence = Game.arrow_sequence.pop();
	//console.log('compensated data: ', Game.arrow_sequence);
}

Game.load_arrows = function() {
	Game.left_arrow = new Image();
	Game.left_arrow.src = "./arrows/left arrow.png";
	Game.down_arrow = new Image();
	Game.down_arrow.src = "./arrows/down arrow.png";
	Game.up_arrow = new Image();
	Game.up_arrow.src = "./arrows/up arrow.png";
	Game.right_arrow = new Image();
	Game.right_arrow.src = "./arrows/right arrow.png";
}

Game.load_player_sprites = function() {
	Game.up1 = new Image();
	Game.up1.src = "./player_sprites/_D/up/+_Hat_up!-1.png";
	Game.up2 = new Image();
	Game.up2.src = "./player_sprites/_D/up/+_Hat_up!-2.png";
	Game.up3 = new Image();
	Game.up3.src = "./player_sprites/_D/up/+_Hat_up!-3.png";
	
	Game.down1 = new Image();
	Game.down1.src = "./player_sprites/_D/down/Down-1.png";
	Game.down2 = new Image();
	Game.down2.src = "./player_sprites/_D/down/Down-2.png";
	Game.down3 = new Image();
	Game.down3.src = "./player_sprites/_D/down/Down-3.png";
	
	Game.right1 = new Image();
	Game.right1.src = "./player_sprites/_D/riight/Right-1.png";
	Game.right2 = new Image();
	Game.right2.src = "./player_sprites/_D/riight/Right-2.png";
	Game.right3 = new Image();
	Game.right3.src = "./player_sprites/_D/riight/Right-3.png";
	
	Game.left1 = new Image();
	Game.left1.src = "./player_sprites/_D/left/left-1.png";
	Game.left2 = new Image();
	Game.left2.src = "./player_sprites/_D/left/left-2.png";
	Game.left3 = new Image();
	Game.left3.src = "./player_sprites/_D/left/left-3.png";
	
	Game.uc1 = new Image();
	Game.uc1.src = "./player_sprites/_D/Cinge/Cinge_up!-1.png";
	Game.uc2 = new Image();
	Game.uc2.src = "./player_sprites/_D/Cinge/Cinge_up!-2.png"
	Game.uc3 = new Image();
	Game.uc3.src = "./player_sprites/_D/Cinge/Cinge_up!-3.png"

	Game.dc1 = new Image();
	Game.dc1.src = "./player_sprites/_D/Cinge/Cinge_Down-1.png"
	Game.dc2 = new Image();
	Game.dc2.src = "./player_sprites/_D/Cinge/Cinge_Down-2.png"
	Game.dc3 = new Image();
	Game.dc3.src = "./player_sprites/_D/Cinge/Cinge_Down-3.png"

	Game.rc1 = new Image();
	Game.rc1.src = "./player_sprites/_D/Cinge/Cinge_Right-1.png"
	Game.rc2 = new Image();
	Game.rc2.src = "./player_sprites/_D/Cinge/Cinge_Right-2.png"
	Game.rc3 = new Image();
	Game.rc3.src = "./player_sprites/_D/Cinge/Cinge_Right-3.png"

	Game.lc1 = new Image();
	Game.lc1.src = "./player_sprites/_D/Cinge/Cinge_left-1.png"
	Game.lc2 = new Image();
	Game.lc2.src = "./player_sprites/_D/Cinge/Cinge_left-2.png"
	Game.lc3 = new Image();
	Game.lc3.src = "./player_sprites/_D/Cinge/Cinge_left-3.png"
	
	Game.idle1 = new Image();
	Game.idle1.src = "./player_sprites/_D/IDA-le/Export_Idle-1.png"
	Game.idle2 = new Image();
	Game.idle2.src = "./player_sprites/_D/IDA-le/Export_Idle-2.png"
	Game.idle3 = new Image();
	Game.idle3.src = "./player_sprites/_D/IDA-le/Export_Idle-3.png"
	Game.idle4 = new Image();
	Game.idle4.src = "./player_sprites/_D/IDA-le/Export_Idle-4.png"
	Game.idle5 = new Image();
	Game.idle5.src = "./player_sprites/_D/IDA-le/Export_Idle-5.png"
	
	Game.player_sprites = [[Game.left1, Game.left2, Game.left3, Game.lc1, Game.lc2, Game.lc3],[Game.right1, Game.right2, Game.right3, Game.rc1, Game.rc2, Game.rc3],[Game.up1, Game.up2, Game.up3, Game.uc1, Game.uc2, Game.uc3],[Game.down1, Game.down2, Game.down3, Game.dc1, Game.dc2, Game.dc3],[Game.idle1,Game.idle2,Game.idle3,Game.idle4,Game.idle5]]
}

Game.load_DEATHING = function() {
	Game.death1 = new Image();
	Game.death1.src = "./DIE/D_I_E-1.png"
	Game.death2 = new Image();
	Game.death2.src = "./DIE/D_I_E-2.png"
	Game.death3 = new Image();
	Game.death3.src = "./DIE/D_I_E-3.png"
	Game.death4 = new Image();
	Game.death4.src = "./DIE/D_I_E-4.png"
	Game.death5 = new Image();
	Game.death5.src = "./DIE/D_I_E-5.png"
	Game.death6 = new Image();
	Game.death6.src = "./DIE/D_I_E-6.png"
	Game.death7 = new Image();
	Game.death7.src = "./DIE/D_I_E-7.png"
	Game.death8 = new Image();
	Game.death8.src = "./DIE/D_I_E-8.png"
	Game.death9 = new Image();
	Game.death9.src = "./DIE/D_I_E-9.png"
	Game.death10 = new Image();
	Game.death10.src = "./DIE/D_I_E-10.png"
	Game.death11 = new Image();
	Game.death11.src = "./DIE/D_I_E-11.png"
	Game.death12 = new Image();
	Game.death12.src = "./DIE/D_I_E-12.png"
	Game.death13 = new Image();
	Game.death13.src = "./DIE/D_I_E-13.png"
	Game.death14 = new Image();
	Game.death14.src = "./DIE/D_I_E-14.png"
	Game.death_animation = [Game.death1,Game.death2,Game.death3,Game.death4,Game.death5,Game.death6,Game.death7,Game.death8,Game.death9,Game.death10,Game.death11,Game.death12,Game.death13,Game.death14]
}

Game.load_astrid = function() {
	Game.eup1 = new Image();
	Game.eup1.src = "./astrid/Up-1.png";
	Game.eup2 = new Image();
	Game.eup2.src = "./astrid/Up-2.png";
	
	Game.edown1 = new Image();
	Game.edown1.src = "./astrid/Down-1.png";
	Game.edown2 = new Image();
	Game.edown2.src = "./astrid/Down-2.png";
	
	
	Game.eright1 = new Image();
	Game.eright1.src = "./astrid/Right_-1.png";
	Game.eright2 = new Image();
	Game.eright2.src = "./astrid/Right_-2.png";
	
	
	Game.eleft1 = new Image();
	Game.eleft1.src = "./astrid/Left-1.png";
	Game.eleft2 = new Image();
	Game.eleft2.src = "./astrid/Left-2.png";
	
	Game.ei1 = new Image();
	Game.ei1.src = "./astrid/Idle-1.png";
	Game.ei2 = new Image();
	Game.ei2.src = "./astrid/Idle-2.png";
	Game.ei3 = new Image();
	Game.ei3.src = "./astrid/Idle-3.png";
	Game.ei4 = new Image();
	Game.ei4.src = "./astrid/Idle-4.png";
	Game.ei5 = new Image();
	Game.ei5.src = "./astrid/Idle-5.png";
	
	Game.enemy_sprites = [[Game.eleft1, Game.eleft2],[Game.eright1, Game.eright2],[Game.eup1, Game.eup2],[Game.edown1, Game.edown2],[Game.ei1, Game.ei2, Game.ei3, Game.ei4, Game.ei5]]
}

Game.load_UI_elements = function() {
	Game.healthbar = new Image();
	Game.healthbar.src = "./UI/health_bar.png"
	Game.healthhat = new Image();
	Game.healthhat.src = "./UI/Bar_icon.png"
	Game.healthhat2 = new Image();
	Game.healthhat2.src = "./UI/Bar_icon2.png"
	Game.hitmarkers = new Image();
	Game.hitmarkers.src = "./arrows/hitmarkers.png"
	Game.loser_image = new Image();
	Game.loser_image.src = "./UI/LOSERHAHAHAHA.png"
	Game.bakgrund = new Image();
	Game.bakgrund.src = "./UI/bakgrund.png"
}

Game.load_musix = function() {
	Game.level_musix = new Audio();
    Game.level_musix.src = "./musik/poppies.mp4";
    Game.level_musix.volume = 1;
}

Game.loadGameData = async function() {
  try {
	const timestamp = new Date().getTime(); // Unique timestamp
    const response = await fetch('./level1.json?cache_bust=${timestamp}');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const gameData = await response.json();
	
    //console.log('Loaded game data:', gameData);
	Game.arrow_speed = Number(gameData.pop());
    Game.arrow_sequence = gameData;
	} catch (error) {
    console.error('Failed to load player data:', error.message);
	}
	try {
	//Enemy
	const response2 = await fetch('./enemy1.json?cache_bust=${timestamp}');
    if (!response2.ok) {
      throw new Error(`HTTP error! Status: ${response2.status}`);
    }

    const gameData2 = await response2.json();
	
    Game.enemy_arrow_sequence = gameData2;
	
	console.log('Loaded game data:', Game.enemy_arrow_sequence);
	//console.log('speed: ', Game.arrow_speed)
  } catch (error) {
    console.error('Failed to load enemy data:', error.message);
  }
}

document.addEventListener( 'DOMContentLoaded', Game.start);

Game.get_in_round_time = function() {
	var d = new Date();
	return (d.getTime() - Game.start_time) / 1000;
}

// Function to resize the canvas
Game.resize_window = function () {
    Game.gameArea = document.getElementById('myCanvas');
    Game.canvas.width = gameArea.offsetWidth;
    Game.canvas.height = gameArea.offsetHeight;
}


Game.mainLoop = function() {
    Game.clearCanvas();
    Game.update();
    Game.draw();
	
    window.setTimeout(Game.mainLoop, 1);
};


//Logic
Game.savefile = function() {
	
	// Convert the game data to JSON format
	const jsonString = JSON.stringify(Game.RECORDED_ARRAY, null, 2);

	// Create a Blob
	const blob = new Blob([jsonString], { type: 'application/json' });

	// Create a download link
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = 'enemy1.json'; // File name
	link.click();

	// Clean up
	URL.revokeObjectURL(link.href);
}

Game.add_to_recorded_array = function(button) {
	var d = new Date();
	Game.RECORDED_ARRAY = [[(d.getTime() - Game.start_time) / 1000, button, 0]].concat(Game.RECORDED_ARRAY);
}

Game.remove_missed_arrows = function() {
	
	if (Game.active_arrows_W.length != 0 && Game.active_arrows_W[Game.active_arrows_W.length - 1][0] <= 0){
		Game.active_arrows_W.pop()
		//Game.decrease_health()
		Game.time_of_last_input = Game.get_in_round_time()
		//Game.cringe_alert = true;
		
	}
	if (Game.active_arrows_A.length != 0 && Game.active_arrows_A[Game.active_arrows_A.length - 1][0] <= 0){
		Game.active_arrows_A.pop()
		//Game.decrease_health()
		Game.time_of_last_input = Game.get_in_round_time()
		//Game.cringe_alert = true;
	}
	if (Game.active_arrows_S.length != 0 && Game.active_arrows_S[Game.active_arrows_S.length - 1][0] <= 0){
		Game.active_arrows_S.pop()
		//Game.decrease_health()
		Game.time_of_last_input = Game.get_in_round_time()
		//Game.cringe_alert = true;
	}
	if (Game.active_arrows_D.length != 0 && Game.active_arrows_D[Game.active_arrows_D.length - 1][0] <= 0){
		Game.active_arrows_D.pop()
		//Game.decrease_health()
		Game.time_of_last_input = Game.get_in_round_time()
		//Game.cringe_alert = true;
	}
}

Game.increase_health = function() {
	if (Game.player_health < 24 && Game.looking_good){
		Game.player_health += 1;
	}
	Game.looking_good = true;
}

Game.decrease_health = function() {
	if (Game.player_health > 0){
		Game.player_health -= 1;
	}/*
	if (Game.player_health > 0){
		Game.player_health -= 1;
	}
	if (Game.player_health > 0 && Game.looking_good == false){
		Game.player_health -= 1;
	}
	if (Game.player_health > 0 && Game.looking_good == false){
		Game.player_health -= 1;
	}*/
	Game.looking_good = false;
}

Game.update_arrows = function() {
	Game.remove_missed_arrows()
	for (let index = 0; index < Game.active_arrows_W.length; ++index) {
		Game.active_arrows_W[index][0] -= Game.arrow_speed
	}
	for (let index = 0; index < Game.active_arrows_A.length; ++index) {
		Game.active_arrows_A[index][0] -= Game.arrow_speed
	}
	for (let index = 0; index < Game.active_arrows_S.length; ++index) {
		Game.active_arrows_S[index][0] -= Game.arrow_speed
	}
	for (let index = 0; index < Game.active_arrows_D.length; ++index) {
		Game.active_arrows_D[index][0] -= Game.arrow_speed
	}
	//Enemy arrows
	for (let index = 0; index < Game.enemy_active_arrows_W.length; ++index) {
		Game.enemy_active_arrows_W[index][0] -= Game.arrow_speed
	}
	for (let index = 0; index < Game.enemy_active_arrows_A.length; ++index) {
		Game.enemy_active_arrows_A[index][0] -= Game.arrow_speed
	}
	for (let index = 0; index < Game.enemy_active_arrows_S.length; ++index) {
		Game.enemy_active_arrows_S[index][0] -= Game.arrow_speed
	}
	for (let index = 0; index < Game.enemy_active_arrows_D.length; ++index) {
		Game.enemy_active_arrows_D[index][0] -= Game.arrow_speed
	}
}

Game.check_user_input = function() {
	//Active arrows has form [[height, duration],[height, duration]]
	if (Keyboard.keyDown[Keys.W]){
		if(Game.W_held == false){	
			Game.last_correct_pressed_key = 2
			Game.time_of_last_input = Game.get_in_round_time()
			Game.W_held = true
			Game.add_to_recorded_array(Game.last_correct_pressed_key);
		}
	}
	else{
	Game.W_held = false
	}
	if (Keyboard.keyDown[Keys.D]){
		if(Game.D_held == false){	
			Game.last_correct_pressed_key = 1
			Game.time_of_last_input = Game.get_in_round_time()
			Game.D_held = true
			Game.add_to_recorded_array(Game.last_correct_pressed_key);
		}
	}
	else{
	Game.D_held = false
	}
	if (Keyboard.keyDown[Keys.S]){
		if(Game.S_held == false){
			Game.last_correct_pressed_key = 3
			Game.time_of_last_input = Game.get_in_round_time()
			Game.S_held = true
			Game.add_to_recorded_array(Game.last_correct_pressed_key);
		}
	}
	else{
	Game.S_held = false
	}
	if (Keyboard.keyDown[Keys.A]){
		if(Game.A_held == false){
			Game.last_correct_pressed_key = 0
			Game.time_of_last_input = Game.get_in_round_time()
			Game.A_held = true
			Game.add_to_recorded_array(Game.last_correct_pressed_key);
		}	
	}
	else{
	Game.A_held = false	
	}
	if (Keyboard.keyDown[Keys.P]){
		if(Game.P_held == false){
			Game.savefile();
			Game.P_held = true;
		}		
	}
}

Game.update_enemy_movement = function() {
	//Create the arrows according to the predefined sequence
	Game.create_enemy_arrow();
	
	//Remove arrows when their time has come
	if (Game.enemy_active_arrows_W.length != 0 && Game.enemy_active_arrows_W[Game.enemy_active_arrows_W.length - 1][0] < 150 && Game.enemy_active_arrows_W[Game.enemy_active_arrows_W.length - 1][0] > 50){
		Game.enemy_last_input_time = Game.get_in_round_time();
		Game.enemy_last_input = 2;
		Game.enemy_active_arrows_W.pop();
	}
	if (Game.enemy_active_arrows_S.length != 0 && Game.enemy_active_arrows_S[Game.enemy_active_arrows_S.length - 1][0] < 150 && Game.enemy_active_arrows_S[Game.enemy_active_arrows_S.length - 1][0] > 50){
		Game.enemy_last_input_time = Game.get_in_round_time();
		Game.enemy_last_input = 3;
		Game.enemy_active_arrows_S.pop();
	}
	if (Game.enemy_active_arrows_D.length != 0 && Game.enemy_active_arrows_D[Game.enemy_active_arrows_D.length - 1][0] < 150 && Game.enemy_active_arrows_D[Game.enemy_active_arrows_D.length - 1][0] > 50){
		Game.enemy_last_input_time = Game.get_in_round_time();
		Game.enemy_last_input = 1;
		Game.enemy_active_arrows_D.pop();
	}
	if (Game.enemy_active_arrows_A.length != 0 && Game.enemy_active_arrows_A[Game.enemy_active_arrows_A.length - 1][0] < 150 && Game.enemy_active_arrows_A[Game.enemy_active_arrows_A.length - 1][0] > 50){
		Game.enemy_last_input_time = Game.get_in_round_time();
		Game.enemy_last_input = 0;
		Game.enemy_active_arrows_A.pop();
	}
	//Enemy arrows are moved in Game.update_arrows()
}

Game.update = function () {
	if(Game.game_over){
		return
	};
    Game.level_musix.play();
	Game.check_user_input();
	Game.update_enemy_movement();
	Game.update_arrows();
	Game.create_arrow();
	Game.check_for_losers();
	//Game.current_sprite = Game.sprites[Game.index]
	//Game.canvas.width;
};

Game.check_for_losers = function() {
	if(Game.player_health == 0) {
		Game.game_over = true;
		Game.level_musix.pause();
	}
}

Game.create_enemy_arrow = function() {
	var d = new Date();
	if (Game.enemy_arrow_sequence.length > 1){
		while ((d.getTime() - Game.start_time) / 1000 > Game.enemy_arrow_sequence[Game.enemy_arrow_sequence.length - 1][0]) {
			if (Game.enemy_arrow_sequence[Game.enemy_arrow_sequence.length - 1][1] == 0) {
				Game.enemy_active_arrows_A = [[900, Game.enemy_arrow_sequence[Game.enemy_arrow_sequence.length - 1][2]]].concat(Game.enemy_active_arrows_A)
			}
			else if (Game.enemy_arrow_sequence[Game.enemy_arrow_sequence.length - 1][1] == 1) {
				Game.enemy_active_arrows_D = [[900, Game.enemy_arrow_sequence[Game.enemy_arrow_sequence.length - 1][2]]].concat(Game.enemy_active_arrows_D)
			}
			else if (Game.enemy_arrow_sequence[Game.enemy_arrow_sequence.length - 1][1] == 2) {
				Game.enemy_active_arrows_W = [[900, Game.enemy_arrow_sequence[Game.enemy_arrow_sequence.length - 1][2]]].concat(Game.enemy_active_arrows_W)
			}
			else if (Game.enemy_arrow_sequence[Game.enemy_arrow_sequence.length - 1][1] == 3) {
				Game.enemy_active_arrows_S = [[900, Game.enemy_arrow_sequence[Game.enemy_arrow_sequence.length - 1][2]]].concat(Game.enemy_active_arrows_S)
			}
			//console.log(Game.arrow_sequence[Game.enemy.arrow_sequence.length - 1])
			Game.enemy_arrow_sequence.pop()
		}
	}
}	

Game.create_arrow = function() {
	var d = new Date();
	if (Game.arrow_sequence.length > 1){
		while ((d.getTime() - Game.start_time) / 1000 > Game.arrow_sequence[Game.arrow_sequence.length - 1][0]) {
			if (Game.arrow_sequence[Game.arrow_sequence.length - 1][1] == 0) {
				Game.active_arrows_A = [[900, Game.arrow_sequence[Game.arrow_sequence.length - 1][2]]].concat(Game.active_arrows_A)
			}
			else if (Game.arrow_sequence[Game.arrow_sequence.length - 1][1] == 1) {
				Game.active_arrows_D = [[900, Game.arrow_sequence[Game.arrow_sequence.length - 1][2]]].concat(Game.active_arrows_D)
			}
			else if (Game.arrow_sequence[Game.arrow_sequence.length - 1][1] == 2) {
				Game.active_arrows_W = [[900, Game.arrow_sequence[Game.arrow_sequence.length - 1][2]]].concat(Game.active_arrows_W)
			}
			else if (Game.arrow_sequence[Game.arrow_sequence.length - 1][1] == 3) {
				Game.active_arrows_S = [[900, Game.arrow_sequence[Game.arrow_sequence.length - 1][2]]].concat(Game.active_arrows_S)
			}
			//console.log(Game.arrow_sequence[Game.arrow_sequence.length - 1])
			Game.arrow_sequence.pop()
		}
	}
}	


//Rendering

Game.clearCanvas = function () {
    Game.canvasContext.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
};

Game.drawImage = function (sprite, position) {
    Game.canvasContext.save();
    Game.canvasContext.translate(position.x, position.y);
    Game.canvasContext.drawImage(sprite, 0, 0, sprite.width, sprite.height,
        0, 0, sprite.width, sprite.height);
    Game.canvasContext.restore();
};

Game.draw_background = function() {
	Game.drawImage(Game.bakgrund, {x : 0, y : 0})
}

Game.draw_loser_text = function() {
	Game.drawImage(Game.loser_image, {x : 100, y : 0});
}

Game.draw = function () {
    //Game.drawImage(Game.backgroundSprite, { x : 0, y : 0 });
	Game.draw_background();
	Game.draw_player(); //Draw the current player icon
	if(Game.game_over == false) {
		Game.draw_enemy();
	}
    //Game.drawImage(Game.current_sprite, {x : 0, y : 0} ); //Bakgrundsbild
	Game.canvasContext.fillStyle = "red";
    Game.draw_hitmarkers();
	Game.draw_enemy_hitmarkers();
	Game.drawarrows();
	Game.drawhealthbar();
	if(Game.death_index > 110) {
		Game.draw_loser_text();
	}
};

Game.draw_player = function() {
	if(Game.game_over){
		Game.draw_game_over();
		return
	}
	var position = {x : 900, y : 50};
	if(Game.cringe_alert){
		if(Game.last_correct_pressed_key == 2) {
		position = {x : 900, y : -25};
		}
		if (Game.get_in_round_time() - Game.time_of_last_input < 0.1){
			Game.drawImage(Game.player_sprites[Game.last_correct_pressed_key][3], position)
		}
		else if (Game.get_in_round_time() - Game.time_of_last_input < 0.2){
			Game.drawImage(Game.player_sprites[Game.last_correct_pressed_key][4], position)
		}
		else if (Game.get_in_round_time() - Game.time_of_last_input < 2){
			Game.drawImage(Game.player_sprites[Game.last_correct_pressed_key][5], position)
		}
		else {
			Game.draw_idle_player();
		}
	}
	else {
		if(Game.last_correct_pressed_key == 2) {
			position = {x : 900, y : -53};
		}
		if (Game.get_in_round_time() - Game.time_of_last_input < 0.1){
			Game.drawImage(Game.player_sprites[Game.last_correct_pressed_key][0], position)
		}
		else if (Game.get_in_round_time() - Game.time_of_last_input < 0.2){
			Game.drawImage(Game.player_sprites[Game.last_correct_pressed_key][1], position)
		}
		else if (Game.get_in_round_time() - Game.time_of_last_input < 2){
			Game.drawImage(Game.player_sprites[Game.last_correct_pressed_key][2], position)
		}
		else {
			Game.draw_idle_player();
		}
	}
}

Game.draw_game_over = function() {
	var position = {x : 900, y : 50};
	if(Game.death_index < 10) {
		Game.drawImage(Game.death_animation[0], position);
	}
	else if(Game.death_index < 20) {
		Game.drawImage(Game.death_animation[1], position);
	}
	else if(Game.death_index < 30) {
		Game.drawImage(Game.death_animation[2], position);
	}
	else if(Game.death_index < 40) {
		Game.drawImage(Game.death_animation[3], position);
	}
	else if(Game.death_index < 50) {
		Game.drawImage(Game.death_animation[4], position);
	}
	else if(Game.death_index < 60) {
		Game.drawImage(Game.death_animation[5], position);
	}
	else if(Game.death_index < 70) {
		Game.drawImage(Game.death_animation[6], position);
	}
	else if(Game.death_index < 80) {
		Game.drawImage(Game.death_animation[7], position);
	}
	else if(Game.death_index < 90) {
		Game.drawImage(Game.death_animation[8], position);
	}
	else if(Game.death_index < 130) {
		Game.drawImage(Game.death_animation[9], position);
	}
	else if(Game.death_index < 140) {
		Game.drawImage(Game.death_animation[10], position);
	}
	else if(Game.death_index < 150) {
		Game.drawImage(Game.death_animation[11], position);
	}
	else if(Game.death_index < 160) {
		Game.drawImage(Game.death_animation[12], position);
	}
	else {
		Game.drawImage(Game.death_animation[13], position);
	}
	if (Game.death_index < 200) {
		Game.death_index += 1;
	}
}

Game.draw_enemy = function() {
	if (Game.get_in_round_time() - Game.enemy_last_input_time < 0.1){
		Game.drawImage(Game.enemy_sprites[Game.enemy_last_input][0], {x : 380, y : 10})
	}
	else if (Game.get_in_round_time() - Game.enemy_last_input_time < 2){
		Game.drawImage(Game.enemy_sprites[Game.enemy_last_input][1], {x : 380, y : 10})
	}
	else {
		Game.draw_idle_enemy();//drawImage(Game.enemy_sprites[Game.enemy_last_input][1], {x : 380, y : 10})
	}
}

Game.draw_idle_enemy = function() {
	Game.enemy_idle_index += 1;
	if(Game.enemy_idle_index < 30) {
		Game.drawImage(Game.enemy_sprites[4][0], {x : 380, y : 10});
	}
	else if(Game.enemy_idle_index < 40) {
		Game.drawImage(Game.enemy_sprites[4][1], {x : 380, y : 10});
	}
	else if(Game.enemy_idle_index < 50) {
		Game.drawImage(Game.enemy_sprites[4][2], {x : 380, y : 10});
	}
	else if(Game.enemy_idle_index < 60) {
		Game.drawImage(Game.enemy_sprites[4][3], {x : 380, y : 10});
	}
	else if(Game.enemy_idle_index < 90) {
		Game.drawImage(Game.enemy_sprites[4][4], {x : 380, y : 10});
	}
	else if(Game.enemy_idle_index < 100) {
		Game.drawImage(Game.enemy_sprites[4][3], {x : 380, y : 10});
	}
	else if(Game.enemy_idle_index < 115) {
		Game.drawImage(Game.enemy_sprites[4][2], {x : 380, y : 10});
	}
	else {
		Game.drawImage(Game.enemy_sprites[4][1], {x : 380, y : 10});
	}
	if(Game.enemy_idle_index == 130) {
		Game.enemy_idle_index = 0;
	}
}


Game.draw_idle_player = function() {
	Game.idle_index += 1;
	if(Game.idle_index < 25) {
		Game.drawImage(Game.player_sprites[4][0], {x : 900, y : 50});
	}
	else if(Game.idle_index < 35) {
		Game.drawImage(Game.player_sprites[4][1], {x : 900, y : 50});
	}
	else if(Game.idle_index < 45) {
		Game.drawImage(Game.player_sprites[4][2], {x : 900, y : 50});
	}
	else if(Game.idle_index < 65) {
		Game.drawImage(Game.player_sprites[4][3], {x : 900, y : 50});
	}
	else if(Game.idle_index < 90) {
		Game.drawImage(Game.player_sprites[4][4], {x : 900, y : 50});
	}
	if(Game.idle_index == 89) {
		Game.idle_index = 0;
	}
}

Game.drawarrows = function() {
	for (let index = 0; index < Game.active_arrows_W.length; ++index) {
		Game.canvasContext.fillStyle = "#585360"; //Enemy color
		Game.canvasContext.fillRect(1637, Game.active_arrows_W[index][0] + 50 , 20, Game.active_arrows_W[index][1] * Game.arrow_speed * 60);
		Game.drawImage(Game.up_arrow, { x : 1607, y : Game.active_arrows_W[index][0]});
	}
	for (let index = 0; index < Game.active_arrows_A.length; ++index) {
		Game.canvasContext.fillStyle = "#585360"; //Enemy color
		Game.canvasContext.fillRect(1430, Game.active_arrows_A[index][0] + 50, 20, Game.active_arrows_A[index][1] * Game.arrow_speed * 60);
		Game.drawImage(Game.left_arrow, { x : 1400, y : Game.active_arrows_A[index][0]});
	}
	for (let index = 0; index < Game.active_arrows_S.length; ++index) {
		Game.canvasContext.fillStyle = "#585360"; //Enemy color
		Game.canvasContext.fillRect(1537, Game.active_arrows_S[index][0] + 50, 20, Game.active_arrows_S[index][1] * Game.arrow_speed * 60);
		Game.drawImage(Game.down_arrow, { x : 1507, y : Game.active_arrows_S[index][0]});
	}
	for (let index = 0; index < Game.active_arrows_D.length; ++index) {
		Game.canvasContext.fillStyle = "#585360"; //Enemy color
		Game.canvasContext.fillRect(1730, Game.active_arrows_D[index][0] + 50, 20, Game.active_arrows_D[index][1] * Game.arrow_speed * 60);
		Game.drawImage(Game.right_arrow, { x : 1700, y : Game.active_arrows_D[index][0]});
	}
	
	//ENEMY ARROWS:
	for (let index = 0; index < Game.enemy_active_arrows_W.length; ++index) {
		Game.canvasContext.fillStyle = "#585360"; //Enemy color
		Game.canvasContext.fillRect(237, Game.enemy_active_arrows_W[index][0] + 50 , 20, Game.enemy_active_arrows_W[index][1] * Game.arrow_speed * 60);
		Game.drawImage(Game.up_arrow, { x : 207, y : Game.enemy_active_arrows_W[index][0]});
	}
	for (let index = 0; index < Game.enemy_active_arrows_A.length; ++index) {
		Game.canvasContext.fillStyle = "#585360"; //Enemy color
		Game.canvasContext.fillRect(30, Game.enemy_active_arrows_A[index][0] + 50, 20, Game.enemy_active_arrows_A[index][1] * Game.arrow_speed * 60);
		Game.drawImage(Game.left_arrow, { x : 0, y : Game.enemy_active_arrows_A[index][0]});
	}
	for (let index = 0; index < Game.enemy_active_arrows_S.length; ++index) {
		Game.canvasContext.fillStyle = "#585360"; //Enemy color
		Game.canvasContext.fillRect(137, Game.enemy_active_arrows_S[index][0] + 50, 20, Game.enemy_active_arrows_S[index][1] * Game.arrow_speed * 60);
		Game.drawImage(Game.down_arrow, { x : 107, y : Game.enemy_active_arrows_S[index][0]});
	}
	for (let index = 0; index < Game.enemy_active_arrows_D.length; ++index) {
		Game.canvasContext.fillStyle = "#585360"; //Enemy color
		Game.canvasContext.fillRect(330, Game.enemy_active_arrows_D[index][0] + 50, 20, Game.enemy_active_arrows_D[index][1] * Game.arrow_speed * 60);
		Game.drawImage(Game.right_arrow, { x : 300, y : Game.enemy_active_arrows_D[index][0]});
	}
}

Game.draw_hitmarkers = function() {
	Game.drawImage(Game.hitmarkers, {x : 1400, y : 100})
}

Game.draw_enemy_hitmarkers = function() {
	Game.drawImage(Game.hitmarkers, {x : 0, y : 100})
}

Game.drawhealthbar = function() {
	let gradient = Game.canvasContext.createLinearGradient(400, 0, 400 + 41 * Game.player_health, 0);
	gradient.addColorStop(0, "#a16341");
	gradient.addColorStop(1, "#e89e6c");
	Game.canvasContext.fillStyle = gradient;
	//Game.canvasContext.fillStyle = "#e89e6c";
    Game.canvasContext.fillRect(400, 810, 41 * Game.player_health, 20);
	Game.canvasContext.fillStyle = "#585360"; //Enemy color
    Game.canvasContext.fillRect(400 + 41 * Game.player_health, 810, 1000 - 41 * Game.player_health, 20);
	Game.drawImage(Game.healthbar, {x : 300, y : 640})
	if(Game.looking_good){
		Game.drawImage(Game.healthhat2, {x : 430 + 41 * Game.player_health - 310, y : 774 - 100})
	}
	else {
		Game.drawImage(Game.healthhat, {x : 430 + 41 * Game.player_health - 200, y : 774 - 100})	
	}
}

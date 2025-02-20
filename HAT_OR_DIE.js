"use strict";

/*
0 = left
1 = right
2 = up
3 = down
*/
function handleKeyDown(evt) {
    Keyboard.keyDown[evt.keyCode] = true;
}

function handleKeyUp(evt) {
    Keyboard.keyDown[evt.keyCode] = false;
}



var Keyboard = { keyDown : {} };

var Keyheld = { keyHeld : {} };

function handleMouseDown(evt) {
    if (evt.which === 1)
        Mouse.leftDown = true;
}

function handleMouseUp(evt) {
    if (evt.which === 1)
        Mouse.leftDown = false;
}

function handleMouseMove(evt) {
    Mouse.position = { x : evt.pageX - Game.mouse_compensation[0], y : evt.pageY - Game.mouse_compensation[1] };
}

var Mouse = {
	position : { x : 0, y : 0 },
    leftDown : false
};

var Keys = {
    A: 65,     B: 66,      C: 67,      D: 68,       E: 69,      F: 70,
    G: 71,     H: 72,      I: 73,      J: 74,       K: 75,      L: 76,
    M: 77,     N: 78,      O: 79,      P: 80,       Q: 81,      R: 82,
    S: 83,     T: 84,      U: 85,      V: 86,       W: 87,      X: 88,
    Y: 89,     Z: 90
};

var inverse_keys = {
    65 : "A",     66 : "B",      67 : "C",      68 : "D",       69 : "E",      70 : "F",
    71 : "G",     72 : "H",      73 : "I",      74 : "J",       75 : "K",      76 : "L",
    77 : "M",     78 : "N",      79 : "O",      80 : "P",       81 : "Q",      82 : "R",
    83 : "S",     84 : "T",      85 : "U",      86 : "V",       87 : "W",      88 : "X",
    89 : "Y",     90 : "Z"	
}

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
	idle_index : 0,
	enemy_idle_index : 0,
	cringe_alert : false,
	looking_good : true,
	enemy_last_input_time : -2,
	enemy_last_input : 0,
	death_index : 0,
	win_index : 0,
	start_menu_counter : -120,
	start_menu_position : undefined,
	mouse_compensation : [0,0],
	game_over : false,
	won : false,
	lost : false,
	name : "",
	score : 0,
	name_inputted : false,
	in_menus : true,
	restart_counter : 0,
	consequtive_hits : 0,
	hit_index : [0,0,0,0],
	miss_index : [0,0,0,0],
	enemy_hit_index : [0,0,0,0]
};

Game.Compensate_for_bigger_screen = function() {
	const canvas = document.getElementById("myCanvas");
	const rect = canvas.getBoundingClientRect();
	Game.mouse_compensation = [rect.left,rect.top];
}

Game.start = async function () {
    Game.canvas = document.getElementById("myCanvas");
    Game.canvasContext = Game.canvas.getContext("2d");
	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
	document.onmousemove = handleMouseMove;
	document.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
	Game.Compensate_for_bigger_screen();
	Game.load_WINNING();
	Game.load_arrows();
	Game.last_correct_pressed_key = 1;
	Game.load_player_sprites();
	Game.load_astrid();
	Game.load_UI_elements();
	Game.load_DEATHING();
	Game.load_musix();
	Game.load_WIN_animation();
	await Game.loadGameData();
	Game.compensator();
	Game.stored_player_sequence = JSON.parse(JSON.stringify(Game.arrow_sequence));
	Game.stored_enemy_sequence = JSON.parse(JSON.stringify(Game.enemy_arrow_sequence));
    window.setTimeout(Game.start_screen, 500);
};

Game.compensator = function() {
	for(let index = 0; index < Game.arrow_sequence.length; ++index) {
		Game.arrow_sequence[index][0] -= 1050 / (Game.arrow_speed * 60);
	}
	for(let index = 0; index < Game.enemy_arrow_sequence.length; ++index) {
		Game.enemy_arrow_sequence[index][0] -= 1050 / (Game.arrow_speed * 60);
	}	
	//Game.arrow_sequence = Game.arrow_sequence.pop();
	//console.log('compensated data: ', Game.arrow_sequence);
}

Game.load_arrows = function() {
	Game.left_arrow = new Image();
	Game.left_arrow.src = "Arrows/leftarrow.png";
	Game.down_arrow = new Image();
	Game.down_arrow.src = "Arrows/downarrow.png";
	Game.up_arrow = new Image();
	Game.up_arrow.src = "Arrows/uparrow.png";
	Game.right_arrow = new Image();
	Game.right_arrow.src = "Arrows/rightarrow.png";
	
	Game.left_arrow_hit = new Image();
	Game.left_arrow_hit.src = "Arrows/leftarrowhit.png";
	Game.down_arrow_hit = new Image();
	Game.down_arrow_hit.src = "Arrows/downarrowhit.png";
	Game.up_arrow_hit = new Image();
	Game.up_arrow_hit.src = "Arrows/uparrowhit.png";
	Game.right_arrow_hit = new Image();
	Game.right_arrow_hit.src = "Arrows/rightarrowhit.png";
	
	Game.down_arrow_miss = new Image();
	Game.down_arrow_miss.src = "Arrows/DOWN_WRONG.png";
	
}

Game.load_player_sprites = function() {
	Game.up1 = new Image();
	Game.up1.src = "player_sprites/D/up/+_Hat_up!-1.png";
	Game.up2 = new Image();
	Game.up2.src = "player_sprites/D/up/+_Hat_up!-2.png";
	Game.up3 = new Image();
	Game.up3.src = "player_sprites/D/up/+_Hat_up!-3.png";
	
	Game.down1 = new Image();
	Game.down1.src = "player_sprites/D/down/Down-1.png";
	Game.down2 = new Image();
	Game.down2.src = "player_sprites/D/down/Down-2.png";
	Game.down3 = new Image();
	Game.down3.src = "player_sprites/D/down/Down-3.png";
	
	Game.right1 = new Image();
	Game.right1.src = "player_sprites/D/riight/Right-1.png";
	Game.right2 = new Image();
	Game.right2.src = "player_sprites/D/riight/Right-2.png";
	Game.right3 = new Image();
	Game.right3.src = "player_sprites/D/riight/Right-3.png";
	
	Game.left1 = new Image();
	Game.left1.src = "player_sprites/D/left/left-1.png";
	Game.left2 = new Image();
	Game.left2.src = "player_sprites/D/left/left-2.png";
	Game.left3 = new Image();
	Game.left3.src = "player_sprites/D/left/left-3.png";
	
	Game.uc1 = new Image();
	Game.uc1.src = "player_sprites/D/Cinge/Cinge_up!-1.png";
	Game.uc2 = new Image();
	Game.uc2.src = "player_sprites/D/Cinge/Cinge_up!-2.png"
	Game.uc3 = new Image();
	Game.uc3.src = "player_sprites/D/Cinge/Cinge_up!-3.png"

	Game.dc1 = new Image();
	Game.dc1.src = "player_sprites/D/Cinge/Cinge_Down-1.png"
	Game.dc2 = new Image();
	Game.dc2.src = "player_sprites/D/Cinge/Cinge_Down-2.png"
	Game.dc3 = new Image();
	Game.dc3.src = "player_sprites/D/Cinge/Cinge_Down-3.png"

	Game.rc1 = new Image();
	Game.rc1.src = "player_sprites/D/Cinge/Cinge_Right-1.png"
	Game.rc2 = new Image();
	Game.rc2.src = "player_sprites/D/Cinge/Cinge_Right-2.png"
	Game.rc3 = new Image();
	Game.rc3.src = "player_sprites/D/Cinge/Cinge_Right-3.png"

	Game.lc1 = new Image();
	Game.lc1.src = "player_sprites/D/Cinge/Cinge_left-1.png"
	Game.lc2 = new Image();
	Game.lc2.src = "player_sprites/D/Cinge/Cinge_left-2.png"
	Game.lc3 = new Image();
	Game.lc3.src = "player_sprites/D/Cinge/Cinge_left-3.png"
	
	Game.idle1 = new Image();
	Game.idle1.src = "player_sprites/D/IDA-le/Export_Idle-1.png"
	Game.idle2 = new Image();
	Game.idle2.src = "player_sprites/D/IDA-le/Export_Idle-2.png"
	Game.idle3 = new Image();
	Game.idle3.src = "player_sprites/D/IDA-le/Export_Idle-3.png"
	Game.idle4 = new Image();
	Game.idle4.src = "player_sprites/D/IDA-le/Export_Idle-4.png"
	Game.idle5 = new Image();
	Game.idle5.src = "player_sprites/D/IDA-le/Export_Idle-5.png"
	
	Game.player_sprites = [[Game.left1, Game.left2, Game.left3, Game.lc1, Game.lc2, Game.lc3],[Game.right1, Game.right2, Game.right3, Game.rc1, Game.rc2, Game.rc3],[Game.up1, Game.up2, Game.up3, Game.uc1, Game.uc2, Game.uc3],[Game.down1, Game.down2, Game.down3, Game.dc1, Game.dc2, Game.dc3],[Game.idle1,Game.idle2,Game.idle3,Game.idle4,Game.idle5]]
}

Game.load_DEATHING = function() {
	Game.death1 = new Image();
	Game.death1.src = "DIE/D_I_E-1.png"
	Game.death2 = new Image();
	Game.death2.src = "DIE/D_I_E-2.png"
	Game.death3 = new Image();
	Game.death3.src = "DIE/D_I_E-3.png"
	Game.death4 = new Image();
	Game.death4.src = "DIE/D_I_E-4.png"
	Game.death5 = new Image();
	Game.death5.src = "DIE/D_I_E-5.png"
	Game.death6 = new Image();
	Game.death6.src = "DIE/D_I_E-6.png"
	Game.death7 = new Image();
	Game.death7.src = "DIE/D_I_E-7.png"
	Game.death8 = new Image();
	Game.death8.src = "DIE/D_I_E-8.png"
	Game.death9 = new Image();
	Game.death9.src = "DIE/D_I_E-9.png"
	Game.death10 = new Image();
	Game.death10.src = "DIE/D_I_E-10.png"
	Game.death11 = new Image();
	Game.death11.src = "DIE/D_I_E-11.png"
	Game.death12 = new Image();
	Game.death12.src = "DIE/D_I_E-12.png"
	Game.death13 = new Image();
	Game.death13.src = "DIE/D_I_E-13.png"
	Game.death14 = new Image();
	Game.death14.src = "DIE/D_I_E-14.png"
	Game.death_animation = [Game.death1,Game.death2,Game.death3,Game.death4,Game.death5,Game.death6,Game.death7,Game.death8,Game.death9,Game.death10,Game.death11,Game.death12,Game.death13,Game.death14]
}

Game.load_WINNING = function() {
	Game.win00 = new Image();
	Game.win00.src = "player_sprites/D/win/win1/finishhhhhhhhhh1.png"
	Game.win01 = new Image();
	Game.win01.src = "player_sprites/D/win/win1/finishhhhhhhhhh2.png"
	Game.win02 = new Image();
	Game.win02.src = "player_sprites/D/win/win1/finishhhhhhhhhh3.png"
	Game.win03 = new Image();
	Game.win03.src = "player_sprites/D/win/win1/finishhhhhhhhhh4.png"
	Game.win04 = new Image();
	Game.win04.src = "player_sprites/D/win/win1/finishhhhhhhhhh5.png"
	Game.win05 = new Image();
	Game.win05.src = "player_sprites/D/win/win1/finishhhhhhhhhh6.png"
	Game.win06 = new Image();
	Game.win06.src = "player_sprites/D/win/win1/finishhhhhhhhhh7.png"
	//Game.win07 = new Image();
	//Game.win07.src = "./player_sprites/_D/win/win1/finishhhhhhhhhh8.png"
	
	Game.win1 = new Image();
	Game.win1.src = "player_sprites/D/win/1.png"
	Game.win2 = new Image();
	Game.win2.src = "player_sprites/D/win/2.png"
	Game.win3 = new Image();
	Game.win3.src = "player_sprites/D/win/3.png"
	Game.win4 = new Image();
	Game.win4.src = "player_sprites/D/win/4.png"
	Game.win5 = new Image();
	Game.win5.src = "player_sprites/D/win/5.png"
	Game.win6 = new Image();
	Game.win6.src = "player_sprites/D/win/6.png"
	Game.win7 = new Image();
	Game.win7.src = "player_sprites/D/win/7.png"
	Game.win8 = new Image();
	Game.win8.src = "player_sprites/D/win/8.png"
	Game.win9 = new Image();
	Game.win9.src = "player_sprites/D/win/9.png"
	Game.win10 = new Image();
	Game.win10.src = "player_sprites/D/win/10.png"

	Game.poof1 = new Image();
	Game.poof1.src = "player_sprites/D/win/POOF/1.png"
	Game.poof2 = new Image();
	Game.poof2.src = "player_sprites/D/win/POOF/2.png"
	Game.poof3 = new Image();
	Game.poof3.src = "player_sprites/D/win/POOF/3.png"
	Game.poof4 = new Image();
	Game.poof4.src = "player_sprites/D/win/POOF/4.png"
	Game.poof5 = new Image();
	Game.poof5.src = "player_sprites/D/win/POOF/5.png"
	Game.poof6 = new Image();
	Game.poof6.src = "player_sprites/D/win/POOF/6.png"
	Game.poof7 = new Image();
	Game.poof7.src = "player_sprites/D/win/POOF/7.png"
	Game.poof8 = new Image();
	Game.poof8.src = "player_sprites/D/win/POOF/8.png"
	Game.poof9 = new Image();
	Game.poof9.src = "player_sprites/D/win/POOF/9.png"
	Game.poof10 = new Image();
	Game.poof10.src = "player_sprites/D/win/POOF/10.png"
	Game.poof11 = new Image();
	Game.poof11.src = "player_sprites/D/win/POOF/11.png"

	Game.pin1 = new Image();
	Game.pin1.src = "player_sprites/D/win/PIN/1.png"
	Game.pin2 = new Image();
	Game.pin2.src = "player_sprites/D/win/PIN/2.png"
	Game.pin3 = new Image();
	Game.pin3.src = "player_sprites/D/win/PIN/3.png"
	Game.pin4 = new Image();
	Game.pin4.src = "player_sprites/D/win/PIN/4.png"
	Game.pin5 = new Image();
	Game.pin5.src = "player_sprites/D/win/PIN/5.png"
	Game.pin6 = new Image();
	Game.pin6.src = "player_sprites/D/win/PIN/6.png"
	Game.pin7 = new Image();
	Game.pin7.src = "player_sprites/D/win/PIN/7.png"
	Game.pin8 = new Image();
	Game.pin8.src = "player_sprites/D/win/PIN/8.png"
	
	Game.win_animation = [Game.win1,Game.win2,Game.win3,Game.win4,Game.win5,Game.win6,Game.win7,Game.win8,Game.win9,Game.win10]
}

Game.load_WIN_animation = function() {
	Game.video = document.createElement('video');
	Game.video.width = 1800;
	Game.video.height = 900;
	//const videoSource = document.createElement('source');
	Game.video.src = 'DIE/fiiinish_a_long_1.mp4';
	Game.video.type = 'video/mp4';
	//Game.video.appendChild(videoSource);
	Game.video.autoplay = true;
	Game.video.muted = false;
	Game.video.pause();
	Game.video.style.display = 'none';
	//document.body.appendChild(Game.video);
}

Game.load_astrid = function() {
	Game.eup1 = new Image();
	Game.eup1.src = "Astrid/Up-1.png";
	Game.eup2 = new Image();
	Game.eup2.src = "Astrid/Up-2.png";
	Game.eup3 = new Image();
	Game.eup3.src = "Astrid/Up-3.png";
	
	Game.edown1 = new Image();
	Game.edown1.src = "Astrid/Down-1.png";
	Game.edown2 = new Image();
	Game.edown2.src = "Astrid/Down-2.png";
	Game.edown3 = new Image();
	Game.edown3.src = "Astrid/Down-2.png";
	
	Game.eright1 = new Image();
	Game.eright1.src = "Astrid/Right_-1.png";
	Game.eright2 = new Image();
	Game.eright2.src = "Astrid/Right_-2.png";
	Game.eright3 = new Image();
	Game.eright3.src = "Astrid/Right_-2.png";
	
	Game.eleft1 = new Image();
	Game.eleft1.src = "Astrid/Left-1.png";
	Game.eleft2 = new Image();
	Game.eleft2.src = "Astrid/Left-2.png";
	Game.eleft3 = new Image();
	Game.eleft3.src = "Astrid/Left-2.png";
	
	Game.ei1 = new Image();
	Game.ei1.src = "Astrid/export-1.png";
	Game.ei2 = new Image();
	Game.ei2.src = "Astrid/export-2.png";
	Game.ei3 = new Image();
	Game.ei3.src = "Astrid/export-3.png";
	Game.ei4 = new Image();
	Game.ei4.src = "Astrid/export-4.png";
	//Game.ei5 = new Image();
	//Game.ei5.src = "./astrid/Idle-5.png";
	
	Game.enemy_sprites = [[Game.eleft1, Game.eleft2, Game.eleft3],[Game.eright1, Game.eright2, Game.eright3],[Game.eup1, Game.eup2, Game.eup3],[Game.edown1, Game.edown2, Game.edown3],[Game.ei1, Game.ei2, Game.ei3, Game.ei4]]
}

Game.load_UI_elements = function() {
	Game.healthbar = new Image();
	Game.healthbar.src = "Text och nya pilar/Health.png"
	Game.healthhat = new Image();
	Game.healthhat.src = "UI/Bar_icon.png"
	Game.healthhat2 = new Image();
	Game.healthhat2.src = "UI/Bar_icon2.png"
	Game.hitmarkers = new Image();
	Game.hitmarkers.src = "Text och nya pilar/Pilar ny.png"
	Game.loser_image = new Image();
	Game.loser_image.src = "UI/LOSERHAHAHAHA.png"
	Game.bakgrund = new Image();
	Game.bakgrund.src = "UI/bababa.png";
	Game.bakgrundKO = new Image();
	Game.bakgrundKO.src = "UI/bakgrund.png";
	
	Game.press_start_image_hatt = new Image();
	Game.press_start_image_hatt.src = "start/Start-3.png";
	Game.press_start_text_oldhats = new Image();
	Game.press_start_text_oldhats.src = "Text och nya pilar/Normal Human Text.png";
	Game.press_start_text_oldhatsGlow = new Image();
	Game.press_start_text_oldhatsGlow.src = "Text och nya pilar/normal glow.png";
	Game.press_start_text_newhats = new Image();
	Game.press_start_text_newhats.src = "Text och nya pilar/perma online text.png";
	Game.press_start_text_newhatsGlow = new Image();
	Game.press_start_text_newhatsGlow.src = "Text och nya pilar/perma online glow.png";
	Game.press_start_text_HATT1 = new Image();
	Game.press_start_text_HATT1.src = "start/hattt.png";
	Game.press_start_text_HATT2 = new Image();
	Game.press_start_text_HATT2.src = "start/Start-21.png";
	Game.press_start_ribbons = new Image();
	Game.press_start_ribbons.src = "start/Start-1.png";
	Game.press_start_floor = new Image();
	Game.press_start_floor.src = "start/Start-2.png";
	Game.difficulties = new Image();
	Game.difficulties.src = "Text och nya pilar/difficulties.png";
	Game.start_background = new Image();
	Game.start_background.src = "start/background.png";
	
	Game.start_bunny1 = new Image();
	Game.start_bunny1.src = "start/Start-15.png";
	Game.start_bunny2 = new Image();
	Game.start_bunny2.src = "start/Start-14.png";
	Game.start_bunny3 = new Image();
	Game.start_bunny3.src = "start/Start-13.png";
	Game.start_bunny4 = new Image();
	Game.start_bunny4.src = "start/Start-12.png";
	Game.start_bunny5 = new Image();
	Game.start_bunny5.src = "start/Start-11.png";
	Game.start_bunny6 = new Image();
	Game.start_bunny6.src = "start/Start-10.png";	
	Game.start_bunny7 = new Image();
	Game.start_bunny7.src = "start/Start-9.png";
	Game.start_bunny8 = new Image();
	Game.start_bunny8.src = "start/Start-17.png";
	Game.start_bunny9 = new Image();
	Game.start_bunny9.src = "start/Start-22.png";
	
	Game.start_drapes1 = new Image();
	Game.start_drapes1.src = "Draperier/Drapes-1.png";
	Game.start_drapes2 = new Image();
	Game.start_drapes2.src = "Draperier/Drapes-2.png";
	Game.start_drapes3 = new Image();
	Game.start_drapes3.src = "Draperier/Drapes-3.png";
	Game.start_drapes4 = new Image();
	Game.start_drapes4.src = "Draperier/Drapes-4.png";
	Game.start_drapes5 = new Image();
	Game.start_drapes5.src = "Draperier/Drapes-5.png";
	Game.start_drapes6 = new Image();
	Game.start_drapes6.src = "Draperier/Drapes-6.png";
	Game.start_drapes7 = new Image();
	Game.start_drapes7.src = "Draperier/Drapes-7.png";
	
	Game.restart_drapes1 = new Image();
	Game.restart_drapes1.src = "Draperier_retry/1.png";
	Game.restart_drapes2 = new Image();
	Game.restart_drapes2.src = "Draperier_retry/2.png";
	Game.restart_drapes3 = new Image();
	Game.restart_drapes3.src = "Draperier_retry/3.png";
	Game.restart_drapes4 = new Image();
	Game.restart_drapes4.src = "Draperier_retry/4.png";
	Game.restart_drapes5 = new Image();
	Game.restart_drapes5.src = "Draperier_retry/5.png";
	Game.restart_drapes6 = new Image();
	Game.restart_drapes6.src = "Draperier_retry/6.png";
	
	Game.scoreboard_button = new Image();
	Game.scoreboard_button.src = "1.png"
	Game.scoreboard_text = new Image();
	Game.scoreboard_text.src = "end_animations/acoewboard000.png"
	Game.scoreboard_background = new Image();
	Game.scoreboard_background.src = "end_animations/end.jpg"
	Game.scoreboard_IDA_1 = new Image();
	Game.scoreboard_IDA_1.src = "end_animations/ida_1.png";
	Game.scoreboard_IDA_2 = new Image();
	Game.scoreboard_IDA_2.src = "end_animations/ida_2.png";
	
}

Game.load_musix = function() {
	Game.level_musix = new Audio();
    Game.level_musix.src = "musik/poppies.mp4";
    Game.level_musix.volume = 0.1;
	/*
	Game.death_schreech = new Audio();
	Game.death_schreech.src = "./audiofx/deth.mp4";
	Game.death_schreech.volume = 2;
	*/
}

Game.loadGameData = async function() {
  try {
	const timestamp = new Date().getTime(); // Unique timestamp
    const response = await fetch('./level1.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const gameData = await response.json();
	Game.arrow_speed = Number(gameData.pop());
    Game.arrow_sequence = gameData;
	} catch (error) {
    console.error('Failed to load player data:', error.message);
	}
	try {
	//Enemy
	const response2 = await fetch('./enemy1.json');
    if (!response2.ok) {
      throw new Error(`HTTP error! Status: ${response2.status}`);
    }

    const gameData2 = await response2.json();
    Game.enemy_arrow_sequence = gameData2;
  } catch (error) {
    console.error('Failed to load enemy data:', error.message);
  }
  //Highscores  
  try {
	let savedData = localStorage.getItem("highscores");

    if (savedData) {
        Game.highscores = JSON.parse(savedData);
        console.log("Game loaded:", Game.highscores);
    } else {
        console.log("No saved game found. Starting fresh.");
		Game.highscores = [["none", "2"],["none", "1"],["none", "0"]];
    }
	  
	/*
	const response2 = await fetch('./highscores.json');
    if (!response2.ok) {
      throw new Error(`HTTP error! Status: ${response2.status}`);
    }

    const highscores = await response2.json();
    Game.highscores = highscores;
	//console.log(Game.highscores);*/
  } catch (error) {
    console.error('Failed to load highscores:', error.message);
  }
}

document.addEventListener( 'DOMContentLoaded', Game.start);

Game.get_in_round_time = function() {
	return Game.level_musix.currentTime
}

Game.start_screen = function() {
	if(Game.get_mouse_position([700,1000],[440, 520])) {
		if(Game.start_menu_position != true) {
			if(Game.start_menu_counter > 170){
				Game.start_menu_counter = 170;
			}
		}
		Game.start_menu_position = true;
		if( Mouse.leftDown == true){
			var d = new Date();
			Game.health_punishment = 1;
			Game.start_time = d.getTime();
			Game.in_menus = false;
			window.setTimeout(Game.mainLoop(),0);
			return
		}
	}
	else if(Game.get_mouse_position([750, 975],[540, 620])){
		if(Game.start_menu_position != false) {
			if(Game.start_menu_counter > 170){
				Game.start_menu_counter = 170;
			}
		}
		Game.start_menu_position = false;
		if( Mouse.leftDown == true){
			Game.health_punishment = 0;
			Game.score = 7000
			var d = new Date();
			Game.start_time = d.getTime() - 155*1000;
			Game.in_menus = false;
			window.setTimeout(Game.mainLoop(),0);
			return
		}
	}
	else {
		Game.start_menu_position = undefined;
	}
	if(Game.start_menu_counter < 190) {
		Game.start_menu_counter += 1;
	}
	Game.clearCanvas();
	Game.draw_start_menu();
	window.setTimeout(Game.start_screen, 1000/60)
}

Game.get_mouse_position = function(xrange, yrange) {
	if (Mouse.position.y > yrange[0] && Mouse.position.y < yrange[1] && Mouse.position.x < xrange[1] && Mouse.position.x > xrange[0]){
		return true;
	}
	return false;
}

Game.mainLoop = function() {
    Game.clearCanvas();
    Game.update();
    Game.draw();
	if(Game.in_menus == false){
		window.setTimeout(Game.mainLoop, 1000/60);
	}
};

Game.draw_start_menu = function() {
	Game.drawImage(Game.start_background, {x : 0, y : 0});
	Game.drawImage(Game.start_drapes7, {x : 0, y : 0});
	Game.drawImage(Game.press_start_floor, {x : 0, y : 0});
	Game.drawImage(Game.press_start_image_hatt, {x : 0, y : 0});
	Game.draw_start_title();
	Game.draw_bunny();
	Game.draw_glow()
	Game.draw_bunny();
	Game.drawImage(Game.press_start_text_newhats, {x : 0, y : 0});
	Game.drawImage(Game.press_start_text_oldhats, {x : 0, y : 0});
	Game.drawImage(Game.difficulties, {x:0,y:0});
	Game.draw_dRapes();
}

Game.draw_start_title = function() {
	Game.drawImage(Game.press_start_text_HATT1, {x : 0, y : -100});
}

Game.draw_glow = function() {
	if (Game.start_menu_position == true) {
		Game.drawImage(Game.press_start_text_newhatsGlow, {x : 0, y : 0});
	}
	else if(Game.start_menu_position == false){
		Game.drawImage(Game.press_start_text_oldhatsGlow, {x : 0, y : 0});
	}
}

Game.draw_dRapes = function() {
	//Draws the bunny animation
	var position = {x : 0, y : 0}
	if (Game.start_menu_counter < -50){
		Game.drawImage(Game.start_drapes1, position);
	}
	else if (Game.start_menu_counter < -40){
		Game.drawImage(Game.start_drapes2, position);
	}
	else if (Game.start_menu_counter < -30){
		Game.drawImage(Game.start_drapes3, position);
	}
	else if (Game.start_menu_counter < -20){
		Game.drawImage(Game.start_drapes4, position);		
	}
	else if (Game.start_menu_counter < -10){
		Game.drawImage(Game.start_drapes5, position);
	}
	else if (Game.start_menu_counter < 0){
		Game.drawImage(Game.start_drapes6, position);
	}
}

Game.draw_bunny = function() {
	//Draws the bunny animation
	var position = {x : 0, y : 0}
	if(Game.start_menu_counter < 30){	
	}
	else if (Game.start_menu_counter < 40){
		Game.drawImage(Game.start_bunny9, position);
	}
	else if (Game.start_menu_counter < 130){
		Game.drawImage(Game.start_bunny1, position);
	}
	else if (Game.start_menu_counter < 140){
		Game.drawImage(Game.start_bunny9, position);
	}
	else if (Game.start_menu_counter < 150){
		Game.drawImage(Game.start_bunny2, position);		
	}
	else if (Game.start_menu_counter < 160){
		Game.drawImage(Game.start_bunny3, position);
	}
	else if (Game.start_menu_counter < 170){
		Game.drawImage(Game.start_bunny4, position);
	}
	else if(Game.start_menu_position == true) {
		if (Game.start_menu_counter < 180){
			Game.drawImage(Game.start_bunny5, position);
		}
		else {
			Game.drawImage(Game.start_bunny6, position);
		}
	}
	else if(Game.start_menu_position == false) {
		if (Game.start_menu_counter < 180){
			Game.drawImage(Game.start_bunny8, position);
		}
		else {
			Game.drawImage(Game.start_bunny7, position);
		}
		
	}
	else {
		Game.drawImage(Game.start_bunny4, position);
	}
}

//Logic

Game.remove_missed_arrows = function() {
	
	if (Game.active_arrows_W.length != 0 && Game.active_arrows_W[Game.active_arrows_W.length - 1][0] <= 0){
		Game.active_arrows_W.pop()
		Game.decrease_health()
		Game.time_of_last_input = Game.get_in_round_time()
		Game.cringe_alert = true;
		
	}
	if (Game.active_arrows_A.length != 0 && Game.active_arrows_A[Game.active_arrows_A.length - 1][0] <= 0){
		Game.active_arrows_A.pop()
		Game.decrease_health()
		Game.time_of_last_input = Game.get_in_round_time()
		Game.cringe_alert = true;
	}
	if (Game.active_arrows_S.length != 0 && Game.active_arrows_S[Game.active_arrows_S.length - 1][0] <= 0){
		Game.active_arrows_S.pop()
		Game.decrease_health()
		Game.time_of_last_input = Game.get_in_round_time()
		Game.cringe_alert = true;
	}
	if (Game.active_arrows_D.length != 0 && Game.active_arrows_D[Game.active_arrows_D.length - 1][0] <= 0){
		Game.active_arrows_D.pop()
		Game.decrease_health()
		Game.time_of_last_input = Game.get_in_round_time()
		Game.cringe_alert = true;
	}
}

Game.increase_health = function() {
	if (Game.player_health < 24 && Game.looking_good){
		Game.player_health += 1;
	}
	Game.score += Game.consequtive_hits;
	Game.consequtive_hits += 1;
	Game.looking_good = true;
}

Game.decrease_health = function() {
	Game.score -= 10
	if (Game.player_health > 0){
		Game.player_health -= Game.health_punishment;
	}
	if (Game.player_health > 0){
		Game.player_health -= Game.health_punishment;
	}
	if (Game.player_health > 0 && Game.looking_good == false){
		Game.player_health -= Game.health_punishment;
		Game.score -= 20
	}
	if (Game.player_health > 0 && Game.looking_good == false){
		Game.player_health -= Game.health_punishment;
	}
	Game.looking_good = false;
	Game.consequtive_hits = 0;
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

Game.draw_hits = function() {
	if(Game.miss_index[0] > 0){
		Game.miss_index[0] -= 1;
		Game.drawImage(Game.up_arrow_hit, {x : 1608, y : 118})
	}
	if(Game.miss_index[1] > 0){
		Game.miss_index[1] -= 1;
		Game.drawImage(Game.right_arrow_hit, {x : 1700, y : 120})
	}	
	if(Game.miss_index[2] > 0){
		Game.miss_index[2] -= 1;
		Game.drawImage(Game.down_arrow_miss, {x : 1511, y : 114})
	}	
	if(Game.miss_index[3] > 0){
		Game.miss_index[3] -= 1;
		Game.drawImage(Game.left_arrow_hit, {x : 1400, y : 126})
	}
	if(Game.hit_index[0] > 0){
		Game.hit_index[0] -= 1;
		Game.drawImage(Game.up_arrow_hit, {x : 1608, y : 118})
	}
	if(Game.hit_index[1] > 0){
		Game.hit_index[1] -= 1;
		Game.drawImage(Game.right_arrow_hit, {x : 1700, y : 120})
	}	
	if(Game.hit_index[2] > 0){
		Game.hit_index[2] -= 1;
		Game.drawImage(Game.down_arrow_hit, {x : 1511, y : 114})
	}	
	if(Game.hit_index[3] > 0){
		Game.hit_index[3] -= 1;
		Game.drawImage(Game.left_arrow_hit, {x : 1400, y : 126})
	}
}

Game.draw_enemy_hits = function() {
	if(Game.enemy_hit_index[0] > 0){
		Game.enemy_hit_index[0] -= 1;
		Game.drawImage(Game.up_arrow_hit, {x : 208, y : 118})
	}
	if(Game.enemy_hit_index[1] > 0){
		Game.enemy_hit_index[1] -= 1;
		Game.drawImage(Game.right_arrow_hit, {x : 300, y : 120})
	}	
	if(Game.enemy_hit_index[2] > 0){
		Game.enemy_hit_index[2] -= 1;
		Game.drawImage(Game.down_arrow_hit, {x : 111, y : 114})
	}	
	if(Game.enemy_hit_index[3] > 0){
		Game.enemy_hit_index[3] -= 1;
		Game.drawImage(Game.left_arrow_hit, {x : 0, y : 126})
	}
}

Game.check_user_input = function() {
	if(Game.won){
		return;
	}
	var hit_animation_duration = 3;
	//Active arrows has form [[height, duration],[height, duration]]
	const arrow_hit_height = 123;
	const arrow_hit_height2 = 132;
	if (Keyboard.keyDown[Keys.W]){
		if(Game.W_held == false){	
			Game.last_correct_pressed_key = 2
			Game.time_of_last_input = Game.get_in_round_time()
			if (Game.active_arrows_W.length != 0 && Game.active_arrows_W[Game.active_arrows_W.length - 1][0] < 180 && Game.active_arrows_W[Game.active_arrows_W.length - 1][0] > 50){
				if(Game.active_arrows_W[Game.active_arrows_W.length - 1][1] > 0){
					Game.active_arrows_W[Game.active_arrows_W.length - 1][0] = arrow_hit_height;
					Game.active_arrows_W[Game.active_arrows_W.length - 1][1] -= 1 / 60;
					//console.log(Game.active_arrows_W[Game.active_arrows_W.length - 1])
				}
				else {
					Game.active_arrows_W.pop()
					Game.increase_health()
					Game.hit_index[0] = hit_animation_duration;
				}					
				Game.cringe_alert = false;
			}
			else{
				Game.cringe_alert = true;
				Game.decrease_health()
				Game.miss_index[0] = hit_animation_duration;
			}
			Game.W_held = true
		}
		else {
			//Code for holding long arrows
			if (Game.active_arrows_W.length != 0 && Game.active_arrows_W[Game.active_arrows_W.length - 1][0] < 180 && Game.active_arrows_W[Game.active_arrows_W.length - 1][0] > 50){
				if(Game.active_arrows_W[Game.active_arrows_W.length - 1][1] > 0){
					Game.hit_index[0] = hit_animation_duration;
					Game.active_arrows_W[Game.active_arrows_W.length - 1][0] = arrow_hit_height;
					Game.active_arrows_W[Game.active_arrows_W.length - 1][1] -= 1 / 60;
					if(Game.active_arrows_W[Game.active_arrows_W.length - 1][1] == 0){
						Game.active_arrows_W[Game.active_arrows_W.length - 1][1] = -1;
					}
				}
				else if (Game.active_arrows_W[Game.active_arrows_W.length - 1][1] < 0){
					Game.active_arrows_W.pop()
					Game.increase_health()
					Game.hit_index[0] = hit_animation_duration;
				}
			}
		}
	}
	else{
	Game.W_held = false
	}
	if (Keyboard.keyDown[Keys.D]){
		if(Game.D_held == false){	
			Game.last_correct_pressed_key = 1
			Game.time_of_last_input = Game.get_in_round_time()
			if (Game.active_arrows_D.length != 0 && Game.active_arrows_D[Game.active_arrows_D.length - 1][0] < 190 && Game.active_arrows_D[Game.active_arrows_D.length - 1][0] > 60){
				if(Game.active_arrows_D[Game.active_arrows_D.length - 1][1] > 0){
					Game.active_arrows_D[Game.active_arrows_D.length - 1][0] = arrow_hit_height2;
					Game.active_arrows_D[Game.active_arrows_D.length - 1][1] -= 1 / 60;
				}
				else {
					Game.active_arrows_D.pop()
					Game.increase_health()
					Game.hit_index[1] = hit_animation_duration;
				}					
				Game.cringe_alert = false;
			}
			else{
				Game.cringe_alert = true;
				Game.decrease_health()
				Game.miss_index[1] = hit_animation_duration;
			}
			Game.D_held = true
		}
		else {
			//Code for holding long arrows
			if (Game.active_arrows_D.length != 0 && Game.active_arrows_D[Game.active_arrows_D.length - 1][0] < 180 && Game.active_arrows_D[Game.active_arrows_D.length - 1][0] > 50){
				if(Game.active_arrows_D[Game.active_arrows_D.length - 1][1] > 0){
					Game.hit_index[1] = hit_animation_duration;
					Game.active_arrows_D[Game.active_arrows_D.length - 1][0] = arrow_hit_height2;
					Game.active_arrows_D[Game.active_arrows_D.length - 1][1] -= 1 / 60;
					if(Game.active_arrows_D[Game.active_arrows_D.length - 1][1] == 0){
						Game.active_arrows_D[Game.active_arrows_D.length - 1][1] = -1;
					}
				}
				else if (Game.active_arrows_D[Game.active_arrows_D.length - 1][1] < 0){
					Game.active_arrows_D.pop()
					Game.increase_health()
					Game.hit_index[1] = hit_animation_duration;
				}
			}
		}
	}
	else{
	Game.D_held = false
	}
	if (Keyboard.keyDown[Keys.S]){
		if(Game.S_held == false){
			Game.last_correct_pressed_key = 3
			Game.time_of_last_input = Game.get_in_round_time()
			if (Game.active_arrows_S.length != 0 && Game.active_arrows_S[Game.active_arrows_S.length - 1][0] < 180 && Game.active_arrows_S[Game.active_arrows_S.length - 1][0] > 50){
				if(Game.active_arrows_S[Game.active_arrows_S.length - 1][1] > 0){
					Game.active_arrows_S[Game.active_arrows_S.length - 1][0] = arrow_hit_height;
					Game.active_arrows_S[Game.active_arrows_S.length - 1][1] -= 1 / 60;
				}
				else {
					Game.active_arrows_S.pop()
					Game.increase_health()
					Game.hit_index[2] = hit_animation_duration;
				}					
				Game.cringe_alert = false;
			}
			else{
				Game.cringe_alert = true;
				Game.decrease_health();
				Game.miss_index[2] = hit_animation_duration;
			}
			Game.S_held = true
		}
		else {
			//Code for holding long arrows
			if (Game.active_arrows_S.length != 0 && Game.active_arrows_S[Game.active_arrows_S.length - 1][0] < 180 && Game.active_arrows_S[Game.active_arrows_S.length - 1][0] > 50){
				if(Game.active_arrows_S[Game.active_arrows_S.length - 1][1] > 0){
					Game.hit_index[2] = hit_animation_duration;
					Game.active_arrows_S[Game.active_arrows_S.length - 1][0] = arrow_hit_height;
					Game.active_arrows_S[Game.active_arrows_S.length - 1][1] -= 1 / 60;
					if(Game.active_arrows_S[Game.active_arrows_S.length - 1][1] == 0){
						Game.active_arrows_S[Game.active_arrows_S.length - 1][1] = -1;
					}
				}
				else if (Game.active_arrows_S[Game.active_arrows_S.length - 1][1] < 0){
					Game.active_arrows_S.pop();
					Game.increase_health();
					Game.hit_index[2] = hit_animation_duration;
				}
			}
		}
	}
	else{
	Game.S_held = false
	}
	if (Keyboard.keyDown[Keys.A]){
		if(Game.A_held == false){
			Game.last_correct_pressed_key = 0
			Game.time_of_last_input = Game.get_in_round_time()
			if (Game.active_arrows_A.length != 0 && Game.active_arrows_A[Game.active_arrows_A.length - 1][0] < 190 && Game.active_arrows_A[Game.active_arrows_A.length - 1][0] > 60){
				if(Game.active_arrows_A[Game.active_arrows_A.length - 1][1] > 0){
					Game.active_arrows_A[Game.active_arrows_A.length - 1][0] = arrow_hit_height2;
					Game.active_arrows_A[Game.active_arrows_A.length - 1][1] -= 1 / 60;
					//console.log(Game.active_arrows_A[Game.active_arrows_A.length - 1])
				}
				else {
					Game.active_arrows_A.pop()
					Game.increase_health()
					Game.hit_index[3] = hit_animation_duration;
				}					
				Game.cringe_alert = false;
			}
			else{
				Game.cringe_alert = true;
				Game.decrease_health();
				Game.miss_index[3] = hit_animation_duration;
			}
			Game.A_held = true;
		}		
		else {
			//Code for holding long arrows
			if (Game.active_arrows_A.length != 0 && Game.active_arrows_A[Game.active_arrows_A.length - 1][0] < 180 && Game.active_arrows_A[Game.active_arrows_A.length - 1][0] > 50){
				if(Game.active_arrows_A[Game.active_arrows_A.length - 1][1] > 0){
					Game.hit_index[3] = hit_animation_duration;
					Game.active_arrows_A[Game.active_arrows_A.length - 1][0] = arrow_hit_height2;
					Game.active_arrows_A[Game.active_arrows_A.length - 1][1] -= 1 / 60;
					if(Game.active_arrows_A[Game.active_arrows_A.length - 1][1] == 0){
						Game.active_arrows_A[Game.active_arrows_A.length - 1][1] = -1;
					}
				}
				else if (Game.active_arrows_A[Game.active_arrows_A.length - 1][1] < 0){
					Game.active_arrows_A.pop()
					Game.increase_health()
					Game.hit_index[3] = hit_animation_duration;
				}
			}
		}
	}
	else{
	Game.A_held = false	
	}
}

Game.update_enemy_movement = function() {
	//Create the arrows according to the predefined sequence
	Game.create_enemy_arrow();
	const arrow_hit_height = 123;
	const arrow_hit_height2 = 132;
	const hit_animation_duration = 3;
	//Remove arrows when their time has come
	if (Game.enemy_active_arrows_W.length != 0 && Game.enemy_active_arrows_W[Game.enemy_active_arrows_W.length - 1][0] < arrow_hit_height){
		Game.enemy_last_input_time = Game.get_in_round_time();
		Game.enemy_last_input = 2;
		Game.enemy_active_arrows_W.pop();
		Game.enemy_hit_index[0] = hit_animation_duration
	}
	if (Game.enemy_active_arrows_S.length != 0 && Game.enemy_active_arrows_S[Game.enemy_active_arrows_S.length - 1][0] < arrow_hit_height){
		Game.enemy_last_input_time = Game.get_in_round_time();
		Game.enemy_last_input = 3;
		Game.enemy_active_arrows_S.pop();
		Game.enemy_hit_index[2] = hit_animation_duration
	}
	if (Game.enemy_active_arrows_D.length != 0 && Game.enemy_active_arrows_D[Game.enemy_active_arrows_D.length - 1][0] < arrow_hit_height2){
		Game.enemy_last_input_time = Game.get_in_round_time();
		Game.enemy_last_input = 1;
		Game.enemy_active_arrows_D.pop();
		Game.enemy_hit_index[1] = hit_animation_duration
	}
	if (Game.enemy_active_arrows_A.length != 0 && Game.enemy_active_arrows_A[Game.enemy_active_arrows_A.length - 1][0] < arrow_hit_height2){
		Game.enemy_last_input_time = Game.get_in_round_time();
		Game.enemy_last_input = 0;
		Game.enemy_active_arrows_A.pop();
		Game.enemy_hit_index[3] = hit_animation_duration
	}
	//Enemy arrows are moved in Game.update_arrows()
}

Game.retry = function() {
	Game.level_musix.currentTime = 0;
	Game.arrow_sequence = JSON.parse(JSON.stringify(Game.stored_player_sequence));
	Game.enemy_arrow_sequence = JSON.parse(JSON.stringify(Game.stored_enemy_sequence));
	Game.active_arrows_A = [];
	Game.active_arrows_D = [];
	Game.active_arrows_W = [];
	Game.active_arrows_S = [];
	Game.enemy_active_arrows_A = [];
	Game.enemy_active_arrows_D = [];
	Game.enemy_active_arrows_W = [];
	Game.enemy_active_arrows_S = [];
	var position = {x : 0, y : 0}
	if(Game.restart_counter < 10){
		Game.drawImage(Game.restart_drapes1, position)
	}
	else if(Game.restart_counter < 10){
		Game.drawImage(Game.restart_drapes2, position)
	}
	else if(Game.restart_counter < 20){
		Game.drawImage(Game.restart_drapes3, position)
	}
	else if(Game.restart_counter < 30){
		Game.drawImage(Game.restart_drapes4, position)
	}
	else if(Game.restart_counter < 40){
		Game.drawImage(Game.restart_drapes5, position)
	}
	else if(Game.restart_counter < 50){
		Game.drawImage(Game.restart_drapes6, position)
	}
	Game.restart_counter += 1;
	if(Game.restart_counter < 50){
		window.setTimeout(Game.retry, 1000/60);
	}
	else{
		window.setTimeout(Game.restart(),1000/60);
	}
}

Game.restart = function() {
	//var d = new Date();
	//Game.start_time = d.getTime();
	//Game.level_musix.play();
	Game.player_health = 12;
	Game.game_over = false;
	Game.looking_good = true;
	Game.time_of_last_input = -3;
	Game.cringe_alert = false;
	Game.death_index = 0;
	Game.enemy_last_input_time = -3;
	Game.score = 0;
	Game.won = false;
	Game.lost = false;
	Game.start_menu_counter = -120;
	Game.restart_counter = 0;
	Game.win_index = 0;
	Game.name = "";
	Game.name_inputted = false;
	Game.video.currentTime = 0;
	Game.video.pause();
	window.setTimeout(Game.start_screen,1000/60);
	return
}

Game.update = function () {
	if(Game.lost){
		Game.loser_logic();
	}
	else if(Game.won){
		Game.winner_logic();
	}
	else if (Game.level_musix.paused) {
		Game.level_musix.play();
	}
	Game.check_user_input();
	Game.update_enemy_movement();
	Game.update_arrows();
	Game.create_arrow();
	Game.check_for_losers();
	Game.check_for_winners();
	if(Game.in_menus){
		Game.retry()
	}
};

Game.loser_logic = function() {//COPE
	if(Game.get_mouse_position([0,1800],[0,900]) && Mouse.leftDown){//COPE
		Game.in_menus = true;//COPE
	}//COPE
	if (Game.death_index < 500) {//COPE
		Game.death_index += 1;//COPE
	}//COPE
	//COPE
}//COPE

Game.winner_logic = function() {
	Game.scoreboard_logic();
	if(Game.win_index > 300){
		Game.level_musix.pause();
	}
	if(Game.win_index < 2000){
		Game.win_index += 1;
	}
	if(Game.win_index > 1300){
		Game.scoreboard_logic();
	}
}

Game.check_for_winners = function() {
	if(Game.arrow_sequence.length == 1){
		if(Game.active_arrows_W.length == 0){
			if(Game.active_arrows_A.length == 0){
				if(Game.active_arrows_S.length == 0){
					if(Game.active_arrows_D.length == 0){
						Game.won = true;
					}
				}
			}
		}
	}
}

Game.check_for_losers = function() {
	if(Game.player_health <= 0) {
		Game.lost = true;
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

Game.play_animation = function(file_name){
	if(!Game.video.ended){
		//Game.video.style.display = 'block';
		if(Game.video.paused){
			Game.video.play();
		}
		Game.drawImage(Game.video, [0,0]);
	}
}

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
	if (Game.lost){
		Game.drawImage(Game.bakgrundKO, {x : 0, y : 0});
		return;
	}
	Game.drawImage(Game.bakgrund, {x : 0, y : 0});
}

Game.draw_loser_text = function() {
	Game.drawImage(Game.loser_image, {x : 100, y : 0});
}

Game.draw = function () {
	Game.draw_background();
	Game.draw_player(); 
	if(!Game.lost){
		Game.draw_enemy();
	}
	if(Game.lost == false && Game.won == false) {
		//round ongoing
		Game.draw_hitmarkers();
		Game.draw_hits();
		Game.draw_enemy_hits();
		Game.drawarrows();
		Game.drawhealthbar();
	}
	
	if(Game.lost){
		//you lost
		Game.draw_game_over();
		if(Game.death_index > 110) {
			Game.draw_loser_text();
		}
		return
	}

	if(Game.won){
		Game.draw_win();
	}
};

Game.draw_player = function() {
	if(Game.lost){
		//Game.draw_game_over();
		return
	}
	else if(Game.won == true){
		//Game.draw_win();
		if(Game.win_index > 100){
			return
		}
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

Game.draw_win = function(){
	var position = {x:0, y:0}
	if(Game.win_index > 100){
		Game.drawImage(Game.win10, position)
		Game.play_animation();
		if(Game.win_index > 1300) {
			Game.draw_scoreboard();
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
	if(Game.death_index > 240) {
		return
	}
}

Game.draw_enemy = function() {
	if (Game.get_in_round_time() - Game.enemy_last_input_time < 0.1){
		Game.drawImage(Game.enemy_sprites[Game.enemy_last_input][0], {x : 0, y : 0})
	}
	else if (Game.get_in_round_time() - Game.enemy_last_input_time < 0.2){
		Game.drawImage(Game.enemy_sprites[Game.enemy_last_input][1], {x : 0, y : 0})
	}
	else if (Game.get_in_round_time() - Game.enemy_last_input_time < 2){
		Game.drawImage(Game.enemy_sprites[Game.enemy_last_input][2], {x : 0, y : 0})
	}
	else {
		Game.draw_idle_enemy();
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
		Game.drawImage(Game.enemy_sprites[4][3], {x : 380, y : 10});
	}
	else if(Game.enemy_idle_index < 100) {
		Game.drawImage(Game.enemy_sprites[4][2], {x : 380, y : 10});
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
		Game.drawImage(Game.up_arrow, { x : 1608, y : Game.active_arrows_W[index][0]});
	}
	for (let index = 0; index < Game.active_arrows_A.length; ++index) {
		Game.canvasContext.fillStyle = "#585360"; //Enemy color
		Game.canvasContext.fillRect(1430, Game.active_arrows_A[index][0] + 50, 20, Game.active_arrows_A[index][1] * Game.arrow_speed * 60);
		Game.drawImage(Game.left_arrow, { x : 1400, y : Game.active_arrows_A[index][0]});
	}
	for (let index = 0; index < Game.active_arrows_S.length; ++index) {
		Game.canvasContext.fillStyle = "#585360"; //Enemy color
		Game.canvasContext.fillRect(1537, Game.active_arrows_S[index][0] + 50, 20, Game.active_arrows_S[index][1] * Game.arrow_speed * 60);
		Game.drawImage(Game.down_arrow, { x : 1511, y : Game.active_arrows_S[index][0]});
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
	Game.drawImage(Game.hitmarkers, {x : 1400, y : 65})
	Game.drawImage(Game.hitmarkers, {x : 0, y : 65})
}

Game.drawhealthbar = function() {
	let gradient = Game.canvasContext.createLinearGradient(400, 0, 400 + 41 * Game.player_health, 0);
	gradient.addColorStop(0, "#a16341");
	gradient.addColorStop(1, "#e89e6c");
	Game.canvasContext.fillStyle = gradient;
	//Game.canvasContext.fillStyle = "#e89e6c";
    Game.canvasContext.fillRect(400, 810, 42 * Game.player_health, 20); //Max width = 41 * 24 = 1008
	Game.canvasContext.fillStyle = "#585360"; //Enemy color
    Game.canvasContext.fillRect(400 + 42 * Game.player_health, 810, 1008 - 42 * Game.player_health, 20); 
	Game.drawImage(Game.healthbar, {x : 300, y : 530})
	if(Game.looking_good){
		Game.drawImage(Game.healthhat2, {x : 430 + 42 * Game.player_health - 310, y : 774 - 100})
	}
	else {
		Game.drawImage(Game.healthhat, {x : 400 + 42 * Game.player_health - 170, y : 774 - 100})	
	}
}

Game.scoreboard_logic = function(){
	if(Game.name_inputted != true){
		Game.inputname();
	}
	else{
		if(Game.get_mouse_position([1500,1800],[600,900])){
			Game.in_menus = true;
		}
	}
}

Game.save_the_score = function() {
	//console.log("innan, ", Game.highscores)
	var newscoreboard = [];
	var length = Game.highscores.length
	var inserted = false;
	var i = 0;
	while ( i < length ) {
		if (Number(Game.highscores[i][1]) > Game.score && inserted != true){
			newscoreboard.push(Game.highscores[i])
			i += 1;
		}
		else if(Number(Game.highscores[i][1]) < Game.score && inserted != true){
			newscoreboard.push([Game.name, String(Game.score)]);
			inserted = true;
		}
		
		else {
			newscoreboard.push(Game.highscores[i])
			i += 1;
		}
	}
	if (!inserted) {
		console.log("hah, sämst")
		newscoreboard.push([Game.name, String(Game.score)]);
	}
	Game.highscores = newscoreboard;
	localStorage.setItem("highscores", JSON.stringify(Game.highscores));
	//console.log("efter, " , Game.highscores)
}

Game.inputname = function(){
	if (Keyboard.keyDown[13]) 
	{
		Game.save_the_score();
		Game.name_inputted = true;
		return
    }
	for (const key in Keyboard.keyDown) 
	{
		if (Keyboard.keyDown[key]){
			if(Keyheld.keyHeld[key])
			{
				continue
			}
			else
			{
				Keyheld.keyHeld[key] = true;
				if(Keyboard.keyDown[8])
				{
					Game.name = `${Game.name.slice(0, -1)}`;
				}
				else if(inverse_keys[key] != undefined){
					Game.name += inverse_keys[key];
				}
			}
		}
		else
		{
			Keyheld.keyHeld[key] = false;
		}
	}
}

Game.draw_inputted_name = function(){
	Game.canvasContext.font = "36px Arial"; // Font size and family
	Game.canvasContext.fillStyle = "white";  // Text color
	if(Game.won){
		Game.canvasContext.fillText("Congratulations!", 780, 150)
	}
	else{
		Game.canvasContext.fillText("You tried...", 780, 150)
	}
	Game.canvasContext.fillText("Your score is " + String(Game.score),780,200)
	Game.canvasContext.fillText("Enter your name:", 780, 250)
	Game.canvasContext.fillText(Game.name, 780, 300)
}

Game.draw_scoreboard = function(){
	const pos = {x : 0, y : 0}
	if(Game.name_inputted != true){
		Game.draw_inputted_name();
	}
	else{
		Game.drawImage(Game.scoreboard_background, pos);
		Game.drawImage(Game.scoreboard_text, pos);
		Game.drawImage(Game.scoreboard_IDA_1, pos);
		Game.canvasContext.font = "36px Times New Roman"; // Font size and family
		Game.canvasContext.fillStyle = "white";  // Text color
		var ypos = 200
		for(var score in Game.highscores){
			Game.canvasContext.fillText(Game.highscores[score][0] + ", " + Game.highscores[score][1], 780, ypos)
			ypos += 80
		}
		Game.drawImage(Game.scoreboard_button, {x : 1500, y : 500})
	}
}
//-----------------------------------------------------------------------------
//	Constants
//-----------------------------------------------------------------------------

// Directions
var NONE = '-';
var NORTH = 'n';
var SOUTH = 's';
var EAST = 'e';
var WEST = 'w';

// Cell element types
var CEMETERY = 1;
var FORTRESS = 2;
var CITY = 3;
var SIGN = 4;
var ZOMBIE = 5;

// Game states
var INIT = 1;
var RUNNING = 2;
var PAUSED = 3;
var STOPPED = 4;
var MUTE = 0;
//-----------------------------------------------------------------------------
//	Main
//-----------------------------------------------------------------------------

window.onload = function() {
	gameState = INIT;
	pauseTimeout = undefined;

	Crafty.init(ETA.config.scene.dimension.width, ETA.config.scene.dimension.height, ETA.config.frameRate);
		
	//-----------------------------------------------------------------------------
	//	Loading scene
	//-----------------------------------------------------------------------------

	//the loading screen that will display while our assets load
	Crafty.scene("loading", function (el) {
		gameState = "running";
		
		//load takes an array of assets and a callback when complete
		Crafty.load([
			"img/sprites/background.png",
			"img/sprites/cemetery-blue.png", 
			"img/sprites/cemetery-red.png",
			"img/sprites/chunks.png",
			"img/sprites/city1.png",
			"img/sprites/city2.png",
			"img/sprites/city3.png",
			"img/sprites/doll-red.png",
			"img/sprites/doll-blue.png", 
			"img/sprites/fortress-blue.png",
			"img/sprites/fortress-red.png",
			"img/sprites/sign-red.png",  
			"img/sprites/sign-blue.png",
			"img/sprites/sorcerer-red.png",
			"img/sprites/sorcerer-blue.png",
			"img/sprites/totemGauge.png",
			"img/sprites/zombie-red.png",
			"img/sprites/zombie-blue.png",
		], function () {
			$('#loading-text').addClass('hideMenu');
			$('#start-button').removeClass('hideMenu');
			$('#start-button').click(function() {
				Crafty.scene("main"); //when everything is loaded, run the main scene
			});
		});

		//black background with some loading text
		Crafty.e('HTML')
			.attr({ w: ETA.config.scene.dimension.width, h: ETA.config.scene.dimension.height, x: 0, y: 0 })
			.replace(
				'<div id="menu">'+
					'<div id="menu-button">'+
						'<div id="loading-text">LOADING ...</div>'+
						'<div id="start-button" class="hideMenu">start</div>'+
//						'<div id="option-button" class="hideMenu"><img src="img/option.png" alt="OPTION"/></div>'+
//						'<div id="tutorial-button" class="hideMenu"><img src="img/tuto.png" alt="TUTORIAL"/></div>'+
					'</div>'+
				'</div>'
		);
	});
	//automatically play the loading scene
	Crafty.scene("loading");

	//-----------------------------------------------------------------------------
	//	Main scene
	//-----------------------------------------------------------------------------

	Crafty.scene("main", function (e) {
		gameState = RUNNING;
        $("#boucleJplayer").jPlayer( {
            ready: function () {
                $(this).jPlayer("setMedia", {
                    m4a: "media/ZombieBattleQN.mp3", 
                    oga: "media/ZombieBattleQN.ogg" 
                }).jPlayer("play");
            },
            ended: function() { 
                $(this).jPlayer("play");
            },
            supplied: "mp3, oga"
        });
        
        $("#pauseJplayer").jPlayer( {
            ready: function () {
                $(this).jPlayer("setMedia", {
                    m4a: "media/LaPause.mp3", 
                    oga: "media/LaPause.ogg" 
                });
            },
            ended: function() { 
                $(this).jPlayer("play");
            },
            supplied: "mp3, oga"
        });
		$("#boucleJplayer").jPlayer("volume",1);
		$("#pauseJplayer").jPlayer("volume",1);
		$("#muter").bind('click', function() {
			if (MUTE == 0){
				MUTE=1;
				$("#boucleJplayer").jPlayer("volume",0);
				$("#pauseJplayer").jPlayer("volume",0);
				Crafty.audio.settings("signCreate",{volume:0});
				Crafty.audio.settings("signMove",{volume:0});
				Crafty.audio.settings("signDelete",{volume:0});
				Crafty.audio.settings("doorOpen",{volume:0});
				Crafty.audio.settings("doorClose",{volume:0});
				Crafty.audio.settings("holeDig",{volume:0});
				Crafty.audio.settings("zombieDie",{volume:0});
				Crafty.audio.settings("zombieSounds",{volume:0});
				Crafty.audio.settings("zombieRage",{volume:0});
				Crafty.audio.settings("fortressAttack",{volume:0});
				Crafty.audio.settings("soldierDie",{volume:0});
				Crafty.audio.settings("cityDie",{volume:0});
				Crafty.audio.settings("gameOver",{volume:0});
				Crafty.audio.settings("pauseStart",{volume:0});
				$("#muter").removeClass("mute");
				$("#muter").addClass("unmute");
			}
			else if(MUTE==1){
				MUTE=0;
				$("#boucleJplayer").jPlayer("volume",1);
				$("#pauseJplayer").jPlayer("volume",1);
				Crafty.audio.settings("signCreate",{volume:0.20});
				Crafty.audio.settings("signMove",{volume:0.30});
				Crafty.audio.settings("signDelete",{volume:0.30});
				Crafty.audio.settings("doorOpen",{volume:0.50});
				Crafty.audio.settings("doorClose",{volume:0.50});
				Crafty.audio.settings("holeDig",{volume:0.50});
				Crafty.audio.settings("zombieDie",{volume:0.50});
				Crafty.audio.settings("zombieSounds",{volume:0.50});
				Crafty.audio.settings("zombieRage",{volume:0.50});
				Crafty.audio.settings("fortressAttack",{volume:1.0});
				Crafty.audio.settings("soldierDie",{volume:1.0});
				Crafty.audio.settings("cityDie",{volume:0.75});
				Crafty.audio.settings("gameOver",{volume:1.0});
				Crafty.audio.settings("pauseStart",{volume:0.5});
				$("#muter").removeClass("unmute");
				$("#muter").addClass("mute");
			} 
		})
		//Crafty.audio.play("bgMusic", -1);
		
		generateWorld();
		generatePauseScreen();
		
		// Create dolls (controlled by players)
		var player1 = Crafty.e("VoodooDoll, redDoll")
				.VoodooDoll(1);
		var player2 = Crafty.e("VoodooDoll, blueDoll")
				.VoodooDoll(2);
		
		// Create sorcerers
		Crafty.e("VoodooMaster, redSorcerer")
			.VoodooMaster(player1, 0, 5);
		Crafty.e("VoodooMaster, blueSorcerer")
			.VoodooMaster(player2, 18, 5);
		
		// Create pillars
		Crafty.e("Pillar, pillar")
			.Pillar(player1, 0, 6);
		Crafty.e("Pillar, pillar")
			.Pillar(player2, 18, 6);
		
		// Create cemeteries
		var cemetery = [];
		cemetery.push(Crafty.e("Cemetery, redCemetery")
				.Cemetery(player1, 1, 3));
		cemetery.push(Crafty.e("Cemetery, redCemetery")
				.Cemetery(player1, 1, 7));
				
		cemetery.push(Crafty.e("Cemetery, blueCemetery")
				.Cemetery(player2, 18, 3));
		cemetery.push(Crafty.e("Cemetery, blueCemetery")
				.Cemetery(player2, 18, 7));
		
		// Create fortress parts - Red
		Crafty.e("Fortress, redFortress")
			.Fortress(1,0,player1);
		Crafty.e("Fortress, redFortress")
			.Fortress(1,1,player1);
		Crafty.e("Fortress, redFortress")
			.Fortress(1,2,player1);
		Crafty.e("Fortress, redFortress")
			.Fortress(1,4,player1);
		Crafty.e("Fortress, redFortress")
			.Fortress(1,5,player1);
		Crafty.e("Fortress, redFortress")
			.Fortress(1,6,player1);
		Crafty.e("Fortress, redFortress")
			.Fortress(1,8,player1);
		Crafty.e("Fortress, redFortress")
			.Fortress(1,9,player1);
		Crafty.e("Fortress, redFortress")
			.Fortress(1,10,player1);
		
		// Create fortress parts - Blue
		Crafty.e("Fortress, blueFortress")
			.Fortress(18,0,player2);
		Crafty.e("Fortress, blueFortress")
			.Fortress(18,1,player2);
		Crafty.e("Fortress, blueFortress")
			.Fortress(18,2,player2);
		Crafty.e("Fortress, blueFortress")
			.Fortress(18,4,player2);
		Crafty.e("Fortress, blueFortress")
			.Fortress(18,5,player2);
		Crafty.e("Fortress, blueFortress")
			.Fortress(18,6,player2);
		Crafty.e("Fortress, blueFortress")
			.Fortress(18,8,player2);
		Crafty.e("Fortress, blueFortress")
			.Fortress(18,9,player2);
		Crafty.e("Fortress, blueFortress")
			.Fortress(18,10,player2);
		
		// Create cities - Size 1
		Crafty.e("City, neutralCity1")
				.City(3, 9, 1);
		Crafty.e("City, neutralCity1")
				.City(4, 2, 1);
		Crafty.e("City, neutralCity1")
				.City(14, 10, 1);
		Crafty.e("City, neutralCity1")
				.City(15, 1, 1);
		
		// Create cities - Size 2
		Crafty.e("City, neutralCity2")
				.City(6, 4, 2);
		Crafty.e("City, neutralCity2")
				.City(13, 6, 2);
		
		// Create cities - Size 3
		Crafty.e("City, neutralCity3")
				.City(10, 5, 3);
	});
	
	//-----------------------------------------------------------------------------
	//	Keyboard handler
	//-----------------------------------------------------------------------------

	Crafty.bind('KeyDown', function(el) {
		if (el.key == Crafty.keys.ESC) {
			if (gameState == RUNNING) {
				gameState = PAUSED;
				Crafty.pause(true);
				$("#pause-screen").show();
				Crafty.audio.settings("pauseStart", { muted: false });
				Crafty.audio.play("pauseStart");
				$("#boucleJplayer").jPlayer("pause");
				pauseTimeout = window.setTimeout(function() {
					$("#pauseJplayer").jPlayer("play");
				}, 6000 );
			} else if (gameState == PAUSED) {
				Crafty.audio.settings("pauseStart", { muted: true });
				$("#boucleJplayer").jPlayer("play");
                $("#pauseJplayer").jPlayer("stop");
				window.clearTimeout(pauseTimeout);
				
				gameState = RUNNING;
				$("#pause-screen").hide();
				Crafty.pause(false);
			}
		} else if ((el.key == Crafty.keys.SPACE || el.key == Crafty.keys.ENTER) && gameState == STOPPED) {
			gameState = INIT;
			Crafty.stop(true);
			Crafty("2D DOM").destroy();
			Crafty.init(ETA.config.scene.dimension.width, ETA.config.scene.dimension.height, ETA.config.frameRate);
			Crafty.scene("loading");
		}
	})
	
	//-----------------------------------------------------------------------------
	//	Method - World generation
	//-----------------------------------------------------------------------------

	function generateWorld() {
		Crafty.sprite(16, "img/sprites/background.png", {
			bg: [0, 0, 1000, 550]
		});
		Crafty.sprite(65, "img/sprites/zombie-red.png", {
			redZombie: [0, 0]
		});
		Crafty.sprite(65, "img/sprites/zombie-blue.png", {
			blueZombie: [0, 0]
		});
		Crafty.sprite(100, "img/sprites/zombiePack-red.png", {
			redZombiePack: [0, 0]
		});
		Crafty.sprite(100, "img/sprites/zombiePack-blue.png", {
			blueZombiePack: [0, 0]
		});
		Crafty.sprite(65, "img/sprites/doll-red.png", {
			redDoll: [0, 0]
		});
		Crafty.sprite(65, "img/sprites/doll-blue.png", {
			blueDoll: [3, 0]
		});
		Crafty.sprite(65, "img/sprites/sign-red.png", {
			redSign: [0, 0]
		});
		Crafty.sprite(65, "img/sprites/sign-blue.png", {
			blueSign: [0, 0]
		});
		Crafty.sprite(110, "img/sprites/cemetery-red.png", {
			redCemetery: [0, 0]
		});
		Crafty.sprite(110, "img/sprites/cemetery-blue.png", {
			blueCemetery: [0, 0]
		});
		Crafty.sprite(70, "img/sprites/fortress-red.png", {
			redFortress: [0, 0]
		});
		Crafty.sprite(70, "img/sprites/fortress-blue.png", {
			blueFortress: [0, 0]
		});
		Crafty.sprite(70, "img/sprites/city1.png", {
			neutralCity1: [0, 0]
		});
		Crafty.sprite(70, "img/sprites/city2.png", {
			neutralCity2: [0, 0]
		});
		Crafty.sprite(70, "img/sprites/city3.png", {
			neutralCity3: [0, 0]
		});
		Crafty.sprite(110, "img/sprites/sorcerer-red.png", {
			redSorcerer: [0, 0]
		});
		Crafty.sprite(110, "img/sprites/sorcerer-blue.png", {
			blueSorcerer: [0, 0]
		});
		Crafty.sprite(80, "img/sprites/totemGauge.png", {
			pillar: [0,0]
		});
		Crafty.sprite(70, "img/sprites/chunks.png", {
			chunks: [0, 0]
		});
		
		ETA.player1FortressLife = ETA.config.game.hitPointsFortress;
		ETA.player2FortressLife = ETA.config.game.hitPointsFortress;
		
		ETA.grid = Crafty.e("BGGrid").
			grid(ETA.config.scene.board.width, ETA.config.scene.board.height);
	}

	//-----------------------------------------------------------------------------
	//	Method - Pause screen
	//-----------------------------------------------------------------------------

	function generatePauseScreen() {
		$('#cr-stage').append(
			'<div id="pause-screen" hidden="">'+
				'<img src="img/pauseText.png" alt="PAUSE"/>'+
			'</div>'
		);
		
		$("#pause-screen").hide();
	}
};


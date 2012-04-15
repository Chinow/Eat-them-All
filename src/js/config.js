var FRAMERATE = 60;

//namespace
ETA = window.ETA || {};

ETA.config = {
	// Scene
	scene: {
		// Scene dimension (in pixels)
		dimension: {
			width: 1000,
			height: 580
		},
		// Board size (in number of tiles)
		board: {
			width: 20,
			height: 11
		},
		// Single tile dimensions (in pixels)
		tile: {
			width: 50,
			height: 50
		}
	},
	
	// Framerate
	frameRate: FRAMERATE,
	
	// Animation
	animation: {
		doll: {
			stand:		FRAMERATE / 1,
			walk:		FRAMERATE / 5,
			summon:		FRAMERATE / 5
		},
		zombie: {
			spawn:		FRAMERATE / 4,
			walk:		FRAMERATE / 5,
			attack:		FRAMERATE / 3,
			die:		FRAMERATE / 5
		},
		sign: {
			create:		FRAMERATE / 5,
			rotate:		FRAMERATE / 10,
			destroy:	FRAMERATE / 5
		},
		cemetery: {
			flame:		FRAMERATE / 2
		},
		sorcerer: {
			stand:		FRAMERATE / 2,
			summon:		FRAMERATE / 5
		},
		chunks: {
			crush:		FRAMERATE / 5
		}
	},
	
	game: {
		village: {
			maxGuards: 5,
			maxHumans: 10,
			procreationSpeed: 0.2,
			eatSpeed: 0.3,
			exitSpeed: 0.4
		},
		town: {
			maxGuards: 10,
			maxHumans: 20,
			procreationSpeed: 0.2,
			eatSpeed: 0.5,
			exitSpeed: 0.4
		},
		city: {
			maxGuards: 25,
			maxHumans: 40,
			procreationSpeed: 0.2,
			eatSpeed: 1,
			exitSpeed: 0.4
		},
		
		doll: {
			speed: 4,
			maxSigns: 6
		},
		
		zombie: {
			speed: 1,
			damage: 1
		},
		
		fortress: {
			hitpoints: 100
		},
		
		cemetery: {
			spawnPeriod: 3
		}
	},
	
	p1: {
		startPosition: { x: 150, y: 250, z: 1000 },
		keyset: "wasd",
		actionKey: Crafty.keys.SPACE,
	},
	p2: {
		startPosition: { x: 800, y: 250, z: 1000 },
		keyset: "arrows",
		actionKey: Crafty.keys.ENTER
	}
};

ETA.debug = {
	play: 1
};

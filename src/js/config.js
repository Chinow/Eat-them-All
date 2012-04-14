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
			stand:		1.0 * FRAMERATE,
			walk:		0.2 * FRAMERATE,
			summon:		0.2 * FRAMERATE
		},
		zombie: {
			spawm:		0.2 * FRAMERATE,
			walk:		0.2 * FRAMERATE,
			attack:		0.3 * FRAMERATE,
			die:		0.2 * FRAMERATE
		},
		sign: {
			create:		0.2 * FRAMERATE,
			rotate:		0.1 * FRAMERATE,
			destroy:	0.2 * FRAMERATE
		},
		cemetery: {
			flame:		0.5 * FRAMERATE
		},
		sorcerer: {
			stand:		0.5 * FRAMERATE,
			summon:		0.2 * FRAMERATE
		},
		chunks: {
			crush:		0.2 * FRAMERATE
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
		
		dollSpeed: 4,
		zombiSpeed: 1,
		zombiDamage: 1,
		nbSign: 6,
		hitPointsFortress: 100,
		timeSpawnFortress: 3,
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

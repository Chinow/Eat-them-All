//namespace
ETA = window.ETA || {};

ETA.config = {
	// Scene
	stageWidth: 1000,
	stageHeight: 580,
	nbTileWidth: 20,
	nbTileHeight: 11,
	
	// Animation
	frameRate: 60,
	zombiAnimationRate:5,
	dollAnimationRate:10,
	signBeginAnimationRate:5,
	signAnimationRate:8,

	tile:{
		tileWidth: 50,
		tileHeight: 50
	},
	game:{
		dollSpeed:4,
		zombiSpeed:1,
		hitPointsFortress:100,
		timeSpawnFortress:2
	},
	p1: {
		startPosition: { x: 150, y: 250, z: 1000 },
		keyset: "zqsd",
		//keyset:"wasd",
		actionKey: Crafty.keys.SPACE,
		popSign:0,
		nbSign:3
	},
	p2: {
		startPosition: { x: 800, y: 250, z: 1000 },
		keyset: "arrows",
		actionKey: Crafty.keys.ENTER,
		popSign:0,
		nbSign:3
	}
};

ETA.debug = {
	play: 1
};

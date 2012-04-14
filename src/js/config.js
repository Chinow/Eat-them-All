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
	zombiAnimationRate: 5,
	zombiAttackAnimationRate: 3,
	dollAnimationRate: 5,
	signBeginAnimationRate: 5,
	signAnimationRate: 8,
	cemeteryAnimationRate: 2,
	sorcererAnimationRate: 2,
	sorcererSummonAnimationRate: 4,
	chunksAnimationRate: 6,
	
	tile:{
		tileWidth: 50,
		tileHeight: 50
	},
	game:{
		procreationSpeed: 0.2,
		cityZombiCreationSpeed: 0.1,
		dollSpeed: 4,
		zombiSpeed: 1,
		zombiDamage: 1,
		nbSign: 6,
		hitPointsFortress: 100,
		nbGuardsHameau: 5,
		nbGuardsVillage: 10,
		nbGuardsVille: 25,
		nbHumansHameau: 10,
		nbHumansVillage: 20,
		nbHumansVille: 40,
		timeSpawnFortress: 3,
		timeGetOutFortress: 0.5,
	},
	p1: {
		startPosition: { x: 150, y: 250, z: 1000 },
		keyset:"wasd",
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

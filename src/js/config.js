//namespace
ETA = window.ETA || {};

ETA.config = {
	keyset:"zqsd",
	//keyset:"wasd",
	frameRate: 60,
	zombiAnimationRate:5,
	dollAnimationRate:10,
	signBeginAnimationRate:5,
	signAnimationRate:8,
	stageWidth: 1000,
	stageHeight: 580,
	nbTileWidth: 20,
	nbTileHeight: 11,
	cellVoodooDool:null,
	keyDownSign: Crafty.keys.ENTER,
	tile:{
		tileWidth: 50,
		tileHeight: 50
	},
	game:{
		dollSpeed:4,
		zombiSpeed:1,
		nbSign:300
	}
};

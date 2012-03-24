window.onload = function() {
	Crafty.init(ETA.config.stageWidth, ETA.config.stageHeight, ETA.config.frameRate);
	Crafty.canvas.init();
	
	
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function () {
		//load takes an array of assets and a callback when complete
		Crafty.load(["img/bgSprite.png"], function () {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});

		//black background with some loading text
		Crafty.background("#505");
		Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
				.text("Loading")
				.css({ "text-align": "center" });
		});

	//automatically play the loading scene
	Crafty.scene("loading");
	
	Crafty.scene("main", function () {
		generateWorld();

	});
	
	function generateWorld() {
		
		Crafty.sprite(16, "img/bgSprite.png", {
			bg: [0, 0,1000 ,550]
		});
		Crafty.e("Grid").grid();
		
		//Crafty.e('2D, DOM, bg')
		//	.attr({ x:0, y:0 , z:1 });
	}
		
	//Crafty.canvas();
	//Crafty.scene('game', function() {
	//Crafty.sprite(1, 'img/bgSprite.png', {'bg': [0, 0]}),

	//Crafty.e("2D, Canvas, bg")
	//           .attr({ x: 0, y: 0, z:1, w:1000, h:550}).draw();



	//  ETA.grid = Crafty.e('Grid, bg').attr({x: 0, y: 0, z: 1, w: ETA.config.stageWidth, h: ETA.config.stageHeight});
	//});	

	//Crafty.scene('game');
};


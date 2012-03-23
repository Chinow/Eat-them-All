$(document).ready(function(){
	Crafty.init(ETA.config.stageWidth, ETA.config.stageHeight);
	//Crafty.canvas();
//	Crafty.scene('game', function() {
        Crafty.sprite(1, 'img/bgSprite.png', {'bg': [0, 0]}),
        
       Crafty.e("2D, Canvas, bg")
                .attr({ x: 0, y: 0, z:1, w:1000, h:550}).draw();
                
                
                
      //  ETA.grid = Crafty.e('Grid, bg').attr({x: 0, y: 0, z: 1, w: ETA.config.stageWidth, h: ETA.config.stageHeight});
	//});	
        
  //  Crafty.scene('game');
});


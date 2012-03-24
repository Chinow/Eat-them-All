Crafty.c("ZombieIA", {
	init: function() {
		Crafty.bind("EnterFrame",this.moveZombi)
		return this;
	},
	move : function(){},
	zombieIA: function(func){
			this.move = func;
			return this;
	},
	moveZombi: function(){
		if (this.move)
		{
			this.move({x:1 ,y:0});
		}
	}
});


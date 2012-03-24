Crafty.c("Controls", {
    init: function() {
        this.requires('Multiway');
    },
    
    keyboard1Controls: function(speed) {
		if (ETA.config.keyset == "zqsd")
		{
			this.multiway(speed, {Z: -90, S: 90, D: 0, Q: 180});
		}
		else if (ETA.config.keyset == "wasd")
		{
			this.multiway(speed, {W: -90, S: 90, D: 0, A: 180});
		}
        return this;
    },
    
    keyboard2Controls: function(speed) {
		this.multiway(speed, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
        return this;
    }
});

Crafty.c("Controls", {
    init: function() {
        this.requires('Multiway');
    },
    
    keyboard1Controls: function(speed) {
		//if (ETA.config.keyset == "zqsd")
		//{
			this.multiway(speed, {Z: -90, S: 90, D: 0, Q: 180})
		//}
		//else if (ETA.config.keyset == "wasd")
		//{
		//	this.multiway(speed, {W: -90, S: 90, D: 0, A: 180})
		//}
        return this;
    }
});

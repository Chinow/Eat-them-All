Crafty.c("Controls", {

	//-----------------------------------------------------------------------------
	//	Init
	//-----------------------------------------------------------------------------
	
	init: function() {
		this.requires('Multiway');
	},
	
	//-----------------------------------------------------------------------------
	//	Methods
	//-----------------------------------------------------------------------------
	
	getMultiway: function(keyset) {
		if (keyset == "wasd") {
			return { Z: -90, W: -90, S: 90, D: 0, A: 180, Q: 180 };
		} else if (keyset == "arrows") {
			return { UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180 };
		}
	},
	
	keyboard1Controls: function(speed) {
		this.multiway(speed, this.getMultiway(ETA.config.p1.keyset));
		return this;
	},
	
	keyboard2Controls: function(speed) {
		this.multiway(speed, this.getMultiway(ETA.config.p2.keyset));
		return this;
	}
});


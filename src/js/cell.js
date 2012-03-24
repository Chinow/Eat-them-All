Crafty.c("Cell", {
    center : {x:0, y:0},
    elem   : null,
    borderCell : false,
    init: function() {
        this.requires('2D, DOM');
        return this;
    },
    cell : function() {
		this.center = {x:this._x+ this._w/2, y:this._y + this._h/2};
		return this;
	},
	attribute : function(p) {
		if(this.elem != p) {
			this.elem = p;
			return true;
		}
		return false;
	}
});


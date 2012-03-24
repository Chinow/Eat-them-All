Crafty.c("Cell", {
    center : {x:0, y:0},
    elem   : null,
    init: function() {
        this.requires('2D, DOM');
        return this;
    },
    cell : function() {
		this.center = {x:this._x +25 + this._w/2, y:this._y + 25 + this._h/2};
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


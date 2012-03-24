Crafty.c("Cell", {
    center : {x:0, y:0},
    id	: 0,
    elem   : null,
    elemType :"none",
    lowerCell : false,
    upperCell : false,
    init: function() {
        this.requires('2D, DOM');
        return this;
    },
    cell : function(ref) {
		this.center = {x:this._x+ this._w/2, y:this._y + this._h/2};
		this.id		= ref;
		return this;
	},
	attribute : function(p) {
		if(this.elem != p) {
			this.elem = p;
			return true;
		}
		return false;
	},
});


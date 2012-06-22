goog.provide('lpc.Layer');

goog.require('lime.Layer');
goog.require('lpc.Config');

lpc.Layer = function(){
	goog.base(this);
	
	this.setAnchorPoint(0, 0);
}

goog.inherits(lpc.Layer, lime.Layer);

lpc.Node.prototype.getPositionOnGrid = function(){
	var position = new goog.math.Coordinate(this.getPosition().x, this.getPosition().y);
	position.x = position.x/lpc.Config.GRID_CELL;
	position.y = position.y/lpc.Config.GRID_CELL;
	
	var x = Math.floor(position.x);
	var y = Math.floor(position.y);
	
	return new goog.math.Coordinate(x, y);
}

lpc.Layer.prototype.setPositionOnGrid = function(value, opt_y){
	var position;
	
	if (arguments.length == 2) {
        position = new goog.math.Coordinate(arguments[0], arguments[1]);
    }
    else {
        position = new goog.math.Coordinate(value.width, value.height);
    }
    
    position.x = Math.round(position.x) * lpc.Config.GRID_CELL;
	position.y = Math.round(position.y) * lpc.Config.GRID_CELL;
	
	return this.setPosition(position.x, position.y);
}
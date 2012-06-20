goog.provide('lpc.Sprite');

goog.require('lime.Sprite');
goog.require('lpc.Config');

lpc.Sprite = function(){
	goog.base(this);
	
	this.setAnchorPoint(0, 0);
}

goog.inherits(lpc.Sprite, lime.Sprite);

lpc.Sprite.prototype.setSizeOnGrid = function(value, opt_height){
	var size;
	
	if (arguments.length == 2) {
        size = new goog.math.Size(arguments[0], arguments[1]);
    }
    else {
        size = value;
    }
	
	size.width *= lpc.Config.GRID_CELL;
	size.height *= lpc.Config.GRID_CELL;
	
	var width = Math.floor(size.width);
	var height = Math.floor(size.height);
	
	if(size.width > width)
		width += 1;
	if(size.height > height)
		height += 1;
	
	return this.setSize(width, height);
}

lpc.Sprite.prototype.getSizeOnGrid = function(){
	var size = this.getSize();
	size.width = size.width/lpc.Config.GRID_CELL;
	size.height = size.height/lpc.Config.GRID_CELL;
	
	var width = Math.floor(size.width);
	var height = Math.floor(size.height);
	
	if(size.width > width)
		width += 1;
	if(size.height > height)
		height += 1;
	
	return new goog.math.Size(width, height);
}

lpc.Sprite.prototype.getPositionOnGrid = function(){
	var position = this.getPosition();
	position.x = position.x/lpc.Config.GRID_CELL;
	position.y = position.y/lpc.Config.GRID_CELL;
	
	var x = Math.floor(position.x);
	var y = Math.floor(position.y);
	
	return new goog.math.Coordinate(x, y);
}

lpc.Sprite.prototype.setPositionOnGrid = function(value, opt_y){
	var position;
	
	if (arguments.length == 2) {
        position = new goog.math.Coordinate(arguments[0], arguments[1]);
    }
    else {
        position = value;
    }
    
    position.x = Math.round(position.x) * lpc.Config.GRID_CELL;
	position.y = Math.round(position.y) * lpc.Config.GRID_CELL;
	
	return this.setPosition(position.x, position.y);
}
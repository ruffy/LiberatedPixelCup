goog.provide('lpc.Node');

goog.require('lime.Node');
goog.require('lpc.Config');

lpc.Node = function(){
	goog.base(this);
	
	this.setAnchorPoint(0, 0);
}

goog.inherits(lpc.Node, lime.Node);

lpc.Node.prototype.setSizeOnGrid = function(value, opt_height){
	var size;
	
	if (arguments.length == 2) {
        size = new goog.math.Size(arguments[0], arguments[1]);
    }
    else {
        size = new goog.math.Size(value.width, value.height);
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

lpc.Node.prototype.getSizeOnGrid = function(){
	var size = new goog.math.Size(this.getSize().width, this.getSize().height);
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

lpc.Node.prototype.getPositionOnGrid = function(){
	var position = new goog.math.Coordinate(this.getPosition().x, this.getPosition().y);
	position.x = position.x/lpc.Config.GRID_CELL;
	position.y = position.y/lpc.Config.GRID_CELL;
	
	var x = Math.floor(position.x);
	var y = Math.floor(position.y);
	
	return new goog.math.Coordinate(x, y);
}

lpc.Node.prototype.setPositionOnGrid = function(value, opt_y){
	var position;
	
	if (arguments.length == 2) {
        position = new goog.math.Coordinate(arguments[0], arguments[1]);
    }
    else {
        position = new goog.math.Coordinate(value.x, value.y);
    }
    
    position.x = Math.round(position.x) * lpc.Config.GRID_CELL;
	position.y = Math.round(position.y) * lpc.Config.GRID_CELL;
	
	return this.setPosition(position.x, position.y);
}
goog.provide('lpc.levels.Level');

goog.require('lpc.Layer');

lpc.levels.Level = function(game, tmx){
	this.layers_ = new Array();
	this.charLayer_;
	
	var grid_visible = false;
	var grid = new lpc.Sprite();
	
	this.map_ = new lime.parser.TMX(tmx);
	
	for(var i in this.map_.layers){
		var layer = new lpc.Layer();
		
		game.appendChild(layer);
		
		for(var p in this.map_.layers[i].properties){
			switch(this.map_.layers[i].properties[p].name){
				case 'player':
				this.charLayer_ = layer;
				break;
				
				case 'renderer':
				if(this.map_.layers[i].properties[p].value == 'canvas'){
					layer.setRenderer(lime.Renderer.CANVAS);
				}
				break;
			}
		}
		
		if(layer != this.charLayer_){
			this.layers_.push(layer);
		}
		
		for(var c in this.map_.layers[i].tiles){
			var tile = new lpc.Sprite().setAnchorPoint(0, 0).setSizeOnGrid(1, 1);
			tile.setPositionOnGrid(this.map_.layers[i].tiles[c].x, this.map_.layers[i].tiles[c].y);
			tile.setFill(this.map_.layers[i].tiles[c].tile.frame);
			
			for(var t in this.map_.layers[i].tiles[c].tile.properties){
				if(this.map_.layers[i].tiles[c].tile.properties[t].name == 'pass'){
					tile.pass = Boolean(this.map_.layers[i].tiles[c].tile.properties[t].value);
				}
			}
			
			layer.setRenderer(lime.Renderer.CANVAS);
			
			
			layer.appendChild(tile);
		}
	}
	
	this.gridIsVisible = function(){return grid_visible}
	
	this.buildGrid = function(){
		grid.setSizeOnGrid(lpc.Config.GRID).setAnchorPoint(0,0).setPosition(0,0).setStroke(1, '#eeeeee');
		
		var squareSize = lpc.Config.GRID_CELL;
		
		for(var i = 0; i+squareSize < grid.getSize().height; i+=squareSize){
			var rect = new lime.Sprite().setAnchorPoint(0,0).setSize(grid.getSize().width,squareSize+1).setPosition(0, i).setStroke(1, '#eeeeee');
			grid.appendChild(rect);
		}
		
		for(var i = 0; i+squareSize < grid.getSize().width; i+=squareSize){
			var rect = new lime.Sprite().setAnchorPoint(0,0).setSize(squareSize+1,grid.getSize().height).setPosition(i, 0).setStroke(1, '#eeeeee');
			grid.appendChild(rect);
		}
		
		this.getLayers()[0].appendChild(grid);
		
		grid_visible = true;
	}
	
	this.clearGrid = function(){
		grid = new lime.Sprite();
		this.removeChild(grid);
		grid_visible = false;
	}
}

lpc.levels.Level.prototype.getLayers = function(){
	return this.layers_;
}

lpc.levels.Level.prototype.getPosition = function(){
	if(this.layers_.length > 0)
		return this.layers_[0].getPosition();
}

lpc.levels.Level.prototype.getPositionOnGrid = function(){
	if(this.layers_.length > 0)
		return this.layers_[0].getPositionOnGrid();
}

lpc.levels.Level.prototype.roundPosition = function(){
	for(var i in this.layers_){
		this.layers_[i].setPositionOnGrid(this.layers_[i].getPositionOnGrid());
	}
}

lpc.levels.Level.prototype.toggleGrid = function(){
	if(!this.gridIsVisible()){
		this.buildGrid();
	}else{
		this.clearGrid();
	}
}

lpc.levels.Level.prototype.getCharLayer = function(){
	return this.charLayer_;
}

lpc.levels.Level.prototype.tileIsPassable = function(value, opt_y){
	var x,
		y;
	
	if (arguments.length == 2) {
        x = arguments[0];
        y = arguments[1];
    }
    else {
        x = value.x;
        y = value.y;
    }
    
    for(var i in this.map_.layers){
    	for(var t in this.map_.layers[i].tiles){
    		if(this.map_.layers[i].tiles[t].x == x && this.map_.layers[i].tiles[t].y == y){
    			for(var p in this.map_.layers[i].tiles[t].tile.properties){
    				if(this.map_.layers[i].tiles[t].tile.properties[p].name == 'pass' && this.map_.layers[i].tiles[t].tile.properties[p].value == 'false'){
    					return false
    				}
    			}
    		}
    	}
    }
    
    return true;
}

goog.provide('lpc.levels.Level');

goog.require('lpc.Layer');

lpc.levels.Level = function(game, tmx){
	this.layers_ = new Array();
	this.charLayer_;
	
	var grid_visible = false;
	var grid = new lpc.Sprite();
	
	var map = new lime.parser.TMX(tmx);
	
	console.log(map)
	
	for(var i in map.layers){
		var layer = new lpc.Layer();
		
		game.appendChild(layer);
		
		for(var p in map.layers[i].properties){
			if(map.layers[i].properties[p].name == 'player'){
				this.charLayer_ = layer;
			}
		}
		
		if(layer != this.charLayer_){
			this.layers_.push(layer);
		}
		
		for(var c in map.layers[i].tiles){
			var tile = new lpc.Sprite().setAnchorPoint(0, 0).setSizeOnGrid(1, 1);
			tile.setPositionOnGrid(map.layers[i].tiles[c].x, map.layers[i].tiles[c].y);
			tile.setFill(map.layers[i].tiles[c].tile.frame);
			
			for(var t in map.layers[i].tiles[c].tile.properties){
				if(map.layers[i].tiles[c].tile.properties[t].name == 'pass'){
					tile.pass = Boolean(map.layers[i].tiles[c].tile.properties[t].value);
				}
			}
			
			
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

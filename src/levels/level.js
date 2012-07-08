goog.provide('lpc.levels.Level');

goog.require('lpc.Layer');
goog.require('lpc.utils.TMXParser')

lpc.levels.Level = function(game, tmx){
	this.layers_ = new Array();
	this.charLayer_;
	this.tilesArray = new Array();
	
	var grid_visible = false;
	var grid = new lpc.Sprite();
	
	this.map_ = new lpc.utils.TMXParser(tmx);
	
	//console.log(this.map_);
	
	for(var i in this.map_.layers){
		var layer = new lpc.Layer();
		
		game.appendChild(layer);
		
		if(this.map_.layers[i].properties.player == 'true'){
			this.charLayer_ = layer;
			layer.setRenderer(lime.Renderer.DOM);
		}else{
			this.layers_.push(layer);
			layer.setRenderer(lime.Renderer.CANVAS);
		}
		
		if(this.map_.layers[i].properties.renderer == 'canvas'){
			layer.setRenderer(lime.Renderer.CANVAS);
		}
		
		//layer.setRenderer(lime.Renderer.CANVAS); //a performance em canvas é muito melhor no firefox (navegador que será usado pelos jurados)
		
		for(var c in this.map_.layers[i].tiles){
			var tile = new lpc.Sprite().setAnchorPoint(0, 0).setSizeOnGrid(1, 1);
			tile.setPositionOnGrid(this.map_.layers[i].tiles[c].x, this.map_.layers[i].tiles[c].y);
			tile.setFill(this.map_.layers[i].tiles[c].tile.frame);
			
			var pass = this.map_.layers[i].tiles[c].tile.properties.pass != 'false';
			//this.tilesArray[this.map_.layers[i].tiles[c].x + 'x' + this.map_.layers[i].tiles[c].y] = pass;
			var x = this.map_.layers[i].tiles[c].x;
			var y = this.map_.layers[i].tiles[c].y;
			
			if(typeof this.tilesArray[y] == 'undefined' || this.tilesArray[y] == null){
				this.tilesArray[y] = new Array();
			}
			this.tilesArray[y][x] = pass ? 0 : 1;
			
			layer.appendChild(tile);
		}
	}
	
	this.gridIsVisible = function(){return grid_visible}
	
	this.buildGrid = function(){
		grid.setSizeOnGrid(lpc.Config.GRID).setAnchorPoint(0,0).setPosition(0,0).setStroke(1, '#000000');
		
		var squareSize = lpc.Config.GRID_CELL;
		
		for(var i = 0; i+squareSize < grid.getSize().height; i+=squareSize){
			var rect = new lime.Sprite().setAnchorPoint(0,0).setSize(grid.getSize().width,squareSize+1).setPosition(0, i).setStroke(1, '#000000');
			grid.appendChild(rect);
		}
		
		for(var i = 0; i+squareSize < grid.getSize().width; i+=squareSize){
			var rect = new lime.Sprite().setAnchorPoint(0,0).setSize(squareSize+1,grid.getSize().height).setPosition(i, 0).setStroke(1, '#000000');
			grid.appendChild(rect);
		}
		
		game.appendChild(grid);
		
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
        x = Math.round(arguments[0]);
        y = Math.round(arguments[1]);
    }
    else {
        x = Math.round(value.x);
        y = Math.round(value.y);
    }
   	
    var pass = this.tilesArray[y][x] == 0;
    
    return pass != false; //se for false retorna false, se for qualquer outra coisa retorna true;
}
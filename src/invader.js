goog.provide('lpc.Invader');

goog.require('lime.SpriteSheet');
goog.require('lpc.Sprite');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.skeleton.json');
goog.require('lpc.Config');
goog.require('lpc.utils.AStar');

lpc.Invader = function(level, player){
	goog.base(this);
	
	this.level = level;
	this.player = player;
	var direction = '';
	var delay = .06;
	var self = this;
	this.speedFactor = 20;
	
	this.sheet = new lime.SpriteSheet('assets/spritesheets/skeleton.png', lime.ASSETS.skeleton.json, lime.parser.JSON);
	
	this.setAnchorPoint(.25, .5).setSizeOnGrid(2, 2).setFill(this.sheet.getFrame('skeleton0018.png'));
	
	this.hitArea = new lpc.Sprite().setSize(26, 26).setPosition(3,3);//.setStroke(1, '#eeeeee');
	this.appendChild(this.hitArea);
	
	this.up = new Array( 
		this.sheet.getFrame('skeleton0000.png'),
		this.sheet.getFrame('skeleton0001.png'),
		this.sheet.getFrame('skeleton0002.png'),
		this.sheet.getFrame('skeleton0003.png'),
		this.sheet.getFrame('skeleton0004.png'),
		this.sheet.getFrame('skeleton0005.png'),
		this.sheet.getFrame('skeleton0006.png'),
		this.sheet.getFrame('skeleton0007.png'),
		this.sheet.getFrame('skeleton0008.png')
	);
	this.down = new Array(
		this.sheet.getFrame('skeleton0018.png'),
		this.sheet.getFrame('skeleton0019.png'),
		this.sheet.getFrame('skeleton0020.png'),
		this.sheet.getFrame('skeleton0021.png'),
		this.sheet.getFrame('skeleton0022.png'),
		this.sheet.getFrame('skeleton0023.png'),
		this.sheet.getFrame('skeleton0024.png'),
		this.sheet.getFrame('skeleton0025.png'),
		this.sheet.getFrame('skeleton0026.png')
	);
	this.right = new Array(
		this.sheet.getFrame('skeleton0027.png'),
		this.sheet.getFrame('skeleton0028.png'),
		this.sheet.getFrame('skeleton0029.png'),
		this.sheet.getFrame('skeleton0030.png'),
		this.sheet.getFrame('skeleton0031.png'),
		this.sheet.getFrame('skeleton0032.png'),
		this.sheet.getFrame('skeleton0033.png'),
		this.sheet.getFrame('skeleton0034.png'),
		this.sheet.getFrame('skeleton0035.png')
	);
	this.left = new Array(
		this.sheet.getFrame('skeleton0009.png'),
		this.sheet.getFrame('skeleton0010.png'),
		this.sheet.getFrame('skeleton0011.png'),
		this.sheet.getFrame('skeleton0012.png'),
		this.sheet.getFrame('skeleton0013.png'),
		this.sheet.getFrame('skeleton0014.png'),
		this.sheet.getFrame('skeleton0015.png'),
		this.sheet.getFrame('skeleton0016.png'),
		this.sheet.getFrame('skeleton0017.png')
	);
	
	this.animationUp = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationUp.setFrames(this.up);
	
	this.animationDown = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationDown.setFrames(this.down);
	
	this.animationRight = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationRight.setFrames(this.right);
	
	this.animationLeft = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationLeft.setFrames(this.left);
	
	this.setDirection = function(value){direction = value; return this}
	this.getDirection = function(){return direction}
}

goog.inherits(lpc.Invader, lpc.Sprite);

lpc.Invader.prototype.findPath = function(){
	var aStar = new lpc.utils.AStar();
	
	var startX = Math.floor((this.getPosition().x + this.hitArea.getPosition().x) / lpc.Config.GRID_CELL),
		startY = Math.floor((this.getPosition().y + this.hitArea.getPosition().y) / lpc.Config.GRID_CELL),
		endX = Math.floor((this.player.getPosition().x + this.player.hitArea.getPosition().x) / lpc.Config.GRID_CELL),
		endY = Math.floor((this.player.getPosition().y + this.player.hitArea.getPosition().y) / lpc.Config.GRID_CELL);
	
	this.path = aStar.AStar(this.level.tilesArray, [startX, startY], [endX, endY]);
	
	this.path.shift();
	
	this.walkPath();
	
	return this;
}

lpc.Invader.prototype.move = function(direction){
	if(this.getDirection() != direction){
		this.setDirection(direction);
		
		switch(direction){
			case 'up':
			this.runAction(this.animationUp);
			break;
			
			case 'down':
			this.runAction(this.animationDown);
			break;
			
			case 'right':
			this.runAction(this.animationRight);
			break;
			
			case 'left':
			this.runAction(this.animationLeft);
			break;
		}
	}
	
	return this;
}

lpc.Invader.prototype.stop = function(){
	switch(this.getDirection()){
		case 'up':
		this.animationUp.stop();
		this.animationUp.play();
		this.setFill(this.sheet.getFrame('skeleton0000.png'));
		break;
		
		case 'down':
		this.animationDown.stop();
		this.animationDown.play();
		this.setFill(this.sheet.getFrame('skeleton0018.png'));
		break;
		
		case 'right':
		this.animationRight.stop();
		this.animationRight.play();
		this.setFill(this.sheet.getFrame('skeleton0027.png'));
		break;
		
		case 'left':
		this.animationLeft.stop();
		this.animationLeft.play();
		this.setFill(this.sheet.getFrame('skeleton0009.png'));
		break;
	}
	
	this.setDirection('');
	
	return this;
}

lpc.Invader.prototype.turn = function(side){
	switch(side){
		case 'up':
		this.setFill(this.sheet.getFrame('skeleton0000.png'));
		break;
		
		case 'down':
		this.setFill(this.sheet.getFrame('skeleton0018.png'));
		break;
		
		case 'right':
		this.setFill(this.sheet.getFrame('skeleton0027.png'));
		break;
		
		case 'left':
		this.setFill(this.sheet.getFrame('skeleton0009.png'));
		break;
	}
	
	return this;
}

lpc.Invader.prototype.walkPath = function(){
	if(this.path.length > 0){
		var step = this.path.shift();
		
		if(	this.level.tileIsPassable(step[0], step[1]) ||
			!this.isTorchPosition(step[0], step[1])){
			
			this.walk(step);
		}else{
			this.stop(this.getDirection());
			this.findPath();
		}
		
	}else{
		this.stop(this.getDirection());
	}
	
	return this;
}

lpc.Invader.prototype.walk = function(step){
	var positionOnGrid = new goog.math.Coordinate(this.getPositionOnGrid().x, this.getPositionOnGrid().y);
	var position = new goog.math.Coordinate(0, 0);
	
	var direction;
	
	if(step[1] < positionOnGrid.y){
		direction = 'up';
	}else if(step[1] > positionOnGrid.y){
		direction = 'down';
	}else if(step[0] > positionOnGrid.x){
		direction = 'right';
	}else if(step[0] < positionOnGrid.x){
		direction = 'left';
	}
    
    position.x = Math.round(step[0]) * lpc.Config.GRID_CELL;
	position.y = Math.round(step[1]) * lpc.Config.GRID_CELL;
	
	this.level.tilesArray[step[1]][step[0]] = 1;
	
	this.move(direction);
	
	var self = this;
	
	lime.scheduleManager.schedule(doWalk, self);
	
	function doWalk(dt){
		var x = 0,
			y = 0;
		
		switch(direction){
			case 'up':
			if(this.getPosition().y - (dt/this.speedFactor) > position.y){
				y = -(dt/12);
			}
			break;
			
			case 'down':
			if(this.getPosition().y + (dt/this.speedFactor) < position.y){
				y = dt/12;
			}
			break;
			
			case 'right':
			if(this.getPosition().x + (dt/this.speedFactor) < position.x){
				x = dt/12;
			}
			break;
			
			case 'left':
			if(this.getPosition().x - (dt/this.speedFactor) > position.x){
				x = -(dt/12);
			}
			break;
		}
		
		if(x == 0){
			x = position.x - this.getPosition().x;
		}
		
		if(y == 0){
			y = position.y - this.getPosition().y;
		}
		
		if(x != 0 || y != 0){
			this.setPosition(this.getPosition().x + x, this.getPosition().y + y);
		}else{
			lime.scheduleManager.unschedule(doWalk, self);
			//self.stop(direction);
			this.level.tilesArray[positionOnGrid.y][positionOnGrid.x] = 0;
			
			this.findPath();
			
			//this.walkPath();
		}
	}
	
	return this;
}

goog.provide('lpc.Game');

goog.require('lime.Scene');
goog.require('lpc.Sprite');
goog.require('lpc.Fog');

lpc.Game = function(){
	goog.base(this);
	
	var self = this;
	
	function init(){
		
	}
	
	var player = new lpc.Player().setOpacity(0),
		input = new lpc.inputs.KeyboardInput(),
		moveDirection,
		score,
		level;
		
	var invadersControl;
	
	level = new lpc.levels.Level(this, 'assets/maps/farm.tmx');
	
	var fog = new lpc.Fog().setQuality(.3)
	var night = new lpc.Sprite().setSizeOnGrid(lpc.Config.GRID).setPositionOnGrid(0, 0).setFill('#0F0F2D').setOpacity(.45);
	this.appendChild(fog);
	this.appendChild(night);
	
	var scoreLabel = new lime.Label().setText(''+goog.string.padNumber(score,4)).setFontFamily('monospace').setFontColor('#eeeeee').setFontSize(16)
						.setPosition(lpc.Config.SCREEN.width - 64, 32).setAlign('right').setFontWeight('bold');
	this.appendChild(scoreLabel);
	
	this.startGame = function(){
		level.getCharLayer().appendChild(player);
		
		moveDirection = '';
		score = 0;
		
		player.setPositionOnGrid((lpc.Config.GRID.width-1)/2 -1, (lpc.Config.GRID.height-1)/2 -3).turn('down');
		
		if(player.getOpacity() == 0)
			player.runAction(new lime.animation.FadeTo(1).setDuration(.2));
		
		goog.events.listen(input, lpc.events.InputEvent.FIRE, function(e){
			moveDirection = e.input;
			
			if(	e.input == 'up' ||
				e.input == 'down' ||
				e.input == 'right' ||
				e.input == 'left'){
				
				lime.scheduleManager.unschedule(walk, this);
					
				lime.scheduleManager.schedule(walk, this);
				
				//player.move(moveDirection);
			}else if(e.input == ''){
				lime.scheduleManager.unschedule(walk, this);
				
				player.stop();
			}
		});
		
		invadersControl = new lpc.InvadersControl(level, player);
		
		scoreLabel.setText(''+goog.string.padNumber(score,4)); 
		
		goog.events.listen(invadersControl, 'score', function(){
			score += 5;
			scoreLabel.setText(''+goog.string.padNumber(score,4));
		});
		
		goog.events.listen(invadersControl, 'gameover', function(){
			self.dispatchEvent('gameover');
		});
		
		return this;
	}
	
	this.getScore = function(){return score}
	
	function walk(dt){
		var position = player.localToParent(player.hitArea.getPosition());
		var size = player.hitArea.getSize();
		
		var cornerLT = new goog.math.Coordinate(position.x/lpc.Config.GRID_CELL, position.y/lpc.Config.GRID_CELL);
		var cornerLB = new goog.math.Coordinate(position.x/lpc.Config.GRID_CELL, (position.y + size.height)/lpc.Config.GRID_CELL);
		var cornerRT = new goog.math.Coordinate((position.x + size.width)/lpc.Config.GRID_CELL, position.y/lpc.Config.GRID_CELL);
		var cornerRB = new goog.math.Coordinate((position.x + size.width)/lpc.Config.GRID_CELL, (position.y + size.height)/lpc.Config.GRID_CELL);
		var move;
		
	   	switch(moveDirection){
	   		case 'up':
	   		var lt = new goog.math.Coordinate(Math.floor(cornerLT.x), Math.floor(cornerLT.y - (1/lpc.Config.GRID_CELL)));
	   		var rt = new goog.math.Coordinate(Math.floor(cornerRT.x), Math.floor(cornerRT.y - (1/lpc.Config.GRID_CELL)));
	   		
            if(level.tileIsPassable(lt) && level.tileIsPassable(rt) && lt.y > 0)
            	move = new goog.math.Coordinate(0, -1);
            else
            	player.setPosition(cornerLT.x * lpc.Config.GRID_CELL - player.hitArea.getPosition().x, Math.round(cornerLT.y) * lpc.Config.GRID_CELL - player.hitArea.getPosition().y);
            break;
            
            case 'down':
            var lb = new goog.math.Coordinate(Math.floor(cornerLB.x), Math.floor(cornerLB.y + (1/lpc.Config.GRID_CELL)));
	   		var rb = new goog.math.Coordinate(Math.floor(cornerRB.x), Math.floor(cornerRB.y + (1/lpc.Config.GRID_CELL)));
            
            if(level.tileIsPassable(lb) && level.tileIsPassable(rb) && lb.y < lpc.Config.GRID.height)
            	move = new goog.math.Coordinate(0, 1);
            else
            	player.setPosition(cornerLT.x * lpc.Config.GRID_CELL - player.hitArea.getPosition().x, Math.round(cornerLT.y) * lpc.Config.GRID_CELL - 1  + player.hitArea.getPosition().y);
            break;
            
            case 'right':
            var rt = new goog.math.Coordinate(Math.floor(cornerRT.x + (1/lpc.Config.GRID_CELL)), Math.floor(cornerRT.y));
	   		var rb = new goog.math.Coordinate(Math.floor(cornerRB.x + (1/lpc.Config.GRID_CELL)), Math.floor(cornerRB.y));
            
            if(level.tileIsPassable(rt) && level.tileIsPassable(rb) && rt.x < lpc.Config.GRID.width)
            	move = new goog.math.Coordinate(1, 0);
            else
            	player.setPosition(Math.round(cornerLT.x) * lpc.Config.GRID_CELL - 1 + player.hitArea.getPosition().x, cornerLT.y * lpc.Config.GRID_CELL - player.hitArea.getPosition().y);
            break; 
            
            case 'left':
            var lt = new goog.math.Coordinate(Math.floor(cornerLT.x - (1/lpc.Config.GRID_CELL)), Math.floor(cornerLT.y));
	   		var lb = new goog.math.Coordinate(Math.floor(cornerLB.x - (1/lpc.Config.GRID_CELL)), Math.floor(cornerLB.y));
	   		
            if(level.tileIsPassable(lt) && level.tileIsPassable(lb) && lt.x + 1 > 0)
            	move = new goog.math.Coordinate(-1, 0);
            else
            	player.setPosition(Math.round(cornerLT.x) * lpc.Config.GRID_CELL - player.hitArea.getPosition().x, cornerLT.y * lpc.Config.GRID_CELL - player.hitArea.getPosition().y);
            break;
	   	}
	    
	   	if(typeof move != 'undefined' && move != null){
	   		player.setPosition(player.getPosition().x + (move.x * (dt/10)), player.getPosition().y + (move.y * (dt/10)));
	   	}
	   	
	   	player.move(moveDirection);
    }
	
	this.startGame();
	
	this.destroy = function(){
		invadersControl.destroy();
	}
}

goog.inherits(lpc.Game, lime.Scene);

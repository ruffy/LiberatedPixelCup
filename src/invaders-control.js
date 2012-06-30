goog.provide('lpc.InvadersControl');

goog.require('goog.math');
goog.require('goog.math.Coordinate');
goog.require('lpc.Invader');
goog.require('lime.scheduleManager');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.Spawn');

lpc.InvadersControl = function(level, player){
	var maxQuantity 	= 1,
		invaderSpeed	= 10,
		invaders		= new Array(),
		counter			= 0;
		interval		= 4000;
		
	var self = this;
		
	manager();
	
	function manager(){
		console.log(counter)
		
		if(counter == 4){
			counter = 0;
			maxQuantity++;
			interval -= 100;	
		}
		
		if(invaders.length < maxQuantity){
			createInvader();
		}
		
		counter++;
		
		lime.scheduleManager.callAfter(function(){
			manager();
		}, self, interval)
	}
	
	function removeInvader(e){
		console.log(e);
	}
	
	function createInvader(){
		var position = new goog.math.Coordinate();
		var anim = new lime.animation.MoveBy(0, 0);
		var direction = 'right';
		
		do{
			if(goog.math.randomInt(2) == 0){ // sorteio -> 0: aparecerá nas laterais / 1: aparecerá em cima ou embaixo.
				position.x = goog.math.randomInt(2) * (lpc.Config.GRID.width - 1);
					
				position.y = goog.math.randomInt(lpc.Config.GRID.height);
			}else{
				position.y = goog.math.randomInt(2) * (lpc.Config.GRID.height - 1);
					
				position.x = goog.math.randomInt(lpc.Config.GRID.width);
			}
		}while(!level.tileIsPassable(position));
		
		if(position.x == 0){
			position.x--;
			anim = new lime.animation.MoveBy(lpc.Config.GRID_CELL, 0);
			direction = 'right';
		}else if(position.x == lpc.Config.GRID.width - 1){
			position.x++;
			anim = new lime.animation.MoveBy(-lpc.Config.GRID_CELL, 0);
			direction = 'left';
		}else if(position.y == 0){
			position.y--;
			anim = new lime.animation.MoveBy(0, 2 * lpc.Config.GRID_CELL);
			direction = 'down';
		}else if(position.y == lpc.Config.GRID.height - 1){
			position.y += 2;
			anim = new lime.animation.MoveBy(0, -2 * lpc.Config.GRID_CELL);
			direction = 'up';
		}
		
		var invader = new lpc.Invader().setPositionOnGrid(position).turn(direction);
		level.getCharLayer().appendChild(invader);
		invaders.push(invader);
		
		invader.runAction(anim.setDuration(2.5));
		
		//goog.events.listen(invader, [lpc.events.InvaderEvent.DISAPEAR], removeInvader);
		//goog.events.listen(invader, [lpc.events.InvaderEvent.MOVE], moveInvader);
	}
}

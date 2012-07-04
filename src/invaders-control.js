goog.provide('lpc.InvadersControl');

goog.require('goog.math');
goog.require('goog.math.Coordinate');
goog.require('lpc.Invader');
goog.require('lime.scheduleManager');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.ghost.json');

lpc.InvadersControl = function(level, player){
	var maxQuantity 	= 1,
		invaderSpeed	= 10,
		invaders		= new Array(),
		invadersTiles	= new Array(),
		interval		= 10000;
		
	var self = this;
	
	manager();
	
	function manager(){
		maxQuantity++;
		interval -= 100;
		
		if(invaders.length < maxQuantity){
			createInvader();
		}
		
		lime.scheduleManager.callAfter(function(){
			//manager();
		}, self, interval)
	}
	
	function removeInvader(e){
		console.log(e);
	}
	
	function createInvader(){
		var position = new goog.math.Coordinate();
		var anim = new lime.animation.MoveBy(0, 0);
		var direction = 'right';
		
		//do{
			if(goog.math.randomInt(2) == 0){ // sorteio -> 0: aparecerá nas laterais / 1: aparecerá em cima ou embaixo.
				position.x = goog.math.randomInt(2) * (lpc.Config.GRID.width - 1);
					
				position.y = goog.math.randomInt(lpc.Config.GRID.height);
			}else{
				position.y = goog.math.randomInt(2) * (lpc.Config.GRID.height - 1);
					
				position.x = goog.math.randomInt(lpc.Config.GRID.width);
			}
		//}while(!level.tileIsPassable(position));
		
		/*if(position.x == 0){
			position.x--;
			direction = 'right';
		}else if(position.x == lpc.Config.GRID.width - 1){
			position.x++;
			direction = 'left';
		}else if(position.y == 0){
			position.y--;
			direction = 'down';
		}else if(position.y == lpc.Config.GRID.height - 1){
			position.y += 2;
			direction = 'up';
		}*/
		
		var invader = new lpc.Invader(level, player);
		invader.setPositionOnGrid(position).turn('down').findPath();
		level.getCharLayer().appendChild(invader);
		invaders.push(invader);
		invadersTiles[position.x + 'x' + position.y] = true; // ex: invadersTiles['7x9']
	}
}

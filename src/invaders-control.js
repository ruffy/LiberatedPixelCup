goog.provide('lpc.InvadersControl');

goog.require('goog.math');
goog.require('goog.math.Coordinate');
goog.require('lpc.Invader');
goog.require('lime.scheduleManager');

lpc.InvadersControl = function(level, player){
	var maxQuantity 	= 1,
		invaderSpeed	= 10,
		invaders		= new Array(),
		counter			= 0;
		interval		= 2000;
		
	var self = this;
		
	manager();
	
	function manager(){
		if(counter == 4){
			counter = 0;
			maxQuantity++;
			interval -= 100;	
		}
		
		if(invaders.length < maxQuantity){
			createInvader();
		}
		
		counter++;
		
		lime.scheduleManager.callAfter(manager, self, interval)
	}
	
	function removeInvader(e){
		console.log(e);
	}
	
	function createInvader(){
		var position = new goog.math.Coordinate();
		
		do{
			if(goog.math.randomInt(2) == 0){ // sorteio -> 0: aparecerá nas laterais / 1: aparecerá em cima ou embaixo.
				position.x = goog.math.randomInt(2) * (lpc.Config.GRID.width - 1);
					
				position.y = goog.math.randomInt(lpc.Config.GRID.height);
			}else{
				position.y = goog.math.randomInt(2) * (lpc.Config.GRID.height - 1);
					
				position.x = goog.math.randomInt(lpc.Config.GRID.width);
			}
		}while(!level.tileIsPassable(position));
		
		if(position.x == 0)
			position.x--;
		else if(position.x == lpc.Config.GRID.width - 1)
			position.x++;
			
		if(position.y == 0)
			position.y--;
		else if(position.y == lpc.Config.GRID.height - 1)
			position.y++;
		
		//TODO: criar animações e adicioná-las a um Spawn, para dispará-las abaixo
		
		var invader = new lpc.Invader().setPositionOnGrid(position);
		level.getCharLayer().appendChild(invader);
		invaders.push(invader);
		
		//goog.events.listen(invader, [lpc.events.InvaderEvent.DISAPEAR], removeInvader);
		//goog.events.listen(invader, [lpc.events.InvaderEvent.MOVE], moveInvader);
	}
}

goog.provide('lpc.InvadersControl');

goog.require('goog.math');
goog.require('goog.math.Coordinate');
goog.require('lpc.Invader');
goog.require('lpc.Node');
goog.require('lime.scheduleManager');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.ghost.json');

lpc.InvadersControl = function(level, player){
	goog.base(this);
	
	this.quantity = 0;
	
	var	invaderSpeed	= 10,
		invaders		= new Array(),
		invadersTiles	= new Array(),
		interval		= 10000;
		
	var self = this;
	
	manager();
	
	function manager(){
		if(interval >= 600){
			interval -= 100;
		}
		
		createInvader();
		
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
			direction = 'right';
		}else if(position.x == lpc.Config.GRID.width - 1){
			direction = 'left';
		}else if(position.y == 0){
			direction = 'down';
		}else if(position.y == lpc.Config.GRID.height - 1){
			direction = 'up';
		}
		
		var invader = new lpc.Invader(level, player);
		invader.setPositionOnGrid(position).turn(direction).findPath();
		level.getCharLayer().appendChild(invader);
		
		goog.events.listen(invader, 'score', function(){
			self.dispatchEvent('score');
		});
		
		goog.events.listen(invader, 'gameover', function(){
			self.dispatchEvent('gameover');
		});
		
		self.quantity += 1;
	}
}

goog.inherits(lpc.InvadersControl, lpc.Node);
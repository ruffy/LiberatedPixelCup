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
		
		//moveInvaders();
		
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
		
		var invader = new lpc.Invader();
		invader.setPositionOnGrid(position).turn('down');
		level.getCharLayer().appendChild(invader);
		invaders.push(invader);
		invadersTiles[position.x + 'x' + position.y] = true; // ex: invadersTiles['7x9']
	}
	
	function moveInvaders(){
		var target = new goog.math.Coordinate(8, 5);
		
		for(var i in invaders){
			if(	invaders[i].getPositionOnGrid().x != target.x &&
				invaders[i].getPositionOnGrid().y != target.y){
				
				
				var path = {};
				path.unchecked = new Array();
				path.done = false;
				path.name = invaders[i].getPositionOnGrid().x + 'x' + invaders[i].getPositionOnGrid().y;
				path[path.name] = {
					x: invaders[i].getPositionOnGrid().x,
					y: invaders[i].getPositionOnGrid().y,
					visited:true,
					parentX:null,
					parentY:null
				}
				
				path.unchecked.push(path[path.name]);
				
				while(path.unchecked.length > 0){
					var currentNode = path.unchecked.pop();
					
					if(typeof currentNode != 'undefined' && currentNode != null){
						if(currentNode.x == target.x && node.y == target.y){
							var step;
							
							while(currentNode.parentX != null){
								step = currentNode.position;
								currentNode = path[currentNode.parent.x + 'x' + currentNode.parent.y];
							}
							
							console.log('walk')
							
							invaders[i].walk(step);
							
							path.done = true;
							break;
						}else{
							
							currentNode.visited = true;
							
							addNode(path, currentNode.x, currentNode.y, currentNode.x - 1, currentNode.y);
							addNode(path, currentNode.x, currentNode.y, currentNode.x + 1, currentNode.y);
							addNode(path, currentNode.x, currentNode.y, currentNode.x, currentNode.y - 1);
							addNode(path, currentNode.x, currentNode.y, currentNode.x, currentNode.y + 1);
						}
					}
				}
			}
		}
	}
	
	function addNode(path, parentX, parentY, x, y){	
		
		path.name = x + 'x' + y;
		//if(level.tileIsPassable(x, y)){
			if(typeof path[path.name] == 'undefined' || path[path.name] == null){
				path[path.name] = {
					x: x,
					y: y,
					visited:false,
					parentX: parentX,
					parentY: parentY
				}
			}
		//}
		
		path.unchecked.push(path[path.name]);
	}
}

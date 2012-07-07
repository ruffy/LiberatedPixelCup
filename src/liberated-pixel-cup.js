goog.provide('lpc');


//get requirements
goog.require('lpc.Config');
goog.require('lime.Director');
goog.require('lpc.Player');
goog.require('goog.events.KeyCodes');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.Easing');
goog.require('lime.scheduleManager');
goog.require('lpc.events.CollisionEvent');
goog.require('lpc.inputs.KeyboardInput');
goog.require('lpc.events.InputEvent');
goog.require('lpc.Node');
goog.require('lpc.Sprite');
goog.require('lpc.Layer');
goog.require('lime.parser.TMX');
goog.require('lpc.levels.Level');
goog.require('lpc.Fog');
goog.require('lpc.InvadersControl');
goog.require('lime.animation.FadeTo');

lpc.start = function(){
	var director = new lime.Director(document.getElementById('game'), lpc.Config.SCREEN.width, lpc.Config.SCREEN.height),
	    game = new lime.Scene(),
		player = new lpc.Player().setPositionOnGrid((lpc.Config.GRID.width-1)/2 -1, (lpc.Config.GRID.height-1)/2 -3).setOpacity(0),
		levelAnimating = false,
		moveDelay = .25;
		moveDirection = '',
		charDirection = '';
	
	var level = new lpc.levels.Level(game, 'assets/maps/farm.tmx');
	var input = new lpc.inputs.KeyboardInput();
	
	level.getCharLayer().appendChild(player);
	
	level.toggleGrid();
	
	var fog = new lpc.Fog().setQuality(.3)
	var night = new lpc.Sprite().setSizeOnGrid(lpc.Config.GRID).setPositionOnGrid(0, 0).setFill('#0F0F2D').setOpacity(.5);
	game.appendChild(fog);
	game.appendChild(night);
	
	director.makeMobileWebAppCapable();
	
	director.replaceScene(game);
	
	startGame();
	//intro();
	
	function intro(){
		var introText = new lpc.Sprite().setPosition(lpc.Config.SCREEN.width/2, lpc.Config.SCREEN.height/2);
		
		var label1 = new lime.Label().setText('In a cold winter night,').setFontFamily('monospace').setFontColor('#eeeeee').setFontSize(20)
		label1.setPosition(0, 0).setOpacity(0);
		
		var label2 = new lime.Label().setText('there\'s something odd out there in the fog.').setFontFamily('monospace').setFontColor('#eeeeee').setFontSize(20)
		label2.setPosition(0, 32).setOpacity(0);
		
		var arrow = new lpc.Sprite().setFill('assets/arrow.png').setPosition(label2.getPosition().x + label2.getSize().width/2, label2.getPosition().y);
		arrow.setOpacity(0);
		
		introText.appendChild(label1);
		introText.appendChild(label2);
		introText.appendChild(arrow);
		
		var fadeIn = new lime.animation.FadeTo(1).setDuration(3).setEasing(lime.animation.Easing.LINEAR);
		var fadeOut = new lime.animation.FadeTo(0).setDuration(1.5).setEasing(lime.animation.Easing.LINEAR);
		
		label1.runAction(fadeIn);
		
		lime.scheduleManager.callAfter(function(){
			fadeIn.removeTarget(label1);
			label1.setOpacity(1);
			label2.runAction(fadeIn);
			arrow.runAction(fadeIn);
			
			goog.events.listen(document, ['keydown'], intro2);
			
			function intro2(e){
				if(e.keyCode == goog.events.KeyCodes.ENTER){
					goog.events.unlisten(document, ['keydown'], intro2);
					
					label1.runAction(fadeOut);
					label2.runAction(fadeOut);
					arrow.runAction(fadeOut);
					
					lime.scheduleManager.callAfter(function(){
						label1.setText('From the window, it seems like');
						label2.setText('someone is lurking in the vicinities of the farm.');
						arrow.setPosition(label2.getPosition().x + label2.getSize().width/2, label2.getPosition().y);
						
						label1.runAction(fadeIn);
						label2.runAction(fadeIn);
						arrow.runAction(fadeIn);
						
						goog.events.listen(document, ['keydown'], intro3);
						
						function intro3(e){
							if(e.keyCode == goog.events.KeyCodes.ENTER){
								goog.events.unlisten(document, ['keydown'], intro3);
								
								label1.runAction(fadeOut);
								label2.runAction(fadeOut);
								arrow.runAction(fadeOut);
								
								lime.scheduleManager.callAfter(function(){
									fadeIn.removeTarget(label2);
									fadeIn.removeTarget(arrow);
									
									label1.setText('Be carefull...');
									
									label1.runAction(fadeIn);
									
									goog.events.listen(document, ['keydown'], finishIntro);
									
									function finishIntro(e){
										if(e.keyCode == goog.events.KeyCodes.ENTER){
											goog.events.unlisten(document, ['keydown'], finishIntro);
											
											fadeOut.removeTarget(label2);
											fadeOut.removeTarget(arrow);
											
											label1.runAction(fadeOut);
											
											goog.events.listen(fadeOut, [lime.animation.Event.STOP], function(){
												introText.removeChild(label1);
												introText.removeChild(label2);
												introText.removeChild(arrow);
												game.removeChild(introText);
												label1 = null;
												label2 = null;
												arrow = null;
												fadeIn = null;
												fadeOut = null;
												introText = null;
												
												startGame();
											});
										}
									}
								}, this, 1000);
							}
						}
					}, this, 1000)
				}
			}
		}, this, 4500);
		
		game.appendChild(introText);
	}
	
	function startGame(){
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
		
		var invadersControl = new lpc.InvadersControl(level, player);
	}
	
	
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
	   		
            if(level.tileIsPassable(lt) && level.tileIsPassable(rt) && lt.y + 1 > 0)
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
	   		player.move(moveDirection);
	   	}
    }
}

goog.exportSymbol('lpc.start', lpc.start);
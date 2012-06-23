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
goog.require('lime.animation.FadeTo');

lpc.start = function(){
	var director = new lime.Director(document.getElementById('game'), lpc.Config.SCREEN.width, lpc.Config.SCREEN.height),
	    game = new lime.Scene(),
		player = new lpc.Player().setPositionOnGrid((lpc.Config.GRID.width-1)/2, (lpc.Config.GRID.height-1)/2 -4).setOpacity(0),
		levelAnimating = false,
		moveDelay = .25;
		moveDirection = '',
		charDirection = '';
	
	var level = new lpc.levels.Level(game, 'assets/maps/test/farm.tmx');
	var input = new lpc.inputs.KeyboardInput();
	
	level.getCharLayer().appendChild(player);
	
	//level.toggleGrid();
	
	var fog = new lpc.Fog().setQuality(.3)
	var night = new lpc.Sprite().setSizeOnGrid(lpc.Config.GRID).setPositionOnGrid(0, 0).setFill('#000000').setOpacity(.5);
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
				
				player.turn(e.input);
				
				if(!levelAnimating){
					lime.scheduleManager.callAfter(walk, this, 100);
				}	
					
			}else if(e.input == ''){
				lime.scheduleManager.callAfter(function(){
					player.stop();
				}, this, 150);
			}
		});
	}
	
	
	
	function walk(){
		if(moveDirection != '' && !levelAnimating){
            levelAnimating = true;
            var move = null;
            var wait = false;
            
            if(moveDirection != charDirection){
                charDirection = moveDirection;
                movingDistance = 0;
                //wait = true;
            }
            
            player.move(moveDirection);
            
            var position = player.getPositionOnGrid();
            
            switch(moveDirection){
                case 'up':
                if(level.tileIsPassable(position.x, position.y - 1) && position.y > 0)
                	move = new lime.animation.MoveBy(0, -lpc.Config.GRID_CELL);
                break;
                
                case 'down':
                if(level.tileIsPassable(position.x, position.y + 1) && position.y < lpc.Config.GRID.height - 1)
                	move = new lime.animation.MoveBy(0, lpc.Config.GRID_CELL);
                break;
                
                case 'right':
                if(level.tileIsPassable(position.x + 1, position.y) && position.x < lpc.Config.GRID.width - 1)
                	move = new lime.animation.MoveBy(lpc.Config.GRID_CELL, 0);
                break; 
                
                case 'left':
                if(level.tileIsPassable(position.x - 1, position.y) && position.x > 0)
                	move = new lime.animation.MoveBy(-lpc.Config.GRID_CELL, 0);
                break;
            }
            
            if(move){
	            move.setDuration(moveDelay).setEasing(lime.animation.Easing.LINEAR);
	    
	            goog.events.listen(move, lime.animation.Event.STOP, function(){
	                levelAnimating = false;
	                walk();
	            });
	            
	            player.runAction(move);
            }else{
            	levelAnimating = false;
            }
	    }
    }
}

goog.exportSymbol('lpc.start', lpc.start);
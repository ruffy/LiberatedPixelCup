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

lpc.start = function(){
	var director = new lime.Director(document.getElementById('game'), lpc.Config.SCREEN.width, lpc.Config.SCREEN.height),
	    game = new lime.Scene(),
	    charLayer = new lpc.Layer().setPosition(0,0),
		player = new lpc.Player().setPosition(director.getSize().width/2,director.getSize().height/2);
		levelAnimating = false,
		blockedWay = '',
		moveDuration = .15,
		movingDistance = 0,
		moveDirection = '',
		charDirection = '';
	
	var level = new lpc.levels.Level(game, 'assets/maps/test/test.tmx');
	var input = new lpc.inputs.KeyboardInput();
	
	level.getCharLayer().appendChild(player);
	
	//level.toggleGrid();
	
	game.setChildIndex(charLayer, 1);

	director.makeMobileWebAppCapable();
	
	director.replaceScene(game);
	
	goog.events.listen(input, lpc.events.InputEvent.FIRE, function(e){
		moveDirection = e.input;
		
		if(	e.input == 'up' ||
			e.input == 'down' ||
			e.input == 'right' ||
			e.input == 'left'){
			
			player.move(e.input);
			
			if(!levelAnimating){
				lime.scheduleManager.callAfter(moveLevel, this, 100); //um pequeno intervalo antes de se mover, para calcular colisões corretamente
			}	
				
		}else if(e.input == ''){
			player.stop();
		}
	});
	
	goog.events.listen(player, lpc.events.CollisionEvent.COLLISION, function(e){
		blockedWay = e.side;
	});
	
	function moveLevel(){
		if(moveDirection != '' && !levelAnimating){
            levelAnimating = true;
            var move;
            var wait = false;
            
            if(moveDirection != charDirection){
                charDirection = moveDirection;
                movingDistance = 0;
                wait = true;
            }
            
            player.move(moveDirection);
            
            if(moveDirection != blockedWay){
                switch(moveDirection){
                    case 'up':
                    value = lpc.Config.GRID_CELL + Math.abs(level.getPosition().y % lpc.Config.GRID_CELL);
                    move = new lime.animation.MoveTo(level.getPosition().x, level.getPosition().y + value);
                    break;
                    
                    case 'down':
                    value = (-1 * lpc.Config.GRID_CELL) + Math.abs(level.getPosition().y % lpc.Config.GRID_CELL);
                    move = new lime.animation.MoveTo(level.getPosition().x, level.getPosition().y + value);
                    break;
                    
                    case 'right':
                    value = (-1 * lpc.Config.GRID_CELL) + Math.abs(level.getPosition().x % lpc.Config.GRID_CELL);
                    move = new lime.animation.MoveTo(level.getPosition().x + value, level.getPosition().y);
                    break;
                    
                    case 'left':
                    value = lpc.Config.GRID_CELL + Math.abs(level.getPosition().x % lpc.Config.GRID_CELL);
                    move = new lime.animation.MoveTo(level.getPosition().x + value, level.getPosition().y);
                    break;
                }
                    
                move.setDuration(moveDuration).setEasing(lime.animation.Easing.LINEAR);
        
                goog.events.listen(move, lime.animation.Event.STOP, function(){
                    level.roundPosition();
                    
                    blockedWay = '';
                    levelAnimating = false;
                    lime.scheduleManager.callAfter(moveLevel, this, 2); //pequeno intervalo antes de mover
                    movingDistance++;
                });
                
                var layers = level.getLayers();
                
                for(var i in layers){
                	move.addTarget(layers[i]);
                }
                
                if(wait){
                    lime.scheduleManager.callAfter(function(){
                        move.play();
                    }, this, 35);// timming que controla o intervalo entre o personagem se virar e o mapa começar a mover
                }else{
                    move.play();
                }
            }else{
                blockedWay = '';
                levelAnimating = false;
                movingDistance = 0;
            }
            
	    }
    }
}

goog.exportSymbol('lpc.start', lpc.start);
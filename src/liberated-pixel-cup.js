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

lpc.start = function(){
	var director = new lime.Director(document.getElementById('game'), lpc.Config.SCREEN.width, lpc.Config.SCREEN.height),
	    game = new lime.Scene(),
		player = new lpc.Player().setPositionOnGrid((lpc.Config.GRID.width-1)/2, (lpc.Config.GRID.height-1)/2),
		levelAnimating = false,
		moveDelay = .25;
		moveDirection = '',
		charDirection = '';
	
	var level = new lpc.levels.Level(game, 'assets/maps/test/farm.tmx');
	var input = new lpc.inputs.KeyboardInput();
	
	level.getCharLayer().appendChild(player);
	
	//level.toggleGrid();
	
	var fog = new lpc.Fog().setQuality(.3)
	var night = new lpc.Sprite().setSizeOnGrid(lpc.Config.GRID).setPositionOnGrid(0, 0).setFill('#000000').setOpacity(.6);
	game.appendChild(fog);
	game.appendChild(night);
	
	director.makeMobileWebAppCapable();
	
	director.replaceScene(game);
	
	goog.events.listen(input, lpc.events.InputEvent.FIRE, function(e){
		moveDirection = e.input;
		
		if(	e.input == 'up' ||
			e.input == 'down' ||
			e.input == 'right' ||
			e.input == 'left'){
			
			player.turn(e.input);
			
			//if(!levelAnimating){
				lime.scheduleManager.unschedule(walk, this);
				lime.scheduleManager.schedule(walk, this);
			//}	
				
		}else if(e.input == ''){
			lime.scheduleManager.unschedule(walk, this);
			
			var move = new goog.math.Coordinate((player.getPosition().x) / lpc.Config.GRID_CELL, (player.getPosition().y) / lpc.Config.GRID_CELL);
			
			player.runAction(new lime.animation.MoveTo(player.getPositionOnGrid().x * lpc.Config.GRID_CELL, player.getPositionOnGrid().y * lpc.Config.GRID_CELL).setDuration(.15).setEasing(lime.animation.Easing.LINEAR));
			
			lime.scheduleManager.callAfter(function(){
				player.stop();
			}, this, 150);
		}
	});
	
	
	function walk(dt){
		/*if(moveDirection != '' && !levelAnimating){
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
	    }*/
	   	
	   	player.move(moveDirection);
            
		var position = player.getPositionOnGrid();
		var move;
		
	   	switch(moveDirection){
	   		case 'up':
            if(level.tileIsPassable(position.x, position.y - 1) && position.y > 0)
            	move = new goog.math.Coordinate(0, -1);
            break;
            
            case 'down':
            if(level.tileIsPassable(position.x, position.y + 1) && position.y < lpc.Config.GRID.height - 1)
            	move = new goog.math.Coordinate(0, 1);
            break;
            
            case 'right':
            if(level.tileIsPassable(position.x + 1, position.y) && position.x < lpc.Config.GRID.width - 1)
            	move = new goog.math.Coordinate(1, 0);
            break; 
            
            case 'left':
            if(level.tileIsPassable(position.x - 1, position.y) && position.x > 0)
            	move = new goog.math.Coordinate(-1, 0);
            break;
	   	}
	   
	   	if(typeof move != 'undefined')
	   		player.setPosition(player.getPosition().x + (move.x * (dt/10)), player.getPosition().y + (move.y * (dt/10)));
    }
}

goog.exportSymbol('lpc.start', lpc.start);
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
	
	level.toggleGrid();
	
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
			
			//lime.scheduleManager.callAfter(function(){
				player.stop();
			//}, this, 150);
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
            
		var position = player.getPosition();
		var cornerLT = new goog.math.Coordinate(position.x/lpc.Config.GRID_CELL, position.y/lpc.Config.GRID_CELL);
		var cornerLB = new goog.math.Coordinate(position.x/lpc.Config.GRID_CELL, (position.y + lpc.Config.GRID_CELL)/lpc.Config.GRID_CELL);
		var cornerRT = new goog.math.Coordinate((position.x + lpc.Config.GRID_CELL)/lpc.Config.GRID_CELL, position.y/lpc.Config.GRID_CELL);
		var cornerRB = new goog.math.Coordinate((position.x + lpc.Config.GRID_CELL)/lpc.Config.GRID_CELL, (position.y + lpc.Config.GRID_CELL)/lpc.Config.GRID_CELL);
		var move;
		
	   	switch(moveDirection){
	   		case 'up':
	   		var lt = new goog.math.Coordinate(Math.floor(cornerLT.x), Math.floor(cornerLT.y - (1/lpc.Config.GRID_CELL)));
	   		var rt = new goog.math.Coordinate(Math.floor(cornerRT.x), Math.floor(cornerRT.y - (1/lpc.Config.GRID_CELL)));
	   		
            if(level.tileIsPassable(lt) && level.tileIsPassable(rt) && lt.y + 1 > 0)
            	move = new goog.math.Coordinate(0, -1);
            else
            	player.setPosition(cornerLT.x * lpc.Config.GRID_CELL, Math.round(cornerLT.y) * lpc.Config.GRID_CELL);
            break;
            
            case 'down':
            var lb = new goog.math.Coordinate(Math.floor(cornerLB.x), Math.floor(cornerLB.y + (1/lpc.Config.GRID_CELL)));
	   		var rb = new goog.math.Coordinate(Math.floor(cornerRB.x), Math.floor(cornerRB.y + (1/lpc.Config.GRID_CELL)));
            
            if(level.tileIsPassable(lb) && level.tileIsPassable(rb) && lb.y < lpc.Config.GRID.height)
            	move = new goog.math.Coordinate(0, 1);
            else
            	player.setPosition(cornerLT.x * lpc.Config.GRID_CELL, Math.round(cornerLT.y) * lpc.Config.GRID_CELL -1);
            break;
            
            case 'right':
            var rt = new goog.math.Coordinate(Math.floor(cornerRT.x + (1/lpc.Config.GRID_CELL)), Math.floor(cornerRT.y));
	   		var rb = new goog.math.Coordinate(Math.floor(cornerRB.x + (1/lpc.Config.GRID_CELL)), Math.floor(cornerRB.y));
            
            if(level.tileIsPassable(rt) && level.tileIsPassable(rb) && rt.x < lpc.Config.GRID.width)
            	move = new goog.math.Coordinate(1, 0);
            else
            	player.setPosition(Math.round(cornerLT.x) * lpc.Config.GRID_CELL - 1, cornerLT.y * lpc.Config.GRID_CELL);
            break; 
            
            case 'left':
            var lt = new goog.math.Coordinate(Math.floor(cornerLT.x - (1/lpc.Config.GRID_CELL)), Math.floor(cornerLT.y));
	   		var lb = new goog.math.Coordinate(Math.floor(cornerLB.x - (1/lpc.Config.GRID_CELL)), Math.floor(cornerLB.y));
	   		
            if(level.tileIsPassable(lt) && level.tileIsPassable(lb) && lt.x + 1 > 0)
            	move = new goog.math.Coordinate(-1, 0);
            else
            	player.setPosition(Math.round(cornerLT.x) * lpc.Config.GRID_CELL, cornerLT.y * lpc.Config.GRID_CELL);
            break;
	   	}
	   
	   	if(typeof move != 'undefined')
	   		player.setPosition(player.getPosition().x + (move.x * (dt/10)), player.getPosition().y + (move.y * (dt/10)));
    }
}

goog.exportSymbol('lpc.start', lpc.start);
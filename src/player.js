goog.provide('lpc.Player');

goog.require('lime.SpriteSheet');
goog.require('lpc.Sprite');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.soldier.json');
goog.require('lpc.Config');

lpc.Player = function(){
	goog.base(this);
	
	var moving = false;
	var direction = '';
	var delay = .07;
	
	this.sheet = new lime.SpriteSheet('assets/spritesheets/soldier.png', lime.ASSETS.soldier.json, lime.parser.JSON);
	
	this.setAnchorPoint(.5, 1).setSizeOnGrid(2, 2).setFill(this.sheet.getFrame('soldier0018.png'));
	
	this.up = new Array( 
		this.sheet.getFrame('soldier0000.png'),
		this.sheet.getFrame('soldier0001.png'),
		this.sheet.getFrame('soldier0002.png'),
		this.sheet.getFrame('soldier0003.png'),
		this.sheet.getFrame('soldier0004.png'),
		this.sheet.getFrame('soldier0005.png'),
		this.sheet.getFrame('soldier0006.png'),
		this.sheet.getFrame('soldier0007.png'),
		this.sheet.getFrame('soldier0008.png')
	);
	this.down = new Array(
		this.sheet.getFrame('soldier0018.png'),
		this.sheet.getFrame('soldier0019.png'),
		this.sheet.getFrame('soldier0020.png'),
		this.sheet.getFrame('soldier0021.png'),
		this.sheet.getFrame('soldier0022.png'),
		this.sheet.getFrame('soldier0023.png'),
		this.sheet.getFrame('soldier0024.png'),
		this.sheet.getFrame('soldier0025.png'),
		this.sheet.getFrame('soldier0026.png')
	);
	this.right = new Array(
		this.sheet.getFrame('soldier0027.png'),
		this.sheet.getFrame('soldier0028.png'),
		this.sheet.getFrame('soldier0029.png'),
		this.sheet.getFrame('soldier0030.png'),
		this.sheet.getFrame('soldier0031.png'),
		this.sheet.getFrame('soldier0032.png'),
		this.sheet.getFrame('soldier0033.png'),
		this.sheet.getFrame('soldier0034.png'),
		this.sheet.getFrame('soldier0035.png')
	);
	this.left = new Array(
		this.sheet.getFrame('soldier0009.png'),
		this.sheet.getFrame('soldier0010.png'),
		this.sheet.getFrame('soldier0011.png'),
		this.sheet.getFrame('soldier0012.png'),
		this.sheet.getFrame('soldier0013.png'),
		this.sheet.getFrame('soldier0014.png'),
		this.sheet.getFrame('soldier0015.png'),
		this.sheet.getFrame('soldier0016.png'),
		this.sheet.getFrame('soldier0017.png')
	);
	
	this.animationUp = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationUp.setFrames(this.up);
	
	this.animationDown = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationDown.setFrames(this.down);
	
	this.animationRight = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationRight.setFrames(this.right);
	
	this.animationLeft = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationLeft.setFrames(this.left);
	
	this.setMoving = function(value){moving = value; return this}
	this.isMoving = function(){return moving}
	this.setDirection = function(value){direction = value; return this}
	this.getDirection = function(){return direction}
}

goog.inherits(lpc.Player, lpc.Sprite);

lpc.Player.prototype.move = function(direction){
	if(this.getDirection() != direction){
		switch(direction){
			case 'up':
			this.runAction(this.animationUp);
			break;
			
			case 'down':
			this.runAction(this.animationDown);
			break;
			
			case 'right':
			this.runAction(this.animationRight);
			break;
			
			case 'left':
			this.runAction(this.animationLeft);
			break;
		}
		
		this.setDirection(direction);
		
		this.setMoving(true);
	}
}

lpc.Player.prototype.stop = function(){
	this.animationUp.stop();
	this.animationDown.stop();
	this.animationRight.stop();
	this.animationLeft.stop();
	
	switch(this.getDirection()){
		case 'up':
		this.animationUp.play(); //bugfix
		this.setFill(this.sheet.getFrame('soldier0000.png'));
		break;
		
		case 'down':
		this.animationDown.play(); //bugfix
		this.setFill(this.sheet.getFrame('soldier0018.png'));
		break;
		
		case 'right':
		this.animationRight.play(); //bugfix
		this.setFill(this.sheet.getFrame('soldier0027.png'));
		break;
		
		case 'left':
		this.animationLeft.play(); //bugfix
		this.setFill(this.sheet.getFrame('soldier0009.png'));
		break;
	}
	
	this.setDirection('');
	
	this.setMoving(false);
}
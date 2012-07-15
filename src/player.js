goog.provide('lpc.Player');

goog.require('lime.SpriteSheet');
goog.require('lpc.Sprite');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.farmer.json');
goog.require('lpc.Config');

lpc.Player = function(){
	goog.base(this);
	var direction = 'down';
	var delay = .05;
	var stoped = true;
	
	this.sheet = new lime.SpriteSheet('assets/spritesheets/farmer.png', lime.ASSETS.farmer.json, lime.parser.JSON);
	
	this.setAnchorPoint(.25, .5).setSizeOnGrid(2, 2).setFill(this.sheet.getFrame('farmer0018.png'));
	
	this.hitArea = new lpc.Sprite().setSize(26, 26).setPosition(3,3);//.setStroke(1, '#eeeeee');
	this.appendChild(this.hitArea);
	
	this.halo = new lpc.Sprite().setFill('assets/halo.png').setPosition(-48,-32).setOpacity(.85);
	this.appendChild(this.halo);
	
	this.up = new Array( 
		this.sheet.getFrame('farmer0000.png'),
		this.sheet.getFrame('farmer0001.png'),
		this.sheet.getFrame('farmer0002.png'),
		this.sheet.getFrame('farmer0003.png'),
		this.sheet.getFrame('farmer0004.png'),
		this.sheet.getFrame('farmer0005.png'),
		this.sheet.getFrame('farmer0006.png'),
		this.sheet.getFrame('farmer0007.png'),
		this.sheet.getFrame('farmer0008.png')
	);
	this.down = new Array(
		this.sheet.getFrame('farmer0018.png'),
		this.sheet.getFrame('farmer0019.png'),
		this.sheet.getFrame('farmer0020.png'),
		this.sheet.getFrame('farmer0021.png'),
		this.sheet.getFrame('farmer0022.png'),
		this.sheet.getFrame('farmer0023.png'),
		this.sheet.getFrame('farmer0024.png'),
		this.sheet.getFrame('farmer0025.png'),
		this.sheet.getFrame('farmer0026.png')
	);
	this.right = new Array(
		this.sheet.getFrame('farmer0027.png'),
		this.sheet.getFrame('farmer0028.png'),
		this.sheet.getFrame('farmer0029.png'),
		this.sheet.getFrame('farmer0030.png'),
		this.sheet.getFrame('farmer0031.png'),
		this.sheet.getFrame('farmer0032.png'),
		this.sheet.getFrame('farmer0033.png'),
		this.sheet.getFrame('farmer0034.png'),
		this.sheet.getFrame('farmer0035.png')
	);
	this.left = new Array(
		this.sheet.getFrame('farmer0009.png'),
		this.sheet.getFrame('farmer0010.png'),
		this.sheet.getFrame('farmer0011.png'),
		this.sheet.getFrame('farmer0012.png'),
		this.sheet.getFrame('farmer0013.png'),
		this.sheet.getFrame('farmer0014.png'),
		this.sheet.getFrame('farmer0015.png'),
		this.sheet.getFrame('farmer0016.png'),
		this.sheet.getFrame('farmer0017.png')
	);
	
	this.animationUp = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationUp.setFrames(this.up);
	
	this.animationDown = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationDown.setFrames(this.down);
	
	this.animationRight = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationRight.setFrames(this.right);
	
	this.animationLeft = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationLeft.setFrames(this.left);
	
	this.setDirection = function(value){direction = value; return this}
	this.getDirection = function(){return direction}
	this.setStoped = function(value){stoped = value; return this}
	this.isStoped = function(){return stoped}
	
	this.torchPosition = [];
}

goog.inherits(lpc.Player, lpc.Sprite);

lpc.Player.prototype.isTorchPosition = function(x, y){
	for(var i = 0, ii = this.torchPosition.length; i < ii; i++){
		if(this.torchPosition[i].x == x && this.torchPosition[i].y == y){
			return true;
		}
	}
	
	return false;
}

lpc.Player.prototype.move = function(direction){
	if(this.getDirection() != direction || this.isStoped()){
		this.setDirection(direction);
		
		switch(direction){
			case 'up':
			this.runAction(this.animationUp);
			this.halo.setPosition(-24,-40);
			break;
			
			case 'down':
			this.runAction(this.animationDown);
			this.halo.setPosition(-48,-32);
			break;
			
			case 'right':
			this.runAction(this.animationRight);
			this.halo.setPosition(-32,-32);
			break;
			
			case 'left':
			this.runAction(this.animationLeft);
			this.halo.setPosition(-48,-32);
			break;
		}
	}
}

lpc.Player.prototype.stop = function(){
	switch(this.getDirection()){
		case 'up':
		this.animationUp.stop();
		this.animationUp.play();
		this.setFill(this.sheet.getFrame('farmer0000.png'));
		break;
		
		case 'down':
		this.animationDown.stop();
		this.animationDown.play();
		this.setFill(this.sheet.getFrame('farmer0018.png'));
		break;
		
		case 'right':
		this.animationRight.stop();
		this.animationRight.play();
		this.setFill(this.sheet.getFrame('farmer0027.png'));
		break;
		
		case 'left':
		this.animationLeft.stop();
		this.animationLeft.play();
		this.setFill(this.sheet.getFrame('farmer0009.png'));
		break;
	}
	
	//this.setDirection('');
	this.setStoped(true);
}

lpc.Player.prototype.turn = function(side){
	switch(side){
		case 'up':
		this.setFill(this.sheet.getFrame('farmer0000.png'));
		break;
		
		case 'down':
		this.setFill(this.sheet.getFrame('farmer0018.png'));
		break;
		
		case 'right':
		this.setFill(this.sheet.getFrame('farmer0027.png'));
		break;
		
		case 'left':
		this.setFill(this.sheet.getFrame('farmer0009.png'));
		break;
	}
}

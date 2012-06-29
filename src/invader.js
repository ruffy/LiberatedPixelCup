goog.provide('lpc.Invader');

goog.require('lpc.Sprite');
goog.require('lime.SpriteSheet');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.ghost.json');
goog.require('lpc.Config');

lpc.Invader = function(player){
	goog.base(this);
	
	this.player = player;
	
	var direction = '';
	var delay = .22;
	
	this.sheet = new lime.SpriteSheet('assets/spritesheets/ghost.png', lime.ASSETS.ghost.json, lime.parser.JSON);
	
	this.setAnchorPoint(.25, .5).setSizeOnGrid(2, 2);
	
	this.up = new Array( 
		this.sheet.getFrame('ghost0000.png'),
		this.sheet.getFrame('ghost0001.png'),
		this.sheet.getFrame('ghost0002.png')
	);
	this.down = new Array( 
		this.sheet.getFrame('ghost0006.png'),
		this.sheet.getFrame('ghost0007.png'),
		this.sheet.getFrame('ghost0008.png')
	);
	this.right = new Array( 
		this.sheet.getFrame('ghost0009.png'),
		this.sheet.getFrame('ghost0010.png'),
		this.sheet.getFrame('ghost0011.png')
	);
	this.left = new Array( 
		this.sheet.getFrame('ghost0003.png'),
		this.sheet.getFrame('ghost0004.png'),
		this.sheet.getFrame('ghost0005.png')
	);
	
	this.animationUp = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationUp.setFrames(this.up);
	
	this.animationDown = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationDown.setFrames(this.down);
	
	this.animationRight = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationRight.setFrames(this.right);
	
	this.animationLeft = new lime.animation.KeyframeAnimation().setDelay(delay);
	this.animationLeft.setFrames(this.left);
	
	this.runAction(this.animationDown);
	
	this.setDirection = function(value){direction = value; return this}
	this.getDirection = function(){return direction}
}

goog.inherits(lpc.Invader, lpc.Sprite);

lpc.Invader.prototype.turn = function(direction){
	
}
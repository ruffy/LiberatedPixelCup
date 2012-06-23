goog.provide('lpc.Invader');

goog.require('lpc.Sprite');

lpc.Invader = function(){
	goog.base(this);
	
	var direction = '';
	var delay = .06;
	
	this.sheet = new lime.SpriteSheet('assets/spritesheets/ghost.png', lime.ASSETS.ghost.json, lime.parser.JSON);
	
	this.setAnchorPoint(.25, .5).setSizeOnGrid(2, 2);
	
	this.up = new Array( 
		this.sheet.getFrame('soldier0000.png'),
		this.sheet.getFrame('soldier0001.png'),
		this.sheet.getFrame('soldier0002.png')
	);
	this.down = new Array( 
		this.sheet.getFrame('soldier0006.png'),
		this.sheet.getFrame('soldier0007.png'),
		this.sheet.getFrame('soldier0008.png')
	);
	this.right = new Array( 
		this.sheet.getFrame('soldier0009.png'),
		this.sheet.getFrame('soldier0010.png'),
		this.sheet.getFrame('soldier0011.png')
	);
	this.left = new Array( 
		this.sheet.getFrame('soldier0003.png'),
		this.sheet.getFrame('soldier0004.png'),
		this.sheet.getFrame('soldier0005.png')
	);
	
	this.setDirection = function(value){direction = value; return this}
	this.getDirection = function(){return direction}
}

goog.inherits(lpc.Invader, lpc.Sprite);

lpc.Invader.prototype.turn = function(direction){
	if(direction != this.getDirection()){
		this.setDirection(direction);
		
		switch(direction){
			case 'up':
			this.runAction(this.up);
			break;
			
			case 'down':
			this.runAction(this.down);
			break;
			
			case 'right':
			this.runAction(this.right);
			break;
			
			case 'left':
			this.runAction(this.left);
			break;
		}
	}
}

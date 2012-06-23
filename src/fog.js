goog.provide('lpc.Fog');

goog.require('lpc.Sprite');
goog.require('lpc.Config');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.Event');
goog.require('lime.animation.Easing');

lpc.Fog = function(){
	goog.base(this);
	
	var fog = new lpc.Sprite().setSizeOnGrid(lpc.Config.GRID.width*2, lpc.Config.GRID.height).setPositionOnGrid(0, 0);
	fog.setFill('assets/fog.png').setOpacity(.5);
	
	this.appendChild(fog);
	
	lime.scheduleManager.schedule(function(dt){
		if(fog.getPosition().x - dt/10 > -(fog.getSize().width/2)){
			fog.setPosition(fog.getPosition().x - dt/10, 0);
		}else{
			fog.setPositionOnGrid(0, 0);
		}
		
	}, this);
}

goog.inherits(lpc.Fog, lpc.Sprite);

goog.provide('lpc.Fog');

goog.require('lpc.Sprite');
goog.require('lpc.Config');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.Event');
goog.require('lime.animation.Easing');

lpc.Fog = function(){
	goog.base(this);
	
	var fog1 = new lpc.Sprite().setSizeOnGrid(lpc.Config.GRID).setPositionOnGrid(0, 0);
	fog1.setFill('assets/fog2.png', 'repeat').setOpacity(.4);
	
	var fog2 = new lpc.Sprite().setSizeOnGrid(lpc.Config.GRID).setPositionOnGrid(lpc.Config.GRID.width, 0);
	fog2.setFill('assets/fog2.png', 'repeat').setOpacity(.4);
	
	this.appendChild(fog1);
	this.appendChild(fog2);
	
	animate();
	
	function animate(){
		var animation = new lime.animation.MoveBy(-lpc.Config.SCREEN.width, 0).setDuration(30).setEasing(lime.animation.Easing.LINEAR);
		
		fog1.setPositionOnGrid(0, 0);
		fog2.setPositionOnGrid(lpc.Config.GRID.width, 0);
		
		animation.addTarget(fog1);
		animation.addTarget(fog2);
		
		goog.events.listen(animation, lime.animation.Event.STOP, function(){
			animate();
		});
		
		animation.play();
	}
}

goog.inherits(lpc.Fog, lpc.Sprite);

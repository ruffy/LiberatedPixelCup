goog.provide('lpc.Intro');

goog.require('lime.Label');
goog.require('lpc.Sprite');

lpc.Intro = function(){
	goog.base(this);
	
	var self = this;
	
	this.start = function(){
		this.setPosition(lpc.Config.SCREEN.width/2, lpc.Config.SCREEN.height/2);
	
		var label1 = new lime.Label().setText('In a cold winter night,').setFontFamily('monospace').setFontColor('#eeeeee').setFontSize(20);
		label1.setPosition(0, 0).setOpacity(0);
		
		var label2 = new lime.Label().setText('there\'s something odd out there in the fog.').setFontFamily('monospace').setFontColor('#eeeeee').setFontSize(20)
		label2.setPosition(0, 32).setOpacity(0);
		
		var arrow = new lpc.Sprite().setFill('assets/arrow.png').setPosition(label2.getPosition().x + label2.getSize().width/2, label2.getPosition().y);
		arrow.setOpacity(0);
		
		this.appendChild(label1);
		this.appendChild(label2);
		this.appendChild(arrow);
		
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
												self.removeChild(label1);
												self.removeChild(label2);
												self.removeChild(arrow);
												label1 = null;
												label2 = null;
												arrow = null;
												fadeIn = null;
												fadeOut = null;
												
												self.dispatchEvent('finish');
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
	}
	
}

goog.inherits(lpc.Intro, lpc.Sprite);

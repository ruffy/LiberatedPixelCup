goog.provide('lpc.GameOver');

goog.require('lime.Scene');
goog.require('lpc.Sprite');
goog.require('lime.Label');
goog.require('lpc.Config');

lpc.GameOver = function(){
	goog.base(this);
	
	var score_ = 0;
	
	var bg = new lpc.Sprite().setFill('#000000').setSize(lpc.Config.SCREEN.width, lpc.Config.SCREEN.height)
	
	var label = new lime.Label().setText('Game Over').setFontFamily('monospace').setFontWeight('bold')
								.setFontSize(48).setFontColor('#eeeeee').setPosition(lpc.Config.SCREEN.width/2, lpc.Config.SCREEN.height/3.5);
	
	var scoreLabel = new lime.Label().setText('You\'ve made '+score_+' points').setFontFamily('monospace')
								.setFontSize(24).setFontColor('#eeeeee').setPosition(lpc.Config.SCREEN.width/2, lpc.Config.SCREEN.height/1.5);
								
	var playAgain = new lime.Label().setText('Press ENTER to play again').setFontFamily('monospace')
								.setFontSize(24).setFontColor('#eeeeee').setPosition(lpc.Config.SCREEN.width/2, lpc.Config.SCREEN.height/1.25);
								
	var arrow = new lpc.Sprite().setFill('assets/arrow.png').setPosition(playAgain.getPosition().x + playAgain.getSize().width/2, playAgain.getPosition().y);

	this.appendChild(bg);
	this.appendChild(label);
	this.appendChild(scoreLabel);
	this.appendChild(playAgain);
	this.appendChild(arrow);
	
	this.setScore = function(value){
		score_ = value;
		
		scoreLabel.setText('You\'ve made '+score_+' points');
		
		return this;
	}
	
	var self = this;
	
	goog.events.listen(document, 'keydown', function(e){
		if(e.keyCode == goog.events.KeyCodes.ENTER)
			self.dispatchEvent('restart');
	});
}

goog.inherits(lpc.GameOver, lime.Scene);

goog.provide('lpc.GameOver');

goog.require('lime.Scene');
goog.require('lpc.Sprite');
goog.require('lime.Label');
goog.require('lpc.Config');

lpc.GameOver = function(score){
	goog.base(this);
	
	var bg = new lpc.Sprite().setFill('#000000').setSize(lpc.Config.SCREEN.width, lpc.Config.SCREEN.height)
	
	var label = new lime.Label().setText('Game Over').setFontFamily('monospace').setFontWeight('bold').setFontSize(48).setFontColor('#eeeeee').setPosition(lpc.Config.SCREEN.width/2, lpc.Config.SCREEN.height/3.5);
	
	var score = new lime.Label().setText('You\'ve made '+score+' points').setFontFamily('monospace').setFontSize(24).setFontColor('#eeeeee').setPosition(lpc.Config.SCREEN.width/2, lpc.Config.SCREEN.height/1.5);

	this.appendChild(bg);
	this.appendChild(label);
	this.appendChild(score);
}

goog.inherits(lpc.GameOver, lime.Scene);

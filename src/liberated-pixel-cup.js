goog.provide('lpc');

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
goog.require('lpc.GameOver');
goog.require('lpc.InvadersControl');
goog.require('lime.animation.FadeTo');
goog.require('lpc.Game');

lpc.start = function(){
	var director = new lime.Director(document.getElementById('game'), lpc.Config.SCREEN.width, lpc.Config.SCREEN.height),
	    game = new lpc.Game();
	
	director.makeMobileWebAppCapable();
	
	director.replaceScene(game);
	
	goog.events.listen(game, 'gameover', function(){
		director.replaceScene(new lpc.GameOver(game.getScore()));
	});
}

goog.exportSymbol('lpc.start', lpc.start);
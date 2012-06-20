goog.provide('lpc.events.InputEvent');

goog.require('goog.events.Event');

lpc.events.InputEvent = function(type, opt_target){
	goog.base(this, type, opt_target);
}

goog.inherits(lpc.events.InputEvent, goog.events.Event);

lpc.events.InputEvent.FIRE = 'InputEvent_Fire';
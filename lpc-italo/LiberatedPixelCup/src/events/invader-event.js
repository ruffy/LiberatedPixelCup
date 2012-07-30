goog.provide('lpc.events.InvaderEvent');

goog.require('goog.events.Event');

lpc.events.InvaderEvent = function(type, opt_target){
	goog.base(this, type, opt_target);
}

goog.inherits(lpc.events.InvaderEvent, goog.events.Event);

lpc.events.InvaderEvent.DISAPEAR = 'InvaderEvent_Disapear';
lpc.events.InvaderEvent.MOVE = 'InvaderEvent_Move';
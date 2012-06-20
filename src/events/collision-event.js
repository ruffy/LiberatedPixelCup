goog.provide('lpc.events.CollisionEvent');

goog.require('goog.events.Event');

lpc.events.CollisionEvent = function(type, opt_target){
	goog.base(this, type, opt_target);
}

goog.inherits(lpc.events.CollisionEvent, goog.events.Event);

lpc.events.CollisionEvent.COLLISION = 'CollisionEvent_Collision';
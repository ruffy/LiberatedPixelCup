goog.provide('lpc.inputs.KeyboardInput');

goog.require('lpc.Node');
goog.require('lpc.inputs.Key');
goog.require('goog.events.KeyCodes');
goog.require('lpc.events.InputEvent');

lpc.inputs.KeyboardInput = function(){
	goog.base(this);
	
	var self = this;
	
	var	currentKeyCode = 0,
		lastKeys = new Array();
	
	this.directionalKeys = new Array(
		new lpc.inputs.Key('up', goog.events.KeyCodes.UP),
		new lpc.inputs.Key('down', goog.events.KeyCodes.DOWN),
		new lpc.inputs.Key('right', goog.events.KeyCodes.RIGHT),
		new lpc.inputs.Key('left', goog.events.KeyCodes.LEFT)
	);
	
	function getDirectionalKey(code){
		for(i in self.directionalKeys){
			if(self.directionalKeys[i].getCode() == code){
				return self.directionalKeys[i];
			}
		}
	}
	
	goog.events.listen(document, ['keydown'], function(e){
		key = getDirectionalKey(e.keyCode);
		
		if(typeof key != 'undefined'){ //é direcional
			key.setPressed(true);
			
			if(key.getCode() != currentKeyCode){
				lastKeys.push(currentKeyCode);
				currentKeyCode = key.getCode();
				
				var ie = new lpc.events.InputEvent(lpc.events.InputEvent.FIRE);
				ie.input = key.getName();
				self.dispatchEvent(ie);
			}
		}
	});
	
	goog.events.listen(document, ['keyup'], function(e){
		var releasedKey = getDirectionalKey(e.keyCode)
		
		if(typeof releasedKey != 'undefined'){ //é direcional
			releasedKey.setPressed(false);
			
			if(releasedKey.getCode() == currentKeyCode){
				currentKeyCode = 0;
				
				var lastKey;
				
				for(i in lastKeys){
					lastKey = getDirectionalKey(lastKeys.pop());
					
					if(typeof lastKey != 'undefined'){
						if(lastKey.isPressed()){
							currentKeyCode = lastKey.getCode();

							var ie = new lpc.events.InputEvent(lpc.events.InputEvent.FIRE);
							ie.input = lastKey.getName();
							self.dispatchEvent(ie);
							
							break;
						}
					}
				}
			}
				
			if(currentKeyCode == 0){
				var ie = new lpc.events.InputEvent(lpc.events.InputEvent.FIRE);
				ie.input = '';
				self.dispatchEvent(ie);
			}
		}
	});
}

goog.inherits(lpc.inputs.KeyboardInput, lpc.Node);
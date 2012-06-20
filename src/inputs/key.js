goog.provide('lpc.inputs.Key');

lpc.inputs.Key = function(name, code){
	var name = name;
	var code = code;
	var pressed = false;
	
	this.isPressed = function(){
		return pressed;
	}
	
	this.setPressed = function(value){
		pressed = value;
		return this;
	}
	
	this.getName = function(){
		return name;
	}
	
	this.setName = function(value){
		name = value;
		return this;
	}
	
	this.getCode = function(){
		return code;
	}
	
	this.setCode = function(value){
		code = value;
		return this;
	}	
}
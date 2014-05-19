function g_object(sprite,rotationInRads,movespeed){

	var maxRotationInRads = rotationInRads || 0.02;
	var maxMovespeed = movespeed || 5;

	var dir = "forward";
	var rotationInRads = 0;
	var movespeed = 0;

	this.sprite = sprite; // pixi js sprite

	this.rotateCW = function(){
		rotationInRads = -maxRotationInRads;
	};

	this.rotateCCW = function(){
		rotationInRads = maxRotationInRads;
	};

	this.rotateStop = function(){
		rotationInRads = 0;
	};

	this.forward = function(){
		dir = "forward";
		movespeed = maxMovespeed;
	};

	this.backward = function(){
		dir = "backward";
		movespeed = -maxMovespeed
	};

	this.stop = function(){
		movespeed = 0;
	};

	this.update = function(){
		this.sprite.rotation += rotationInRads;
		this.sprite.position.x += ( movespeed * Math.cos(rotationInRads) );
		this.sprite.position.y += ( -movespeed * Math.sin(rotationInRads) );
	};

}
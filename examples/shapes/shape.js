const cop = require("./context-traits.js");

TShape = {
	b: 2,
	h: 3,
	type: "shape",
	getType: function() {
		return this.type;
	},
	area: function() {
		return 'Calling an abstract method area';
	},
	perimeter: function() {
		return 'Calling an abstract method perimeter';
	},
	numberOfSides: function() {
		return 0;
	}
};

Triangle = new cop.Context();
TriangleBehavior = cop.Trait({ 
	getType: function() {
		return "triangle";
	},
	area: function() {
		return this.b * this.h/2;
	},
	perimeter: function() {
		return this.b + 2*Math.sqrt(Math.pow(this.h,2) + Math.pow(this.b/2, 2));
	},
	numberOfSides: function() {
		return 3;
	}
});	
Triangle.adapt(TShape, TriangleBehavior);



Circle = new cop.Context();
CircleBehavior = cop.Trait({ 
	getType: function() {
		return "circle";
	},
	area: function() {
		return Math.pow(this.b, 2) * Math.PI;
	},
	perimeter: function() {
		return this.b * 2* Math.PI;
	},
	numberOfSides: function() {
		throw new Error("Number of sides is not defined in a circle");
	}
});	
Circle.adapt(TShape, CircleBehavior);

if(matchMedia.random() >= 0.5) 
	Circle.activate()
else 
	Triangle.activate();

var area = TShape.area();
var sides = TShape.numberOfSides();

if(Circle.isActive()) 
	this.Circle.deactivate();
else
	Triangle.deactivate();

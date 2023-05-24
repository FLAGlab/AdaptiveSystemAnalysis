const cop = require("./context-traits.js");

TShape = {
	b: 0,
	h: 0,
	type: "shape",
	getType: function() {
		return this.type;
	},
	area: function() {
		return 'Calling an abstract method area';
	},
	perimeter: function() {
		return 'Calling an abstract method perimeter';
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
	}
});	
Circle.adapt(TShape, CircleBehavior);

module.exports.TShape = TShape;
module.exports.Circle = TShape;
module.exports.Triangle = TShape;

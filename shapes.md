# Shapes

`shapes.js` is small program to calculate the area, perimeter, and number of sides of different geometrical shapes (e.g., triangles, circles).

## Program

The program to evaluate is shown in the following

```js
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
```

## Precision and Recall

Analysis for the `area` variable
| Analysis | Instances | True Positives | False Positives | False Negatives | Precision | Recall |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
Baseline | 3 | 1 | 0 | 2 | 1 | 0.33
Whole Program | 3 | 1 | 0 | 2 | 1 | 0.33
**Our** | 3 | 3 | 0 | 0 | 1 | **1**

Analysis for the `sides` variable
| Analysis | Instances | True Positives | False Positives | False Negatives | Precision | Recall |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
Baseline | 3 | 1 | 0 | 2 | 1 | 0.33
Whole Program | 3 | 1 | 0 | 2 | 1 | 0.33
**Our** | 3 | 3 | 0 | 0 | 1 | **1**

## Performance

All times are shown in ms.

| Analysis | No. of Nodes | No. of Edges | Processing time | Analysis time |
| ---- | ---- | ---- | ---- | ---- |
Baseline | 125 | 124 | **688 ± 10.7** | 391 ± 34.1
Whole Program | 220 | 223 | 897 ± 28.6 | 567 ± 28
**Our** | 131 | 130 | 791 ± 37.2 | **367 ± 17.4**

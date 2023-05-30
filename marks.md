# Marks

`course.js` is an application to calculate the marks of a student taking different courses

## Program

The program to evaluate is shown in the following

```js
//--- Base behavior definition
Person = Trait({
  name: "",
  role: function() {
    console.log("base person method");
  }
});

//--- Adaptations definition
function makeStudentTrait(marks) {
   return Trait({
     role: function() {
       console.log("Student method");
     },
     setMarks: function(newMarks) {
       marks = newMarks;
     },
     marks: function() {
       return marks;
     },
     printMarks: function() {
       console.log("Marks for the student " + this.name);
       for(var i=0; i<marks.length; i++) {
         console.log(marks[i].course + ": " + marks[i].mark);
       }
     }
  });
}

ProfessorOps = Trait({
  role: function() {
    console.log("Professor method");
  },
  giveMark: function(mark, student) {
    var newMarks = student.marks();
    newMarks[newMarks.length] = {
      "course": rop.isActive() ? "ROP" : "SE",
      "mark": mark
    };
    console.log(newMarks);
    student.setMarks(newMarks);
  }
});

//context instances
rop = new cop.Context({
    name: "rop"
});
se = new cop.Context({
    name : "se"
})


//--- Object instances definition
var nicolas = Object.create(Object.prototype, Person);
nicolas.name = "Nicolas";
var thomas = Object.create(Object.prototype, Person);
thomas.name = "Thomas";
var ly = Object.create(Object.prototype, Person);
ly.name = "Ly";
var martin = Object.create(Object.prototype, Person);
martin.name = "Martin";
var markus = Object.create(Object.prototype, Person);
markus.name = "Markus";

//--- Context-object-behaviora adaptations association

rop.adapt(nicolas, makeStudentTrait([]));
rop.adapt(thomas, ProfessorOps);
rop.adapt(ly, makeStudentTrait([]));
rop.adapt(martin, makeStudentTrait([]));
rop.adapt(markus, makeStudentTrait([]));

se.adapt(nicolas, ProfessorOps);
se.adapt(thomas, makeStudentTrait([]));

//--- Main
rop.activate();
thomas.giveMark(1, nicolas);
thomas.giveMark(1, ly);
thomas.giveMark(1, markus);
thomas.role();

var marks = markus.printMarks();
```

## Precision and Recall

We begin the analysis with calculating the points-to set for the `marks` variable. The baseline cannot detect the implementation of the marks method, and therefore has and `Unknonw` result. While our implementation we point to an array of marks, which we call `i4`.

This array, should have only one instance (of the marks), while we detect three different instances `pts(i4[0]) = {Object (instance 1), Object (instance 2), Object (instance 3)}`. This may be explained by the 3 calls to the function `giveMarks` (one per student).

| Analysis | Instances | True Positives | False Positives | False Negatives | Precision | Recall |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
Baseline | 2 | 0 | 1 | 1 | 0 | 0
Whole Program | 2 | 0 | 1 | 1 | 0  | 0  
**Our** | 2 | 1 | 2 | 0 | **0.33** | **1**

## Performance

All times are shown in ms.

| Analysis | No. of Nodes | No. of Edges | Processing time | Analysis time |
| ---- | ---- | ---- | ---- | ---- |
Baseline | 150 | 149 | **688 ± 13.6** | 436 ± 26.7
Whole Program | 248 | 253 | 969 ± 53.8 | 602 ± 27
**Our** | 159 | 158 | 857 ± 35.8 | **383 ± 12.6**

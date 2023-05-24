var Trait = require("../traits.js").Trait;
var cop = require("./context-traits.js");

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

Course = new cop.Context({
  name: "course"
});
//context instances
rop = Object.create(Course);
se = Object.create(Course);


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
//se.adapt(ly, makeStudentTrait([]));
//se.adapt(martin, makeStudentTrait([]));
//se.adapt(markus, makeStudentTrait([]));

/*
cop.manager.addObjectPolicy(nicolas, [ProfessorOps, StudentOps]);
cop.manager.addObjectPolicy(thomas, [ProfessorOps, StudentOps]);
cop.manager.addObjectPolicy(ly, [StudentOps, ProfessorOps]);
cop.manager.addObjectPolicy(martin, [StudentOps, ProfessorOps]);
cop.manager.addObjectPolicy(markus, [StudentOps, ProfessorOps]);
*/
//--- Main
rop.activate();
thomas.giveMark(1, nicolas);
thomas.giveMark(1, ly);
thomas.giveMark(1, markus);
thomas.role();

/*
se.activate();
nicolas.giveMark(10, ly);
nicolas.giveMark(10, markus);
nicolas.giveMark(10, martin);
thomas.role();
*/

markus.printMarks();

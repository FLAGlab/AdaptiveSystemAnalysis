var Trait = require('./traits.js');
var cop = require('./context-traits');

Person = {
  greetings: function() {
	  return "Hello!"; 
  }
};

Spanish = new cop.Context(); 

SpanishSpeaking = Trait({ 
	greetings: function() {
		return "Hola!";
	} 
});

French = new cop.Context(); 
FrenchSpeaking = Trait({
	greetings: function() {
		return "Bonjour!"; 
	}
});

Spanish.adapt(Person , SpanishSpeaking);
French.adapt(Person , FrenchSpeaking);

var result = Person.greetings(); 
Spanish.activate();
result = Person.greetings(); 
French.activate();
result = Person.greetings();
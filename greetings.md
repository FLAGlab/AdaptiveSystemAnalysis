# Greetings

`greetings.js` is a prototypical application for COP containing a multi-lingual implementation of a 'Hello World!'. Each implementation is presented as an adaptation dynamically selected according to the context (i.e., region of execution) to select the appropriate language.

## Program

The program to evaluate is shown in the following

```js
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
```

There are 2 contexts, `Spanish` and `French` to greet in the corresponding language whenever appropriate. The adaptations associated with each context adapts the `greetings` function.

## Precision and Recall

| Analysis | Instances | True Positives | False Positives | False Negatives | Precision | Recall |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
Baseline | 3 | 1 | 0 | 2 | 1 | 0.33
Whole Program | 3 | 1 | 0 | 2 | 1 | 0.33
**Our** | 3 | 3 | 0 | 0 | 1 | **1**

## Performance

All times are shown in ms.

| Analysis | No. of Nodes | No. of Edges | Processing time | Analysis time |
| ---- | ---- | ---- | ---- | ---- |
Baseline | 116 | 115 | 665 ± 25.4 | 398 ± 10.4
Whole Program | 211 | 214 | 858 ± 25.5 | 539 ± 18.6
**Our** | 120 | 119 | 727 ± 29.9 | 321 ± 25.3

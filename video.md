# Video Encoder

`video-encoder.js` is a example application to demonstrate the interactions and unexpected behavior arising from interacting adaptations.

## Program

The program to evaluate is shown in the following

```js
var Trait = require("../traits.js").Trait;
var cop = require("./context-traits.js");

CoreObject = Trait({
  send: function(msg) {
    return msg;
  }
});

Encryption = new cop.Context({
  name: "Encryption"
});


Compression = new cop.Context({
  name: "Compression"
});

EncryptionRole = Trait({
  send: function(msg) {
    return "<E>" + this.proceed(msg) + "<E>";
  }
});

CompressionRole = Trait({
  send: function(msg) {
    return "<C>" + this.proceed(msg) + "<C>";
  }
});

obj = Object.create(Object.prototype, CoreObject);

Compression.adapt(obj, CompressionRole);
Encryption.adapt(obj, EncryptionRole);

Encryption.activate();
Compression.activate();
received_msg = obj.send("message");
Compression.deactivate();
Encryption.deactivate();
```

## Precision and Recall

In this intance, we calculate the points to set over one variable, `received_msg` with the following result:

```js
//Expected pts = {"message", <E>"message"<E>, <C>"message"<C>, <E><C>"message"<C><E>}
//Baseline
pts(received_msg) = {"message"}  
//Whole program
pts(received_msg) = {"message"} 
//Our
pts(received_msg) = {Unknown} 
```

| Analysis | Instances | True Positives | False Positives | False Negatives | Precision | Recall |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
Baseline | 3 | 1 | 0 | 3 | **1** | **0.25**
Whole Program | 3 | 1 | 0 | 3 | 1 | 0.25
**Our** | 3 | 0 | 1 | 4 | 0 | 0

## Performance

All times are shown in ms.

| Analysis | No. of Nodes | No. of Edges | Processing time | Analysis time |
| ---- | ---- | ---- | ---- | ---- |
Baseline | 115 | 114 | **647 ± 20.4** | 372 ± 26.5
Whole Program | 213 | 218 | 907 ± 39.9 | 602 ± 24.3
**Our** | 119 | 118 | 751 ± 35.8 | **316 ± 18.4**

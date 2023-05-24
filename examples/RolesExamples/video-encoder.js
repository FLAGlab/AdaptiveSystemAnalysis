var Trait = require("../traits.js").Trait;
var cop = require("./context-traits.js");

CoreObject = Trait({
  send: function() {
    return "message";
  }
});

Encryption = new cop.Context({
  name: "Encryption"
});


Compression = new cop.Context({
  name: "Compression"
});

EncryptionRole = Trait({
  send: function() {
    return "<E>" + this.proceed() + "<E>";
  }
});

CompressionRole = Trait({
  send: function() {
    return "<C>" + this.proceed() + "<C>";
  }
});

CompressedEncryptionRole = Trait({
  send: function() {
    return this.proceed();
  }
});

obj = Object.create(Object.prototype, CoreObject);

Compression.adapt(obj, CompressionRole);
Encryption.adapt(obj, EncryptionRole);
//CompressedEncryption.adapt(obj, CompressedEncryptionRole);




console.log(obj.send());
Compression.activate();
console.log(obj.send());
Compression.deactivate();
Encryption.activate();
console.log(obj.send());
Encryption.deactivate();

Encryption.activate();
Compression.activate();
console.log(obj.send());
Compression.deactivate();
Encryption.deactivate();

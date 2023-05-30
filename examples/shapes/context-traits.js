/* Context Traits v0.0.0
   https://github.com/tagae/context-traits
   Copyright © 2012 UCLouvain
   Licensed under Apache Licence, Version 2.0 */

// Generated by CoffeeScript 1.3.3
require("underscore");

(function() {
  var ActivationAgePolicy, Adaptation, Context, Manager, Namespace, Policy, contexts, ensureObject, exports, findScriptHome, strategies, traceableMethod, traceableTrait, traits, _base, _ref,
    __hasProp = {}.hasOwnProperty;

  ensureObject = function(name, file) {
    var object;
    object = this[name];
    if (object == null) {
      if (typeof require !== "undefined" && require !== null) {
        return this[name] = require(file);
      } else {
        throw new Error("Required object '" + name + "' of library '" + file + "' not found");
      }
    }
  };

  ensureObject('_', 'underscore');
  var Trait = require("traits.js").Trait;
  //ensureObject('Trait', 'traits.js');

  if ((_ref = (_base = Function.prototype).inheritFrom) == null) {
    _base.inheritFrom = function(parent) {
      this.prototype = new parent();
      return this;
    };
  }

  Array.prototype.top = function() {
    return this[this.length - 1];
  };

  Context = function(name) {
    var _ref1;
    this.activationCount = 0;
    this.adaptations = [];
    this.manager = ((_ref1 = contexts.Default) != null ? _ref1.manager : void 0) || new Manager();
    if (name != null) {
      this.name = (function() {
        return name;
      });
    }
    return this;
  };

  Adaptation = function(context, object, trait) {
    this.context = context;
    this.object = object;
    this.trait = trait;
    return this;
  };

  Manager = function() {
    this.adaptations = [];
    this.invocations = [];
    this.policy = new ActivationAgePolicy();
    this.totalActivations = 0;
    return this;
  };

  Policy = function() {
    return this;
  };

  _.extend(Context.prototype, {
    activate: function() {
      if (++this.activationCount === 1) {
        this.activationStamp = ++this.manager.totalActivations;
        this.activateAdaptations();
      }
      return this;
    },
    deactivate: function() {
      if (this.activationCount > 0) {
        if (--this.activationCount === 0) {
          this.deactivateAdaptations();
          delete this.activationStamp;
        }
      }
      return this;
    },
    isActive: function() {
      return this.activationCount > 0;
    }
  });

  strategies = {
    compose: function(adaptation, trait) {
      var name, propdesc, resultingTrait;
      resultingTrait = Trait.compose(adaptation.trait, trait);
      for (name in resultingTrait) {
        if (!__hasProp.call(resultingTrait, name)) continue;
        propdesc = resultingTrait[name];
        if (propdesc.conflict) {
          throw new Error(("Property '" + name + "' already adapted for ") + adaptation.object + " in " + adaptation.context);
        }
      }
      return resultingTrait;
    },
    preserve: function(adaptation, trait) {
      return Trait.override(adaptation.trait, trait);
    },
    override: function(adaptation, trait) {
      return Trait.override(trait, adaptation.trait);
    },
    prevent: function(adaptation, trait) {
      throw new Error(adaptation.object + " already adapted in " + adaptation.context);
    }
  };

  _.extend(Context.prototype, {
    adapt: function(object, trait) {
      if (!(object instanceof Object)) {
        throw new Error("Values of type " + (typeof object) + " cannot be adapted.");
      }
      contexts.Default.addAdaptation(object, Trait(object), strategies.preserve);
      return this.addAdaptation(object, trait, strategies.compose);
    },
    addAdaptation: function(object, trait, strategy) {
      var adaptation;
      trait = traceableTrait(trait);
      adaptation = this.adaptationFor(object);
      if (adaptation) {
        adaptation.trait = strategy(adaptation, trait);
        if (this.isActive()) {
          this.manager.updateBehaviorOf(object);
        }
      } else {
        trait = Trait.compose(trait, traits.Extensible);
        adaptation = new Adaptation(this, object, trait);
        this.adaptations.push(adaptation);
        if (this.isActive()) {
          this.manager.deployAdaptation(adaptation);
        }
      }
      return this;
    },
    adaptationFor: function(object) {
      return _.find(this.adaptations, function(adaptation) {
        return adaptation.object === object;
      });
    },
    activateAdaptations: function() {
      var adaptation, _i, _len, _ref1, _results;
      _ref1 = this.adaptations;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        adaptation = _ref1[_i];
        _results.push(this.manager.deployAdaptation(adaptation));
      }
      return _results;
    },
    deactivateAdaptations: function() {
      var adaptation, _i, _len, _ref1, _results;
      _ref1 = this.adaptations;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        adaptation = _ref1[_i];
        _results.push(this.manager.withdrawAdaptation(adaptation));
      }
      return _results;
    }
  });

  _.extend(Manager.prototype, {
    deployAdaptation: function(adaptation) {
      this.adaptations.push(adaptation);
      return this.updateBehaviorOf(adaptation.object);
    },
    withdrawAdaptation: function(adaptation) {
      var i;
      i = this.adaptations.indexOf(adaptation);
      if (i === -1) {
        throw new Error("Attempt to withdraw unmanaged adaptation");
      }
      this.adaptations.splice(i, 1);
      return this.updateBehaviorOf(adaptation.object);
    },
    updateBehaviorOf: function(object) {
      this.adaptationChainFor(object)[0].deploy();
      return this;
    },
    adaptationChainFor: function(object) {
      var relevantAdaptations;
      relevantAdaptations = _.filter(this.adaptations, function(adaptation) {
        return adaptation.object === object;
      });
      if (relevantAdaptations.length === 0) {
        throw new Error("No adaptations found for " + object);
      }
      return this.policy.order(relevantAdaptations);
    }
  });

  _.extend(Adaptation.prototype, {
    deploy: function() {
      return _.extend(this.object, Object.create({}, this.trait));
    },
    toString: function() {
      return "Adaptation for " + this.object + " in " + this.context;
    },
    equivalent: function(other) {
      return this.context === other.context && this.object === other.object && Trait.eqv(this.trait, other.trait);
    }
  });

  traits = {};

  traits.Extensible = Trait({
    proceed: function() {
      var alternatives, args, index, invocations, manager, method, name, _ref1;
      manager = contexts.Default.manager;
      invocations = manager.invocations;
      if (invocations.length === 0) {
        throw new Error("Proceed must be called from an adaptation");
      }
      _ref1 = invocations.top(), name = _ref1[0], args = _ref1[1], method = _ref1[2];
      args = arguments.length === 0 ? args : arguments;
      alternatives = manager.orderedMethods(this, name);
      index = alternatives.indexOf(method);
      if (index === -1) {
        throw new Error("Cannot proceed from an inactive adaptation");
      }
      if (index + 1 === alternatives.length) {
        throw new Error("Cannot proceed further");
      }
      return alternatives[index + 1].apply(this, args);
    }
  });

  traceableMethod = function(name, method) {
    var wrapper;
    wrapper = function() {
      var invocations;
      invocations = contexts.Default.manager.invocations;
      invocations.push([name, arguments, wrapper]);
      try {
        return method.apply(this, arguments);
      } finally {
        invocations.pop();
      }
    };
    return wrapper;
  };

  traceableTrait = function(trait) {
    var name, newTrait, propdesc;
    newTrait = Trait.compose(trait);
    for (name in newTrait) {
      if (!__hasProp.call(newTrait, name)) continue;
      propdesc = newTrait[name];
      if (_.isFunction(propdesc.value)) {
        propdesc.value = traceableMethod(name, propdesc.value);
      }
    }
    return newTrait;
  };

  _.extend(Manager.prototype, {
    orderedMethods: function(object, name) {
      var adaptation, adaptations, _i, _len, _results;
      adaptations = this.adaptationChainFor(object);
      _results = [];
      for (_i = 0, _len = adaptations.length; _i < _len; _i++) {
        adaptation = adaptations[_i];
        _results.push(adaptation.trait[name].value);
      }
      return _results;
    }
  });

  _.extend(Policy.prototype, {
    order: function(adaptations) {
      var self;
      self = this;
      return adaptations.sort(function(adaptation1, adaptation2) {
        if (adaptation1.object !== adaptation2.object) {
          throw new Error("Refusing to order adaptations of different objects");
        }
        return self.compare(adaptation1, adaptation2);
      });
    },
    compare: function(adaptation1, adaptation2) {
      throw new Error("There is no criterium to order adaptations");
    },
    toString: function() {
      return this.name() + ' policy';
    },
    name: function() {
      return 'anonymous';
    }
  });

  ActivationAgePolicy = function() {
    Policy.call(this);
    return this;
  };

  ActivationAgePolicy.inheritFrom(Policy);

  _.extend(ActivationAgePolicy.prototype, {
    compare: function(adaptation1, adaptation2) {
      return adaptation1.context.activationAge() - adaptation2.context.activationAge();
    },
    name: function() {
      return 'activation age';
    }
  });

  _.extend(Context.prototype, {
    activationAge: function() {
      return this.manager.totalActivations - this.activationStamp;
    }
  });

  Namespace = function(name, parent) {
    if (parent == null) {
      parent = null;
    }
    if (!name) {
      throw new Error("Namespaces must have a name");
    }
    this.name = name;
    this.parent = parent;
    if (!parent) {
      this.home = findScriptHome();
    }
    return this;
  };

  _.extend(Namespace.prototype, {
    root: function() {
      if (this.parent != null) {
        return this.parent.root();
      } else {
        return this;
      }
    },
    path: function() {
      var path;
      if (this.parent != null) {
        path = this.parent.path();
        path.push(this.name);
        return path;
      } else {
        return [this.name];
      }
    },
    normalizePath: function(path) {
      if (_.isString(path)) {
        return path = path.split('.');
      } else if (_.isArray(path)) {
        return path;
      } else {
        throw new Error("Invalid path specification");
      }
    },
    ensure: function(path) {
      var name, namespace, _i, _len;
      path = this.normalizePath(path);
      namespace = this;
      for (_i = 0, _len = path.length; _i < _len; _i++) {
        name = path[_i];
        if (namespace[name] == null) {
          namespace[name] = new Namespace(name, namespace);
        }
        namespace = namespace[name];
      }
      return namespace;
    },
    add: function(properties) {
      return _.extend(this, properties);
    },
    load: function(path, options) {
      var failure, success;
      success = options.success || (function() {});
      failure = options.failure || (function() {});
      path = this.normalizePath(path);
      if (typeof document !== "undefined" && document !== null) {
        return this.loadInBrowser(path, success, failure);
      } else {
        throw new Error("Loading of context modules not supported in current JavaScript platform.");
      }
    },
    loadInBrowser: function(path, success, failure) {
      var target, url;
      if (typeof $ === "undefined" || $ === null) {
        throw new Error("Context module loading depends on jQuery");
      }
      target = this;
      url = target.root().home + (target.path().concat(path)).join('/') + '.js';
      return $.ajax({
        url: url,
        dataType: "text",
        success: function(data, textStatus, jqXHR) {
          var leaf, origExports;
          try {
            if (window.hasOwnProperty('exports')) {
              origExports = window.exports;
            }
            window.exports = {};
            $.globalEval(data);
            leaf = target.ensure(path);
            leaf.add(window.exports);
            if (origExports != null) {
              window.exports = origExports;
            } else {
              delete window.exports;
            }
            console.log('Loaded ' + url);
            return success();
          } catch (error) {
            return failure(error);
          }
        },
        error: function(jqXHR, status, error) {
          console.log("Failed to load " + url + " (" + status + "): " + error);
          return failure(error);
        }
      });
    }
  });

  _.extend(Context.prototype, {
    path: function(from) {
      var i, keys, p, subspace, values, _i, _len;
      if (from == null) {
        from = contexts;
      }
      keys = _.keys(from);
      values = _.values(from);
      i = values.indexOf(this);
      if (i !== -1) {
        return [keys[i]];
      } else {
        for (i = _i = 0, _len = values.length; _i < _len; i = ++_i) {
          subspace = values[i];
          if (subspace instanceof Namespace && keys[i] !== 'parent') {
            p = this.path(subspace);
            if (p) {
              p.unshift(keys[i]);
              return p;
            }
          }
        }
        return false;
      }
    },
    name: function() {
      var path;
      path = this.path();
      if (path) {
        return path.join('.');
      } else {
        return 'anonymous';
      }
    },
    toString: function() {
      return this.name() + ' context';
    }
  });

  findScriptHome = function() {
    var line, matches, trace, _i, _len, _ref1;
    try {
      throw new Error;
    } catch (error) {
      trace = error.stack || error.stacktrace;
      if (trace) {
        _ref1 = trace.split('\n');
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          line = _ref1[_i];
          matches = /(http|file):\/\/[^/]*(\/.*\/)[^/]*\.js/.exec(line);
          if (matches != null) {
            return matches[2];
          }
        }
      } else if (error.sourceURL) {
        throw new Error('TODO: error.sourceURL not supported yet.');
      } else {
        throw new Error('Could not determine script home directory.');
      }
    }
    return null;
  };

  contexts = new Namespace('contexts');

  contexts.Default = new Context('default');

  contexts.Default.activate();

  if (typeof exports === "undefined" || exports === null) {
    exports = this;
  }

  exports.Context = Context;

  exports.Namespace = Namespace;

  exports.Policy = Policy;

  exports.Trait = Trait;

  exports.contexts = contexts;

}).call(this);
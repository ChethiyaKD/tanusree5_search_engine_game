/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js ***!
  \*********************************************************************************/
/***/ (function(module) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayLikeToArray; }
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithoutHoles; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _asyncToGenerator; }
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArray; }
/* harmony export */ });
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableSpread; }
/* harmony export */ });
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _toConsumableArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js");




function _toConsumableArray(arr) {
  return (0,_arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr) || (0,_nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _unsupportedIterableToArray; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!****************************!*\
  !*** ./src/background.jsx ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


var APIURL = "https://script.google.com/macros/s/AKfycbxqmBMb5NkK8u1JKvOHQME9fHCutxG4sZVR2_vDfGfIdOnS2ARRRWTTheIaILuRdYgPnA/exec";
var serpAPIKEY = "ede9da382a0e902a00d18bb52d2ec91d1766187663d782bf7d8e0f2013016aa3";
var staticResult = [{
  position: 1,
  title: "Coffee - Wikipedia",
  link: "https://en.wikipedia.org/wiki/Coffee",
  displayed_link: "https://en.wikipedia.org › wiki › Coffee",
  thumbnail: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de33f1075c739f8422a9f36bd05bdd0ca9f.jpeg",
  snippet: "Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain flowering plants in the Coffea genus. From the coffee fruit, ...",
  snippet_highlighted_words: ["Coffee", "coffee", "coffee"],
  sitelinks: {
    inline: [{
      title: "Coffee bean",
      link: "https://en.wikipedia.org/wiki/Coffee_bean"
    }, {
      title: "History",
      link: "https://en.wikipedia.org/wiki/History_of_coffee"
    }, {
      title: "Coffee preparation",
      link: "https://en.wikipedia.org/wiki/Coffee_preparation"
    }, {
      title: "Coffee production",
      link: "https://en.wikipedia.org/wiki/Coffee_production"
    }]
  },
  rich_snippet: {
    bottom: {
      extensions: ["Region of origin: Horn of Africa and ‎South Ara...‎", "Color: Black, dark brown, light brown, beige", "Introduced: 15th century"],
      detected_extensions: {
        introduced_th_century: 15
      }
    }
  },
  about_this_result: {
    source: {
      description: "Wikipedia is a multilingual free online encyclopedia written and maintained by a community of volunteers through open collaboration and a wiki-based editing system. Individual contributors, also called editors, are known as Wikipedians. Wikipedia is the largest and most-read reference work in history.",
      icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de3a991c60432db4437d53a378874df5fd3c8eee73e16e6b2baf77aba3b1336b6b6.png"
    },
    keywords: ["coffee"],
    languages: ["English"],
    regions: ["the United States"]
  },
  about_page_link: "https://www.google.com/search?q=About+https://en.wikipedia.org/wiki/Coffee&tbm=ilp&ilps=ADNMCi0tVhSB-fGHOJYgrIxB0xlXYrPGPA",
  cached_page_link: "https://webcache.googleusercontent.com/search?q=cache:U6oJMnF-eeUJ:https://en.wikipedia.org/wiki/Coffee+&cd=14&hl=en&ct=clnk&gl=us",
  related_pages_link: "https://www.google.com/search?q=related:https://en.wikipedia.org/wiki/Coffee+Coffee"
}, {
  position: 2,
  title: "The Coffee Bean & Tea Leaf | CBTL",
  link: "https://www.coffeebean.com/",
  displayed_link: "https://www.coffeebean.com",
  snippet: "Born and brewed in Southern California since 1963, The Coffee Bean & Tea Leaf® is passionate about connecting loyal customers with carefully handcrafted ...",
  snippet_highlighted_words: ["Coffee"],
  about_this_result: {
    source: {
      description: "The Coffee Bean & Tea Leaf is an American coffee shop chain founded in 1963. Since 2019, it is a trade name of Ireland-based Super Magnificent Coffee Company Ireland Limited, itself wholly owned subsidiary of multinational Jollibee Foods Corporation.",
      icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de37f4dd49485528fe7b21de475d2107126d1322bc34dca9b3f60f1c42148ce2d4e.png"
    },
    keywords: ["coffee"],
    languages: ["English"],
    regions: ["the United States"]
  },
  about_page_link: "https://www.google.com/search?q=About+https://www.coffeebean.com/&tbm=ilp&ilps=ADNMCi2oSYB5WqnhmnflS86OdMdpjMzz9g",
  cached_page_link: "https://webcache.googleusercontent.com/search?q=cache:WpQxSYo2c6AJ:https://www.coffeebean.com/+&cd=15&hl=en&ct=clnk&gl=us",
  related_pages_link: "https://www.google.com/search?q=related:https://www.coffeebean.com/+Coffee"
}, {
  position: 3,
  title: "The History of Coffee - National Coffee Association",
  link: "https://www.ncausa.org/about-coffee/history-of-coffee",
  displayed_link: "https://www.ncausa.org › ... › History of Coffee",
  snippet: "Coffee grown worldwide can trace its heritage back centuries to the ancient coffee forests on the Ethiopian plateau. There, legend says the goat herder ...",
  snippet_highlighted_words: ["Coffee", "coffee"],
  sitelinks: {
    inline: [{
      title: "An Ethiopian Legend",
      link: "https://www.ncausa.org/about-coffee/history-of-coffee#:~:text=An%20Ethiopian%20Legend"
    }, {
      title: "The Arabian Peninsula",
      link: "https://www.ncausa.org/about-coffee/history-of-coffee#:~:text=The%20Arabian%20Peninsula,-Coffee%20cultivation%20and%20trade%20began"
    }, {
      title: "Coffee Comes To Europe",
      link: "https://www.ncausa.org/about-coffee/history-of-coffee#:~:text=Coffee%20Comes%20to%20Europe"
    }]
  },
  about_this_result: {
    source: {
      description: "The National Coffee Association or, is the main market research, consumer information, and lobbying association for the coffee industry in the United States."
    },
    keywords: ["coffee"],
    languages: ["English"],
    regions: ["the United States"]
  },
  about_page_link: "https://www.google.com/search?q=About+https://www.ncausa.org/about-coffee/history-of-coffee&tbm=ilp&ilps=ADNMCi2T6KU_7eHEV4EzZS1EnLrQVwD53A",
  cached_page_link: "https://webcache.googleusercontent.com/search?q=cache:v1hp0SS8WggJ:https://www.ncausa.org/about-coffee/history-of-coffee+&cd=16&hl=en&ct=clnk&gl=us"
}, {
  position: 4,
  title: "9 Health Benefits of Coffee, Based on Science - Healthline",
  link: "https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee",
  displayed_link: "https://www.healthline.com › nutrition › top-evidence-b...",
  snippet: "Coffee is a major source of antioxidants in the diet. It has many health benefits, such as improved brain function and a lower risk of several diseases.",
  snippet_highlighted_words: ["Coffee"],
  sitelinks: {
    inline: [{
      title: "1. Boosts Energy Levels",
      link: "https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee#:~:text=1.%20Boosts%20energy%20levels"
    }, {
      title: "2. May Be Linked To A Lower...",
      link: "https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee#:~:text=2.%20May%20be%20linked%20to%20a%20lower%20risk%20of%20type%202%20diabetes"
    }, {
      title: "3. Could Support Brain...",
      link: "https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee#:~:text=3.%20Could%20support%20brain%20health"
    }]
  },
  about_this_result: {
    source: {
      description: "Healthline Media, Inc. is an American website and provider of health information headquartered in San Francisco, California. It was founded in its current form 2006 and established as a standalone entity in January 2016.",
      icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de339c2b8dc2d17f23567c77e0bbc2f014386fb25182a64ce9fe79002d3e19a37e4.png"
    },
    keywords: ["coffee"],
    languages: ["English"],
    regions: ["the United States"]
  },
  about_page_link: "https://www.google.com/search?q=About+https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee&tbm=ilp&ilps=ADNMCi005zP34LoVlgtSYcT3k6ep4HgZPQ",
  cached_page_link: "https://webcache.googleusercontent.com/search?q=cache:r1UW6FGz3F4J:https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee+&cd=17&hl=en&ct=clnk&gl=us"
}, {
  position: 5,
  title: "coffee | Origin, Types, Uses, History, & Facts | Britannica",
  link: "https://www.britannica.com/topic/coffee",
  displayed_link: "https://www.britannica.com › ... › Food",
  date: "May 17, 2022",
  snippet: "coffee, beverage brewed from the roasted and ground seeds of the tropical evergreen coffee plants of African origin. Coffee is one of the ...",
  snippet_highlighted_words: ["coffee", "coffee", "Coffee"],
  about_this_result: {
    source: {
      description: "britannica.com was first indexed by Google more than 10 years ago",
      icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de3d94b9642f9e73eae53139d628085d840c483d7851a2d359fa0ad991302dd4dc3.png"
    },
    keywords: ["coffee"],
    languages: ["English"],
    regions: ["the United States"]
  },
  about_page_link: "https://www.google.com/search?q=About+https://www.britannica.com/topic/coffee&tbm=ilp&ilps=ADNMCi0xG2ABk5g9BrBwiawxBsBHMAwr8A",
  cached_page_link: "https://webcache.googleusercontent.com/search?q=cache:Wikbu4ipU28J:https://www.britannica.com/topic/coffee+&cd=18&hl=en&ct=clnk&gl=us",
  related_pages_link: "https://www.google.com/search?q=related:https://www.britannica.com/topic/coffee+Coffee"
}, {
  position: 6,
  title: "Peet's Coffee: The Original Craft Coffee",
  link: "https://www.peets.com/",
  displayed_link: "https://www.peets.com",
  snippet: "Since 1966, Peet's Coffee has offered superior coffees and teas by sourcing the best quality coffee beans and tea leaves in the world and adhering to strict ...",
  snippet_highlighted_words: ["Coffee", "coffees", "coffee"],
  about_this_result: {
    source: {
      description: "Peet's Coffee is a San Francisco Bay Area-based specialty coffee roaster and retailer owned by JAB Holding Company via JDE Peet's.",
      icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de37df725a437f7ce9737eb1dd6b39997770635523bf5e28f914a51454c2769e162.png"
    },
    keywords: ["coffee"],
    related_keywords: ["coffees"],
    languages: ["English"],
    regions: ["California"]
  },
  about_page_link: "https://www.google.com/search?q=About+https://www.peets.com/&tbm=ilp&ilps=ADNMCi2xqgiMSzEyTwg-QewuVQYGctzClw",
  cached_page_link: "https://webcache.googleusercontent.com/search?q=cache:BCjzno6zP6wJ:https://www.peets.com/+&cd=19&hl=en&ct=clnk&gl=us",
  related_pages_link: "https://www.google.com/search?q=related:https://www.peets.com/+Coffee"
}, {
  position: 7,
  title: "Starbucks Coffee Company",
  link: "https://www.starbucks.com/",
  displayed_link: "https://www.starbucks.com",
  snippet: "More than just great coffee. Explore the menu, sign up for Starbucks® Rewards, manage your gift card and more.",
  snippet_highlighted_words: ["coffee"],
  about_this_result: {
    source: {
      description: "Starbucks Corporation is an American multinational chain of coffeehouses and roastery reserves headquartered in Seattle, Washington. It is the world's largest coffeehouse chain.\nAs of November 2021, the company had 33,833 stores in 80 countries, 15,444 of which were located in the United States.",
      icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de3ad916b247a53360f0877bed9eba55dd7f02f4cc3b02948c98349d227b7e0c3a1.png"
    },
    keywords: ["coffee"],
    languages: ["English"],
    regions: ["the United States"]
  },
  about_page_link: "https://www.google.com/search?q=About+https://www.starbucks.com/&tbm=ilp&ilps=ADNMCi0cMyV0H7KdBl4d_vac7u0R1ouGYg",
  cached_page_link: "https://webcache.googleusercontent.com/search?q=cache:1vGXgo_FlHkJ:https://www.starbucks.com/+&cd=20&hl=en&ct=clnk&gl=us",
  related_pages_link: "https://www.google.com/search?q=related:https://www.starbucks.com/+Coffee"
}, {
  position: 8,
  title: "Coffee | The Nutrition Source",
  link: "https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/",
  displayed_link: "https://www.hsph.harvard.edu › ... › Food Features",
  snippet: "Coffee beans are the seeds of a fruit called a coffee cherry. Coffee cherries grow on coffee trees from a genus of plants called Coffea. There are a wide ...",
  snippet_highlighted_words: ["Coffee", "coffee", "Coffee", "coffee"],
  sitelinks: {
    inline: [{
      title: "Coffee And Health",
      link: "https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/#:~:text=Coffee%20and%20Health"
    }, {
      title: "Types",
      link: "https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/#:~:text=Types,-Coffee%20beans%20are%20the%20seeds"
    }, {
      title: "Make",
      link: "https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/#:~:text="
    }]
  },
  about_this_result: {
    source: {
      description: "The Harvard T.H. Chan School of Public Health is the public health school of Harvard University, located in the Longwood Medical Area of Boston, Massachusetts.",
      icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de3229aae72459d52def89429ddcb1d5343f77deb2f4657de73e4f71607635e3ae3.png"
    },
    keywords: ["coffee"],
    languages: ["English"],
    regions: ["the United States"]
  },
  about_page_link: "https://www.google.com/search?q=About+https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/&tbm=ilp&ilps=ADNMCi3F4RO_DIqjcm9VUCXmfmpqrX5h3w",
  cached_page_link: "https://webcache.googleusercontent.com/search?q=cache:aCQFR0EWgPwJ:https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/+&cd=24&hl=en&ct=clnk&gl=us"
}];

var getSerp = function getSerp(searchTerm) {
  return new Promise(function (resolve) {
    var requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch("https://serpapi.com/search.json?engine=google&q=".concat(searchTerm, "&api_key=").concat(serpAPIKEY, "&num=15"), requestOptions).then(function (response) {
      return response.json();
    }).then(function (result) {
      return resolve(result);
    })["catch"](function (error) {
      return console.log("error", error);
    });
  });
};

var googleSearch = function googleSearch(searchTerm) {
  return new Promise( /*#__PURE__*/function () {
    var _ref = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee(resolve) {
      var serpRes, storageRes, submittedCount, reveresed, data, i;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getSerp(searchTerm);

            case 2:
              serpRes = _context.sent;
              console.log(serpRes);
              _context.next = 6;
              return getFromStorage(["history", "staticResult"]);

            case 6:
              storageRes = _context.sent;

              if (storageRes.history) {
                _context.next = 9;
                break;
              }

              return _context.abrupt("return");

            case 9:
              storageRes.history.push({
                searchTerm: searchTerm,
                date: new Date().toUTCString(),
                url: serpRes.search_metadata.google_url,
                submitted: false
              });
              saveToStorage({
                history: storageRes.history
              });
              submittedCount = storageRes.history.filter(function (h) {
                return h.submitted;
              });
              reveresed = serpRes.organic_results.reverse();
              console.log(reveresed);
              data = [];
              console.log(submittedCount);

              if (!(submittedCount.length === 0)) {
                _context.next = 18;
                break;
              }

              return _context.abrupt("return", resolve(storageRes.staticResult));

            case 18:
              for (i = 0; i < Math.floor(reveresed.length * (submittedCount.length / 3)); i++) {
                data.push(reveresed[i]);
              }

              resolve(data);

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};

var toMinsAndSecs = function toMinsAndSecs(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = (millis % 60000 / 1000).toFixed(0);
  return "".concat(minutes, " :").concat(seconds < 10 ? "0" : "").concat(seconds);
};

var submitTask = /*#__PURE__*/function () {
  var _ref2 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee2(task) {
    var storageRes, history, raw, done;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getFromStorage(["userId", "history", "submittedKeywords"]);

          case 2:
            storageRes = _context2.sent;

            if (!(storageRes.userId && storageRes.history)) {
              _context2.next = 12;
              break;
            }

            history = storageRes.history;
            raw = JSON.stringify({
              userId: storageRes.userId,
              keyword: task.keyword,
              timeTaken: toMinsAndSecs(Date.now() - new Date(history[history.length - 1].date)),
              url: task.link,
              type: "submitTask"
            });
            storageRes.submittedKeywords.push(task.keyword);
            saveToStorage({
              submittedKeywords: storageRes.submittedKeywords
            });
            console.log(raw);
            _context2.next = 11;
            return postData(raw);

          case 11:
            done = _context2.sent;

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function submitTask(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var getBrowsingWeek = function getBrowsingWeek() {
  fetch("".concat(APIURL, "?type=keywords")).then(function (result) {
    return result.json();
  }).then(function (data) {
    console.log(data);
    saveToStorage({
      browsingWeek: data.data
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

var getWeek2 = function getWeek2() {
  fetch("".concat(APIURL, "?type=week_2")).then(function (result) {
    return result.json();
  }).then(function (data) {
    console.log(data);
    saveToStorage({
      weekTwoKeywords: data.data
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

var getServey = /*#__PURE__*/function () {
  var _ref3 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee3() {
    var storageRes;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getFromStorage("serveyQuestions");

          case 2:
            storageRes = _context3.sent;
            fetch("".concat(APIURL, "?type=surveyQuesions")).then(function (result) {
              return result.json();
            }).then(function (data) {
              console.log(data);
              var filtered = [];

              if (!storageRes.serveyQuestions) {
                saveToStorage({
                  serveyQuestions: data.data
                });
                return;
              }

              var _iterator = _createForOfIteratorHelper(data.data),
                  _step;

              try {
                var _loop = function _loop() {
                  var d = _step.value;
                  var found = storageRes.serveyQuestions.find(function (s) {
                    return s.question === d.question;
                  });

                  if (!found) {
                    filtered.push(d);
                  }
                };

                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  _loop();
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

              if (filtered.length > 0) {
                storageRes.serveyQuestions = [].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(storageRes.serveyQuestions), filtered);
                saveToStorage({
                  serveyQuestions: storageRes.serveyQuestions
                });
              }
            })["catch"](function (err) {
              return console.log(err);
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getServey() {
    return _ref3.apply(this, arguments);
  };
}();

var answerServey = function answerServey(data) {
  return new Promise( /*#__PURE__*/function () {
    var _ref4 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee4(resolve) {
      var storageRes, raw, res, _iterator2, _step2, _loop2;

      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return getFromStorage(["userId", "serveyQuestions"]);

            case 2:
              storageRes = _context4.sent;
              raw = JSON.stringify({
                userId: storageRes.userId,
                type: "serveyAnswers",
                servey: data
              });
              _context4.next = 6;
              return postData(raw);

            case 6:
              res = _context4.sent;
              _iterator2 = _createForOfIteratorHelper(data);

              try {
                _loop2 = function _loop2() {
                  var answered = _step2.value;
                  var index = storageRes.serveyQuestions.indexOf(storageRes.serveyQuestions.find(function (s) {
                    return s.question === answered.question;
                  }));
                  storageRes.serveyQuestions[index].answer = answered.answer;
                };

                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  _loop2();
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }

              saveToStorage({
                serveyQuestions: storageRes.serveyQuestions
              });
              resolve(res);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }());
};

var getHistory = function getHistory() {
  return new Promise( /*#__PURE__*/function () {
    var _ref5 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee5(resolve) {
      var storageRes;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return getFromStorage("history");

            case 2:
              storageRes = _context5.sent;
              // console.log(storageRes);
              if (storageRes.history) resolve(storageRes.history);

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x4) {
      return _ref5.apply(this, arguments);
    };
  }());
};

var postData = function postData(data) {
  console.log(data);
  return new Promise(function (resolve) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: data,
      redirect: "follow"
    };
    fetch(APIURL, requestOptions).then(function (response) {
      return response.json();
    }).then(function (result) {
      return resolve(result);
    })["catch"](function (error) {
      return console.log("error", error);
    });
  });
};

var authUser = function authUser(userId) {
  return new Promise( /*#__PURE__*/function () {
    var _ref6 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee6(resolve) {
      var raw, res;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              raw = JSON.stringify({
                userId: userId,
                type: "authUser"
              });
              _context6.next = 3;
              return postData(raw);

            case 3:
              res = _context6.sent;
              resolve(res);

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x5) {
      return _ref6.apply(this, arguments);
    };
  }());
};

var uploadHistory = function uploadHistory(data) {
  return new Promise( /*#__PURE__*/function () {
    var _ref7 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee7(resolve) {
      var storageRes, raw, done, _iterator3, _step3, _loop3;

      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return getFromStorage(["userId", "history"]);

            case 2:
              storageRes = _context7.sent;

              if (!(storageRes.userId && storageRes.history)) {
                _context7.next = 13;
                break;
              }

              raw = JSON.stringify({
                userId: storageRes.userId,
                history: data,
                type: "uploadHistory"
              });
              console.log(raw);
              _context7.next = 8;
              return postData(raw);

            case 8:
              done = _context7.sent;
              resolve(done);
              _iterator3 = _createForOfIteratorHelper(storageRes.history);

              try {
                _loop3 = function _loop3() {
                  var h = _step3.value;
                  var found = data.find(function (d) {
                    return d.url === h.url && d.date === h.date;
                  });
                  if (found) h.submitted = true;
                };

                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  _loop3();
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }

              saveToStorage({
                history: storageRes.history
              });

            case 13:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x6) {
      return _ref7.apply(this, arguments);
    };
  }());
};

var saveToStorage = function saveToStorage(obj) {
  return new Promise(function (resolve) {
    chrome.storage.local.set(obj, function (res) {
      return resolve(true);
    });
  });
};

var getFromStorage = function getFromStorage(arr) {
  return new Promise(function (resolve) {
    chrome.storage.local.get(arr, function (res) {
      return resolve(res);
    });
  });
};

chrome.runtime.onInstalled.addListener(function () {
  var defSettings = {
    firstTime: true,
    userId: null,
    credits: 0,
    balance: 0,
    history: [],
    weekTwoKeywords: [],
    whitelistedKeywords: [],
    searchHistoryCheck: true,
    staticResult: staticResult,
    submittedKeywords: []
  };
  saveToStorage(defSettings);
});
chrome.action.onClicked.addListener(function (tab) {
  openWindow();
});
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log(msg);

  if (msg.command === "search") {
    (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee8() {
      var serpRes;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return googleSearch(msg.data);

            case 2:
              serpRes = _context8.sent;
              sendResponse(serpRes);

            case 4:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }))();
  }

  if (msg.command === "getHistory") {
    (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee9() {
      var history;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return getHistory();

            case 2:
              history = _context9.sent;
              sendResponse(history);

            case 4:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }))();
  }

  if (msg.command === "createUser") {
    createUser(msg.data);
  }

  if (msg.command === "uploadHistory") {
    (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee10() {
      var res;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return uploadHistory(msg.history);

            case 2:
              res = _context10.sent;
              sendResponse(res);

            case 4:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }))();
  }

  if (msg.command === "authUser") {
    (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee11() {
      var res;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return authUser(msg.userId);

            case 2:
              res = _context11.sent;
              sendResponse(res);

            case 4:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }))();
  }

  if (msg.command === "googleSearch") {
    console.log(msg.data);
  }

  if (msg.command === "openLink") {
    chrome.tabs.create({
      url: msg.url
    });
  }

  if (msg.command === "submitTask") {
    submitTask(msg.task);
  }

  if (msg.command === "answerServey") {
    (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee12() {
      var res;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              res = answerServey(msg.data);
              sendResponse(res);

            case 2:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }))();
  }

  if (msg.command === "init") {
    getServey();
  }

  return true;
});

var openWindow = function openWindow() {
  chrome.windows.getCurrent(function (tabWindow) {
    var width = 760;
    var height = 478;
    var left = Math.round((tabWindow.width - width) * 0.5 + tabWindow.left);
    var top = Math.round((tabWindow.height - height) * 0.5 + tabWindow.top);
    chrome.windows.create({
      focused: true,
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: width,
      height: height,
      left: left,
      top: top
    });
  });
}; ///////


var init = function init() {
  getBrowsingWeek();
  getWeek2();
  getServey();
};

init();
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZixNQUFNO0FBQ04sZUFBZTtBQUNmO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQ7QUFDMUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0MsV0FBVztBQUNuRDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFVBQVU7QUFDVjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUNBQXFDLGNBQWM7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLG1CQUFtQjtBQUNwRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGdCQUFnQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUEsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7QUFDRDtB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YWJlbC9ydW50aW1lL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vZ3VpbGxhdW1lYmFyMzIyLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL3JlZ2VuZXJhdG9yL2luZGV4LmpzIiwid2VicGFjazovL2d1aWxsYXVtZWJhcjMyMi8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9hcnJheUxpa2VUb0FycmF5LmpzIiwid2VicGFjazovL2d1aWxsYXVtZWJhcjMyMi8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9hcnJheVdpdGhvdXRIb2xlcy5qcyIsIndlYnBhY2s6Ly9ndWlsbGF1bWViYXIzMjIvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vYXN5bmNUb0dlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly9ndWlsbGF1bWViYXIzMjIvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vaXRlcmFibGVUb0FycmF5LmpzIiwid2VicGFjazovL2d1aWxsYXVtZWJhcjMyMi8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9ub25JdGVyYWJsZVNwcmVhZC5qcyIsIndlYnBhY2s6Ly9ndWlsbGF1bWViYXIzMjIvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdG9Db25zdW1hYmxlQXJyYXkuanMiLCJ3ZWJwYWNrOi8vZ3VpbGxhdW1lYmFyMzIyLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5LmpzIiwid2VicGFjazovL2d1aWxsYXVtZWJhcjMyMi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9ndWlsbGF1bWViYXIzMjIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZ3VpbGxhdW1lYmFyMzIyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9ndWlsbGF1bWViYXIzMjIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9ndWlsbGF1bWViYXIzMjIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9ndWlsbGF1bWViYXIzMjIvLi9zcmMvYmFja2dyb3VuZC5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIGRlZmluZShvYmosIGtleSwgdmFsdWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBvYmpba2V5XTtcbiAgfVxuICB0cnkge1xuICAgIC8vIElFIDggaGFzIGEgYnJva2VuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGF0IG9ubHkgd29ya3Mgb24gRE9NIG9iamVjdHMuXG4gICAgZGVmaW5lKHt9LCBcIlwiKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZGVmaW5lID0gZnVuY3Rpb24ob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgICByZXR1cm4gb2JqW2tleV0gPSB2YWx1ZTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgZXhwb3J0cy53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgZGVmaW5lKEl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBkZWZpbmUoR3AsIFwiY29uc3RydWN0b3JcIiwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICBkZWZpbmUoR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUsIFwiY29uc3RydWN0b3JcIiwgR2VuZXJhdG9yRnVuY3Rpb24pO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IGRlZmluZShcbiAgICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSxcbiAgICB0b1N0cmluZ1RhZ1N5bWJvbCxcbiAgICBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgKTtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBkZWZpbmUocHJvdG90eXBlLCBtZXRob2QsIGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBkZWZpbmUoZ2VuRnVuLCB0b1N0cmluZ1RhZ1N5bWJvbCwgXCJHZW5lcmF0b3JGdW5jdGlvblwiKTtcbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgZXhwb3J0cy5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yLCBQcm9taXNlSW1wbCkge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAvLyBJZiBhIHJlamVjdGVkIFByb21pc2Ugd2FzIHlpZWxkZWQsIHRocm93IHRoZSByZWplY3Rpb24gYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgaGFuZGxlZCB0aGVyZS5cbiAgICAgICAgICByZXR1cm4gaW52b2tlKFwidGhyb3dcIiwgZXJyb3IsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlSW1wbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIGRlZmluZShBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSwgYXN5bmNJdGVyYXRvclN5bWJvbCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgIGlmIChQcm9taXNlSW1wbCA9PT0gdm9pZCAwKSBQcm9taXNlSW1wbCA9IFByb21pc2U7XG5cbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksXG4gICAgICBQcm9taXNlSW1wbFxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgZGVmaW5lKEdwLCB0b1N0cmluZ1RhZ1N5bWJvbCwgXCJHZW5lcmF0b3JcIik7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBkZWZpbmUoR3AsIGl0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgZGVmaW5lKEdwLCBcInRvU3RyaW5nXCIsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9KTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCBpbiBtb2Rlcm4gZW5naW5lc1xuICAvLyB3ZSBjYW4gZXhwbGljaXRseSBhY2Nlc3MgZ2xvYmFsVGhpcy4gSW4gb2xkZXIgZW5naW5lcyB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBnbG9iYWxUaGlzLnJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG4gIH0gZWxzZSB7XG4gICAgRnVuY3Rpb24oXCJyXCIsIFwicmVnZW5lcmF0b3JSdW50aW1lID0gclwiKShydW50aW1lKTtcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVnZW5lcmF0b3ItcnVudGltZVwiKTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykge1xuICAgIGFycjJbaV0gPSBhcnJbaV07XG4gIH1cblxuICByZXR1cm4gYXJyMjtcbn0iLCJpbXBvcnQgYXJyYXlMaWtlVG9BcnJheSBmcm9tIFwiLi9hcnJheUxpa2VUb0FycmF5LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KGFycik7XG59IiwiZnVuY3Rpb24gYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBrZXksIGFyZykge1xuICB0cnkge1xuICAgIHZhciBpbmZvID0gZ2VuW2tleV0oYXJnKTtcbiAgICB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlamVjdChlcnJvcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGluZm8uZG9uZSkge1xuICAgIHJlc29sdmUodmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihfbmV4dCwgX3Rocm93KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfYXN5bmNUb0dlbmVyYXRvcihmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGdlbiA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuXG4gICAgICBmdW5jdGlvbiBfbmV4dCh2YWx1ZSkge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwibmV4dFwiLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIF90aHJvdyhlcnIpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcInRocm93XCIsIGVycik7XG4gICAgICB9XG5cbiAgICAgIF9uZXh0KHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH07XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGl0ZXJbU3ltYm9sLml0ZXJhdG9yXSAhPSBudWxsIHx8IGl0ZXJbXCJAQGl0ZXJhdG9yXCJdICE9IG51bGwpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59IiwiaW1wb3J0IGFycmF5V2l0aG91dEhvbGVzIGZyb20gXCIuL2FycmF5V2l0aG91dEhvbGVzLmpzXCI7XG5pbXBvcnQgaXRlcmFibGVUb0FycmF5IGZyb20gXCIuL2l0ZXJhYmxlVG9BcnJheS5qc1wiO1xuaW1wb3J0IHVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5IGZyb20gXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5LmpzXCI7XG5pbXBvcnQgbm9uSXRlcmFibGVTcHJlYWQgZnJvbSBcIi4vbm9uSXRlcmFibGVTcHJlYWQuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHtcbiAgcmV0dXJuIGFycmF5V2l0aG91dEhvbGVzKGFycikgfHwgaXRlcmFibGVUb0FycmF5KGFycikgfHwgdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBub25JdGVyYWJsZVNwcmVhZCgpO1xufSIsImltcG9ydCBhcnJheUxpa2VUb0FycmF5IGZyb20gXCIuL2FycmF5TGlrZVRvQXJyYXkuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHtcbiAgaWYgKCFvKSByZXR1cm47XG4gIGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbiAgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpO1xuICBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lO1xuICBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTtcbiAgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGU7IH07XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImNvbnN0IEFQSVVSTCA9XG4gIFwiaHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4cW1CTWI1TmtLOHUxSkt2T0hRTUU5ZkhDdXR4RzRzWlZSMl92RGZHZklkT25TMkFSUlJXVFRoZUlhSUx1UmRZZ1BuQS9leGVjXCI7XG5jb25zdCBzZXJwQVBJS0VZID1cbiAgXCJlZGU5ZGEzODJhMGU5MDJhMDBkMThiYjUyZDJlYzkxZDE3NjYxODc2NjNkNzgyYmY3ZDhlMGYyMDEzMDE2YWEzXCI7XG5cbmNvbnN0IHN0YXRpY1Jlc3VsdCA9IFtcbiAge1xuICAgIHBvc2l0aW9uOiAxLFxuICAgIHRpdGxlOiBcIkNvZmZlZSAtIFdpa2lwZWRpYVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29mZmVlXCIsXG4gICAgZGlzcGxheWVkX2xpbms6IFwiaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnIOKAuiB3aWtpIOKAuiBDb2ZmZWVcIixcbiAgICB0aHVtYm5haWw6XG4gICAgICBcImh0dHBzOi8vc2VycGFwaS5jb20vc2VhcmNoZXMvNjJjMWJhOWVmNTVkNzc0ZGZkMDE4YTAzL2ltYWdlcy9iN2NjNjdhMmI3OGRiYjQ2N2ZkNzNkYTNhNWM4M2RlMzNmMTA3NWM3MzlmODQyMmE5ZjM2YmQwNWJkZDBjYTlmLmpwZWdcIixcbiAgICBzbmlwcGV0OlxuICAgICAgXCJDb2ZmZWUgaXMgYSBicmV3ZWQgZHJpbmsgcHJlcGFyZWQgZnJvbSByb2FzdGVkIGNvZmZlZSBiZWFucywgdGhlIHNlZWRzIG9mIGJlcnJpZXMgZnJvbSBjZXJ0YWluIGZsb3dlcmluZyBwbGFudHMgaW4gdGhlIENvZmZlYSBnZW51cy4gRnJvbSB0aGUgY29mZmVlIGZydWl0LCAuLi5cIixcbiAgICBzbmlwcGV0X2hpZ2hsaWdodGVkX3dvcmRzOiBbXCJDb2ZmZWVcIiwgXCJjb2ZmZWVcIiwgXCJjb2ZmZWVcIl0sXG4gICAgc2l0ZWxpbmtzOiB7XG4gICAgICBpbmxpbmU6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRpdGxlOiBcIkNvZmZlZSBiZWFuXCIsXG4gICAgICAgICAgbGluazogXCJodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db2ZmZWVfYmVhblwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGl0bGU6IFwiSGlzdG9yeVwiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSGlzdG9yeV9vZl9jb2ZmZWVcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRpdGxlOiBcIkNvZmZlZSBwcmVwYXJhdGlvblwiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29mZmVlX3ByZXBhcmF0aW9uXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogXCJDb2ZmZWUgcHJvZHVjdGlvblwiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29mZmVlX3Byb2R1Y3Rpb25cIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICByaWNoX3NuaXBwZXQ6IHtcbiAgICAgIGJvdHRvbToge1xuICAgICAgICBleHRlbnNpb25zOiBbXG4gICAgICAgICAgXCJSZWdpb24gb2Ygb3JpZ2luOiBIb3JuIG9mIEFmcmljYSBhbmQg4oCOU291dGggQXJhLi4u4oCOXCIsXG4gICAgICAgICAgXCJDb2xvcjogQmxhY2ssIGRhcmsgYnJvd24sIGxpZ2h0IGJyb3duLCBiZWlnZVwiLFxuICAgICAgICAgIFwiSW50cm9kdWNlZDogMTV0aCBjZW50dXJ5XCIsXG4gICAgICAgIF0sXG4gICAgICAgIGRldGVjdGVkX2V4dGVuc2lvbnM6IHtcbiAgICAgICAgICBpbnRyb2R1Y2VkX3RoX2NlbnR1cnk6IDE1LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGFib3V0X3RoaXNfcmVzdWx0OiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJXaWtpcGVkaWEgaXMgYSBtdWx0aWxpbmd1YWwgZnJlZSBvbmxpbmUgZW5jeWNsb3BlZGlhIHdyaXR0ZW4gYW5kIG1haW50YWluZWQgYnkgYSBjb21tdW5pdHkgb2Ygdm9sdW50ZWVycyB0aHJvdWdoIG9wZW4gY29sbGFib3JhdGlvbiBhbmQgYSB3aWtpLWJhc2VkIGVkaXRpbmcgc3lzdGVtLiBJbmRpdmlkdWFsIGNvbnRyaWJ1dG9ycywgYWxzbyBjYWxsZWQgZWRpdG9ycywgYXJlIGtub3duIGFzIFdpa2lwZWRpYW5zLiBXaWtpcGVkaWEgaXMgdGhlIGxhcmdlc3QgYW5kIG1vc3QtcmVhZCByZWZlcmVuY2Ugd29yayBpbiBoaXN0b3J5LlwiLFxuICAgICAgICBpY29uOiBcImh0dHBzOi8vc2VycGFwaS5jb20vc2VhcmNoZXMvNjJjMWJhOWVmNTVkNzc0ZGZkMDE4YTAzL2ltYWdlcy9iN2NjNjdhMmI3OGRiYjQ2N2ZkNzNkYTNhNWM4M2RlM2E5OTFjNjA0MzJkYjQ0MzdkNTNhMzc4ODc0ZGY1ZmQzYzhlZWU3M2UxNmU2YjJiYWY3N2FiYTNiMTMzNmI2YjYucG5nXCIsXG4gICAgICB9LFxuICAgICAga2V5d29yZHM6IFtcImNvZmZlZVwiXSxcbiAgICAgIGxhbmd1YWdlczogW1wiRW5nbGlzaFwiXSxcbiAgICAgIHJlZ2lvbnM6IFtcInRoZSBVbml0ZWQgU3RhdGVzXCJdLFxuICAgIH0sXG4gICAgYWJvdXRfcGFnZV9saW5rOlxuICAgICAgXCJodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPUFib3V0K2h0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvZmZlZSZ0Ym09aWxwJmlscHM9QUROTUNpMHRWaFNCLWZHSE9KWWdySXhCMHhsWFlyUEdQQVwiLFxuICAgIGNhY2hlZF9wYWdlX2xpbms6XG4gICAgICBcImh0dHBzOi8vd2ViY2FjaGUuZ29vZ2xldXNlcmNvbnRlbnQuY29tL3NlYXJjaD9xPWNhY2hlOlU2b0pNbkYtZWVVSjpodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db2ZmZWUrJmNkPTE0JmhsPWVuJmN0PWNsbmsmZ2w9dXNcIixcbiAgICByZWxhdGVkX3BhZ2VzX2xpbms6XG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9cmVsYXRlZDpodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db2ZmZWUrQ29mZmVlXCIsXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjogMixcbiAgICB0aXRsZTogXCJUaGUgQ29mZmVlIEJlYW4gJiBUZWEgTGVhZiB8IENCVExcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmNvZmZlZWJlYW4uY29tL1wiLFxuICAgIGRpc3BsYXllZF9saW5rOiBcImh0dHBzOi8vd3d3LmNvZmZlZWJlYW4uY29tXCIsXG4gICAgc25pcHBldDpcbiAgICAgIFwiQm9ybiBhbmQgYnJld2VkIGluIFNvdXRoZXJuIENhbGlmb3JuaWEgc2luY2UgMTk2MywgVGhlIENvZmZlZSBCZWFuICYgVGVhIExlYWbCriBpcyBwYXNzaW9uYXRlIGFib3V0IGNvbm5lY3RpbmcgbG95YWwgY3VzdG9tZXJzIHdpdGggY2FyZWZ1bGx5IGhhbmRjcmFmdGVkIC4uLlwiLFxuICAgIHNuaXBwZXRfaGlnaGxpZ2h0ZWRfd29yZHM6IFtcIkNvZmZlZVwiXSxcbiAgICBhYm91dF90aGlzX3Jlc3VsdDoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgIFwiVGhlIENvZmZlZSBCZWFuICYgVGVhIExlYWYgaXMgYW4gQW1lcmljYW4gY29mZmVlIHNob3AgY2hhaW4gZm91bmRlZCBpbiAxOTYzLiBTaW5jZSAyMDE5LCBpdCBpcyBhIHRyYWRlIG5hbWUgb2YgSXJlbGFuZC1iYXNlZCBTdXBlciBNYWduaWZpY2VudCBDb2ZmZWUgQ29tcGFueSBJcmVsYW5kIExpbWl0ZWQsIGl0c2VsZiB3aG9sbHkgb3duZWQgc3Vic2lkaWFyeSBvZiBtdWx0aW5hdGlvbmFsIEpvbGxpYmVlIEZvb2RzIENvcnBvcmF0aW9uLlwiLFxuICAgICAgICBpY29uOiBcImh0dHBzOi8vc2VycGFwaS5jb20vc2VhcmNoZXMvNjJjMWJhOWVmNTVkNzc0ZGZkMDE4YTAzL2ltYWdlcy9iN2NjNjdhMmI3OGRiYjQ2N2ZkNzNkYTNhNWM4M2RlMzdmNGRkNDk0ODU1MjhmZTdiMjFkZTQ3NWQyMTA3MTI2ZDEzMjJiYzM0ZGNhOWIzZjYwZjFjNDIxNDhjZTJkNGUucG5nXCIsXG4gICAgICB9LFxuICAgICAga2V5d29yZHM6IFtcImNvZmZlZVwiXSxcbiAgICAgIGxhbmd1YWdlczogW1wiRW5nbGlzaFwiXSxcbiAgICAgIHJlZ2lvbnM6IFtcInRoZSBVbml0ZWQgU3RhdGVzXCJdLFxuICAgIH0sXG4gICAgYWJvdXRfcGFnZV9saW5rOlxuICAgICAgXCJodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPUFib3V0K2h0dHBzOi8vd3d3LmNvZmZlZWJlYW4uY29tLyZ0Ym09aWxwJmlscHM9QUROTUNpMm9TWUI1V3FuaG1uZmxTODZPZE1kcGpNeno5Z1wiLFxuICAgIGNhY2hlZF9wYWdlX2xpbms6XG4gICAgICBcImh0dHBzOi8vd2ViY2FjaGUuZ29vZ2xldXNlcmNvbnRlbnQuY29tL3NlYXJjaD9xPWNhY2hlOldwUXhTWW8yYzZBSjpodHRwczovL3d3dy5jb2ZmZWViZWFuLmNvbS8rJmNkPTE1JmhsPWVuJmN0PWNsbmsmZ2w9dXNcIixcbiAgICByZWxhdGVkX3BhZ2VzX2xpbms6XG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9cmVsYXRlZDpodHRwczovL3d3dy5jb2ZmZWViZWFuLmNvbS8rQ29mZmVlXCIsXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjogMyxcbiAgICB0aXRsZTogXCJUaGUgSGlzdG9yeSBvZiBDb2ZmZWUgLSBOYXRpb25hbCBDb2ZmZWUgQXNzb2NpYXRpb25cIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3Lm5jYXVzYS5vcmcvYWJvdXQtY29mZmVlL2hpc3Rvcnktb2YtY29mZmVlXCIsXG4gICAgZGlzcGxheWVkX2xpbms6IFwiaHR0cHM6Ly93d3cubmNhdXNhLm9yZyDigLogLi4uIOKAuiBIaXN0b3J5IG9mIENvZmZlZVwiLFxuICAgIHNuaXBwZXQ6XG4gICAgICBcIkNvZmZlZSBncm93biB3b3JsZHdpZGUgY2FuIHRyYWNlIGl0cyBoZXJpdGFnZSBiYWNrIGNlbnR1cmllcyB0byB0aGUgYW5jaWVudCBjb2ZmZWUgZm9yZXN0cyBvbiB0aGUgRXRoaW9waWFuIHBsYXRlYXUuIFRoZXJlLCBsZWdlbmQgc2F5cyB0aGUgZ29hdCBoZXJkZXIgLi4uXCIsXG4gICAgc25pcHBldF9oaWdobGlnaHRlZF93b3JkczogW1wiQ29mZmVlXCIsIFwiY29mZmVlXCJdLFxuICAgIHNpdGVsaW5rczoge1xuICAgICAgaW5saW5lOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogXCJBbiBFdGhpb3BpYW4gTGVnZW5kXCIsXG4gICAgICAgICAgbGluazogXCJodHRwczovL3d3dy5uY2F1c2Eub3JnL2Fib3V0LWNvZmZlZS9oaXN0b3J5LW9mLWNvZmZlZSM6fjp0ZXh0PUFuJTIwRXRoaW9waWFuJTIwTGVnZW5kXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogXCJUaGUgQXJhYmlhbiBQZW5pbnN1bGFcIixcbiAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vd3d3Lm5jYXVzYS5vcmcvYWJvdXQtY29mZmVlL2hpc3Rvcnktb2YtY29mZmVlIzp+OnRleHQ9VGhlJTIwQXJhYmlhbiUyMFBlbmluc3VsYSwtQ29mZmVlJTIwY3VsdGl2YXRpb24lMjBhbmQlMjB0cmFkZSUyMGJlZ2FuXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogXCJDb2ZmZWUgQ29tZXMgVG8gRXVyb3BlXCIsXG4gICAgICAgICAgbGluazogXCJodHRwczovL3d3dy5uY2F1c2Eub3JnL2Fib3V0LWNvZmZlZS9oaXN0b3J5LW9mLWNvZmZlZSM6fjp0ZXh0PUNvZmZlZSUyMENvbWVzJTIwdG8lMjBFdXJvcGVcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBhYm91dF90aGlzX3Jlc3VsdDoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgIFwiVGhlIE5hdGlvbmFsIENvZmZlZSBBc3NvY2lhdGlvbiBvciwgaXMgdGhlIG1haW4gbWFya2V0IHJlc2VhcmNoLCBjb25zdW1lciBpbmZvcm1hdGlvbiwgYW5kIGxvYmJ5aW5nIGFzc29jaWF0aW9uIGZvciB0aGUgY29mZmVlIGluZHVzdHJ5IGluIHRoZSBVbml0ZWQgU3RhdGVzLlwiLFxuICAgICAgfSxcbiAgICAgIGtleXdvcmRzOiBbXCJjb2ZmZWVcIl0sXG4gICAgICBsYW5ndWFnZXM6IFtcIkVuZ2xpc2hcIl0sXG4gICAgICByZWdpb25zOiBbXCJ0aGUgVW5pdGVkIFN0YXRlc1wiXSxcbiAgICB9LFxuICAgIGFib3V0X3BhZ2VfbGluazpcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1BYm91dCtodHRwczovL3d3dy5uY2F1c2Eub3JnL2Fib3V0LWNvZmZlZS9oaXN0b3J5LW9mLWNvZmZlZSZ0Ym09aWxwJmlscHM9QUROTUNpMlQ2S1VfN2VIRVY0RXpaUzFFbkxyUVZ3RDUzQVwiLFxuICAgIGNhY2hlZF9wYWdlX2xpbms6XG4gICAgICBcImh0dHBzOi8vd2ViY2FjaGUuZ29vZ2xldXNlcmNvbnRlbnQuY29tL3NlYXJjaD9xPWNhY2hlOnYxaHAwU1M4V2dnSjpodHRwczovL3d3dy5uY2F1c2Eub3JnL2Fib3V0LWNvZmZlZS9oaXN0b3J5LW9mLWNvZmZlZSsmY2Q9MTYmaGw9ZW4mY3Q9Y2xuayZnbD11c1wiLFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IDQsXG4gICAgdGl0bGU6IFwiOSBIZWFsdGggQmVuZWZpdHMgb2YgQ29mZmVlLCBCYXNlZCBvbiBTY2llbmNlIC0gSGVhbHRobGluZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuaGVhbHRobGluZS5jb20vbnV0cml0aW9uL3RvcC1ldmlkZW5jZS1iYXNlZC1oZWFsdGgtYmVuZWZpdHMtb2YtY29mZmVlXCIsXG4gICAgZGlzcGxheWVkX2xpbms6XG4gICAgICBcImh0dHBzOi8vd3d3LmhlYWx0aGxpbmUuY29tIOKAuiBudXRyaXRpb24g4oC6IHRvcC1ldmlkZW5jZS1iLi4uXCIsXG4gICAgc25pcHBldDpcbiAgICAgIFwiQ29mZmVlIGlzIGEgbWFqb3Igc291cmNlIG9mIGFudGlveGlkYW50cyBpbiB0aGUgZGlldC4gSXQgaGFzIG1hbnkgaGVhbHRoIGJlbmVmaXRzLCBzdWNoIGFzIGltcHJvdmVkIGJyYWluIGZ1bmN0aW9uIGFuZCBhIGxvd2VyIHJpc2sgb2Ygc2V2ZXJhbCBkaXNlYXNlcy5cIixcbiAgICBzbmlwcGV0X2hpZ2hsaWdodGVkX3dvcmRzOiBbXCJDb2ZmZWVcIl0sXG4gICAgc2l0ZWxpbmtzOiB7XG4gICAgICBpbmxpbmU6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRpdGxlOiBcIjEuIEJvb3N0cyBFbmVyZ3kgTGV2ZWxzXCIsXG4gICAgICAgICAgbGluazogXCJodHRwczovL3d3dy5oZWFsdGhsaW5lLmNvbS9udXRyaXRpb24vdG9wLWV2aWRlbmNlLWJhc2VkLWhlYWx0aC1iZW5lZml0cy1vZi1jb2ZmZWUjOn46dGV4dD0xLiUyMEJvb3N0cyUyMGVuZXJneSUyMGxldmVsc1wiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGl0bGU6IFwiMi4gTWF5IEJlIExpbmtlZCBUbyBBIExvd2VyLi4uXCIsXG4gICAgICAgICAgbGluazogXCJodHRwczovL3d3dy5oZWFsdGhsaW5lLmNvbS9udXRyaXRpb24vdG9wLWV2aWRlbmNlLWJhc2VkLWhlYWx0aC1iZW5lZml0cy1vZi1jb2ZmZWUjOn46dGV4dD0yLiUyME1heSUyMGJlJTIwbGlua2VkJTIwdG8lMjBhJTIwbG93ZXIlMjByaXNrJTIwb2YlMjB0eXBlJTIwMiUyMGRpYWJldGVzXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogXCIzLiBDb3VsZCBTdXBwb3J0IEJyYWluLi4uXCIsXG4gICAgICAgICAgbGluazogXCJodHRwczovL3d3dy5oZWFsdGhsaW5lLmNvbS9udXRyaXRpb24vdG9wLWV2aWRlbmNlLWJhc2VkLWhlYWx0aC1iZW5lZml0cy1vZi1jb2ZmZWUjOn46dGV4dD0zLiUyMENvdWxkJTIwc3VwcG9ydCUyMGJyYWluJTIwaGVhbHRoXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgYWJvdXRfdGhpc19yZXN1bHQ6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIkhlYWx0aGxpbmUgTWVkaWEsIEluYy4gaXMgYW4gQW1lcmljYW4gd2Vic2l0ZSBhbmQgcHJvdmlkZXIgb2YgaGVhbHRoIGluZm9ybWF0aW9uIGhlYWRxdWFydGVyZWQgaW4gU2FuIEZyYW5jaXNjbywgQ2FsaWZvcm5pYS4gSXQgd2FzIGZvdW5kZWQgaW4gaXRzIGN1cnJlbnQgZm9ybSAyMDA2IGFuZCBlc3RhYmxpc2hlZCBhcyBhIHN0YW5kYWxvbmUgZW50aXR5IGluIEphbnVhcnkgMjAxNi5cIixcbiAgICAgICAgaWNvbjogXCJodHRwczovL3NlcnBhcGkuY29tL3NlYXJjaGVzLzYyYzFiYTllZjU1ZDc3NGRmZDAxOGEwMy9pbWFnZXMvYjdjYzY3YTJiNzhkYmI0NjdmZDczZGEzYTVjODNkZTMzOWMyYjhkYzJkMTdmMjM1NjdjNzdlMGJiYzJmMDE0Mzg2ZmIyNTE4MmE2NGNlOWZlNzkwMDJkM2UxOWEzN2U0LnBuZ1wiLFxuICAgICAgfSxcbiAgICAgIGtleXdvcmRzOiBbXCJjb2ZmZWVcIl0sXG4gICAgICBsYW5ndWFnZXM6IFtcIkVuZ2xpc2hcIl0sXG4gICAgICByZWdpb25zOiBbXCJ0aGUgVW5pdGVkIFN0YXRlc1wiXSxcbiAgICB9LFxuICAgIGFib3V0X3BhZ2VfbGluazpcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1BYm91dCtodHRwczovL3d3dy5oZWFsdGhsaW5lLmNvbS9udXRyaXRpb24vdG9wLWV2aWRlbmNlLWJhc2VkLWhlYWx0aC1iZW5lZml0cy1vZi1jb2ZmZWUmdGJtPWlscCZpbHBzPUFETk1DaTAwNXpQMzRMb1ZsZ3RTWWNUM2s2ZXA0SGdaUFFcIixcbiAgICBjYWNoZWRfcGFnZV9saW5rOlxuICAgICAgXCJodHRwczovL3dlYmNhY2hlLmdvb2dsZXVzZXJjb250ZW50LmNvbS9zZWFyY2g/cT1jYWNoZTpyMVVXNkZHejNGNEo6aHR0cHM6Ly93d3cuaGVhbHRobGluZS5jb20vbnV0cml0aW9uL3RvcC1ldmlkZW5jZS1iYXNlZC1oZWFsdGgtYmVuZWZpdHMtb2YtY29mZmVlKyZjZD0xNyZobD1lbiZjdD1jbG5rJmdsPXVzXCIsXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjogNSxcbiAgICB0aXRsZTogXCJjb2ZmZWUgfCBPcmlnaW4sIFR5cGVzLCBVc2VzLCBIaXN0b3J5LCAmIEZhY3RzIHwgQnJpdGFubmljYVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuYnJpdGFubmljYS5jb20vdG9waWMvY29mZmVlXCIsXG4gICAgZGlzcGxheWVkX2xpbms6IFwiaHR0cHM6Ly93d3cuYnJpdGFubmljYS5jb20g4oC6IC4uLiDigLogRm9vZFwiLFxuICAgIGRhdGU6IFwiTWF5IDE3LCAyMDIyXCIsXG4gICAgc25pcHBldDpcbiAgICAgIFwiY29mZmVlLCBiZXZlcmFnZSBicmV3ZWQgZnJvbSB0aGUgcm9hc3RlZCBhbmQgZ3JvdW5kIHNlZWRzIG9mIHRoZSB0cm9waWNhbCBldmVyZ3JlZW4gY29mZmVlIHBsYW50cyBvZiBBZnJpY2FuIG9yaWdpbi4gQ29mZmVlIGlzIG9uZSBvZiB0aGUgLi4uXCIsXG4gICAgc25pcHBldF9oaWdobGlnaHRlZF93b3JkczogW1wiY29mZmVlXCIsIFwiY29mZmVlXCIsIFwiQ29mZmVlXCJdLFxuICAgIGFib3V0X3RoaXNfcmVzdWx0OiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJicml0YW5uaWNhLmNvbSB3YXMgZmlyc3QgaW5kZXhlZCBieSBHb29nbGUgbW9yZSB0aGFuIDEwIHllYXJzIGFnb1wiLFxuICAgICAgICBpY29uOiBcImh0dHBzOi8vc2VycGFwaS5jb20vc2VhcmNoZXMvNjJjMWJhOWVmNTVkNzc0ZGZkMDE4YTAzL2ltYWdlcy9iN2NjNjdhMmI3OGRiYjQ2N2ZkNzNkYTNhNWM4M2RlM2Q5NGI5NjQyZjllNzNlYWU1MzEzOWQ2MjgwODVkODQwYzQ4M2Q3ODUxYTJkMzU5ZmEwYWQ5OTEzMDJkZDRkYzMucG5nXCIsXG4gICAgICB9LFxuICAgICAga2V5d29yZHM6IFtcImNvZmZlZVwiXSxcbiAgICAgIGxhbmd1YWdlczogW1wiRW5nbGlzaFwiXSxcbiAgICAgIHJlZ2lvbnM6IFtcInRoZSBVbml0ZWQgU3RhdGVzXCJdLFxuICAgIH0sXG4gICAgYWJvdXRfcGFnZV9saW5rOlxuICAgICAgXCJodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPUFib3V0K2h0dHBzOi8vd3d3LmJyaXRhbm5pY2EuY29tL3RvcGljL2NvZmZlZSZ0Ym09aWxwJmlscHM9QUROTUNpMHhHMkFCazVnOUJyQndpYXd4QnNCSE1Bd3I4QVwiLFxuICAgIGNhY2hlZF9wYWdlX2xpbms6XG4gICAgICBcImh0dHBzOi8vd2ViY2FjaGUuZ29vZ2xldXNlcmNvbnRlbnQuY29tL3NlYXJjaD9xPWNhY2hlOldpa2J1NGlwVTI4SjpodHRwczovL3d3dy5icml0YW5uaWNhLmNvbS90b3BpYy9jb2ZmZWUrJmNkPTE4JmhsPWVuJmN0PWNsbmsmZ2w9dXNcIixcbiAgICByZWxhdGVkX3BhZ2VzX2xpbms6XG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9cmVsYXRlZDpodHRwczovL3d3dy5icml0YW5uaWNhLmNvbS90b3BpYy9jb2ZmZWUrQ29mZmVlXCIsXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjogNixcbiAgICB0aXRsZTogXCJQZWV0J3MgQ29mZmVlOiBUaGUgT3JpZ2luYWwgQ3JhZnQgQ29mZmVlXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5wZWV0cy5jb20vXCIsXG4gICAgZGlzcGxheWVkX2xpbms6IFwiaHR0cHM6Ly93d3cucGVldHMuY29tXCIsXG4gICAgc25pcHBldDpcbiAgICAgIFwiU2luY2UgMTk2NiwgUGVldCdzIENvZmZlZSBoYXMgb2ZmZXJlZCBzdXBlcmlvciBjb2ZmZWVzIGFuZCB0ZWFzIGJ5IHNvdXJjaW5nIHRoZSBiZXN0IHF1YWxpdHkgY29mZmVlIGJlYW5zIGFuZCB0ZWEgbGVhdmVzIGluIHRoZSB3b3JsZCBhbmQgYWRoZXJpbmcgdG8gc3RyaWN0IC4uLlwiLFxuICAgIHNuaXBwZXRfaGlnaGxpZ2h0ZWRfd29yZHM6IFtcIkNvZmZlZVwiLCBcImNvZmZlZXNcIiwgXCJjb2ZmZWVcIl0sXG4gICAgYWJvdXRfdGhpc19yZXN1bHQ6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIlBlZXQncyBDb2ZmZWUgaXMgYSBTYW4gRnJhbmNpc2NvIEJheSBBcmVhLWJhc2VkIHNwZWNpYWx0eSBjb2ZmZWUgcm9hc3RlciBhbmQgcmV0YWlsZXIgb3duZWQgYnkgSkFCIEhvbGRpbmcgQ29tcGFueSB2aWEgSkRFIFBlZXQncy5cIixcbiAgICAgICAgaWNvbjogXCJodHRwczovL3NlcnBhcGkuY29tL3NlYXJjaGVzLzYyYzFiYTllZjU1ZDc3NGRmZDAxOGEwMy9pbWFnZXMvYjdjYzY3YTJiNzhkYmI0NjdmZDczZGEzYTVjODNkZTM3ZGY3MjVhNDM3ZjdjZTk3MzdlYjFkZDZiMzk5OTc3NzA2MzU1MjNiZjVlMjhmOTE0YTUxNDU0YzI3NjllMTYyLnBuZ1wiLFxuICAgICAgfSxcbiAgICAgIGtleXdvcmRzOiBbXCJjb2ZmZWVcIl0sXG4gICAgICByZWxhdGVkX2tleXdvcmRzOiBbXCJjb2ZmZWVzXCJdLFxuICAgICAgbGFuZ3VhZ2VzOiBbXCJFbmdsaXNoXCJdLFxuICAgICAgcmVnaW9uczogW1wiQ2FsaWZvcm5pYVwiXSxcbiAgICB9LFxuICAgIGFib3V0X3BhZ2VfbGluazpcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1BYm91dCtodHRwczovL3d3dy5wZWV0cy5jb20vJnRibT1pbHAmaWxwcz1BRE5NQ2kyeHFnaU1TekV5VHdnLVFld3VWUVlHY3R6Q2x3XCIsXG4gICAgY2FjaGVkX3BhZ2VfbGluazpcbiAgICAgIFwiaHR0cHM6Ly93ZWJjYWNoZS5nb29nbGV1c2VyY29udGVudC5jb20vc2VhcmNoP3E9Y2FjaGU6QkNqem5vNnpQNndKOmh0dHBzOi8vd3d3LnBlZXRzLmNvbS8rJmNkPTE5JmhsPWVuJmN0PWNsbmsmZ2w9dXNcIixcbiAgICByZWxhdGVkX3BhZ2VzX2xpbms6XG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9cmVsYXRlZDpodHRwczovL3d3dy5wZWV0cy5jb20vK0NvZmZlZVwiLFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IDcsXG4gICAgdGl0bGU6IFwiU3RhcmJ1Y2tzIENvZmZlZSBDb21wYW55XCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5zdGFyYnVja3MuY29tL1wiLFxuICAgIGRpc3BsYXllZF9saW5rOiBcImh0dHBzOi8vd3d3LnN0YXJidWNrcy5jb21cIixcbiAgICBzbmlwcGV0OlxuICAgICAgXCJNb3JlIHRoYW4ganVzdCBncmVhdCBjb2ZmZWUuIEV4cGxvcmUgdGhlIG1lbnUsIHNpZ24gdXAgZm9yIFN0YXJidWNrc8KuIFJld2FyZHMsIG1hbmFnZSB5b3VyIGdpZnQgY2FyZCBhbmQgbW9yZS5cIixcbiAgICBzbmlwcGV0X2hpZ2hsaWdodGVkX3dvcmRzOiBbXCJjb2ZmZWVcIl0sXG4gICAgYWJvdXRfdGhpc19yZXN1bHQ6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIlN0YXJidWNrcyBDb3Jwb3JhdGlvbiBpcyBhbiBBbWVyaWNhbiBtdWx0aW5hdGlvbmFsIGNoYWluIG9mIGNvZmZlZWhvdXNlcyBhbmQgcm9hc3RlcnkgcmVzZXJ2ZXMgaGVhZHF1YXJ0ZXJlZCBpbiBTZWF0dGxlLCBXYXNoaW5ndG9uLiBJdCBpcyB0aGUgd29ybGQncyBsYXJnZXN0IGNvZmZlZWhvdXNlIGNoYWluLlxcbkFzIG9mIE5vdmVtYmVyIDIwMjEsIHRoZSBjb21wYW55IGhhZCAzMyw4MzMgc3RvcmVzIGluIDgwIGNvdW50cmllcywgMTUsNDQ0IG9mIHdoaWNoIHdlcmUgbG9jYXRlZCBpbiB0aGUgVW5pdGVkIFN0YXRlcy5cIixcbiAgICAgICAgaWNvbjogXCJodHRwczovL3NlcnBhcGkuY29tL3NlYXJjaGVzLzYyYzFiYTllZjU1ZDc3NGRmZDAxOGEwMy9pbWFnZXMvYjdjYzY3YTJiNzhkYmI0NjdmZDczZGEzYTVjODNkZTNhZDkxNmIyNDdhNTMzNjBmMDg3N2JlZDllYmE1NWRkN2YwMmY0Y2MzYjAyOTQ4Yzk4MzQ5ZDIyN2I3ZTBjM2ExLnBuZ1wiLFxuICAgICAgfSxcbiAgICAgIGtleXdvcmRzOiBbXCJjb2ZmZWVcIl0sXG4gICAgICBsYW5ndWFnZXM6IFtcIkVuZ2xpc2hcIl0sXG4gICAgICByZWdpb25zOiBbXCJ0aGUgVW5pdGVkIFN0YXRlc1wiXSxcbiAgICB9LFxuICAgIGFib3V0X3BhZ2VfbGluazpcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1BYm91dCtodHRwczovL3d3dy5zdGFyYnVja3MuY29tLyZ0Ym09aWxwJmlscHM9QUROTUNpMGNNeVYwSDdLZEJsNGRfdmFjN3UwUjFvdUdZZ1wiLFxuICAgIGNhY2hlZF9wYWdlX2xpbms6XG4gICAgICBcImh0dHBzOi8vd2ViY2FjaGUuZ29vZ2xldXNlcmNvbnRlbnQuY29tL3NlYXJjaD9xPWNhY2hlOjF2R1hnb19GbEhrSjpodHRwczovL3d3dy5zdGFyYnVja3MuY29tLysmY2Q9MjAmaGw9ZW4mY3Q9Y2xuayZnbD11c1wiLFxuICAgIHJlbGF0ZWRfcGFnZXNfbGluazpcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1yZWxhdGVkOmh0dHBzOi8vd3d3LnN0YXJidWNrcy5jb20vK0NvZmZlZVwiLFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IDgsXG4gICAgdGl0bGU6IFwiQ29mZmVlIHwgVGhlIE51dHJpdGlvbiBTb3VyY2VcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmhzcGguaGFydmFyZC5lZHUvbnV0cml0aW9uc291cmNlL2Zvb2QtZmVhdHVyZXMvY29mZmVlL1wiLFxuICAgIGRpc3BsYXllZF9saW5rOiBcImh0dHBzOi8vd3d3LmhzcGguaGFydmFyZC5lZHUg4oC6IC4uLiDigLogRm9vZCBGZWF0dXJlc1wiLFxuICAgIHNuaXBwZXQ6XG4gICAgICBcIkNvZmZlZSBiZWFucyBhcmUgdGhlIHNlZWRzIG9mIGEgZnJ1aXQgY2FsbGVkIGEgY29mZmVlIGNoZXJyeS4gQ29mZmVlIGNoZXJyaWVzIGdyb3cgb24gY29mZmVlIHRyZWVzIGZyb20gYSBnZW51cyBvZiBwbGFudHMgY2FsbGVkIENvZmZlYS4gVGhlcmUgYXJlIGEgd2lkZSAuLi5cIixcbiAgICBzbmlwcGV0X2hpZ2hsaWdodGVkX3dvcmRzOiBbXCJDb2ZmZWVcIiwgXCJjb2ZmZWVcIiwgXCJDb2ZmZWVcIiwgXCJjb2ZmZWVcIl0sXG4gICAgc2l0ZWxpbmtzOiB7XG4gICAgICBpbmxpbmU6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRpdGxlOiBcIkNvZmZlZSBBbmQgSGVhbHRoXCIsXG4gICAgICAgICAgbGluazogXCJodHRwczovL3d3dy5oc3BoLmhhcnZhcmQuZWR1L251dHJpdGlvbnNvdXJjZS9mb29kLWZlYXR1cmVzL2NvZmZlZS8jOn46dGV4dD1Db2ZmZWUlMjBhbmQlMjBIZWFsdGhcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRpdGxlOiBcIlR5cGVzXCIsXG4gICAgICAgICAgbGluazogXCJodHRwczovL3d3dy5oc3BoLmhhcnZhcmQuZWR1L251dHJpdGlvbnNvdXJjZS9mb29kLWZlYXR1cmVzL2NvZmZlZS8jOn46dGV4dD1UeXBlcywtQ29mZmVlJTIwYmVhbnMlMjBhcmUlMjB0aGUlMjBzZWVkc1wiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGl0bGU6IFwiTWFrZVwiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuaHNwaC5oYXJ2YXJkLmVkdS9udXRyaXRpb25zb3VyY2UvZm9vZC1mZWF0dXJlcy9jb2ZmZWUvIzp+OnRleHQ9XCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgYWJvdXRfdGhpc19yZXN1bHQ6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIlRoZSBIYXJ2YXJkIFQuSC4gQ2hhbiBTY2hvb2wgb2YgUHVibGljIEhlYWx0aCBpcyB0aGUgcHVibGljIGhlYWx0aCBzY2hvb2wgb2YgSGFydmFyZCBVbml2ZXJzaXR5LCBsb2NhdGVkIGluIHRoZSBMb25nd29vZCBNZWRpY2FsIEFyZWEgb2YgQm9zdG9uLCBNYXNzYWNodXNldHRzLlwiLFxuICAgICAgICBpY29uOiBcImh0dHBzOi8vc2VycGFwaS5jb20vc2VhcmNoZXMvNjJjMWJhOWVmNTVkNzc0ZGZkMDE4YTAzL2ltYWdlcy9iN2NjNjdhMmI3OGRiYjQ2N2ZkNzNkYTNhNWM4M2RlMzIyOWFhZTcyNDU5ZDUyZGVmODk0MjlkZGNiMWQ1MzQzZjc3ZGViMmY0NjU3ZGU3M2U0ZjcxNjA3NjM1ZTNhZTMucG5nXCIsXG4gICAgICB9LFxuICAgICAga2V5d29yZHM6IFtcImNvZmZlZVwiXSxcbiAgICAgIGxhbmd1YWdlczogW1wiRW5nbGlzaFwiXSxcbiAgICAgIHJlZ2lvbnM6IFtcInRoZSBVbml0ZWQgU3RhdGVzXCJdLFxuICAgIH0sXG4gICAgYWJvdXRfcGFnZV9saW5rOlxuICAgICAgXCJodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPUFib3V0K2h0dHBzOi8vd3d3LmhzcGguaGFydmFyZC5lZHUvbnV0cml0aW9uc291cmNlL2Zvb2QtZmVhdHVyZXMvY29mZmVlLyZ0Ym09aWxwJmlscHM9QUROTUNpM0Y0Uk9fRElxamNtOVZVQ1htZm1wcXJYNWgzd1wiLFxuICAgIGNhY2hlZF9wYWdlX2xpbms6XG4gICAgICBcImh0dHBzOi8vd2ViY2FjaGUuZ29vZ2xldXNlcmNvbnRlbnQuY29tL3NlYXJjaD9xPWNhY2hlOmFDUUZSMEVXZ1B3SjpodHRwczovL3d3dy5oc3BoLmhhcnZhcmQuZWR1L251dHJpdGlvbnNvdXJjZS9mb29kLWZlYXR1cmVzL2NvZmZlZS8rJmNkPTI0JmhsPWVuJmN0PWNsbmsmZ2w9dXNcIixcbiAgfSxcbl07XG5cbmNvbnN0IGdldFNlcnAgPSAoc2VhcmNoVGVybSkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICB2YXIgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICByZWRpcmVjdDogXCJmb2xsb3dcIixcbiAgICB9O1xuXG4gICAgZmV0Y2goXG4gICAgICBgaHR0cHM6Ly9zZXJwYXBpLmNvbS9zZWFyY2guanNvbj9lbmdpbmU9Z29vZ2xlJnE9JHtzZWFyY2hUZXJtfSZhcGlfa2V5PSR7c2VycEFQSUtFWX0mbnVtPTE1YCxcbiAgICAgIHJlcXVlc3RPcHRpb25zXG4gICAgKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAudGhlbigocmVzdWx0KSA9PiByZXNvbHZlKHJlc3VsdCkpXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiBjb25zb2xlLmxvZyhcImVycm9yXCIsIGVycm9yKSk7XG4gIH0pO1xufTtcblxuY29uc3QgZ29vZ2xlU2VhcmNoID0gKHNlYXJjaFRlcm0pID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgbGV0IHNlcnBSZXMgPSBhd2FpdCBnZXRTZXJwKHNlYXJjaFRlcm0pO1xuICAgIGNvbnNvbGUubG9nKHNlcnBSZXMpO1xuXG4gICAgbGV0IHN0b3JhZ2VSZXMgPSBhd2FpdCBnZXRGcm9tU3RvcmFnZShbXCJoaXN0b3J5XCIsIFwic3RhdGljUmVzdWx0XCJdKTtcbiAgICBpZiAoIXN0b3JhZ2VSZXMuaGlzdG9yeSkgcmV0dXJuO1xuXG4gICAgc3RvcmFnZVJlcy5oaXN0b3J5LnB1c2goe1xuICAgICAgc2VhcmNoVGVybTogc2VhcmNoVGVybSxcbiAgICAgIGRhdGU6IG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSxcbiAgICAgIHVybDogc2VycFJlcy5zZWFyY2hfbWV0YWRhdGEuZ29vZ2xlX3VybCxcbiAgICAgIHN1Ym1pdHRlZDogZmFsc2UsXG4gICAgfSk7XG4gICAgc2F2ZVRvU3RvcmFnZSh7IGhpc3Rvcnk6IHN0b3JhZ2VSZXMuaGlzdG9yeSB9KTtcbiAgICBsZXQgc3VibWl0dGVkQ291bnQgPSBzdG9yYWdlUmVzLmhpc3RvcnkuZmlsdGVyKChoKSA9PiBoLnN1Ym1pdHRlZCk7XG4gICAgbGV0IHJldmVyZXNlZCA9IHNlcnBSZXMub3JnYW5pY19yZXN1bHRzLnJldmVyc2UoKTtcbiAgICBjb25zb2xlLmxvZyhyZXZlcmVzZWQpO1xuICAgIGxldCBkYXRhID0gW107XG4gICAgY29uc29sZS5sb2coc3VibWl0dGVkQ291bnQpO1xuICAgIGlmIChzdWJtaXR0ZWRDb3VudC5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKHN0b3JhZ2VSZXMuc3RhdGljUmVzdWx0KTtcbiAgICBmb3IgKFxuICAgICAgbGV0IGkgPSAwO1xuICAgICAgaSA8IE1hdGguZmxvb3IocmV2ZXJlc2VkLmxlbmd0aCAqIChzdWJtaXR0ZWRDb3VudC5sZW5ndGggLyAzKSk7XG4gICAgICBpKytcbiAgICApIHtcbiAgICAgIGRhdGEucHVzaChyZXZlcmVzZWRbaV0pO1xuICAgIH1cbiAgICByZXNvbHZlKGRhdGEpO1xuICB9KTtcbn07XG5cbmNvbnN0IHRvTWluc0FuZFNlY3MgPSAobWlsbGlzKSA9PiB7XG4gIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcihtaWxsaXMgLyA2MDAwMCk7XG4gIGxldCBzZWNvbmRzID0gKChtaWxsaXMgJSA2MDAwMCkgLyAxMDAwKS50b0ZpeGVkKDApO1xuICByZXR1cm4gYCR7bWludXRlc30gOiR7c2Vjb25kcyA8IDEwID8gXCIwXCIgOiBcIlwifSR7c2Vjb25kc31gO1xufTtcblxuY29uc3Qgc3VibWl0VGFzayA9IGFzeW5jICh0YXNrKSA9PiB7XG4gIGxldCBzdG9yYWdlUmVzID0gYXdhaXQgZ2V0RnJvbVN0b3JhZ2UoW1xuICAgIFwidXNlcklkXCIsXG4gICAgXCJoaXN0b3J5XCIsXG4gICAgXCJzdWJtaXR0ZWRLZXl3b3Jkc1wiLFxuICBdKTtcbiAgaWYgKHN0b3JhZ2VSZXMudXNlcklkICYmIHN0b3JhZ2VSZXMuaGlzdG9yeSkge1xuICAgIGxldCBoaXN0b3J5ID0gc3RvcmFnZVJlcy5oaXN0b3J5O1xuICAgIGNvbnN0IHJhdyA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHVzZXJJZDogc3RvcmFnZVJlcy51c2VySWQsXG4gICAgICBrZXl3b3JkOiB0YXNrLmtleXdvcmQsXG4gICAgICB0aW1lVGFrZW46IHRvTWluc0FuZFNlY3MoXG4gICAgICAgIERhdGUubm93KCkgLSBuZXcgRGF0ZShoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV0uZGF0ZSlcbiAgICAgICksXG4gICAgICB1cmw6IHRhc2subGluayxcbiAgICAgIHR5cGU6IFwic3VibWl0VGFza1wiLFxuICAgIH0pO1xuICAgIHN0b3JhZ2VSZXMuc3VibWl0dGVkS2V5d29yZHMucHVzaCh0YXNrLmtleXdvcmQpO1xuICAgIHNhdmVUb1N0b3JhZ2UoeyBzdWJtaXR0ZWRLZXl3b3Jkczogc3RvcmFnZVJlcy5zdWJtaXR0ZWRLZXl3b3JkcyB9KTtcbiAgICBjb25zb2xlLmxvZyhyYXcpO1xuICAgIGxldCBkb25lID0gYXdhaXQgcG9zdERhdGEocmF3KTtcbiAgfVxufTtcblxuY29uc3QgZ2V0QnJvd3NpbmdXZWVrID0gKCkgPT4ge1xuICBmZXRjaChgJHtBUElVUkx9P3R5cGU9a2V5d29yZHNgKVxuICAgIC50aGVuKChyZXN1bHQpID0+IHJlc3VsdC5qc29uKCkpXG4gICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgc2F2ZVRvU3RvcmFnZSh7IGJyb3dzaW5nV2VlazogZGF0YS5kYXRhIH0pO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUubG9nKGVycikpO1xufTtcbmNvbnN0IGdldFdlZWsyID0gKCkgPT4ge1xuICBmZXRjaChgJHtBUElVUkx9P3R5cGU9d2Vla18yYClcbiAgICAudGhlbigocmVzdWx0KSA9PiByZXN1bHQuanNvbigpKVxuICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgIHNhdmVUb1N0b3JhZ2UoeyB3ZWVrVHdvS2V5d29yZHM6IGRhdGEuZGF0YSB9KTtcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbn07XG5cbmNvbnN0IGdldFNlcnZleSA9IGFzeW5jICgpID0+IHtcbiAgbGV0IHN0b3JhZ2VSZXMgPSBhd2FpdCBnZXRGcm9tU3RvcmFnZShcInNlcnZleVF1ZXN0aW9uc1wiKTtcbiAgZmV0Y2goYCR7QVBJVVJMfT90eXBlPXN1cnZleVF1ZXNpb25zYClcbiAgICAudGhlbigocmVzdWx0KSA9PiByZXN1bHQuanNvbigpKVxuICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgIGxldCBmaWx0ZXJlZCA9IFtdO1xuICAgICAgaWYgKCFzdG9yYWdlUmVzLnNlcnZleVF1ZXN0aW9ucykge1xuICAgICAgICBzYXZlVG9TdG9yYWdlKHsgc2VydmV5UXVlc3Rpb25zOiBkYXRhLmRhdGEgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGQgb2YgZGF0YS5kYXRhKSB7XG4gICAgICAgIGxldCBmb3VuZCA9IHN0b3JhZ2VSZXMuc2VydmV5UXVlc3Rpb25zLmZpbmQoXG4gICAgICAgICAgKHMpID0+IHMucXVlc3Rpb24gPT09IGQucXVlc3Rpb25cbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgIGZpbHRlcmVkLnB1c2goZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHN0b3JhZ2VSZXMuc2VydmV5UXVlc3Rpb25zID0gW1xuICAgICAgICAgIC4uLnN0b3JhZ2VSZXMuc2VydmV5UXVlc3Rpb25zLFxuICAgICAgICAgIC4uLmZpbHRlcmVkLFxuICAgICAgICBdO1xuICAgICAgICBzYXZlVG9TdG9yYWdlKHsgc2VydmV5UXVlc3Rpb25zOiBzdG9yYWdlUmVzLnNlcnZleVF1ZXN0aW9ucyB9KTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbn07XG5cbmNvbnN0IGFuc3dlclNlcnZleSA9IChkYXRhKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBzdG9yYWdlUmVzID0gYXdhaXQgZ2V0RnJvbVN0b3JhZ2UoW1widXNlcklkXCIsIFwic2VydmV5UXVlc3Rpb25zXCJdKTtcbiAgICBjb25zdCByYXcgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB1c2VySWQ6IHN0b3JhZ2VSZXMudXNlcklkLFxuICAgICAgdHlwZTogXCJzZXJ2ZXlBbnN3ZXJzXCIsXG4gICAgICBzZXJ2ZXk6IGRhdGEsXG4gICAgfSk7XG5cbiAgICBsZXQgcmVzID0gYXdhaXQgcG9zdERhdGEocmF3KTtcbiAgICBmb3IgKGxldCBhbnN3ZXJlZCBvZiBkYXRhKSB7XG4gICAgICBsZXQgaW5kZXggPSBzdG9yYWdlUmVzLnNlcnZleVF1ZXN0aW9ucy5pbmRleE9mKFxuICAgICAgICBzdG9yYWdlUmVzLnNlcnZleVF1ZXN0aW9ucy5maW5kKChzKSA9PiBzLnF1ZXN0aW9uID09PSBhbnN3ZXJlZC5xdWVzdGlvbilcbiAgICAgICk7XG4gICAgICBzdG9yYWdlUmVzLnNlcnZleVF1ZXN0aW9uc1tpbmRleF0uYW5zd2VyID0gYW5zd2VyZWQuYW5zd2VyO1xuICAgIH1cbiAgICBzYXZlVG9TdG9yYWdlKHsgc2VydmV5UXVlc3Rpb25zOiBzdG9yYWdlUmVzLnNlcnZleVF1ZXN0aW9ucyB9KTtcbiAgICByZXNvbHZlKHJlcyk7XG4gIH0pO1xufTtcblxuY29uc3QgZ2V0SGlzdG9yeSA9ICgpID0+XG4gIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgbGV0IHN0b3JhZ2VSZXMgPSBhd2FpdCBnZXRGcm9tU3RvcmFnZShcImhpc3RvcnlcIik7XG4gICAgLy8gY29uc29sZS5sb2coc3RvcmFnZVJlcyk7XG4gICAgaWYgKHN0b3JhZ2VSZXMuaGlzdG9yeSkgcmVzb2x2ZShzdG9yYWdlUmVzLmhpc3RvcnkpO1xuICB9KTtcblxuY29uc3QgcG9zdERhdGEgPSAoZGF0YSkgPT4ge1xuICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY29uc3QgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBteUhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcblxuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcbiAgICAgIGJvZHk6IGRhdGEsXG4gICAgICByZWRpcmVjdDogXCJmb2xsb3dcIixcbiAgICB9O1xuXG4gICAgZmV0Y2goQVBJVVJMLCByZXF1ZXN0T3B0aW9ucylcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4gcmVzb2x2ZShyZXN1bHQpKVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4gY29uc29sZS5sb2coXCJlcnJvclwiLCBlcnJvcikpO1xuICB9KTtcbn07XG5cbmNvbnN0IGF1dGhVc2VyID0gKHVzZXJJZCkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICBjb25zdCByYXcgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgIHR5cGU6IFwiYXV0aFVzZXJcIixcbiAgICB9KTtcblxuICAgIGxldCByZXMgPSBhd2FpdCBwb3N0RGF0YShyYXcpO1xuICAgIHJlc29sdmUocmVzKTtcbiAgfSk7XG59O1xuXG5jb25zdCB1cGxvYWRIaXN0b3J5ID0gKGRhdGEpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgbGV0IHN0b3JhZ2VSZXMgPSBhd2FpdCBnZXRGcm9tU3RvcmFnZShbXCJ1c2VySWRcIiwgXCJoaXN0b3J5XCJdKTtcbiAgICBpZiAoc3RvcmFnZVJlcy51c2VySWQgJiYgc3RvcmFnZVJlcy5oaXN0b3J5KSB7XG4gICAgICBjb25zdCByYXcgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHVzZXJJZDogc3RvcmFnZVJlcy51c2VySWQsXG4gICAgICAgIGhpc3Rvcnk6IGRhdGEsXG4gICAgICAgIHR5cGU6IFwidXBsb2FkSGlzdG9yeVwiLFxuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyhyYXcpO1xuICAgICAgbGV0IGRvbmUgPSBhd2FpdCBwb3N0RGF0YShyYXcpO1xuICAgICAgcmVzb2x2ZShkb25lKTtcblxuICAgICAgZm9yIChsZXQgaCBvZiBzdG9yYWdlUmVzLmhpc3RvcnkpIHtcbiAgICAgICAgbGV0IGZvdW5kID0gZGF0YS5maW5kKChkKSA9PiBkLnVybCA9PT0gaC51cmwgJiYgZC5kYXRlID09PSBoLmRhdGUpO1xuICAgICAgICBpZiAoZm91bmQpIGguc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHNhdmVUb1N0b3JhZ2UoeyBoaXN0b3J5OiBzdG9yYWdlUmVzLmhpc3RvcnkgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmNvbnN0IHNhdmVUb1N0b3JhZ2UgPSAob2JqKSA9PlxuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldChvYmosIChyZXMpID0+IHJlc29sdmUodHJ1ZSkpO1xuICB9KTtcblxuY29uc3QgZ2V0RnJvbVN0b3JhZ2UgPSAoYXJyKSA9PlxuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChhcnIsIChyZXMpID0+IHJlc29sdmUocmVzKSk7XG4gIH0pO1xuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gIGNvbnN0IGRlZlNldHRpbmdzID0ge1xuICAgIGZpcnN0VGltZTogdHJ1ZSxcbiAgICB1c2VySWQ6IG51bGwsXG4gICAgY3JlZGl0czogMCxcbiAgICBiYWxhbmNlOiAwLFxuICAgIGhpc3Rvcnk6IFtdLFxuICAgIHdlZWtUd29LZXl3b3JkczogW10sXG4gICAgd2hpdGVsaXN0ZWRLZXl3b3JkczogW10sXG4gICAgc2VhcmNoSGlzdG9yeUNoZWNrOiB0cnVlLFxuICAgIHN0YXRpY1Jlc3VsdDogc3RhdGljUmVzdWx0LFxuICAgIHN1Ym1pdHRlZEtleXdvcmRzOiBbXSxcbiAgfTtcbiAgc2F2ZVRvU3RvcmFnZShkZWZTZXR0aW5ncyk7XG59KTtcblxuY2hyb21lLmFjdGlvbi5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKHRhYikge1xuICBvcGVuV2luZG93KCk7XG59KTtcblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2csIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gIGNvbnNvbGUubG9nKG1zZyk7XG4gIGlmIChtc2cuY29tbWFuZCA9PT0gXCJzZWFyY2hcIikge1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgc2VycFJlcyA9IGF3YWl0IGdvb2dsZVNlYXJjaChtc2cuZGF0YSk7XG4gICAgICBzZW5kUmVzcG9uc2Uoc2VycFJlcyk7XG4gICAgfSkoKTtcbiAgfVxuICBpZiAobXNnLmNvbW1hbmQgPT09IFwiZ2V0SGlzdG9yeVwiKSB7XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIGxldCBoaXN0b3J5ID0gYXdhaXQgZ2V0SGlzdG9yeSgpO1xuICAgICAgc2VuZFJlc3BvbnNlKGhpc3RvcnkpO1xuICAgIH0pKCk7XG4gIH1cbiAgaWYgKG1zZy5jb21tYW5kID09PSBcImNyZWF0ZVVzZXJcIikge1xuICAgIGNyZWF0ZVVzZXIobXNnLmRhdGEpO1xuICB9XG4gIGlmIChtc2cuY29tbWFuZCA9PT0gXCJ1cGxvYWRIaXN0b3J5XCIpIHtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IHJlcyA9IGF3YWl0IHVwbG9hZEhpc3RvcnkobXNnLmhpc3RvcnkpO1xuICAgICAgc2VuZFJlc3BvbnNlKHJlcyk7XG4gICAgfSkoKTtcbiAgfVxuICBpZiAobXNnLmNvbW1hbmQgPT09IFwiYXV0aFVzZXJcIikge1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgcmVzID0gYXdhaXQgYXV0aFVzZXIobXNnLnVzZXJJZCk7XG4gICAgICBzZW5kUmVzcG9uc2UocmVzKTtcbiAgICB9KSgpO1xuICB9XG4gIGlmIChtc2cuY29tbWFuZCA9PT0gXCJnb29nbGVTZWFyY2hcIikge1xuICAgIGNvbnNvbGUubG9nKG1zZy5kYXRhKTtcbiAgfVxuICBpZiAobXNnLmNvbW1hbmQgPT09IFwib3BlbkxpbmtcIikge1xuICAgIGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogbXNnLnVybCB9KTtcbiAgfVxuICBpZiAobXNnLmNvbW1hbmQgPT09IFwic3VibWl0VGFza1wiKSB7XG4gICAgc3VibWl0VGFzayhtc2cudGFzayk7XG4gIH1cbiAgaWYgKG1zZy5jb21tYW5kID09PSBcImFuc3dlclNlcnZleVwiKSB7XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIGxldCByZXMgPSBhbnN3ZXJTZXJ2ZXkobXNnLmRhdGEpO1xuICAgICAgc2VuZFJlc3BvbnNlKHJlcyk7XG4gICAgfSkoKTtcbiAgfVxuICBpZiAobXNnLmNvbW1hbmQgPT09IFwiaW5pdFwiKSB7XG4gICAgZ2V0U2VydmV5KCk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuY29uc3Qgb3BlbldpbmRvdyA9ICgpID0+IHtcbiAgY2hyb21lLndpbmRvd3MuZ2V0Q3VycmVudCgodGFiV2luZG93KSA9PiB7XG4gICAgY29uc3Qgd2lkdGggPSA3NjA7XG4gICAgY29uc3QgaGVpZ2h0ID0gNDc4O1xuICAgIGNvbnN0IGxlZnQgPSBNYXRoLnJvdW5kKCh0YWJXaW5kb3cud2lkdGggLSB3aWR0aCkgKiAwLjUgKyB0YWJXaW5kb3cubGVmdCk7XG4gICAgY29uc3QgdG9wID0gTWF0aC5yb3VuZCgodGFiV2luZG93LmhlaWdodCAtIGhlaWdodCkgKiAwLjUgKyB0YWJXaW5kb3cudG9wKTtcblxuICAgIGNocm9tZS53aW5kb3dzLmNyZWF0ZSh7XG4gICAgICBmb2N1c2VkOiB0cnVlLFxuICAgICAgdXJsOiBjaHJvbWUucnVudGltZS5nZXRVUkwoXCJwb3B1cC5odG1sXCIpLFxuICAgICAgdHlwZTogXCJwb3B1cFwiLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBsZWZ0LFxuICAgICAgdG9wLFxuICAgIH0pO1xuICB9KTtcbn07XG5cbi8vLy8vLy9cblxuY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgZ2V0QnJvd3NpbmdXZWVrKCk7XG4gIGdldFdlZWsyKCk7XG4gIGdldFNlcnZleSgpO1xufTtcblxuaW5pdCgpO1xuIl0sIm5hbWVzIjpbIkFQSVVSTCIsInNlcnBBUElLRVkiLCJzdGF0aWNSZXN1bHQiLCJwb3NpdGlvbiIsInRpdGxlIiwibGluayIsImRpc3BsYXllZF9saW5rIiwidGh1bWJuYWlsIiwic25pcHBldCIsInNuaXBwZXRfaGlnaGxpZ2h0ZWRfd29yZHMiLCJzaXRlbGlua3MiLCJpbmxpbmUiLCJyaWNoX3NuaXBwZXQiLCJib3R0b20iLCJleHRlbnNpb25zIiwiZGV0ZWN0ZWRfZXh0ZW5zaW9ucyIsImludHJvZHVjZWRfdGhfY2VudHVyeSIsImFib3V0X3RoaXNfcmVzdWx0Iiwic291cmNlIiwiZGVzY3JpcHRpb24iLCJpY29uIiwia2V5d29yZHMiLCJsYW5ndWFnZXMiLCJyZWdpb25zIiwiYWJvdXRfcGFnZV9saW5rIiwiY2FjaGVkX3BhZ2VfbGluayIsInJlbGF0ZWRfcGFnZXNfbGluayIsImRhdGUiLCJyZWxhdGVkX2tleXdvcmRzIiwiZ2V0U2VycCIsInNlYXJjaFRlcm0iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlcXVlc3RPcHRpb25zIiwibWV0aG9kIiwicmVkaXJlY3QiLCJmZXRjaCIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJyZXN1bHQiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJnb29nbGVTZWFyY2giLCJzZXJwUmVzIiwiZ2V0RnJvbVN0b3JhZ2UiLCJzdG9yYWdlUmVzIiwiaGlzdG9yeSIsInB1c2giLCJEYXRlIiwidG9VVENTdHJpbmciLCJ1cmwiLCJzZWFyY2hfbWV0YWRhdGEiLCJnb29nbGVfdXJsIiwic3VibWl0dGVkIiwic2F2ZVRvU3RvcmFnZSIsInN1Ym1pdHRlZENvdW50IiwiZmlsdGVyIiwiaCIsInJldmVyZXNlZCIsIm9yZ2FuaWNfcmVzdWx0cyIsInJldmVyc2UiLCJkYXRhIiwibGVuZ3RoIiwiaSIsIk1hdGgiLCJmbG9vciIsInRvTWluc0FuZFNlY3MiLCJtaWxsaXMiLCJtaW51dGVzIiwic2Vjb25kcyIsInRvRml4ZWQiLCJzdWJtaXRUYXNrIiwidGFzayIsInVzZXJJZCIsInJhdyIsIkpTT04iLCJzdHJpbmdpZnkiLCJrZXl3b3JkIiwidGltZVRha2VuIiwibm93IiwidHlwZSIsInN1Ym1pdHRlZEtleXdvcmRzIiwicG9zdERhdGEiLCJkb25lIiwiZ2V0QnJvd3NpbmdXZWVrIiwiYnJvd3NpbmdXZWVrIiwiZXJyIiwiZ2V0V2VlazIiLCJ3ZWVrVHdvS2V5d29yZHMiLCJnZXRTZXJ2ZXkiLCJmaWx0ZXJlZCIsInNlcnZleVF1ZXN0aW9ucyIsImQiLCJmb3VuZCIsImZpbmQiLCJzIiwicXVlc3Rpb24iLCJhbnN3ZXJTZXJ2ZXkiLCJzZXJ2ZXkiLCJyZXMiLCJhbnN3ZXJlZCIsImluZGV4IiwiaW5kZXhPZiIsImFuc3dlciIsImdldEhpc3RvcnkiLCJteUhlYWRlcnMiLCJIZWFkZXJzIiwiYXBwZW5kIiwiaGVhZGVycyIsImJvZHkiLCJhdXRoVXNlciIsInVwbG9hZEhpc3RvcnkiLCJvYmoiLCJjaHJvbWUiLCJzdG9yYWdlIiwibG9jYWwiLCJzZXQiLCJhcnIiLCJnZXQiLCJydW50aW1lIiwib25JbnN0YWxsZWQiLCJhZGRMaXN0ZW5lciIsImRlZlNldHRpbmdzIiwiZmlyc3RUaW1lIiwiY3JlZGl0cyIsImJhbGFuY2UiLCJ3aGl0ZWxpc3RlZEtleXdvcmRzIiwic2VhcmNoSGlzdG9yeUNoZWNrIiwiYWN0aW9uIiwib25DbGlja2VkIiwidGFiIiwib3BlbldpbmRvdyIsIm9uTWVzc2FnZSIsIm1zZyIsInNlbmRlciIsInNlbmRSZXNwb25zZSIsImNvbW1hbmQiLCJjcmVhdGVVc2VyIiwidGFicyIsImNyZWF0ZSIsIndpbmRvd3MiLCJnZXRDdXJyZW50IiwidGFiV2luZG93Iiwid2lkdGgiLCJoZWlnaHQiLCJsZWZ0Iiwicm91bmQiLCJ0b3AiLCJmb2N1c2VkIiwiZ2V0VVJMIiwiaW5pdCJdLCJzb3VyY2VSb290IjoiIn0=
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


var APIURL = "https://script.google.com/macros/s/AKfycbyNCAcwQhVeDRpMTM62EGYJw50G---8V4z1WJoJLVmxJf0YeioaMKYHFu0SXHi67aXN/exec"; // const APIURL =
//   "https://script.google.com/macros/s/AKfycbxqmBMb5NkK8u1JKvOHQME9fHCutxG4sZVR2_vDfGfIdOnS2ARRRWTTheIaILuRdYgPnA/exec";

var serpAPIKEY = "7ff28bfd424339b1679a3d5455f2ced6dd0177d74ef8e62240b03be3a675588b";
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
    fetch("https://serpapi.com/search.json?engine=google&q=".concat(searchTerm, "&api_key=").concat(serpAPIKEY, "&num=77"), requestOptions).then(function (response) {
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
              if (submittedCount.length === 0) submittedCount.length = 3;

              for (i = 0; i < Math.floor(reveresed.length * (submittedCount.length / 3)); i++) {
                data.push(reveresed[i]);
              }

              resolve(data);

            case 19:
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
    var height = 570;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZixNQUFNO0FBQ04sZUFBZTtBQUNmO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQ7QUFDMUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0MsV0FBVztBQUNuRDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFVBQVU7QUFDVjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUNBQXFDLGNBQWM7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLG1CQUFtQjtBQUNwRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGdCQUFnQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUEsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7QUFDRDtB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YSxHQUFNO0FBQ3ZCbEIsRUFBQUEsTUFBTSxDQUFDMkIsT0FBUCxDQUFlQyxVQUFmLENBQTBCLFVBQUNDLFNBQUQsRUFBZTtBQUN2QyxRQUFNQyxLQUFLLEdBQUcsR0FBZDtBQUNBLFFBQU1DLE1BQU0sR0FBRyxHQUFmO0FBQ0EsUUFBTUMsSUFBSSxHQUFHakYsSUFBSSxDQUFDa0YsS0FBTCxDQUFXLENBQUNKLFNBQVMsQ0FBQ0MsS0FBVixHQUFrQkEsS0FBbkIsSUFBNEIsR0FBNUIsR0FBa0NELFNBQVMsQ0FBQ0csSUFBdkQsQ0FBYjtBQUNBLFFBQU1FLEdBQUcsR0FBR25GLElBQUksQ0FBQ2tGLEtBQUwsQ0FBVyxDQUFDSixTQUFTLENBQUNFLE1BQVYsR0FBbUJBLE1BQXBCLElBQThCLEdBQTlCLEdBQW9DRixTQUFTLENBQUNLLEdBQXpELENBQVo7QUFFQWxDLElBQUFBLE1BQU0sQ0FBQzJCLE9BQVAsQ0FBZUQsTUFBZixDQUFzQjtBQUNwQlMsTUFBQUEsT0FBTyxFQUFFLElBRFc7QUFFcEJsRyxNQUFBQSxHQUFHLEVBQUUrRCxNQUFNLENBQUNNLE9BQVAsQ0FBZThCLE1BQWYsQ0FBc0IsWUFBdEIsQ0FGZTtBQUdwQnJFLE1BQUFBLElBQUksRUFBRSxPQUhjO0FBSXBCK0QsTUFBQUEsS0FBSyxFQUFMQSxLQUpvQjtBQUtwQkMsTUFBQUEsTUFBTSxFQUFOQSxNQUxvQjtBQU1wQkMsTUFBQUEsSUFBSSxFQUFKQSxJQU5vQjtBQU9wQkUsTUFBQUEsR0FBRyxFQUFIQTtBQVBvQixLQUF0QjtBQVNELEdBZkQ7QUFnQkQsQ0FqQkQsRUFtQkE7OztBQUVBLElBQU1HLElBQUksR0FBRyxTQUFQQSxJQUFPLEdBQU07QUFDakJsRSxFQUFBQSxlQUFlO0FBQ2ZHLEVBQUFBLFFBQVE7QUFDUkUsRUFBQUEsU0FBUztBQUNWLENBSkQ7O0FBTUE2RCxJQUFJLEciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ndWlsbGF1bWViYXIzMjIvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIndlYnBhY2s6Ly9ndWlsbGF1bWViYXIzMjIvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZ3VpbGxhdW1lYmFyMzIyLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2FycmF5TGlrZVRvQXJyYXkuanMiLCJ3ZWJwYWNrOi8vZ3VpbGxhdW1lYmFyMzIyLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2FycmF5V2l0aG91dEhvbGVzLmpzIiwid2VicGFjazovL2d1aWxsYXVtZWJhcjMyMi8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9hc3luY1RvR2VuZXJhdG9yLmpzIiwid2VicGFjazovL2d1aWxsYXVtZWJhcjMyMi8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9pdGVyYWJsZVRvQXJyYXkuanMiLCJ3ZWJwYWNrOi8vZ3VpbGxhdW1lYmFyMzIyLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL25vbkl0ZXJhYmxlU3ByZWFkLmpzIiwid2VicGFjazovL2d1aWxsYXVtZWJhcjMyMi8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS90b0NvbnN1bWFibGVBcnJheS5qcyIsIndlYnBhY2s6Ly9ndWlsbGF1bWViYXIzMjIvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkuanMiLCJ3ZWJwYWNrOi8vZ3VpbGxhdW1lYmFyMzIyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2d1aWxsYXVtZWJhcjMyMi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9ndWlsbGF1bWViYXIzMjIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2d1aWxsYXVtZWJhcjMyMi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2d1aWxsYXVtZWJhcjMyMi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2d1aWxsYXVtZWJhcjMyMi8uL3NyYy9iYWNrZ3JvdW5kLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gZGVmaW5lKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG4gIHRyeSB7XG4gICAgLy8gSUUgOCBoYXMgYSBicm9rZW4gT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoYXQgb25seSB3b3JrcyBvbiBET00gb2JqZWN0cy5cbiAgICBkZWZpbmUoe30sIFwiXCIpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBkZWZpbmUgPSBmdW5jdGlvbihvYmosIGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBkZWZpbmUoSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIGRlZmluZShHcCwgXCJjb25zdHJ1Y3RvclwiLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gIGRlZmluZShHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCBHZW5lcmF0b3JGdW5jdGlvbik7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gZGVmaW5lKFxuICAgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLFxuICAgIHRvU3RyaW5nVGFnU3ltYm9sLFxuICAgIFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICApO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIGRlZmluZShwcm90b3R5cGUsIG1ldGhvZCwgZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGRlZmluZShnZW5GdW4sIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvckZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IsIFByb21pc2VJbXBsKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VJbXBsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgZGVmaW5lKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlLCBhc3luY0l0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7XG4gICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSxcbiAgICAgIFByb21pc2VJbXBsXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBkZWZpbmUoR3AsIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvclwiKTtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIGRlZmluZShHcCwgaXRlcmF0b3JTeW1ib2wsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBkZWZpbmUoR3AsIFwidG9TdHJpbmdcIiwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIGluIG1vZGVybiBlbmdpbmVzXG4gIC8vIHdlIGNhbiBleHBsaWNpdGx5IGFjY2VzcyBnbG9iYWxUaGlzLiBJbiBvbGRlciBlbmdpbmVzIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gXCJvYmplY3RcIikge1xuICAgIGdsb2JhbFRoaXMucmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbiAgfSBlbHNlIHtcbiAgICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lXCIpO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgYXJyMltpXSA9IGFycltpXTtcbiAgfVxuXG4gIHJldHVybiBhcnIyO1xufSIsImltcG9ydCBhcnJheUxpa2VUb0FycmF5IGZyb20gXCIuL2FycmF5TGlrZVRvQXJyYXkuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkoYXJyKTtcbn0iLCJmdW5jdGlvbiBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIGtleSwgYXJnKSB7XG4gIHRyeSB7XG4gICAgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpO1xuICAgIHZhciB2YWx1ZSA9IGluZm8udmFsdWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVqZWN0KGVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaW5mby5kb25lKSB7XG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKF9uZXh0LCBfdGhyb3cpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9hc3luY1RvR2VuZXJhdG9yKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgZ2VuID0gZm4uYXBwbHkoc2VsZiwgYXJncyk7XG5cbiAgICAgIGZ1bmN0aW9uIF9uZXh0KHZhbHVlKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJuZXh0XCIsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3Rocm93KGVycikge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwidGhyb3dcIiwgZXJyKTtcbiAgICAgIH1cblxuICAgICAgX25leHQodW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHtcbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgaXRlcltTeW1ib2wuaXRlcmF0b3JdICE9IG51bGwgfHwgaXRlcltcIkBAaXRlcmF0b3JcIl0gIT0gbnVsbCkgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn0iLCJpbXBvcnQgYXJyYXlXaXRob3V0SG9sZXMgZnJvbSBcIi4vYXJyYXlXaXRob3V0SG9sZXMuanNcIjtcbmltcG9ydCBpdGVyYWJsZVRvQXJyYXkgZnJvbSBcIi4vaXRlcmFibGVUb0FycmF5LmpzXCI7XG5pbXBvcnQgdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkgZnJvbSBcIi4vdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkuanNcIjtcbmltcG9ydCBub25JdGVyYWJsZVNwcmVhZCBmcm9tIFwiLi9ub25JdGVyYWJsZVNwcmVhZC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikge1xuICByZXR1cm4gYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBpdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IG5vbkl0ZXJhYmxlU3ByZWFkKCk7XG59IiwiaW1wb3J0IGFycmF5TGlrZVRvQXJyYXkgZnJvbSBcIi4vYXJyYXlMaWtlVG9BcnJheS5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZTsgfTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiY29uc3QgQVBJVVJMID1cbiAgXCJodHRwczovL3NjcmlwdC5nb29nbGUuY29tL21hY3Jvcy9zL0FLZnljYnlOQ0Fjd1FoVmVEUnBNVE02MkVHWUp3NTBHLS0tOFY0ejFXSm9KTFZteEpmMFllaW9hTUtZSEZ1MFNYSGk2N2FYTi9leGVjXCI7XG4vLyBjb25zdCBBUElVUkwgPVxuLy8gICBcImh0dHBzOi8vc2NyaXB0Lmdvb2dsZS5jb20vbWFjcm9zL3MvQUtmeWNieHFtQk1iNU5rSzh1MUpLdk9IUU1FOWZIQ3V0eEc0c1pWUjJfdkRmR2ZJZE9uUzJBUlJSV1RUaGVJYUlMdVJkWWdQbkEvZXhlY1wiO1xuY29uc3Qgc2VycEFQSUtFWSA9XG4gIFwiN2ZmMjhiZmQ0MjQzMzliMTY3OWEzZDU0NTVmMmNlZDZkZDAxNzdkNzRlZjhlNjIyNDBiMDNiZTNhNjc1NTg4YlwiO1xuXG5jb25zdCBzdGF0aWNSZXN1bHQgPSBbXG4gIHtcbiAgICBwb3NpdGlvbjogMSxcbiAgICB0aXRsZTogXCJDb2ZmZWUgLSBXaWtpcGVkaWFcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvZmZlZVwiLFxuICAgIGRpc3BsYXllZF9saW5rOiBcImh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZyDigLogd2lraSDigLogQ29mZmVlXCIsXG4gICAgdGh1bWJuYWlsOlxuICAgICAgXCJodHRwczovL3NlcnBhcGkuY29tL3NlYXJjaGVzLzYyYzFiYTllZjU1ZDc3NGRmZDAxOGEwMy9pbWFnZXMvYjdjYzY3YTJiNzhkYmI0NjdmZDczZGEzYTVjODNkZTMzZjEwNzVjNzM5Zjg0MjJhOWYzNmJkMDViZGQwY2E5Zi5qcGVnXCIsXG4gICAgc25pcHBldDpcbiAgICAgIFwiQ29mZmVlIGlzIGEgYnJld2VkIGRyaW5rIHByZXBhcmVkIGZyb20gcm9hc3RlZCBjb2ZmZWUgYmVhbnMsIHRoZSBzZWVkcyBvZiBiZXJyaWVzIGZyb20gY2VydGFpbiBmbG93ZXJpbmcgcGxhbnRzIGluIHRoZSBDb2ZmZWEgZ2VudXMuIEZyb20gdGhlIGNvZmZlZSBmcnVpdCwgLi4uXCIsXG4gICAgc25pcHBldF9oaWdobGlnaHRlZF93b3JkczogW1wiQ29mZmVlXCIsIFwiY29mZmVlXCIsIFwiY29mZmVlXCJdLFxuICAgIHNpdGVsaW5rczoge1xuICAgICAgaW5saW5lOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogXCJDb2ZmZWUgYmVhblwiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29mZmVlX2JlYW5cIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRpdGxlOiBcIkhpc3RvcnlcIixcbiAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0hpc3Rvcnlfb2ZfY29mZmVlXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogXCJDb2ZmZWUgcHJlcGFyYXRpb25cIixcbiAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvZmZlZV9wcmVwYXJhdGlvblwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGl0bGU6IFwiQ29mZmVlIHByb2R1Y3Rpb25cIixcbiAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvZmZlZV9wcm9kdWN0aW9uXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgcmljaF9zbmlwcGV0OiB7XG4gICAgICBib3R0b206IHtcbiAgICAgICAgZXh0ZW5zaW9uczogW1xuICAgICAgICAgIFwiUmVnaW9uIG9mIG9yaWdpbjogSG9ybiBvZiBBZnJpY2EgYW5kIOKAjlNvdXRoIEFyYS4uLuKAjlwiLFxuICAgICAgICAgIFwiQ29sb3I6IEJsYWNrLCBkYXJrIGJyb3duLCBsaWdodCBicm93biwgYmVpZ2VcIixcbiAgICAgICAgICBcIkludHJvZHVjZWQ6IDE1dGggY2VudHVyeVwiLFxuICAgICAgICBdLFxuICAgICAgICBkZXRlY3RlZF9leHRlbnNpb25zOiB7XG4gICAgICAgICAgaW50cm9kdWNlZF90aF9jZW50dXJ5OiAxNSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBhYm91dF90aGlzX3Jlc3VsdDoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgIFwiV2lraXBlZGlhIGlzIGEgbXVsdGlsaW5ndWFsIGZyZWUgb25saW5lIGVuY3ljbG9wZWRpYSB3cml0dGVuIGFuZCBtYWludGFpbmVkIGJ5IGEgY29tbXVuaXR5IG9mIHZvbHVudGVlcnMgdGhyb3VnaCBvcGVuIGNvbGxhYm9yYXRpb24gYW5kIGEgd2lraS1iYXNlZCBlZGl0aW5nIHN5c3RlbS4gSW5kaXZpZHVhbCBjb250cmlidXRvcnMsIGFsc28gY2FsbGVkIGVkaXRvcnMsIGFyZSBrbm93biBhcyBXaWtpcGVkaWFucy4gV2lraXBlZGlhIGlzIHRoZSBsYXJnZXN0IGFuZCBtb3N0LXJlYWQgcmVmZXJlbmNlIHdvcmsgaW4gaGlzdG9yeS5cIixcbiAgICAgICAgaWNvbjogXCJodHRwczovL3NlcnBhcGkuY29tL3NlYXJjaGVzLzYyYzFiYTllZjU1ZDc3NGRmZDAxOGEwMy9pbWFnZXMvYjdjYzY3YTJiNzhkYmI0NjdmZDczZGEzYTVjODNkZTNhOTkxYzYwNDMyZGI0NDM3ZDUzYTM3ODg3NGRmNWZkM2M4ZWVlNzNlMTZlNmIyYmFmNzdhYmEzYjEzMzZiNmI2LnBuZ1wiLFxuICAgICAgfSxcbiAgICAgIGtleXdvcmRzOiBbXCJjb2ZmZWVcIl0sXG4gICAgICBsYW5ndWFnZXM6IFtcIkVuZ2xpc2hcIl0sXG4gICAgICByZWdpb25zOiBbXCJ0aGUgVW5pdGVkIFN0YXRlc1wiXSxcbiAgICB9LFxuICAgIGFib3V0X3BhZ2VfbGluazpcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1BYm91dCtodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db2ZmZWUmdGJtPWlscCZpbHBzPUFETk1DaTB0VmhTQi1mR0hPSllnckl4QjB4bFhZclBHUEFcIixcbiAgICBjYWNoZWRfcGFnZV9saW5rOlxuICAgICAgXCJodHRwczovL3dlYmNhY2hlLmdvb2dsZXVzZXJjb250ZW50LmNvbS9zZWFyY2g/cT1jYWNoZTpVNm9KTW5GLWVlVUo6aHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29mZmVlKyZjZD0xNCZobD1lbiZjdD1jbG5rJmdsPXVzXCIsXG4gICAgcmVsYXRlZF9wYWdlc19saW5rOlxuICAgICAgXCJodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPXJlbGF0ZWQ6aHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29mZmVlK0NvZmZlZVwiLFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IDIsXG4gICAgdGl0bGU6IFwiVGhlIENvZmZlZSBCZWFuICYgVGVhIExlYWYgfCBDQlRMXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5jb2ZmZWViZWFuLmNvbS9cIixcbiAgICBkaXNwbGF5ZWRfbGluazogXCJodHRwczovL3d3dy5jb2ZmZWViZWFuLmNvbVwiLFxuICAgIHNuaXBwZXQ6XG4gICAgICBcIkJvcm4gYW5kIGJyZXdlZCBpbiBTb3V0aGVybiBDYWxpZm9ybmlhIHNpbmNlIDE5NjMsIFRoZSBDb2ZmZWUgQmVhbiAmIFRlYSBMZWFmwq4gaXMgcGFzc2lvbmF0ZSBhYm91dCBjb25uZWN0aW5nIGxveWFsIGN1c3RvbWVycyB3aXRoIGNhcmVmdWxseSBoYW5kY3JhZnRlZCAuLi5cIixcbiAgICBzbmlwcGV0X2hpZ2hsaWdodGVkX3dvcmRzOiBbXCJDb2ZmZWVcIl0sXG4gICAgYWJvdXRfdGhpc19yZXN1bHQ6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIlRoZSBDb2ZmZWUgQmVhbiAmIFRlYSBMZWFmIGlzIGFuIEFtZXJpY2FuIGNvZmZlZSBzaG9wIGNoYWluIGZvdW5kZWQgaW4gMTk2My4gU2luY2UgMjAxOSwgaXQgaXMgYSB0cmFkZSBuYW1lIG9mIElyZWxhbmQtYmFzZWQgU3VwZXIgTWFnbmlmaWNlbnQgQ29mZmVlIENvbXBhbnkgSXJlbGFuZCBMaW1pdGVkLCBpdHNlbGYgd2hvbGx5IG93bmVkIHN1YnNpZGlhcnkgb2YgbXVsdGluYXRpb25hbCBKb2xsaWJlZSBGb29kcyBDb3Jwb3JhdGlvbi5cIixcbiAgICAgICAgaWNvbjogXCJodHRwczovL3NlcnBhcGkuY29tL3NlYXJjaGVzLzYyYzFiYTllZjU1ZDc3NGRmZDAxOGEwMy9pbWFnZXMvYjdjYzY3YTJiNzhkYmI0NjdmZDczZGEzYTVjODNkZTM3ZjRkZDQ5NDg1NTI4ZmU3YjIxZGU0NzVkMjEwNzEyNmQxMzIyYmMzNGRjYTliM2Y2MGYxYzQyMTQ4Y2UyZDRlLnBuZ1wiLFxuICAgICAgfSxcbiAgICAgIGtleXdvcmRzOiBbXCJjb2ZmZWVcIl0sXG4gICAgICBsYW5ndWFnZXM6IFtcIkVuZ2xpc2hcIl0sXG4gICAgICByZWdpb25zOiBbXCJ0aGUgVW5pdGVkIFN0YXRlc1wiXSxcbiAgICB9LFxuICAgIGFib3V0X3BhZ2VfbGluazpcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1BYm91dCtodHRwczovL3d3dy5jb2ZmZWViZWFuLmNvbS8mdGJtPWlscCZpbHBzPUFETk1DaTJvU1lCNVdxbmhtbmZsUzg2T2RNZHBqTXp6OWdcIixcbiAgICBjYWNoZWRfcGFnZV9saW5rOlxuICAgICAgXCJodHRwczovL3dlYmNhY2hlLmdvb2dsZXVzZXJjb250ZW50LmNvbS9zZWFyY2g/cT1jYWNoZTpXcFF4U1lvMmM2QUo6aHR0cHM6Ly93d3cuY29mZmVlYmVhbi5jb20vKyZjZD0xNSZobD1lbiZjdD1jbG5rJmdsPXVzXCIsXG4gICAgcmVsYXRlZF9wYWdlc19saW5rOlxuICAgICAgXCJodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPXJlbGF0ZWQ6aHR0cHM6Ly93d3cuY29mZmVlYmVhbi5jb20vK0NvZmZlZVwiLFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IDMsXG4gICAgdGl0bGU6IFwiVGhlIEhpc3Rvcnkgb2YgQ29mZmVlIC0gTmF0aW9uYWwgQ29mZmVlIEFzc29jaWF0aW9uXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5uY2F1c2Eub3JnL2Fib3V0LWNvZmZlZS9oaXN0b3J5LW9mLWNvZmZlZVwiLFxuICAgIGRpc3BsYXllZF9saW5rOiBcImh0dHBzOi8vd3d3Lm5jYXVzYS5vcmcg4oC6IC4uLiDigLogSGlzdG9yeSBvZiBDb2ZmZWVcIixcbiAgICBzbmlwcGV0OlxuICAgICAgXCJDb2ZmZWUgZ3Jvd24gd29ybGR3aWRlIGNhbiB0cmFjZSBpdHMgaGVyaXRhZ2UgYmFjayBjZW50dXJpZXMgdG8gdGhlIGFuY2llbnQgY29mZmVlIGZvcmVzdHMgb24gdGhlIEV0aGlvcGlhbiBwbGF0ZWF1LiBUaGVyZSwgbGVnZW5kIHNheXMgdGhlIGdvYXQgaGVyZGVyIC4uLlwiLFxuICAgIHNuaXBwZXRfaGlnaGxpZ2h0ZWRfd29yZHM6IFtcIkNvZmZlZVwiLCBcImNvZmZlZVwiXSxcbiAgICBzaXRlbGlua3M6IHtcbiAgICAgIGlubGluZTogW1xuICAgICAgICB7XG4gICAgICAgICAgdGl0bGU6IFwiQW4gRXRoaW9waWFuIExlZ2VuZFwiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cubmNhdXNhLm9yZy9hYm91dC1jb2ZmZWUvaGlzdG9yeS1vZi1jb2ZmZWUjOn46dGV4dD1BbiUyMEV0aGlvcGlhbiUyMExlZ2VuZFwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGl0bGU6IFwiVGhlIEFyYWJpYW4gUGVuaW5zdWxhXCIsXG4gICAgICAgICAgbGluazogXCJodHRwczovL3d3dy5uY2F1c2Eub3JnL2Fib3V0LWNvZmZlZS9oaXN0b3J5LW9mLWNvZmZlZSM6fjp0ZXh0PVRoZSUyMEFyYWJpYW4lMjBQZW5pbnN1bGEsLUNvZmZlZSUyMGN1bHRpdmF0aW9uJTIwYW5kJTIwdHJhZGUlMjBiZWdhblwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGl0bGU6IFwiQ29mZmVlIENvbWVzIFRvIEV1cm9wZVwiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cubmNhdXNhLm9yZy9hYm91dC1jb2ZmZWUvaGlzdG9yeS1vZi1jb2ZmZWUjOn46dGV4dD1Db2ZmZWUlMjBDb21lcyUyMHRvJTIwRXVyb3BlXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgYWJvdXRfdGhpc19yZXN1bHQ6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIlRoZSBOYXRpb25hbCBDb2ZmZWUgQXNzb2NpYXRpb24gb3IsIGlzIHRoZSBtYWluIG1hcmtldCByZXNlYXJjaCwgY29uc3VtZXIgaW5mb3JtYXRpb24sIGFuZCBsb2JieWluZyBhc3NvY2lhdGlvbiBmb3IgdGhlIGNvZmZlZSBpbmR1c3RyeSBpbiB0aGUgVW5pdGVkIFN0YXRlcy5cIixcbiAgICAgIH0sXG4gICAgICBrZXl3b3JkczogW1wiY29mZmVlXCJdLFxuICAgICAgbGFuZ3VhZ2VzOiBbXCJFbmdsaXNoXCJdLFxuICAgICAgcmVnaW9uczogW1widGhlIFVuaXRlZCBTdGF0ZXNcIl0sXG4gICAgfSxcbiAgICBhYm91dF9wYWdlX2xpbms6XG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9QWJvdXQraHR0cHM6Ly93d3cubmNhdXNhLm9yZy9hYm91dC1jb2ZmZWUvaGlzdG9yeS1vZi1jb2ZmZWUmdGJtPWlscCZpbHBzPUFETk1DaTJUNktVXzdlSEVWNEV6WlMxRW5MclFWd0Q1M0FcIixcbiAgICBjYWNoZWRfcGFnZV9saW5rOlxuICAgICAgXCJodHRwczovL3dlYmNhY2hlLmdvb2dsZXVzZXJjb250ZW50LmNvbS9zZWFyY2g/cT1jYWNoZTp2MWhwMFNTOFdnZ0o6aHR0cHM6Ly93d3cubmNhdXNhLm9yZy9hYm91dC1jb2ZmZWUvaGlzdG9yeS1vZi1jb2ZmZWUrJmNkPTE2JmhsPWVuJmN0PWNsbmsmZ2w9dXNcIixcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOiA0LFxuICAgIHRpdGxlOiBcIjkgSGVhbHRoIEJlbmVmaXRzIG9mIENvZmZlZSwgQmFzZWQgb24gU2NpZW5jZSAtIEhlYWx0aGxpbmVcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmhlYWx0aGxpbmUuY29tL251dHJpdGlvbi90b3AtZXZpZGVuY2UtYmFzZWQtaGVhbHRoLWJlbmVmaXRzLW9mLWNvZmZlZVwiLFxuICAgIGRpc3BsYXllZF9saW5rOlxuICAgICAgXCJodHRwczovL3d3dy5oZWFsdGhsaW5lLmNvbSDigLogbnV0cml0aW9uIOKAuiB0b3AtZXZpZGVuY2UtYi4uLlwiLFxuICAgIHNuaXBwZXQ6XG4gICAgICBcIkNvZmZlZSBpcyBhIG1ham9yIHNvdXJjZSBvZiBhbnRpb3hpZGFudHMgaW4gdGhlIGRpZXQuIEl0IGhhcyBtYW55IGhlYWx0aCBiZW5lZml0cywgc3VjaCBhcyBpbXByb3ZlZCBicmFpbiBmdW5jdGlvbiBhbmQgYSBsb3dlciByaXNrIG9mIHNldmVyYWwgZGlzZWFzZXMuXCIsXG4gICAgc25pcHBldF9oaWdobGlnaHRlZF93b3JkczogW1wiQ29mZmVlXCJdLFxuICAgIHNpdGVsaW5rczoge1xuICAgICAgaW5saW5lOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogXCIxLiBCb29zdHMgRW5lcmd5IExldmVsc1wiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuaGVhbHRobGluZS5jb20vbnV0cml0aW9uL3RvcC1ldmlkZW5jZS1iYXNlZC1oZWFsdGgtYmVuZWZpdHMtb2YtY29mZmVlIzp+OnRleHQ9MS4lMjBCb29zdHMlMjBlbmVyZ3klMjBsZXZlbHNcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRpdGxlOiBcIjIuIE1heSBCZSBMaW5rZWQgVG8gQSBMb3dlci4uLlwiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuaGVhbHRobGluZS5jb20vbnV0cml0aW9uL3RvcC1ldmlkZW5jZS1iYXNlZC1oZWFsdGgtYmVuZWZpdHMtb2YtY29mZmVlIzp+OnRleHQ9Mi4lMjBNYXklMjBiZSUyMGxpbmtlZCUyMHRvJTIwYSUyMGxvd2VyJTIwcmlzayUyMG9mJTIwdHlwZSUyMDIlMjBkaWFiZXRlc1wiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGl0bGU6IFwiMy4gQ291bGQgU3VwcG9ydCBCcmFpbi4uLlwiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuaGVhbHRobGluZS5jb20vbnV0cml0aW9uL3RvcC1ldmlkZW5jZS1iYXNlZC1oZWFsdGgtYmVuZWZpdHMtb2YtY29mZmVlIzp+OnRleHQ9My4lMjBDb3VsZCUyMHN1cHBvcnQlMjBicmFpbiUyMGhlYWx0aFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIGFib3V0X3RoaXNfcmVzdWx0OiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJIZWFsdGhsaW5lIE1lZGlhLCBJbmMuIGlzIGFuIEFtZXJpY2FuIHdlYnNpdGUgYW5kIHByb3ZpZGVyIG9mIGhlYWx0aCBpbmZvcm1hdGlvbiBoZWFkcXVhcnRlcmVkIGluIFNhbiBGcmFuY2lzY28sIENhbGlmb3JuaWEuIEl0IHdhcyBmb3VuZGVkIGluIGl0cyBjdXJyZW50IGZvcm0gMjAwNiBhbmQgZXN0YWJsaXNoZWQgYXMgYSBzdGFuZGFsb25lIGVudGl0eSBpbiBKYW51YXJ5IDIwMTYuXCIsXG4gICAgICAgIGljb246IFwiaHR0cHM6Ly9zZXJwYXBpLmNvbS9zZWFyY2hlcy82MmMxYmE5ZWY1NWQ3NzRkZmQwMThhMDMvaW1hZ2VzL2I3Y2M2N2EyYjc4ZGJiNDY3ZmQ3M2RhM2E1YzgzZGUzMzljMmI4ZGMyZDE3ZjIzNTY3Yzc3ZTBiYmMyZjAxNDM4NmZiMjUxODJhNjRjZTlmZTc5MDAyZDNlMTlhMzdlNC5wbmdcIixcbiAgICAgIH0sXG4gICAgICBrZXl3b3JkczogW1wiY29mZmVlXCJdLFxuICAgICAgbGFuZ3VhZ2VzOiBbXCJFbmdsaXNoXCJdLFxuICAgICAgcmVnaW9uczogW1widGhlIFVuaXRlZCBTdGF0ZXNcIl0sXG4gICAgfSxcbiAgICBhYm91dF9wYWdlX2xpbms6XG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9QWJvdXQraHR0cHM6Ly93d3cuaGVhbHRobGluZS5jb20vbnV0cml0aW9uL3RvcC1ldmlkZW5jZS1iYXNlZC1oZWFsdGgtYmVuZWZpdHMtb2YtY29mZmVlJnRibT1pbHAmaWxwcz1BRE5NQ2kwMDV6UDM0TG9WbGd0U1ljVDNrNmVwNEhnWlBRXCIsXG4gICAgY2FjaGVkX3BhZ2VfbGluazpcbiAgICAgIFwiaHR0cHM6Ly93ZWJjYWNoZS5nb29nbGV1c2VyY29udGVudC5jb20vc2VhcmNoP3E9Y2FjaGU6cjFVVzZGR3ozRjRKOmh0dHBzOi8vd3d3LmhlYWx0aGxpbmUuY29tL251dHJpdGlvbi90b3AtZXZpZGVuY2UtYmFzZWQtaGVhbHRoLWJlbmVmaXRzLW9mLWNvZmZlZSsmY2Q9MTcmaGw9ZW4mY3Q9Y2xuayZnbD11c1wiLFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IDUsXG4gICAgdGl0bGU6IFwiY29mZmVlIHwgT3JpZ2luLCBUeXBlcywgVXNlcywgSGlzdG9yeSwgJiBGYWN0cyB8IEJyaXRhbm5pY2FcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmJyaXRhbm5pY2EuY29tL3RvcGljL2NvZmZlZVwiLFxuICAgIGRpc3BsYXllZF9saW5rOiBcImh0dHBzOi8vd3d3LmJyaXRhbm5pY2EuY29tIOKAuiAuLi4g4oC6IEZvb2RcIixcbiAgICBkYXRlOiBcIk1heSAxNywgMjAyMlwiLFxuICAgIHNuaXBwZXQ6XG4gICAgICBcImNvZmZlZSwgYmV2ZXJhZ2UgYnJld2VkIGZyb20gdGhlIHJvYXN0ZWQgYW5kIGdyb3VuZCBzZWVkcyBvZiB0aGUgdHJvcGljYWwgZXZlcmdyZWVuIGNvZmZlZSBwbGFudHMgb2YgQWZyaWNhbiBvcmlnaW4uIENvZmZlZSBpcyBvbmUgb2YgdGhlIC4uLlwiLFxuICAgIHNuaXBwZXRfaGlnaGxpZ2h0ZWRfd29yZHM6IFtcImNvZmZlZVwiLCBcImNvZmZlZVwiLCBcIkNvZmZlZVwiXSxcbiAgICBhYm91dF90aGlzX3Jlc3VsdDoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgIFwiYnJpdGFubmljYS5jb20gd2FzIGZpcnN0IGluZGV4ZWQgYnkgR29vZ2xlIG1vcmUgdGhhbiAxMCB5ZWFycyBhZ29cIixcbiAgICAgICAgaWNvbjogXCJodHRwczovL3NlcnBhcGkuY29tL3NlYXJjaGVzLzYyYzFiYTllZjU1ZDc3NGRmZDAxOGEwMy9pbWFnZXMvYjdjYzY3YTJiNzhkYmI0NjdmZDczZGEzYTVjODNkZTNkOTRiOTY0MmY5ZTczZWFlNTMxMzlkNjI4MDg1ZDg0MGM0ODNkNzg1MWEyZDM1OWZhMGFkOTkxMzAyZGQ0ZGMzLnBuZ1wiLFxuICAgICAgfSxcbiAgICAgIGtleXdvcmRzOiBbXCJjb2ZmZWVcIl0sXG4gICAgICBsYW5ndWFnZXM6IFtcIkVuZ2xpc2hcIl0sXG4gICAgICByZWdpb25zOiBbXCJ0aGUgVW5pdGVkIFN0YXRlc1wiXSxcbiAgICB9LFxuICAgIGFib3V0X3BhZ2VfbGluazpcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1BYm91dCtodHRwczovL3d3dy5icml0YW5uaWNhLmNvbS90b3BpYy9jb2ZmZWUmdGJtPWlscCZpbHBzPUFETk1DaTB4RzJBQms1ZzlCckJ3aWF3eEJzQkhNQXdyOEFcIixcbiAgICBjYWNoZWRfcGFnZV9saW5rOlxuICAgICAgXCJodHRwczovL3dlYmNhY2hlLmdvb2dsZXVzZXJjb250ZW50LmNvbS9zZWFyY2g/cT1jYWNoZTpXaWtidTRpcFUyOEo6aHR0cHM6Ly93d3cuYnJpdGFubmljYS5jb20vdG9waWMvY29mZmVlKyZjZD0xOCZobD1lbiZjdD1jbG5rJmdsPXVzXCIsXG4gICAgcmVsYXRlZF9wYWdlc19saW5rOlxuICAgICAgXCJodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPXJlbGF0ZWQ6aHR0cHM6Ly93d3cuYnJpdGFubmljYS5jb20vdG9waWMvY29mZmVlK0NvZmZlZVwiLFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IDYsXG4gICAgdGl0bGU6IFwiUGVldCdzIENvZmZlZTogVGhlIE9yaWdpbmFsIENyYWZ0IENvZmZlZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cucGVldHMuY29tL1wiLFxuICAgIGRpc3BsYXllZF9saW5rOiBcImh0dHBzOi8vd3d3LnBlZXRzLmNvbVwiLFxuICAgIHNuaXBwZXQ6XG4gICAgICBcIlNpbmNlIDE5NjYsIFBlZXQncyBDb2ZmZWUgaGFzIG9mZmVyZWQgc3VwZXJpb3IgY29mZmVlcyBhbmQgdGVhcyBieSBzb3VyY2luZyB0aGUgYmVzdCBxdWFsaXR5IGNvZmZlZSBiZWFucyBhbmQgdGVhIGxlYXZlcyBpbiB0aGUgd29ybGQgYW5kIGFkaGVyaW5nIHRvIHN0cmljdCAuLi5cIixcbiAgICBzbmlwcGV0X2hpZ2hsaWdodGVkX3dvcmRzOiBbXCJDb2ZmZWVcIiwgXCJjb2ZmZWVzXCIsIFwiY29mZmVlXCJdLFxuICAgIGFib3V0X3RoaXNfcmVzdWx0OiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJQZWV0J3MgQ29mZmVlIGlzIGEgU2FuIEZyYW5jaXNjbyBCYXkgQXJlYS1iYXNlZCBzcGVjaWFsdHkgY29mZmVlIHJvYXN0ZXIgYW5kIHJldGFpbGVyIG93bmVkIGJ5IEpBQiBIb2xkaW5nIENvbXBhbnkgdmlhIEpERSBQZWV0J3MuXCIsXG4gICAgICAgIGljb246IFwiaHR0cHM6Ly9zZXJwYXBpLmNvbS9zZWFyY2hlcy82MmMxYmE5ZWY1NWQ3NzRkZmQwMThhMDMvaW1hZ2VzL2I3Y2M2N2EyYjc4ZGJiNDY3ZmQ3M2RhM2E1YzgzZGUzN2RmNzI1YTQzN2Y3Y2U5NzM3ZWIxZGQ2YjM5OTk3NzcwNjM1NTIzYmY1ZTI4ZjkxNGE1MTQ1NGMyNzY5ZTE2Mi5wbmdcIixcbiAgICAgIH0sXG4gICAgICBrZXl3b3JkczogW1wiY29mZmVlXCJdLFxuICAgICAgcmVsYXRlZF9rZXl3b3JkczogW1wiY29mZmVlc1wiXSxcbiAgICAgIGxhbmd1YWdlczogW1wiRW5nbGlzaFwiXSxcbiAgICAgIHJlZ2lvbnM6IFtcIkNhbGlmb3JuaWFcIl0sXG4gICAgfSxcbiAgICBhYm91dF9wYWdlX2xpbms6XG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9QWJvdXQraHR0cHM6Ly93d3cucGVldHMuY29tLyZ0Ym09aWxwJmlscHM9QUROTUNpMnhxZ2lNU3pFeVR3Zy1RZXd1VlFZR2N0ekNsd1wiLFxuICAgIGNhY2hlZF9wYWdlX2xpbms6XG4gICAgICBcImh0dHBzOi8vd2ViY2FjaGUuZ29vZ2xldXNlcmNvbnRlbnQuY29tL3NlYXJjaD9xPWNhY2hlOkJDanpubzZ6UDZ3SjpodHRwczovL3d3dy5wZWV0cy5jb20vKyZjZD0xOSZobD1lbiZjdD1jbG5rJmdsPXVzXCIsXG4gICAgcmVsYXRlZF9wYWdlc19saW5rOlxuICAgICAgXCJodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPXJlbGF0ZWQ6aHR0cHM6Ly93d3cucGVldHMuY29tLytDb2ZmZWVcIixcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOiA3LFxuICAgIHRpdGxlOiBcIlN0YXJidWNrcyBDb2ZmZWUgQ29tcGFueVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuc3RhcmJ1Y2tzLmNvbS9cIixcbiAgICBkaXNwbGF5ZWRfbGluazogXCJodHRwczovL3d3dy5zdGFyYnVja3MuY29tXCIsXG4gICAgc25pcHBldDpcbiAgICAgIFwiTW9yZSB0aGFuIGp1c3QgZ3JlYXQgY29mZmVlLiBFeHBsb3JlIHRoZSBtZW51LCBzaWduIHVwIGZvciBTdGFyYnVja3PCriBSZXdhcmRzLCBtYW5hZ2UgeW91ciBnaWZ0IGNhcmQgYW5kIG1vcmUuXCIsXG4gICAgc25pcHBldF9oaWdobGlnaHRlZF93b3JkczogW1wiY29mZmVlXCJdLFxuICAgIGFib3V0X3RoaXNfcmVzdWx0OiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJTdGFyYnVja3MgQ29ycG9yYXRpb24gaXMgYW4gQW1lcmljYW4gbXVsdGluYXRpb25hbCBjaGFpbiBvZiBjb2ZmZWVob3VzZXMgYW5kIHJvYXN0ZXJ5IHJlc2VydmVzIGhlYWRxdWFydGVyZWQgaW4gU2VhdHRsZSwgV2FzaGluZ3Rvbi4gSXQgaXMgdGhlIHdvcmxkJ3MgbGFyZ2VzdCBjb2ZmZWVob3VzZSBjaGFpbi5cXG5BcyBvZiBOb3ZlbWJlciAyMDIxLCB0aGUgY29tcGFueSBoYWQgMzMsODMzIHN0b3JlcyBpbiA4MCBjb3VudHJpZXMsIDE1LDQ0NCBvZiB3aGljaCB3ZXJlIGxvY2F0ZWQgaW4gdGhlIFVuaXRlZCBTdGF0ZXMuXCIsXG4gICAgICAgIGljb246IFwiaHR0cHM6Ly9zZXJwYXBpLmNvbS9zZWFyY2hlcy82MmMxYmE5ZWY1NWQ3NzRkZmQwMThhMDMvaW1hZ2VzL2I3Y2M2N2EyYjc4ZGJiNDY3ZmQ3M2RhM2E1YzgzZGUzYWQ5MTZiMjQ3YTUzMzYwZjA4NzdiZWQ5ZWJhNTVkZDdmMDJmNGNjM2IwMjk0OGM5ODM0OWQyMjdiN2UwYzNhMS5wbmdcIixcbiAgICAgIH0sXG4gICAgICBrZXl3b3JkczogW1wiY29mZmVlXCJdLFxuICAgICAgbGFuZ3VhZ2VzOiBbXCJFbmdsaXNoXCJdLFxuICAgICAgcmVnaW9uczogW1widGhlIFVuaXRlZCBTdGF0ZXNcIl0sXG4gICAgfSxcbiAgICBhYm91dF9wYWdlX2xpbms6XG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9QWJvdXQraHR0cHM6Ly93d3cuc3RhcmJ1Y2tzLmNvbS8mdGJtPWlscCZpbHBzPUFETk1DaTBjTXlWMEg3S2RCbDRkX3ZhYzd1MFIxb3VHWWdcIixcbiAgICBjYWNoZWRfcGFnZV9saW5rOlxuICAgICAgXCJodHRwczovL3dlYmNhY2hlLmdvb2dsZXVzZXJjb250ZW50LmNvbS9zZWFyY2g/cT1jYWNoZToxdkdYZ29fRmxIa0o6aHR0cHM6Ly93d3cuc3RhcmJ1Y2tzLmNvbS8rJmNkPTIwJmhsPWVuJmN0PWNsbmsmZ2w9dXNcIixcbiAgICByZWxhdGVkX3BhZ2VzX2xpbms6XG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9cmVsYXRlZDpodHRwczovL3d3dy5zdGFyYnVja3MuY29tLytDb2ZmZWVcIixcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOiA4LFxuICAgIHRpdGxlOiBcIkNvZmZlZSB8IFRoZSBOdXRyaXRpb24gU291cmNlXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5oc3BoLmhhcnZhcmQuZWR1L251dHJpdGlvbnNvdXJjZS9mb29kLWZlYXR1cmVzL2NvZmZlZS9cIixcbiAgICBkaXNwbGF5ZWRfbGluazogXCJodHRwczovL3d3dy5oc3BoLmhhcnZhcmQuZWR1IOKAuiAuLi4g4oC6IEZvb2QgRmVhdHVyZXNcIixcbiAgICBzbmlwcGV0OlxuICAgICAgXCJDb2ZmZWUgYmVhbnMgYXJlIHRoZSBzZWVkcyBvZiBhIGZydWl0IGNhbGxlZCBhIGNvZmZlZSBjaGVycnkuIENvZmZlZSBjaGVycmllcyBncm93IG9uIGNvZmZlZSB0cmVlcyBmcm9tIGEgZ2VudXMgb2YgcGxhbnRzIGNhbGxlZCBDb2ZmZWEuIFRoZXJlIGFyZSBhIHdpZGUgLi4uXCIsXG4gICAgc25pcHBldF9oaWdobGlnaHRlZF93b3JkczogW1wiQ29mZmVlXCIsIFwiY29mZmVlXCIsIFwiQ29mZmVlXCIsIFwiY29mZmVlXCJdLFxuICAgIHNpdGVsaW5rczoge1xuICAgICAgaW5saW5lOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogXCJDb2ZmZWUgQW5kIEhlYWx0aFwiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuaHNwaC5oYXJ2YXJkLmVkdS9udXRyaXRpb25zb3VyY2UvZm9vZC1mZWF0dXJlcy9jb2ZmZWUvIzp+OnRleHQ9Q29mZmVlJTIwYW5kJTIwSGVhbHRoXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogXCJUeXBlc1wiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuaHNwaC5oYXJ2YXJkLmVkdS9udXRyaXRpb25zb3VyY2UvZm9vZC1mZWF0dXJlcy9jb2ZmZWUvIzp+OnRleHQ9VHlwZXMsLUNvZmZlZSUyMGJlYW5zJTIwYXJlJTIwdGhlJTIwc2VlZHNcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRpdGxlOiBcIk1ha2VcIixcbiAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmhzcGguaGFydmFyZC5lZHUvbnV0cml0aW9uc291cmNlL2Zvb2QtZmVhdHVyZXMvY29mZmVlLyM6fjp0ZXh0PVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIGFib3V0X3RoaXNfcmVzdWx0OiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJUaGUgSGFydmFyZCBULkguIENoYW4gU2Nob29sIG9mIFB1YmxpYyBIZWFsdGggaXMgdGhlIHB1YmxpYyBoZWFsdGggc2Nob29sIG9mIEhhcnZhcmQgVW5pdmVyc2l0eSwgbG9jYXRlZCBpbiB0aGUgTG9uZ3dvb2QgTWVkaWNhbCBBcmVhIG9mIEJvc3RvbiwgTWFzc2FjaHVzZXR0cy5cIixcbiAgICAgICAgaWNvbjogXCJodHRwczovL3NlcnBhcGkuY29tL3NlYXJjaGVzLzYyYzFiYTllZjU1ZDc3NGRmZDAxOGEwMy9pbWFnZXMvYjdjYzY3YTJiNzhkYmI0NjdmZDczZGEzYTVjODNkZTMyMjlhYWU3MjQ1OWQ1MmRlZjg5NDI5ZGRjYjFkNTM0M2Y3N2RlYjJmNDY1N2RlNzNlNGY3MTYwNzYzNWUzYWUzLnBuZ1wiLFxuICAgICAgfSxcbiAgICAgIGtleXdvcmRzOiBbXCJjb2ZmZWVcIl0sXG4gICAgICBsYW5ndWFnZXM6IFtcIkVuZ2xpc2hcIl0sXG4gICAgICByZWdpb25zOiBbXCJ0aGUgVW5pdGVkIFN0YXRlc1wiXSxcbiAgICB9LFxuICAgIGFib3V0X3BhZ2VfbGluazpcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1BYm91dCtodHRwczovL3d3dy5oc3BoLmhhcnZhcmQuZWR1L251dHJpdGlvbnNvdXJjZS9mb29kLWZlYXR1cmVzL2NvZmZlZS8mdGJtPWlscCZpbHBzPUFETk1DaTNGNFJPX0RJcWpjbTlWVUNYbWZtcHFyWDVoM3dcIixcbiAgICBjYWNoZWRfcGFnZV9saW5rOlxuICAgICAgXCJodHRwczovL3dlYmNhY2hlLmdvb2dsZXVzZXJjb250ZW50LmNvbS9zZWFyY2g/cT1jYWNoZTphQ1FGUjBFV2dQd0o6aHR0cHM6Ly93d3cuaHNwaC5oYXJ2YXJkLmVkdS9udXRyaXRpb25zb3VyY2UvZm9vZC1mZWF0dXJlcy9jb2ZmZWUvKyZjZD0yNCZobD1lbiZjdD1jbG5rJmdsPXVzXCIsXG4gIH0sXG5dO1xuXG5jb25zdCBnZXRTZXJwID0gKHNlYXJjaFRlcm0pID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgdmFyIHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgcmVkaXJlY3Q6IFwiZm9sbG93XCIsXG4gICAgfTtcblxuICAgIGZldGNoKFxuICAgICAgYGh0dHBzOi8vc2VycGFwaS5jb20vc2VhcmNoLmpzb24/ZW5naW5lPWdvb2dsZSZxPSR7c2VhcmNoVGVybX0mYXBpX2tleT0ke3NlcnBBUElLRVl9Jm51bT03N2AsXG4gICAgICByZXF1ZXN0T3B0aW9uc1xuICAgIClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4gcmVzb2x2ZShyZXN1bHQpKVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4gY29uc29sZS5sb2coXCJlcnJvclwiLCBlcnJvcikpO1xuICB9KTtcbn07XG5cbmNvbnN0IGdvb2dsZVNlYXJjaCA9IChzZWFyY2hUZXJtKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBzZXJwUmVzID0gYXdhaXQgZ2V0U2VycChzZWFyY2hUZXJtKTtcbiAgICBjb25zb2xlLmxvZyhzZXJwUmVzKTtcblxuICAgIGxldCBzdG9yYWdlUmVzID0gYXdhaXQgZ2V0RnJvbVN0b3JhZ2UoW1wiaGlzdG9yeVwiLCBcInN0YXRpY1Jlc3VsdFwiXSk7XG4gICAgaWYgKCFzdG9yYWdlUmVzLmhpc3RvcnkpIHJldHVybjtcblxuICAgIHN0b3JhZ2VSZXMuaGlzdG9yeS5wdXNoKHtcbiAgICAgIHNlYXJjaFRlcm06IHNlYXJjaFRlcm0sXG4gICAgICBkYXRlOiBuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKCksXG4gICAgICB1cmw6IHNlcnBSZXMuc2VhcmNoX21ldGFkYXRhLmdvb2dsZV91cmwsXG4gICAgICBzdWJtaXR0ZWQ6IGZhbHNlLFxuICAgIH0pO1xuICAgIHNhdmVUb1N0b3JhZ2UoeyBoaXN0b3J5OiBzdG9yYWdlUmVzLmhpc3RvcnkgfSk7XG4gICAgbGV0IHN1Ym1pdHRlZENvdW50ID0gc3RvcmFnZVJlcy5oaXN0b3J5LmZpbHRlcigoaCkgPT4gaC5zdWJtaXR0ZWQpO1xuICAgIGxldCByZXZlcmVzZWQgPSBzZXJwUmVzLm9yZ2FuaWNfcmVzdWx0cy5yZXZlcnNlKCk7XG4gICAgY29uc29sZS5sb2cocmV2ZXJlc2VkKTtcbiAgICBsZXQgZGF0YSA9IFtdO1xuICAgIGNvbnNvbGUubG9nKHN1Ym1pdHRlZENvdW50KTtcbiAgICBpZiAoc3VibWl0dGVkQ291bnQubGVuZ3RoID09PSAwKSBzdWJtaXR0ZWRDb3VudC5sZW5ndGggPSAzO1xuICAgIGZvciAoXG4gICAgICBsZXQgaSA9IDA7XG4gICAgICBpIDwgTWF0aC5mbG9vcihyZXZlcmVzZWQubGVuZ3RoICogKHN1Ym1pdHRlZENvdW50Lmxlbmd0aCAvIDMpKTtcbiAgICAgIGkrK1xuICAgICkge1xuICAgICAgZGF0YS5wdXNoKHJldmVyZXNlZFtpXSk7XG4gICAgfVxuICAgIHJlc29sdmUoZGF0YSk7XG4gIH0pO1xufTtcblxuY29uc3QgdG9NaW5zQW5kU2VjcyA9IChtaWxsaXMpID0+IHtcbiAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKG1pbGxpcyAvIDYwMDAwKTtcbiAgbGV0IHNlY29uZHMgPSAoKG1pbGxpcyAlIDYwMDAwKSAvIDEwMDApLnRvRml4ZWQoMCk7XG4gIHJldHVybiBgJHttaW51dGVzfSA6JHtzZWNvbmRzIDwgMTAgPyBcIjBcIiA6IFwiXCJ9JHtzZWNvbmRzfWA7XG59O1xuXG5jb25zdCBzdWJtaXRUYXNrID0gYXN5bmMgKHRhc2spID0+IHtcbiAgbGV0IHN0b3JhZ2VSZXMgPSBhd2FpdCBnZXRGcm9tU3RvcmFnZShbXG4gICAgXCJ1c2VySWRcIixcbiAgICBcImhpc3RvcnlcIixcbiAgICBcInN1Ym1pdHRlZEtleXdvcmRzXCIsXG4gIF0pO1xuICBpZiAoc3RvcmFnZVJlcy51c2VySWQgJiYgc3RvcmFnZVJlcy5oaXN0b3J5KSB7XG4gICAgbGV0IGhpc3RvcnkgPSBzdG9yYWdlUmVzLmhpc3Rvcnk7XG4gICAgY29uc3QgcmF3ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgdXNlcklkOiBzdG9yYWdlUmVzLnVzZXJJZCxcbiAgICAgIGtleXdvcmQ6IHRhc2sua2V5d29yZCxcbiAgICAgIHRpbWVUYWtlbjogdG9NaW5zQW5kU2VjcyhcbiAgICAgICAgRGF0ZS5ub3coKSAtIG5ldyBEYXRlKGhpc3RvcnlbaGlzdG9yeS5sZW5ndGggLSAxXS5kYXRlKVxuICAgICAgKSxcbiAgICAgIHVybDogdGFzay5saW5rLFxuICAgICAgdHlwZTogXCJzdWJtaXRUYXNrXCIsXG4gICAgfSk7XG4gICAgc3RvcmFnZVJlcy5zdWJtaXR0ZWRLZXl3b3Jkcy5wdXNoKHRhc2sua2V5d29yZCk7XG4gICAgc2F2ZVRvU3RvcmFnZSh7IHN1Ym1pdHRlZEtleXdvcmRzOiBzdG9yYWdlUmVzLnN1Ym1pdHRlZEtleXdvcmRzIH0pO1xuICAgIGNvbnNvbGUubG9nKHJhdyk7XG4gICAgbGV0IGRvbmUgPSBhd2FpdCBwb3N0RGF0YShyYXcpO1xuICB9XG59O1xuXG5jb25zdCBnZXRCcm93c2luZ1dlZWsgPSAoKSA9PiB7XG4gIGZldGNoKGAke0FQSVVSTH0/dHlwZT1rZXl3b3Jkc2ApXG4gICAgLnRoZW4oKHJlc3VsdCkgPT4gcmVzdWx0Lmpzb24oKSlcbiAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICBzYXZlVG9TdG9yYWdlKHsgYnJvd3NpbmdXZWVrOiBkYXRhLmRhdGEgfSk7XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5sb2coZXJyKSk7XG59O1xuY29uc3QgZ2V0V2VlazIgPSAoKSA9PiB7XG4gIGZldGNoKGAke0FQSVVSTH0/dHlwZT13ZWVrXzJgKVxuICAgIC50aGVuKChyZXN1bHQpID0+IHJlc3VsdC5qc29uKCkpXG4gICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgc2F2ZVRvU3RvcmFnZSh7IHdlZWtUd29LZXl3b3JkczogZGF0YS5kYXRhIH0pO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUubG9nKGVycikpO1xufTtcblxuY29uc3QgZ2V0U2VydmV5ID0gYXN5bmMgKCkgPT4ge1xuICBsZXQgc3RvcmFnZVJlcyA9IGF3YWl0IGdldEZyb21TdG9yYWdlKFwic2VydmV5UXVlc3Rpb25zXCIpO1xuICBmZXRjaChgJHtBUElVUkx9P3R5cGU9c3VydmV5UXVlc2lvbnNgKVxuICAgIC50aGVuKChyZXN1bHQpID0+IHJlc3VsdC5qc29uKCkpXG4gICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgbGV0IGZpbHRlcmVkID0gW107XG4gICAgICBpZiAoIXN0b3JhZ2VSZXMuc2VydmV5UXVlc3Rpb25zKSB7XG4gICAgICAgIHNhdmVUb1N0b3JhZ2UoeyBzZXJ2ZXlRdWVzdGlvbnM6IGRhdGEuZGF0YSB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgZCBvZiBkYXRhLmRhdGEpIHtcbiAgICAgICAgbGV0IGZvdW5kID0gc3RvcmFnZVJlcy5zZXJ2ZXlRdWVzdGlvbnMuZmluZChcbiAgICAgICAgICAocykgPT4gcy5xdWVzdGlvbiA9PT0gZC5xdWVzdGlvblxuICAgICAgICApO1xuICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgZmlsdGVyZWQucHVzaChkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3RvcmFnZVJlcy5zZXJ2ZXlRdWVzdGlvbnMgPSBbXG4gICAgICAgICAgLi4uc3RvcmFnZVJlcy5zZXJ2ZXlRdWVzdGlvbnMsXG4gICAgICAgICAgLi4uZmlsdGVyZWQsXG4gICAgICAgIF07XG4gICAgICAgIHNhdmVUb1N0b3JhZ2UoeyBzZXJ2ZXlRdWVzdGlvbnM6IHN0b3JhZ2VSZXMuc2VydmV5UXVlc3Rpb25zIH0pO1xuICAgICAgfVxuICAgIH0pXG4gICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUubG9nKGVycikpO1xufTtcblxuY29uc3QgYW5zd2VyU2VydmV5ID0gKGRhdGEpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgbGV0IHN0b3JhZ2VSZXMgPSBhd2FpdCBnZXRGcm9tU3RvcmFnZShbXCJ1c2VySWRcIiwgXCJzZXJ2ZXlRdWVzdGlvbnNcIl0pO1xuICAgIGNvbnN0IHJhdyA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHVzZXJJZDogc3RvcmFnZVJlcy51c2VySWQsXG4gICAgICB0eXBlOiBcInNlcnZleUFuc3dlcnNcIixcbiAgICAgIHNlcnZleTogZGF0YSxcbiAgICB9KTtcblxuICAgIGxldCByZXMgPSBhd2FpdCBwb3N0RGF0YShyYXcpO1xuICAgIGZvciAobGV0IGFuc3dlcmVkIG9mIGRhdGEpIHtcbiAgICAgIGxldCBpbmRleCA9IHN0b3JhZ2VSZXMuc2VydmV5UXVlc3Rpb25zLmluZGV4T2YoXG4gICAgICAgIHN0b3JhZ2VSZXMuc2VydmV5UXVlc3Rpb25zLmZpbmQoKHMpID0+IHMucXVlc3Rpb24gPT09IGFuc3dlcmVkLnF1ZXN0aW9uKVxuICAgICAgKTtcbiAgICAgIHN0b3JhZ2VSZXMuc2VydmV5UXVlc3Rpb25zW2luZGV4XS5hbnN3ZXIgPSBhbnN3ZXJlZC5hbnN3ZXI7XG4gICAgfVxuICAgIHNhdmVUb1N0b3JhZ2UoeyBzZXJ2ZXlRdWVzdGlvbnM6IHN0b3JhZ2VSZXMuc2VydmV5UXVlc3Rpb25zIH0pO1xuICAgIHJlc29sdmUocmVzKTtcbiAgfSk7XG59O1xuXG5jb25zdCBnZXRIaXN0b3J5ID0gKCkgPT5cbiAgbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICBsZXQgc3RvcmFnZVJlcyA9IGF3YWl0IGdldEZyb21TdG9yYWdlKFwiaGlzdG9yeVwiKTtcbiAgICAvLyBjb25zb2xlLmxvZyhzdG9yYWdlUmVzKTtcbiAgICBpZiAoc3RvcmFnZVJlcy5oaXN0b3J5KSByZXNvbHZlKHN0b3JhZ2VSZXMuaGlzdG9yeSk7XG4gIH0pO1xuXG5jb25zdCBwb3N0RGF0YSA9IChkYXRhKSA9PiB7XG4gIGNvbnNvbGUubG9nKGRhdGEpO1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBjb25zdCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIG15SGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuXG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxuICAgICAgYm9keTogZGF0YSxcbiAgICAgIHJlZGlyZWN0OiBcImZvbGxvd1wiLFxuICAgIH07XG5cbiAgICBmZXRjaChBUElVUkwsIHJlcXVlc3RPcHRpb25zKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAudGhlbigocmVzdWx0KSA9PiByZXNvbHZlKHJlc3VsdCkpXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiBjb25zb2xlLmxvZyhcImVycm9yXCIsIGVycm9yKSk7XG4gIH0pO1xufTtcblxuY29uc3QgYXV0aFVzZXIgPSAodXNlcklkKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgIGNvbnN0IHJhdyA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgdHlwZTogXCJhdXRoVXNlclwiLFxuICAgIH0pO1xuXG4gICAgbGV0IHJlcyA9IGF3YWl0IHBvc3REYXRhKHJhdyk7XG4gICAgcmVzb2x2ZShyZXMpO1xuICB9KTtcbn07XG5cbmNvbnN0IHVwbG9hZEhpc3RvcnkgPSAoZGF0YSkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICBsZXQgc3RvcmFnZVJlcyA9IGF3YWl0IGdldEZyb21TdG9yYWdlKFtcInVzZXJJZFwiLCBcImhpc3RvcnlcIl0pO1xuICAgIGlmIChzdG9yYWdlUmVzLnVzZXJJZCAmJiBzdG9yYWdlUmVzLmhpc3RvcnkpIHtcbiAgICAgIGNvbnN0IHJhdyA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgdXNlcklkOiBzdG9yYWdlUmVzLnVzZXJJZCxcbiAgICAgICAgaGlzdG9yeTogZGF0YSxcbiAgICAgICAgdHlwZTogXCJ1cGxvYWRIaXN0b3J5XCIsXG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUubG9nKHJhdyk7XG4gICAgICBsZXQgZG9uZSA9IGF3YWl0IHBvc3REYXRhKHJhdyk7XG4gICAgICByZXNvbHZlKGRvbmUpO1xuXG4gICAgICBmb3IgKGxldCBoIG9mIHN0b3JhZ2VSZXMuaGlzdG9yeSkge1xuICAgICAgICBsZXQgZm91bmQgPSBkYXRhLmZpbmQoKGQpID0+IGQudXJsID09PSBoLnVybCAmJiBkLmRhdGUgPT09IGguZGF0ZSk7XG4gICAgICAgIGlmIChmb3VuZCkgaC5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgc2F2ZVRvU3RvcmFnZSh7IGhpc3Rvcnk6IHN0b3JhZ2VSZXMuaGlzdG9yeSB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3Qgc2F2ZVRvU3RvcmFnZSA9IChvYmopID0+XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KG9iaiwgKHJlcykgPT4gcmVzb2x2ZSh0cnVlKSk7XG4gIH0pO1xuXG5jb25zdCBnZXRGcm9tU3RvcmFnZSA9IChhcnIpID0+XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KGFyciwgKHJlcykgPT4gcmVzb2x2ZShyZXMpKTtcbiAgfSk7XG5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCgpID0+IHtcbiAgY29uc3QgZGVmU2V0dGluZ3MgPSB7XG4gICAgZmlyc3RUaW1lOiB0cnVlLFxuICAgIHVzZXJJZDogbnVsbCxcbiAgICBjcmVkaXRzOiAwLFxuICAgIGJhbGFuY2U6IDAsXG4gICAgaGlzdG9yeTogW10sXG4gICAgd2Vla1R3b0tleXdvcmRzOiBbXSxcbiAgICB3aGl0ZWxpc3RlZEtleXdvcmRzOiBbXSxcbiAgICBzZWFyY2hIaXN0b3J5Q2hlY2s6IHRydWUsXG4gICAgc3RhdGljUmVzdWx0OiBzdGF0aWNSZXN1bHQsXG4gICAgc3VibWl0dGVkS2V5d29yZHM6IFtdLFxuICB9O1xuICBzYXZlVG9TdG9yYWdlKGRlZlNldHRpbmdzKTtcbn0pO1xuXG5jaHJvbWUuYWN0aW9uLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAodGFiKSB7XG4gIG9wZW5XaW5kb3coKTtcbn0pO1xuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZywgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgY29uc29sZS5sb2cobXNnKTtcbiAgaWYgKG1zZy5jb21tYW5kID09PSBcInNlYXJjaFwiKSB7XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIGxldCBzZXJwUmVzID0gYXdhaXQgZ29vZ2xlU2VhcmNoKG1zZy5kYXRhKTtcbiAgICAgIHNlbmRSZXNwb25zZShzZXJwUmVzKTtcbiAgICB9KSgpO1xuICB9XG4gIGlmIChtc2cuY29tbWFuZCA9PT0gXCJnZXRIaXN0b3J5XCIpIHtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IGhpc3RvcnkgPSBhd2FpdCBnZXRIaXN0b3J5KCk7XG4gICAgICBzZW5kUmVzcG9uc2UoaGlzdG9yeSk7XG4gICAgfSkoKTtcbiAgfVxuICBpZiAobXNnLmNvbW1hbmQgPT09IFwiY3JlYXRlVXNlclwiKSB7XG4gICAgY3JlYXRlVXNlcihtc2cuZGF0YSk7XG4gIH1cbiAgaWYgKG1zZy5jb21tYW5kID09PSBcInVwbG9hZEhpc3RvcnlcIikge1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgcmVzID0gYXdhaXQgdXBsb2FkSGlzdG9yeShtc2cuaGlzdG9yeSk7XG4gICAgICBzZW5kUmVzcG9uc2UocmVzKTtcbiAgICB9KSgpO1xuICB9XG4gIGlmIChtc2cuY29tbWFuZCA9PT0gXCJhdXRoVXNlclwiKSB7XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIGxldCByZXMgPSBhd2FpdCBhdXRoVXNlcihtc2cudXNlcklkKTtcbiAgICAgIHNlbmRSZXNwb25zZShyZXMpO1xuICAgIH0pKCk7XG4gIH1cbiAgaWYgKG1zZy5jb21tYW5kID09PSBcImdvb2dsZVNlYXJjaFwiKSB7XG4gICAgY29uc29sZS5sb2cobXNnLmRhdGEpO1xuICB9XG4gIGlmIChtc2cuY29tbWFuZCA9PT0gXCJvcGVuTGlua1wiKSB7XG4gICAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiBtc2cudXJsIH0pO1xuICB9XG4gIGlmIChtc2cuY29tbWFuZCA9PT0gXCJzdWJtaXRUYXNrXCIpIHtcbiAgICBzdWJtaXRUYXNrKG1zZy50YXNrKTtcbiAgfVxuICBpZiAobXNnLmNvbW1hbmQgPT09IFwiYW5zd2VyU2VydmV5XCIpIHtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IHJlcyA9IGFuc3dlclNlcnZleShtc2cuZGF0YSk7XG4gICAgICBzZW5kUmVzcG9uc2UocmVzKTtcbiAgICB9KSgpO1xuICB9XG4gIGlmIChtc2cuY29tbWFuZCA9PT0gXCJpbml0XCIpIHtcbiAgICBnZXRTZXJ2ZXkoKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5jb25zdCBvcGVuV2luZG93ID0gKCkgPT4ge1xuICBjaHJvbWUud2luZG93cy5nZXRDdXJyZW50KCh0YWJXaW5kb3cpID0+IHtcbiAgICBjb25zdCB3aWR0aCA9IDc2MDtcbiAgICBjb25zdCBoZWlnaHQgPSA1NzA7XG4gICAgY29uc3QgbGVmdCA9IE1hdGgucm91bmQoKHRhYldpbmRvdy53aWR0aCAtIHdpZHRoKSAqIDAuNSArIHRhYldpbmRvdy5sZWZ0KTtcbiAgICBjb25zdCB0b3AgPSBNYXRoLnJvdW5kKCh0YWJXaW5kb3cuaGVpZ2h0IC0gaGVpZ2h0KSAqIDAuNSArIHRhYldpbmRvdy50b3ApO1xuXG4gICAgY2hyb21lLndpbmRvd3MuY3JlYXRlKHtcbiAgICAgIGZvY3VzZWQ6IHRydWUsXG4gICAgICB1cmw6IGNocm9tZS5ydW50aW1lLmdldFVSTChcInBvcHVwLmh0bWxcIiksXG4gICAgICB0eXBlOiBcInBvcHVwXCIsXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIGxlZnQsXG4gICAgICB0b3AsXG4gICAgfSk7XG4gIH0pO1xufTtcblxuLy8vLy8vL1xuXG5jb25zdCBpbml0ID0gKCkgPT4ge1xuICBnZXRCcm93c2luZ1dlZWsoKTtcbiAgZ2V0V2VlazIoKTtcbiAgZ2V0U2VydmV5KCk7XG59O1xuXG5pbml0KCk7XG4iXSwibmFtZXMiOlsiQVBJVVJMIiwic2VycEFQSUtFWSIsInN0YXRpY1Jlc3VsdCIsInBvc2l0aW9uIiwidGl0bGUiLCJsaW5rIiwiZGlzcGxheWVkX2xpbmsiLCJ0aHVtYm5haWwiLCJzbmlwcGV0Iiwic25pcHBldF9oaWdobGlnaHRlZF93b3JkcyIsInNpdGVsaW5rcyIsImlubGluZSIsInJpY2hfc25pcHBldCIsImJvdHRvbSIsImV4dGVuc2lvbnMiLCJkZXRlY3RlZF9leHRlbnNpb25zIiwiaW50cm9kdWNlZF90aF9jZW50dXJ5IiwiYWJvdXRfdGhpc19yZXN1bHQiLCJzb3VyY2UiLCJkZXNjcmlwdGlvbiIsImljb24iLCJrZXl3b3JkcyIsImxhbmd1YWdlcyIsInJlZ2lvbnMiLCJhYm91dF9wYWdlX2xpbmsiLCJjYWNoZWRfcGFnZV9saW5rIiwicmVsYXRlZF9wYWdlc19saW5rIiwiZGF0ZSIsInJlbGF0ZWRfa2V5d29yZHMiLCJnZXRTZXJwIiwic2VhcmNoVGVybSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVxdWVzdE9wdGlvbnMiLCJtZXRob2QiLCJyZWRpcmVjdCIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsInJlc3VsdCIsImVycm9yIiwiY29uc29sZSIsImxvZyIsImdvb2dsZVNlYXJjaCIsInNlcnBSZXMiLCJnZXRGcm9tU3RvcmFnZSIsInN0b3JhZ2VSZXMiLCJoaXN0b3J5IiwicHVzaCIsIkRhdGUiLCJ0b1VUQ1N0cmluZyIsInVybCIsInNlYXJjaF9tZXRhZGF0YSIsImdvb2dsZV91cmwiLCJzdWJtaXR0ZWQiLCJzYXZlVG9TdG9yYWdlIiwic3VibWl0dGVkQ291bnQiLCJmaWx0ZXIiLCJoIiwicmV2ZXJlc2VkIiwib3JnYW5pY19yZXN1bHRzIiwicmV2ZXJzZSIsImRhdGEiLCJsZW5ndGgiLCJpIiwiTWF0aCIsImZsb29yIiwidG9NaW5zQW5kU2VjcyIsIm1pbGxpcyIsIm1pbnV0ZXMiLCJzZWNvbmRzIiwidG9GaXhlZCIsInN1Ym1pdFRhc2siLCJ0YXNrIiwidXNlcklkIiwicmF3IiwiSlNPTiIsInN0cmluZ2lmeSIsImtleXdvcmQiLCJ0aW1lVGFrZW4iLCJub3ciLCJ0eXBlIiwic3VibWl0dGVkS2V5d29yZHMiLCJwb3N0RGF0YSIsImRvbmUiLCJnZXRCcm93c2luZ1dlZWsiLCJicm93c2luZ1dlZWsiLCJlcnIiLCJnZXRXZWVrMiIsIndlZWtUd29LZXl3b3JkcyIsImdldFNlcnZleSIsImZpbHRlcmVkIiwic2VydmV5UXVlc3Rpb25zIiwiZCIsImZvdW5kIiwiZmluZCIsInMiLCJxdWVzdGlvbiIsImFuc3dlclNlcnZleSIsInNlcnZleSIsInJlcyIsImFuc3dlcmVkIiwiaW5kZXgiLCJpbmRleE9mIiwiYW5zd2VyIiwiZ2V0SGlzdG9yeSIsIm15SGVhZGVycyIsIkhlYWRlcnMiLCJhcHBlbmQiLCJoZWFkZXJzIiwiYm9keSIsImF1dGhVc2VyIiwidXBsb2FkSGlzdG9yeSIsIm9iaiIsImNocm9tZSIsInN0b3JhZ2UiLCJsb2NhbCIsInNldCIsImFyciIsImdldCIsInJ1bnRpbWUiLCJvbkluc3RhbGxlZCIsImFkZExpc3RlbmVyIiwiZGVmU2V0dGluZ3MiLCJmaXJzdFRpbWUiLCJjcmVkaXRzIiwiYmFsYW5jZSIsIndoaXRlbGlzdGVkS2V5d29yZHMiLCJzZWFyY2hIaXN0b3J5Q2hlY2siLCJhY3Rpb24iLCJvbkNsaWNrZWQiLCJ0YWIiLCJvcGVuV2luZG93Iiwib25NZXNzYWdlIiwibXNnIiwic2VuZGVyIiwic2VuZFJlc3BvbnNlIiwiY29tbWFuZCIsImNyZWF0ZVVzZXIiLCJ0YWJzIiwiY3JlYXRlIiwid2luZG93cyIsImdldEN1cnJlbnQiLCJ0YWJXaW5kb3ciLCJ3aWR0aCIsImhlaWdodCIsImxlZnQiLCJyb3VuZCIsInRvcCIsImZvY3VzZWQiLCJnZXRVUkwiLCJpbml0Il0sInNvdXJjZVJvb3QiOiIifQ==
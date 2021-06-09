function _call(body, then, direct) {
  if (direct) {
    return then ? then(body()) : body();
  }

  try {
    var result = Promise.resolve(body());
    return then ? result.then(then) : result;
  } catch (e) {
    return Promise.reject(e);
  }
}

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('Index', factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Index = factory());
})(this, function () {
  'use strict';

  var two = 2;
  var one = 1;

  var promise = function promise() {
    return Promise.resolve('adding');
  };

  var add = function add(numOne, numTwo) {
    return _call(promise, function (message) {
      console.log(message);
      return numOne + numTwo;
    });
  };
  /*
  	@banner
  	I am still here.
  */

  /*
  	@preserve
  	I am still here again
  */


  Promise.resolve().then(function () {
    return _await(add(one, two), function (sum) {
      console.log("".concat(sum));
    });
  }).catch(console.error);
  console.log('bundle');
  var index_b_t = {
    add: add
  };
  /*
  const p = Promise.resolve().then(function () {
      return 'hello world';
  });
  	(async function () {
  	    const r = await p();
      console.log(r);
  	}()).catch(function (e) {
      console.log(e);
  });
  */

  return index_b_t;
});
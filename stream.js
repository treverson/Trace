var Stream, stream;

(function () {
  'use strict';

  var streams = [];


  function array(object) {
    var target = [];

    Object.keys(object).forEach(function (key) {
      target[key] = object[key];
    });

    return target;
  }

  Stream = function () {
    this.event = {};
    this.state = {};

    streams.push(this);
  };

  Stream.prototype = {
    on: function () {
      var events = array(arguments),
        stream = this;
      stream.target = events.map(function (event) {
        if (!stream.event[event]) {
          stream.event[event] = [];
          stream.state[event] = {};
        }
        return stream.event[event];
      });
      return this;
    },

    run: function () {
      var stream = this;
      array(arguments).forEach(function (cb) {
        stream.target.forEach(function (target) {
          target.push(cb);
        });
      });

      return this;
    },

    emit: function (name) {
      var events = this.event[name],
        state = this.state[name],
        splats = array(arguments).slice(1);

      if (!events) {
        return this;
      }

      events.forEach(function (event) {
        try {
          event.apply(state, splats);
        } catch (e) {}
      });
      return this;
    }
  };

  Stream.emit = function (name) {
    streams.forEach(function (stream) {
      stream.emit(name);
    });
    return Stream;
  };

  stream = new Stream();

}());

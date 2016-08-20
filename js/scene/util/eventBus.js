app.classes.EventBus = function() {};

app.classes.EventBus.prototype = {
    eventToCallbackMap: {},

    on: function(event, callback, context) {
        if (!this.eventToCallbackMap[event]) {
            this.eventToCallbackMap[event] = [];
        }

        this.eventToCallbackMap[event].push({
            callback: callback,
            context: context || null
        });
    },

    trigger: function(event) {
        var args = Array.prototype.slice.call(arguments, 1);

        var eventToCallbackObj = this.eventToCallbackMap[event];

        if (eventToCallbackObj) {
            for (var i = 0; i < eventToCallbackObj.length; i++) {
                eventToCallbackObj[i].callback.apply(eventToCallbackObj.context, args);
            }
        }
    }
}

define(function(require) {
    
        var events = {};
        var eventsCache = {};
    
        // Bind event
        events.on = function(event, callback) {
            if (!callback) return events
    
            var list = eventsCache[event] || (eventsCache[event] = [])
            list.push(callback)
    
            return events
        }
    
        // Remove event. If `callback` is undefined, remove all callbacks for the
        // event. If `event` and `callback` are both undefined, remove all callbacks
        // for all events
        events.off = function(event, callback) {
            // Remove *all* events
            if (!(event || callback)) {
                eventsCache = {}
                return events
            }
    
            var list = eventsCache[event]
            if (list) {
                if (callback) {
                    for (var i = list.length - 1; i >= 0; i--) {
                        if (list[i] === callback) {
                            list.splice(i, 1)
                        }
                    }
                } else {
                    delete eventsCache[event]
                }
            }
    
            return events
        }
    
        // Emit event, firing all bound callbacks. Callbacks are passed the same
        // arguments as `emit` is, apart from the event name
        events.emit = function(event, data) {
            var list = eventsCache[event],
                fn;
    
            if (list) {
                // Copy callback lists to prevent modification
                list = list.slice()
    
                // Execute event callbacks
                while ((fn = list.shift())) {
                    fn.apply(null, Array.prototype.slice.call(arguments, 1))
                }
            }
    
            return events
        }
    
        return events;
    });
    
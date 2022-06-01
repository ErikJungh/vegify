

module.exports = {
    createTimer: function(f, time) {
        const t = setTimeout(f,time); 
        return {
            'timer': t,
            'function': f
        };
    }, 
    updateTimer: function(t, time) {
        clearTimeout(t.timer);

        const t_new = setTimeout(t.function,time);

        return {
            'timer': t_new,
            'function': t.function
        };
    },
    deleteTimer: function(t) {
        clearTimeout(t.timer);
    }
}

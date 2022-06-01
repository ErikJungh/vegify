const timer = require("./timer")
const cache = new Map();
// Change this variable to change the time a search is cached
const TIME = 1800000;

module.exports = {
    isCached: function(key) {
        return cache.has(key);
    },
    get: function(key) {
        val = cache.get(key);
        const t = timer.updateTimer(val.timer,TIME);

        val.timer = t;
        
        cache.set(key, val);

        return val.value
    },
    set: function(key,value) {

        const t = timer.createTimer(()=>{cache.delete(key)},TIME);

        val = {timer: t, value: value}
        cache.set(key,val);    
    },
}

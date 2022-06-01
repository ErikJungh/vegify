const timer = require('./timer');
const blacklist = new Map();
const TIME = 10000;

module.exports = {
    allowedVoting: function(req){
        const remote_ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
        console.log(remote_ip);

        if (blacklist.has(remote_ip)) {
            const entry = blacklist.get(remote_ip);
            var t = entry.timer; 
            if (entry.no_access > 5) {
                t = timer.updateTimer(t,(TIME/2)*entry.no_access);
            }
            blacklist.set(remote_ip, {
                no_access: entry.no_access+1,
                timer: t
            });
            return false;
        }

        const _timer = timer.createTimer(function(){blacklist.delete(remote_ip)}, TIME);

        blacklist.set(remote_ip, {
            no_access: 1,
            timer: _timer
        });
        return true;
    }
}

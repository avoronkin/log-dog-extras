var redis = require('./redis')

module.exports = function (options) {
    var hits = options.hits
    var interval = options.interval
    var prefix = options.prefix

    if (!interval || !hits) {
        throw new Error('hits, interval required')
    }
    return function (data) {
        var keyParts = []
        if (prefix) {
            keyParts.push(prefix)
        }
        keyParts.push('blocker')
        keyParts.push(data.pattern)

        var key = keyParts.join(':')

        return redis.getAsync(key)
        .then(function (count) {
            if (count < hits) {
                return redis.incrAsync(key)
                .then(function (count) {
                    if (count === hits) {
                        return redis.expireAsync(key, interval)
                    }
                })
            } else {
                throw new Error('Blocked')
            }
        })
    }
}

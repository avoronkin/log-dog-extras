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
        keyParts.push('counter')
        keyParts.push(data.pattern)

        var key = keyParts.join(':')

        return redis.incrAsync(key)
        .then(function (count) {
            if (count === 1) {
                return redis.expireAsync(key, interval).then(function () {
                    return count
                })
            }

            return count
        })
        .then(function (count) {
            if(count > hits) {
                throw new Error('Counter')
            }
        })

    }
}

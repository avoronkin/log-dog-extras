var Promise = require('bluebird')
var redis = require('redis')
Promise.promisifyAll(redis)
var port = process.env.REDIS_PORT || 6379
var host = process.env.REDIS_HOST || '127.0.0.1'
var client = redis.createClient(port, host)
client.on('error', function (err) {
    console.log('redis client error' + err);
})

module.exports = client

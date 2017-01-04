
```
npm i log-dog-extras
```

```js
var logDogFactory = require('log-dog')
var counter = require('log-dog-extras').counter
var blocker = require('log-dog-extras').blocker

var logDog = logDogFactory()
.use(/Server listen/i, counter({
    hits: 5,
    interval: 60
}), blocker({
    hits: 1,
    interval: 600
}), function (data, next) {
    console.log('server has been restarted 5 times per minute', new Date())
})
.use(function (err, data, next) {
    console.error(err)
})

logDog.read('tail -n 300 -f /some/path.log')
```

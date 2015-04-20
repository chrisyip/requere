var Module = require('module')
var loader = require('./lib/loader.js')

Module._load = loader

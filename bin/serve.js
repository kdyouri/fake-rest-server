#!/usr/bin/env node

let port;

process.argv.forEach((arg, index) => {
    if (/--port=/.test(arg)) {
        port = arg.match(/--port=(\w+)/)[1];
    }
})

const svr = require('../src/FakeRestServer');

svr.init(port);

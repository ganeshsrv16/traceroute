
const Child = require('child_process');
const Dns = require('dns');
const Net = require('net');
const Os = require('os');
const DESTINATION_HOST = process.argv[process.argv.length - 1];  // host reading from cmd line arguments


const internals = {};

internals.isWin = /^win/.test(Os.platform());

trace = function (host, callback) {


    Dns.lookup(host.toUpperCase(), (err) => {

        if (err && Net.isIP(host) === 0) {
            return callback(new Error('Invalid host'));
        }

        const command = (internals.isWin ? 'tracert -d ' : 'traceroute -q 1 -n ') + host;
        Child.exec(command, (err, stdout, stderr) => {

            if (err) {
                return callback(err);
            }
            return callback(null, stdout);
        });
    });
};


trace(DESTINATION_HOST, function (err, hops) {
    if (!err) {
        console.log(hops)
    } else {
        console.log(err);
    }
});
'use strict';

const os = require('os');
const hoek = require('hoek');

let value;
let header;

const internals = {};

internals.onPreResponse = (request, reply) => {

    const response = request.response;

    if (response.isBoom) {

        response.output.headers[header] = value;

    } else if (response.header) {

        response.header(header, value);

    }

    reply.continue();
};

exports.register = (server, options, next) => {

    hoek.assert(options.header, 'options header must be a string.');

    const NA = 'N/A';
    const hostname = os.hostname().replace(/\w*-/g, '') || NA;

    value = `${hostname} (${options.value || NA})`;
    header = `X-${options.header}`;

    server.ext('onPreResponse', internals.onPreResponse);

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};


'use strict';

const os = require('os');
const hoek = require('hoek');

let instance;
let header;

internals.onPreResponse = (request, reply) => {

    const response = request.response;

    if (response.isBoom) {

        response.output.headers[header] = instance;

    } else if (response.header) {

        response.header(header, instance);

    }

    reply.continue();
};

exports.register = (server, options, next) => {

    hoek.assert(options.header, 'options header must be a string.');

    const NA = 'N/A';
    const hostname = os.hostname().replace(/\w*-/g, '') || NA;

    instance = `${hostname}/${options.instance || NA}`;
    header = `X-${options.header}`;

    plugin.ext('onPreResponse', internals.onPreResponse);

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};


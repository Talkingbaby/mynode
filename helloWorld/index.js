/*
 * Primary file for API
 *
 */

//  dependencies
let http = require('http');
let https = require('https');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;
let config = require('./config');
let fs = require('fs');

// configure the http server to respond to all requests with a string
let httpServer = http.createServer((req, res) => {
    unfifiedServer(req, res);
})

// start the http server
httpServer.listen(config.httpPort, () => {
    console.log(`the server is running on port ${config.httpPort}`);
});


// Instantiate the HTTPS server
let httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
  };

// configure the https server to respond to all requests with a string
let httpsServer = http.createServer((req, res) => {
    unfifiedServer(req, res);
})

// start the https server
httpsServer.listen(config.httpsPort, () => {
    console.log(`the server is running on port ${config.httpsPort}`);
});

let unfifiedServer = (req,res) => {

    // parse the url
    let parsedUrl = url.parse(req.url, true);

    // get the path
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the query string as an object
    let queryStringObject = parsedUrl.query;

    // get the http method
    let method = req.method.toLowerCase();

    // get the headers as an object
    let headers = req.headers;

    // if payload then get payload
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        // check the router for a matching path for a handler. use not found handler if nothing is found
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // construct the data object to send to the handler
        let data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: buffer
        }

        // route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // use the status code returned from the handler, or set the default status code to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // use the payload returned from the handler, or set the default payload to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // convert the payload to a string
            let payloadString = JSON.stringify(payload);

            // return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log('returning this response', statusCode, payloadString);
        })
    })
}

// define all handlers
let handlers = {};

// sample handler
handlers.sample = (data, callback) => {
    callback(406, {'name': 'sample handler'});
}

// not found handler
handlers.notFound = (data, callback) => {
    callback(404);
}

// define the request router
let router = {
    sample: handlers.sample
}
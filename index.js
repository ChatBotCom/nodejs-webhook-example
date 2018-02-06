
'use strict';

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const token = 'secret'; // replace to process.env.TOKEN for non development

const server = http
    .createServer((req, res) => {
        const parsed = url.parse(req.url);

        req.url = parsed.pathname;
        req.query = querystring.parse(parsed.query);

        // check token in every request
        if (req.query.token !== token) {
            res.writeHead(401);

            return res.end();
        }

        // verification request
        if (req.method === 'GET') {
            return res.end(req.query.challenge);
        }
        
        req.rawBody = '';

        req.on('data', chunk => {
            req.rawBody += chunk;
        });

        req.on('end', () => {
            if (req.rawBody) {
                req.body = JSON.parse(req.rawBody);
            }
            
            handler(req, res);
        });
    });

function handler(req, res) {
    // it will contain query response
    console.log(req.body);

    const data = {
        responses: [
            {
                type: 'text',
                elements: ['Ok, no problem']
            }
        ]
    };

    res.end(JSON.stringify(data));
}

server.listen(3000);

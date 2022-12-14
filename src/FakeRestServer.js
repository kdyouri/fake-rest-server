const Dataset = require('./Dataset');
const http = require('http');

class FakeRestServer {
    DEFAULT_PORT = 8000;

    constructor(port) {
        this.port = port || this.DEFAULT_PORT;
        this.dataset = new Dataset();
        
        const self = this;
        http
            .createServer((req, res) => {
                self.request(req, res);
            })
            .listen(this.port);

        console.log('Fake REST-Server:');
        console.log(`Listening at port ${this.port}...\n`);
        console.log('Use curl on a new terminal:');
        console.log(`  curl -X POST -d '{"first_name":"John","last_name":"Smith","email":"johnsmith@mailer.net"}' http://localhost:${this.port}/students`);
        console.log(`  curl http://localhost:${this.port}/students`);
        console.log(`  curl http://localhost:${this.port}/students/1`);
        console.log(`  curl -X PUT -d '{"first_name":"John","last_name":"Smith","email":"john_smith@mailer.net"}' http://localhost:${this.port}/students/1`);
        console.log(`  curl -X PATCH -d '{"email":"john_smith@gmail.com"}' http://localhost:${this.port}/students/1`);
        console.log(`  curl -X DELETE http://localhost:${this.port}/students/1\n`);
    }

    static init(port) {
        return new FakeRestServer(port);
    }

    route(req, res, json) {
        const params = this.parseParams(req);

        switch (req.method) {
            case 'POST':
                json = this.dataset.create(params.table, json);
                return this.response(req, res, this.getStatusCode(req, json), json);

            case 'GET':
                json = this.dataset.read(params.table, params.id);
                return this.response(req, res, this.getStatusCode(req, json), json);

            case 'PUT':
                json.id = params.id;
                json = this.dataset.replace(params.table, json);
                return this.response(req, res, this.getStatusCode(req, json), json);

            case 'PATCH':
                json.id = params.id;
                json = this.dataset.update(params.table, json);
                return this.response(req, res, this.getStatusCode(req, json), json);

            case 'DELETE':
                json = this.dataset.delete(params.table, params.id);
                return this.response(req, res, this.getStatusCode(req, json), json);
        }
    }

    request(req, res) {
        const self = this;
        let data = '';
        req.on('data', d => {data += d; })
            .on('end', () => {
                let json = {};
                try {
                    json = (data !== '') ? JSON.parse(data) : {};
                } catch (e) {
                    console.log(`Error: ${e.message}`);
                    return self.response(req, res, 400, {});
                }
                self.route(req, res, json);
            });
    }

    response(req, res, statusCode, json) {
        const headers = {
            "Content-Type": "application/json; charset=UTF-8",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE",
            "Access-Control-Max-Age": 18000
        };
        res.writeHead(statusCode, headers);

        const data = JSON.stringify(json);
        res.end(data);

        console.log(`>> ${req.method} - ${req.url} (${statusCode}): ${data}`);
    }

    getStatusCode(req, json) {
        const isEmptyJson = (Object.keys(json).length === 0);

        switch (true) {
            case (req.method === 'GET' && (!isEmptyJson || Array.isArray(json))):
            case (req.method === 'PUT' && !isEmptyJson):
            case (req.method === 'PATCH' && !isEmptyJson):
                return 200;

            case (req.method === 'POST'):
                return 201;

            case (req.method === 'DELETE'):
                return 204;

            default:
                return 404;
        }
    }

    parseParams(req) {
        const [query, param] = req.url.split('?');
        const [, table, id] = query.split('/');
        return {
            table: table,
            id: parseInt(id)
        };
    }
}

module.exports = FakeRestServer;

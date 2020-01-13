import supertest from 'supertest';

describe('loading express', function() {

    let server;
    beforeEach(function () {
        server = require('../src/server.js');
    });
    afterEach(function () {
        server.close();
    })

    it('responds to /login', function testLogin(done){
        request(server)
        .get('/login')
        .expect(401,done);
    });
    it('responds to /api', function testApi(done){
        request(server)
        .get('/api')
        .expect(401,done);
    }); 
});
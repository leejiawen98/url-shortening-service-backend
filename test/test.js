var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3001");

describe("Unit Test for retrieving URLs from database", function() {
    it("return records from database", function(done) {
        server
        .get('/get/urls')
        .expect("Content-type", /json/)
        .expect(200)
        .end(function(err, res){;
            should(res.status).equal(200);
            should(err).equal(null);
            done();
        });
    });
});

describe("Unit Test for shortening URL", function() {
    it("return shortened URL", function(done) {
        server
        .post('/post/shorten')
        .send({url:"https://www.google.com"})
        .expect(String)
        .expect(200)
        .end(function(err, res){
            should(res.status).equal(200);
            should(err).equal(null);
            should(res.body[0].short_url).equal("/h0f75d")
            done();
        });
    });
});
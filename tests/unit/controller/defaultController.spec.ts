import { assert } from 'chai';
import request from 'supertest';
import { api } from '../../../src/app';

describe("defaultController-Test", () => {
    it("testing simple get request", () => {
        request(api)
            .get('/')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, "Welcome to the Skiosa Core-Service!");
                assert.equal(res.body.status, "/status");
                assert.equal(res.body.git, "https://github.com/skiosa/core-service");
            });
    });
});
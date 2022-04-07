import { assert } from 'chai';
import express from 'express';
import request from 'supertest';
import { defaultController } from '../../../src/controller/defaultController';

describe("defaultController-Test", () => {
    let mockExpress: any = null;

    before(() => {
        mockExpress = express();
        mockExpress.use("/", defaultController);
    });

    it("testing simple get request", (done) => {
        request(mockExpress)
            .get('/')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, "Welcome to the Skiosa Core-Service!");
                assert.equal(res.body.status, "/status");
                assert.equal(res.body.git, "https://github.com/skiosa/core-service");
                if (err) done(err);
                done();
            });
    });
});
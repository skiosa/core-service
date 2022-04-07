import { assert } from 'chai';
import express from 'express';
import request from 'supertest';
import { errorController } from '../../../src/controller/errorController';

describe("errorController-Test", () => {
    let mockExpress: any = null;

    before(() => {
        mockExpress = express();
        mockExpress.use("*", errorController);
    });

    it("testing simple error request", (done) => {
        request(mockExpress)
            .get('/itsmeanerror')
            .end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.message, "no endpoint found");
                assert.equal(res.body.status, "404");
                if (err) done(err);
                done();
            });
    });
});
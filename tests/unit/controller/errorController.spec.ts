import { assert } from 'chai';
import request from 'supertest';
import { api } from '../../../src/app';

describe("errorController-Test", () => {
    it("testing simple error request", () => {
        request(api)
            .get('/itsmeanerror')
            .end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.message, "no endpoint found");
                assert.equal(res.body.status, "404");
            });
    });
});
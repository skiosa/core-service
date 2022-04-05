import { assert } from 'chai';
import express from 'express';
import request from 'supertest';
import { graphqlController } from '../../../src/controller/graphqlController';

describe("graphController-Test", () => {
    let mockExpress: any = null;

    before(() => {
        mockExpress = express();
        mockExpress.use("/graphql", graphqlController);
    });

    it("testing simple request", (done) => {
        request(mockExpress)
            .get('/graphql')
            .end((err, res) => {
                //400 Because no Query String
                assert.equal(res.status, 400);
                if (err) done(err);
                done();
            });
    });
});
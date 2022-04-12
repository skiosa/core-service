import { assert } from 'chai';
import express from 'express';
import { UserInfo } from '../../../src/model/jwt';
import { getUserInfo } from '../../../src/util/middelwares';

declare module "express-serve-static-core" {
    interface Request {
      UserInfo?: UserInfo;
    }
  }

describe("Middelware-Test", () => {
    let request: express.Request = <express.Request>{
        headers: {
            authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdzJrRUZkaDVYRF9WWER4VTAzbXhnSVJkZWNrVzdjc3ZPMEFUOF9UTHpzIn0.eyJleHAiOjE2NDk3NjIxNjgsImlhdCI6MTY0OTc2MTg2OCwianRpIjoiMGU3NjRjYzUtOWM1My00ODQ1LWIxNmYtZjYwZjg4MmIzMzYyIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5za2lvc2EuZGUvYXV0aC9yZWFsbXMvU2tpb3NhIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjAwNjhjMWUwLTFjOGUtNGQwNS05MWRjLWE0NzhiMWFkZmQ3MiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImNvcmUtc2VydmljZSIsInNlc3Npb25fc3RhdGUiOiJmZTIwYWQ1MC00MzE4LTQzMzUtOTA5Mi0wZWE2OTYwNGFkYjAiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwic2tpb3NhLXVzZXIiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtc2tpb3NhIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwic2lkIjoiZmUyMGFkNTAtNDMxOC00MzM1LTkwOTItMGVhNjk2MDRhZGIwIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoidGltIHRpbSIsInByZWZlcnJlZF91c2VybmFtZSI6InRpbSIsImdpdmVuX25hbWUiOiJ0aW0iLCJmYW1pbHlfbmFtZSI6InRpbSIsImVtYWlsIjoidGltQHRpbS5kZSJ9.CRDfSw_q98Mq1cK8cX9TkpN_dh4kszwRonx8A9Dx9F7Boq7Zy-gx7YPPnlo6wjKEKmAXa7iPlx_7wkXFU1RAv6BFYh29fbqg78PsYpNdzoDkkWldXF4SRCU61I2_ai9s3EcJ7rvVvW0X0ll4aGV1LAQ5I70gVQAhxn3KtJs3cHqc2XfF9_ArtozS0bUGZEz4x9AeAW-rkHKMtTzQxTNShhkMvcR8p4E4gh7AF3iKBJEAff3-t9niqbMkUAVfIgMpCKi174apsuzWMpdjzhQXTHfLHZuY7s0FJZegkt6MlA2BmbH8Ap6Zg9NbU0rSRsueueajh8acMjp2-Ffg_tGW_g"
        }
    };
    let response: express.Response = <express.Response>{};


    it("should return UserInfo", (done) => {
        getUserInfo(request, response, (err) => {
            var userInfo = request.UserInfo;
            assert.isObject(userInfo);
            assert.equal(userInfo?.id, "0068c1e0-1c8e-4d05-91dc-a478b1adfd72");
            assert.equal(userInfo?.email, "tim@tim.de");
            assert.equal(userInfo?.username, "tim");
            assert.equal(userInfo?.firstName, "tim");
            assert.equal(userInfo?.lastName, "tim");
            done();
        });
    });
});
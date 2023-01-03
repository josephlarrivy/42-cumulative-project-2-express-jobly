"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const Job = require("../models/job")

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    adminTestingToken
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /companies */

describe("POST /jobs", function () {
    const job = {
        title: "test_job_4",
        salary: 90000,
        equity: 0,
        company_handle: "c1"
    };

    test("admin can post a job", async function () {
        const resp = await request(app)
            .post("/jobs/create")
            .send(job)
            .set("authorization", `Bearer ${adminTestingToken}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            "created": {"job" : {
                title: "test_job_4",
                salary: 90000,
                equity: "0",
                company_handle: "c1"
            },
        },
        });
    });

    test("non-admins cannot post jobs", async function () {
        const resp = await request(app)
            .post("/jobs/create")
            .send(job)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(403);
    });
});



/************************************** GET /jobs */

describe("GET /jobs", function () {
    test("ok for anon", async function () {
        const resp = await request(app).get("/jobs");
        expect(resp.body).toEqual(
            [{ "company_handle": "c1", "equity": "0", "salary": 90000, "title": "test_job_1" }]
        );
    });

    test("fails: test next() handler", async function () {
        // there's no normal failure event which will cause this route to fail ---
        // thus making it hard to test that the error-handler works with it. This
        // should cause an error, all right :)
        await db.query("DROP TABLE jobs CASCADE");
        const resp = await request(app)
            .get("/jobs")
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(500);
    });
});

describe("GET /jobs/:handle", function () {
    test("gets job by handle", async function () {
        const resp = await request(app).get("/jobs/c1");
        expect(resp.body).toEqual(
            [{
                title: "test_job_1",
                salary: 90000,
                equity: "0",
                company_handle: "c1"
            }]
        )
    })
})

describe("DELETE /jobs", function () {
    const job = {
        title: "test_job_4",
        salary: 90000,
        equity: 0,
        company_handle: "c1"
    };
    Job.create(job);

    test("deletes job", async function () {
        const resp = await request(app)
        .delete("/jobs")
        .send({
            title: "test_job_4",
            company_handle: "c1"
        })
        .set("authorization", `Bearer ${adminTestingToken}`);
        expect(resp.statusCode).toEqual(202);
    })
})
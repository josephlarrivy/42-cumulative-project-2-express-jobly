"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, ExpressError } = require("../expressError");
const Job = require("./job")
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("creating jobs", function () {
    const newJob = {
        title: "test_job_2",
        salary: 80000,
        equity: "0",
        company_handle: "c1"
    };

    test("creates job", async function () {
        const job = await Job.create(newJob);
        expect(job).toEqual(newJob)
    })
})

describe("getting jobs", function () {
    test("gets all jobs", async function () {
        const getJob = await Job.getAll();
        expect(getJob).toEqual({
            title: "test_job_1",
            salary: 90000,
            equity: "0",
            company_handle: "c1",
        })
    })

    // test("gets job by handle", async function () {
    //     const 
    // })
})
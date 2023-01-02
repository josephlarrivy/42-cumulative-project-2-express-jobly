const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql")

// no idea how to test this function
describe("sqlForPartialUpdate test", function () {
    test("no data returns BadRequestError", function () {
        const data = sqlForPartialUpdate({})
        expect(data).toThrow(error)
    })
})

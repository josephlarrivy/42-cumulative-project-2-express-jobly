
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");


class Job {

  static async create({ title, salary, equity, company_handle }) {
    const result = await db.query(
      `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING title, salary, equity, company_handle`,
      [
        title,
        salary,
        equity,
        company_handle
      ],
    );
    const company = result.rows[0];
    return company;
  }


}




module.exports = Job
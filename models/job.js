
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");



class Job {
  // Creates a new job
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

  // gets all jobs
  static async getAll() {
    const response = await db.query(
      `SELECT title, salary, equity, company_handle FROM jobs ORDER BY company_handle`
    );
    return response.rows;
  }

  // gets all jobs by company handle
  static async get(handle) {
    const response = await db.query(
      `SELECT company_handle, title, salary, equity FROM jobs WHERE company_handle = $1`,
      [handle]);

    const jobs = response.rows;
    if (!jobs) throw new NotFoundError(`No jobs found for ${handle}`);
    return jobs;
  }

  // filters by minimum salary
  static async minSalary(input) {
    const minSal = await db.query(
      `SELECT company_handle, title, salary, equity FROM jobs WHERE salary >= $1 ORDER BY salary`, [input]
    )
    console.log(minSal);
    return minSal.rows;
  }

  // returns job that have equity
  static async hasEquity() {
    const equity = await db.query(
      `SELECT company_handle, title, salary, equity FROM jobs WHERE equity > 0 ORDER BY salary`,
    )
    console.log(equity);
    return equity.rows;
  }

  // filters job titles by input string
  static async search(input) {
    const searchContain = await db.query(
      `SELECT title, company_handle, salary, equity FROM jobs WHERE title ILIKE '%${input}%' ORDER BY salary`
    )
    console.log(searchContain);
    return searchContain.rows;
  }

  // deletes jobs by company handle and titile
  static async delete(title, company_handle) {
    const response = await db.query(
      `DELETE FROM jobs WHERE title = $1 AND company_handle = $2 RETURNING title, company_handle`,
      [title, company_handle]);
    return response
  }


}




module.exports = Job
const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/authMiddleware");
const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNewSchema.json");
// const companyUpdateSchema = require("../schemas/companyUpdate.json");

const router = new express.Router();

// #########################



// gets all jobs
router.get("/", async (req, res, next) => {

  if (req.query.title) {
    let { title } = req.query;
    try {
      const result = await Job.search(title);
      return res.json({result});
    } catch (e) {
      return next(e)
    }
  }

  if (req.query.minSalary) {
    let { minSalary } = req.query;
    try {
      const response = await Job.minSalary(minSalary)
      return res.json(response)
    } catch (e) {
      return next(e)
    }
  }

  try {
    const jobs = await Job.getAll();
    console.log(jobs)
    return res.status(200).json({jobs})
  } catch (e) {
    next(e)
  }
})

// gets all jobs that have equity
router.get('/equity', async (req, res, next) => {
  try {
    let jobs = await Job.hasEquity()
    return res.json(jobs)
  } catch (e) {
    return next(e)
  }
})


// posts a new job
router.post('/create', ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, jobNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Job.create(req.body);
    return res.status(201).json({"created":{ job }})
  } catch (err) {
    return next(err);
  }
})

// gets jobs by handle
router.get('/:handle', async (req, res, next) => {
  const { handle } = req.params;
  try {
    const jobs = await Job.get(handle);
    return res.status(200).json(jobs)
  } catch (err) {
    return next (err)
  }
})

// deletes a job posting
router.delete('/', ensureAdmin, async (req, res, next) => {
  try {
    const { title, company_handle } = req.body;
    const response = Job.delete(title, company_handle)
    return res.status(202).json('deleted')
  } catch (e) {
    return next (e)
  }
})





module.exports = router;
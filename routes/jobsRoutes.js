const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/authMiddleware");
const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNewSchema.json");
// const companyUpdateSchema = require("../schemas/companyUpdate.json");

const router = new express.Router();




router.post('/create', async (req, res, next) => {
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







module.exports = router;
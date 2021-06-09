"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const Listing = require("../models/listing");
const newListingSchema = require("../schemas/newListingSchema.json");

const router = express.Router();

/** POST /listings  { host_username, title, description, price } => { listing }
 *
 *
 * Authorization required: none
 */

 router.post("/", async function (req, res, next) {
  const validator = jsonschema.validate(req.body, newListingSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const { host_username, title, description, price } = req.body;
  console.log("host_username--->", host_username);
  const listing = await Listing.addListing(host_username, title, description, price);

  return res.json({ listing });
});

module.exports = router;
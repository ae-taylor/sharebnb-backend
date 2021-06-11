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
 * Authorization required: ensureLoggedIn
 * //TODO ^ Implement auth middleware
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

/** GET /listings 
 * 
 * gets all listings & returns listings object
 * 
 * Authorization: none
 */

router.get("/", async function (req, res, next) {
  console.log("MADE IT TO GET LISTINGS");
  const listings = await Listing.getListings();
  console.log("LISTINGS IN LISTINGS.JS--->", listings);
  return res.json({listings});
});

/** GET /listings/:id 
 * 
 * Gets listing by ID and returns listing object
 * 
 * Authorization: none
 */
router.get("/:id", async function (req, res, next) {
  console.log("MADE IT TO GET LISTING");
  const listing = await Listing.getListing(req.params.id);
  console.log("LISTING IN LISTINGS.JS--->", listing);
  return res.json({listing});
});

module.exports = router;
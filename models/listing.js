"use strict";

const db = require("../db");

class Listing {
  //TODO - add photos to listing & store in S3 with 
  // photo URLS stored in DB
  /** Method addListing
   * 
   * Receives: {host_username, title, description, price}
   * 
   * Returns: {}
   */
  static async addListing(host_username, title, description, price) {
    console.log("host_username--->", host_username);
    const result = await db.query(
      `INSERT INTO listings (host_username, title, description, price)
       VALUES ($1, $2, $3, $4)
       RETURNING id, host_username, title, description, price`,
      [host_username, title, description, price],
    );
    let newListing = result.rows[0];
    return newListing;
  }

  //TODO - add search functionality
  /** Gets all listings */
  static async getListings() {
    const result = await db.query(
      `SELECT id, host_username, title, description, price
        FROM listings`
    );
    console.log("RESULTS OF LISTINGS--->", result);
    let listings = result.rows;
    console.log("LISTINGS--->", listings);
    return listings;
  }

  /** Gets specific listing by listing id */
  static async getListing(id) {
    const result = await db.query(
      `SELECT id, host_username, title, description, price
      FROM listings
      WHERE id = $1`, 
      [id]
    );
    let listing = result.rows[0];
    return listing;
  }
}

module.exports = Listing;
"use strict";

const db = require("../db");

class Listing {
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
}

module.exports = Listing;
"use strict";
const db = require("../db");

class Host {
  /** Method addHost
   * Adds a new Host to the database
   */
  static async addHost(username) {
    const duplicateCheck = await db.query(
      `SELECT host_username
       FROM hosts
       WHERE host_username = $1`,
    [username],
    );
    
    if (duplicateCheck.length < 1) {
      `INSERT INTO hosts (username) 
        VALUES ($1)`,
      [username]
    }
  }
}

module.exports = Host;
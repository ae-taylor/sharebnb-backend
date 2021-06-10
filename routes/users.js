"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");

const multer  = require('multer');
const upload = multer();

const aws = require("aws-sdk");
const {S3Client, PutObjectCommand, GetObjectCommand} = require("@aws-sdk/client-s3");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userRegisterSchema = require("../schemas/userRegisterSchema.json");
const userAuthSchema = require("../schemas/userAuthSchema.json");
const { S3 } = require("aws-sdk");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_NAME, S3_REGION} = require("../config");

const router = express.Router();

/** POST /users/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

 router.post("/token", async function (req, res, next) {
  const validator = jsonschema.validate(req.body, userAuthSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const { username, password } = req.body;
  const user = await User.authenticate(username, password);
  const token = createToken(user);
  return res.json({ token });
});

/** POST /users/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email, phone }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

 router.post("/register", upload.single('file'), async function (req, res, next) {
  console.log("req.body--->", req.body);
  console.log("req.file--->", req.file);
  const validator = jsonschema.validate(req.body, userRegisterSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }
  console.log(`got through validator`)
  const image = req.file;
  const client = new S3Client({
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
    region: S3_REGION});

    
    const uploadParams = {
      Bucket: S3_BUCKET_NAME,
      Key: `${req.body.username}-profile-pic`,
      Body: image.buffer,
      ContentType: 'image/jpeg',
      Tagging: "public=yes"
    }
    
    
    console.log(`upload params --->`, uploadParams)
    
    const putCommand = new PutObjectCommand(uploadParams);
    const response = await client.send(putCommand);
    
    const getUrlParams = {
      Bucket: S3_BUCKET_NAME,
      Key: `${req.body.username}-profile-pic`,
    }

  const getCommand = new GetObjectCommand(getUrlParams);  
  const url = await getSignedUrl(client, getCommand);

  console.log(`url from AWS S3---> `, url);
  console.log(`command --->`, putCommand);
  console.log(`response -->`, response)
  const {username, password, firstName, lastName, email, phone} = req.body;
  const newUser = await User.register(username, password, firstName, lastName, email, phone);
  const token = createToken(newUser);
  console.log("CREATED NEW USER");
  return res.status(201).json({ token });
});

// router.post("/image", upload.single('file'), async function (req, res, next) {
//   const image = req.file;
//   const client = new S3Client({
//     credentials: {
//       accessKeyId: S3_ACCESS_KEY,
//       secretAccessKey: S3_SECRET_KEY,
//     },
//     region: "us-west-2"});

//   const uploadParams = {
//     Bucket: "sharebnb-aa",
//     Key: `${req.body.username}-profile-pic`,
//     Body: image.buffer,
//     Tagging: "public=yes"
//   }

//   const command = new PutObjectCommand(uploadParams);
//   const response = await client.send(command);
//   console.log("IMAGE UPLOAD RESPONSE", response);
// })

module.exports = router;
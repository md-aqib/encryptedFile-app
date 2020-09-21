const express = require("express");
const tokenVerify = require("../common/tokenVerify");
const router = express.Router();

router.post("/register", require("./register"));
router.post("/login", require("./login"));
router.post("/adduser", tokenVerify, require("./addUser"));

router.post("/generatefile", tokenVerify, require("./generateFile"));
router.put("/downloadfile", tokenVerify, require("./downloadfile"));
router.post(
  "/getdownloadhistory/:page",
  tokenVerify,
  require("./getDownloadHist")
);
router.post("/filter", tokenVerify, require("./filter"));

module.exports = router;

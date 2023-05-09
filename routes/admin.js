const express = require("express");
const { protect, authorize } = require("../middlewares/auths");
const advancedResults = require("../middlewares/results");
const User = require("../models/User");
const { getAllUsers, getUser, deleteUser } = require("../controllers/admin");

const router = express.Router();

router
  .route("/users")
  .get(protect, authorize("admin"), advancedResults(User), getAllUsers);

router.route("/users/:id").get(protect, authorize("admin"), getUser);
router.route("/users/:id").delete(protect, authorize("admin"), deleteUser);

module.exports = router;

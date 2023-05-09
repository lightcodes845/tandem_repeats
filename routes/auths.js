const express = require("express");
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
} = require("../controllers/auths");
const validate = require("../middlewares/validation");
const { protect } = require("../middlewares/auths");
const {
  userSchema,
  loginSchema,
  userUpdateSchema,
  passwordSchema,
} = require("../validation/users");

const router = express.Router();

router.post("/register", validate(userSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);
router.put(
  "/updatedetails",
  protect,
  validate(userUpdateSchema),
  updateDetails
);
router.put(
  "/updatepassword",
  protect,
  validate(passwordSchema),
  updatePassword
);

module.exports = router;

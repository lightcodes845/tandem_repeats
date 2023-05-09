const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc Get all users
// @route POST /api/v1/admin/users
// @access Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});

// @desc Get single user
// @route GET /api/v1/users/:id
// @access Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Delete single user
// @route GET /api/v1/users/:id
// @access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  await user.remove();

  return res.status(200).json({
    success: true,
    data: user,
  });
});

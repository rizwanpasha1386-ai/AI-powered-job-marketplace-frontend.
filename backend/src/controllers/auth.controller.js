import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Cookie options for JWT
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
export const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role,
  });

  if (user) {
    // Generate token
    const token = user.generateAccessToken();

    // Remove password from response
    user.password = undefined;

    res
      .status(201)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message: 'User registered successfully',
        data: user,
      });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Auth user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email and explicitly select password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check if password matches
  const isMatch = await user.isPasswordCorrect(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = user.generateAccessToken();

  // Remove password from response
  user.password = undefined;

  res
    .status(200)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message: 'Login successful',
      data: user,
    });
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie('token', cookieOptions)
    .json({
      success: true,
      message: 'Logged out successfully',
    });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  // req.user is set by the verifyJWT middleware
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

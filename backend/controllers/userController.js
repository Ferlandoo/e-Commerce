import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async(request, response) => {
    const { email, password } = request.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        generateToken(response, user._id)
        response.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        }
    else {
        response.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(request, response) => {
    const { name, email, password } = request.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        response.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({ name, email, password });
    if (user) {
        generateToken(response, user._id)
        response.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        response.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async(request, response) => {
    response.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    response.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async(request, response) => {
    const user = await User.findById(request.user._id);
    if (user) {
        response.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        response.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async(request, response) => {
    const user = await User.findById(request.user._id);
    if (user) {
        user.name = request.body.name || user.name;
        user.email = request.body.email || user.email;
        if (request.body.password) {
            user.password = request.body.password;
        }
        const updatedUser = await user.save();
        response.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        response.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async(request, response) => {
    response.send('Update profile user');
});

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private/Admin
const getUsersById = asyncHandler(async(request, response) => {
    response.send('Get user by id');
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async(request, response) => {
    response.send('Delete user');
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async(request, response) => {
    response.send('Update user');
});

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers, getUsersById, deleteUser, updateUser };

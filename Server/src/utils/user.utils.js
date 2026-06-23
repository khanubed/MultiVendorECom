import User from '../models/user.schema.js';

export const getUserProfile = async (userId) => {
  try {
    return await User.findById(userId).select('-password');
  } catch (error) {
    throw new Error('Failed to fetch user profile');
  }
};

export const updateUserProfile = async (userId, updateData) => {
  try {
    return await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
  } catch (error) {
    throw new Error('Failed to update user profile');
  }
};

export const getCartWithProducts = async (userId) => {
  try {
    const user = await User.findById(userId).populate('cart');
    return user.cart || [];
  } catch (error) {
    throw new Error('Failed to fetch cart');
  }
};

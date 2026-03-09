import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    console.log("Comparing passwords...");
    console.log("Input password length:", password?.length);
    console.log("Hashed password length:", hashedPassword?.length);
    
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log("Comparison result:", isValid);
    return isValid;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id.toString(), 
      email: user.email, 
      role: user.role,
      name: user.name 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecretkey';

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });

const isEmailValid = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

// Register a user
exports.register = async (req, res) => {
  const { name, email, password, designation } = req.body;

  if (!name || !email || !password || !designation) {
    return res.status(400).json({ error: 'All fields (name, email, password, designation) are required.' });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, designation });

    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user.', details: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'You did not register yet! Please register first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken(user.id);
    res.json({ message: 'Login successful.', token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in user.', details: error.message });
  }
};

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required.' });
//   }

//   if (!isEmailValid(email)) {
//     return res.status(400).json({ error: 'Invalid email format.' });
//   }

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid password.' });
//     }

//     const token = generateToken(user.id);
//     res.json({ message: 'Login successful.', token });
//   } catch (error) {
//     res.status(500).json({ error: 'Error logging in user.', details: error.message });
//   }
// };

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const resetToken = generateToken(user.id);
    res.json({ message: 'Password reset token generated.', resetToken });
  } catch (error) {
    res.status(500).json({ error: 'Error generating password reset token.', details: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: decoded.id } });

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired.' });
    }
    res.status(500).json({ error: 'Error changing password.', details: error.message });
  }
};

// Update Designation
exports.updateDesignation = async (req, res) => {
  const { id } = req.params;
  const { designation } = req.body;

  if (!designation) {
    return res.status(400).json({ error: 'Designation is required.' });
  }

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID. ID must be a number.' });
  }

  try {
    const [updated] = await User.update({ designation }, { where: { id } });

    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'Designation updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating designation.', details: error.message });
  }
};




// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID. ID must be a number.' });
  }

  try {
    const result = await User.destroy({ where: { id } });

    if (!result) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user.', details: error.message });
  }
};

// Get User by ID
exports.getUser = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID. ID must be a number.' });
  }

  try {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user details.', details: error.message });
  }
};







// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const JWT_SECRET = 'supersecretkey';

// const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });

// Register a user
// exports.register = async (req, res) => {
//   const { name, email, password, designation } = req.body;
//   if (!name){
//     return res.status(400).json({error: 'Name is required'})
//   }

//   try {
   
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashedPassword, designation });
//     res.status(201).json({ message: 'User registered successfully', user });
//   } catch (error) {
//     res.status(400).json({ error: 'Error registering user', details: error });
//   }

// };

// Login a user
// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email && !password){
//     return res.status(400).json({error: 'email and password is required'})
//   }

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

//     const token = generateToken(user.id);
//     res.json({ message: 'Login successful', token });
//   } catch (error) {
//     res.status(500).json({ error: 'Login failed', details: error });
//   }
// };

// Forgot Password
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   if (!email){
//     return res.status(400).json({error: 'Email is required'})
//   }

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const resetToken = generateToken(user.id);
//     res.json({ message: 'Password reset token generated', resetToken });
//   } catch (error) {
//     res.status(500).json({ error: 'Error generating reset token', details: error });
//   }
// };

// Change Password
// exports.changePassword = async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     await User.update({ password: hashedPassword }, { where: { id: decoded.id } });
//     res.json({ message: 'Password changed successfully' });
//   } catch (error) {
//     res.status(400).json({ error: 'Invalid or expired token', details: error });
//   }
// };


// Update Designation
// exports.updateDesignation = async (req, res) => {
//   const { id } = req.params;
//   const { designation } = req.body;

//   try {
//     await User.update({ designation }, { where: { id } });
//     res.json({ message: 'Designation updated successfully' });
//   } catch (error) {
//     res.status(400).json({ error: 'Error updating designation', details: error });
//   }
// };


// Delete User
// exports.deleteUser = async (req, res) => {
//   const { id } = req.params; // Get the user ID from the request parameters

//   try {
//     // Delete the user with the matching ID
//     const result = await User.destroy({ where: { id } });

//     if (result === 0) {
//       // If no rows were affected, the user does not exist
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Respond with a success message
//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     // Handle any errors
//     res.status(500).json({ error: 'Error deleting user', details: error });
//   }
// };




// Get User by ID
// exports.getUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching user details', details: error });
//   }
// };

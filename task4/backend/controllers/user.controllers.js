const UserModel = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
		if (user.status === 'Blocked') {
        res.status(403).json({ message: "User is blocked." });
      } else {
		  bcrypt.compare(password, user.password, (err, isMatch) => {
			if (err) {
			  res.status(500).json({ error: "Server error during authentication." });
			} else if (isMatch){
			  user.lastLoginTime = new Date();
			  user.save()
				.then((updatedUser) => {
				  const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET);
				  const { password, ...rest } = updatedUser._doc;
				  res.cookie('access_token', token, { httpOnly: true })
					 .status(200)
					 .json({ message: "success", user: rest });
				})
				.catch(err => res.status(500).json({ error: "Database error during login time update." }));
			} else {
			  res.status(404).json({ message: " Password is incorrect" });
			}
		  });
	}
    } else {
      res.status(404).json({ message: "User does not exist" });
    }
  }).catch(err => res.status(500).json({ error: "Database error during authentication." }));
};

const validatesession = (req, res) => {
  const token = req.cookies['access_token'];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.json({ isAuthenticated: false });
      } else {
        res.json({ isAuthenticated: true });
      }
    });
  } else {
    res.json({ isAuthenticated: false });
  }
};


const signup = (req, res) => {
  const { username, email, password } = req.body;

  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      res.status(404).json({ message: "user already exists" });
    } else {
      const newUser = new UserModel({
        username,
        email,
        password
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          res.status(500).json({ error: "Server error during account creation." });
        } else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              res.status(500).json({ error: "Server error during account creation." });
            } else {
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  const userResponse = { ...user._doc };
                  delete userResponse.password;
                  res.json(userResponse);
                })
                .catch(err => res.status(500).json({ error: "Database error during account creation." }));
            }
          });
        }
      });
    }
  }).catch(err => res.status(500).json({ error: "Database error during account creation." }));
};

const logout = (req, res) => {
  res.clearCookie('access_token')
     .json({ message: "Successfully signed out" });
};


const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

const getUserName = (req, res) => {
  const token = req.cookies['access_token'];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(500).json({ error: "Server error during authentication." });
      } else {
        UserModel.findById(decoded.id)
          .then(user => {
            if (user) {
              res.status(200).json({ username: user.username });
            } else {
              res.status(404).json({ message: "User does not exist" });
            }
          })
          .catch(err => res.status(500).json({ error: "Database error during authentication." }));
      }
    });
  } else {
    res.status(403).json({ message: "No token provided." });
  }
};


const blockUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const result = await UserModel.updateOne({ _id: userId }, { status: 'Blocked' });

    if (result.nModified == 0) {
      res.json({ message: "No user was blocked. Please check the user ID." });
    } else {
      res.json({ message: "User successfully blocked." });
    }
  } catch (err) {
    console.error("Error blocking user:", err);
    res.status(500).json({ error: "Server error during user blocking." });
  }
};

const UnblockUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const result = await UserModel.updateOne({ _id: userId }, { status: 'active' });

    if (result.nModified == 0) {
      res.json({ message: "No user was unblocked. Please check the user ID." });
    } else {
      res.json({ message: "User successfully unblocked." });
    }
  } catch (err) {
    console.error("Error unblocking user:", err);
    res.status(500).json({ error: "Server error during user unblocking." });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const result = await UserModel.deleteOne({ _id: userId });

    if (result.deletedCount == 0) {
      res.json({ message: "No user was deleted. Please check the user ID." });
    } else {
      res.json({ message: "User successfully deleted." });
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error during user deletion." });
  }
};



module.exports = { login, signup, logout, validatesession, getUsers, blockUser, UnblockUser, deleteUser, getUserName };

const usermodel = require("../model/user.model");
const bcrypt = require("bcrypt");
const JWT = require(`jsonwebtoken`);

async function registercotroller(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required"
      });
    }

    const isuser = await usermodel.findOne({ username });
    if (isuser) {
      return res.status(400).json({
        error: "Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await usermodel.create({
      username,
      password: hashedPassword,
    });

    const TOKEN = JWT.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    res.cookie("usertoken", TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600000, // 1 hour
      path: '/',
      domain: 'onrender.com'
    });

    res.status(200).json({
      message: "Registration successful",
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Internal server error"
    });
  }
}

async function logincontroller(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required"
      });
    }

    const user = await usermodel.findOne({ username });

    if (!user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        error: "Invalid password"
      });
    }

    const TOKEN = JWT.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    res.cookie("usertoken", TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600000, // 1 hour
      path: '/',
      domain: 'onrender.com'
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error"
    });
  }
}

module.exports = { registercotroller, logincontroller };

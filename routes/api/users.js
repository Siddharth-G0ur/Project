const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../../models/User");

// @route GET api/users
// @desc get all user data
// @access Public

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.json(users);
    }
  } catch (err) {
    console.log(err.message);
    res.send(500).send("Server error");
  }
});

// @route POST api/users
// @desc create user data
// @access Public

router.post(
  "/",
  [
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Email Is Required").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, description } = req.body;
      const user = new User({ name, email, description });
      await user.save();
      return res.json(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route PUT api/users/:id
// @desc update user data by id
// @access Public

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const { description } = req.body;
      if (description) {
        user.description = description;
        await user.save();
        return res.json(user);
      } else {
        return res.send(401).send("Invalid ID");
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @route DELETE api/users/:id
// @desc delete user data by id
// @access Public

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

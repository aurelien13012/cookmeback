const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const UserModel = require("../Models/users");

//route affiche toutes les informations du user de la bdd
router.post("/infoUser", async (req, res, next) => {
  const user = await UserModel.findOne({ token: req.body.userTokenFromFront });
  console.log(user);
  res.json(user);
});

module.exports = router;
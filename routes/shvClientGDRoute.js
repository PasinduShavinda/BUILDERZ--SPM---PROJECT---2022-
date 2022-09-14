const express = require("express");
const router = express.Router();
const AdminGD = require('../models/shvAdminGDModel.js');
//const multer = require('multer');
//const fs = require('fs');
//const { check, validationResult } = require('express-validator');
//const path = require('path');


// Get All Garden Designers Route
router.get("/allClientGD", (req, res) => {
  AdminGD.find().exec((err, adminGds) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("shvClientViewAllGardenDesigners", {
        title: "All Client Garden Designers",
        adminGds: adminGds,
      });
    }
  });
});

module.exports = router;

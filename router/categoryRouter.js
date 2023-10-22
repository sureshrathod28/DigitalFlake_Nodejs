let express = require("express");
let userCategory=require('../models/categorySchema')
require("dotenv").config();
let userAuthentication=require('../middleware/middleware')
let jwt = require("jsonwebtoken");
let categoryapp = express.Router();


categoryapp.get("/categorypost", (req, res) => {
  userCategory.find()
    .then((record) => {
      res.status(200).json({ message: "Successfull", data: record });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to fetch post" });
    });
});

categoryapp.post("/categorypost" ,(req, res) => {
 
      let newdata = new userCategory({
        id:req.body.id,
        category: req.body.category,
        product_name: req.body.product_name,
        pack_size: req.body.pack_size,
        mrp: req.body.mrp,
        status: req.body.status
    });

      newdata
        .save()
        .then((record) => {
          res
            .status(200)
            .json({ message: "Category post successfully", data: record });
        })
        .catch((err) => {
          res.status(404).json({ message: "Failed to category data" });
        });
    
  });




module.exports = categoryapp;
const express = require('express');
const multer = require('multer');
const path = require('path');
let postapp = express.Router();
const userpost=require("../models/productSchema")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

// Endpoint for creating a product
postapp.post('/newproduct', upload.single('image'), async (req, res) => {
  try {
    const { id, category, product_name, mrp, quantity, status } = req.body;
    const image = req.file.filename;
    if (!req.file.filename) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
    const newProduct = new userpost({
      id,
      category,
      product_name,
      mrp,
      quantity,
      image,
      status,
    });

    const savedProduct = await newProduct.save();

    res.status(200).json({ message: 'Product created successfully', data: savedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

module.exports = postapp;

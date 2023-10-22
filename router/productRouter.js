let express = require("express");
let userpost = require("../models/productSchema");
require("dotenv").config();
let userAuthentication = require("../middleware/middleware");
let jwt = require("jsonwebtoken");
const cors=require("cors")
const multer=require("multer")
let postapp = express.Router();
const base64Img = require('base64-img');
postapp.use(cors({}))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

postapp.get("/userpost", userAuthentication, (req, res) => {
  jwt.verify(req.userId, process.env.Skey, (err, auth) => {
    if (err) {
      res.status(404).json({ message: "Invalid token" });
    } else {
      Postdata.find({ user: auth._id })
        .then((record) => {
          res.status(200).json({ message: "Successfull", data: record });
        })
        .catch((err) => {
          res.status(500).json({ message: "Failed to fetch post" });
        });
    }
  });
});

postapp.post("/userpost", upload.single('image'), async (req, res) => {
  try {
    let newdata = new userpost({
      category: req.body.Category,
      product_name: req.body.product_name,
      pack_Size: req.body.pack_size,
      mrp: req.body.mrp,
      image: req.body.myFile, // Use the base64 image data
      status: req.body.status
    });

    const record = await newdata.save();
    res.status(200).json({ message: "Data posted successfully", data: record });
  } catch (err) {
    console.error('Failed to post data:', err);
    res.status(500).json({ message: "Failed to post data", error: err });
  }
});



postapp.delete("/userpost/:postId", userAuthentication, (req, res) => {
  jwt.verify(req.userId, process.env.Skey, (err, auth) => {
    if (err) {
      res.status(404).json({ message: "Authentication Failed" });
    } else {
      const postId = req.params.postId;

         Postdata.findOneAndDelete({ _id: postId, user: auth._id })
        .then((deletedRecord) => {
          if (deletedRecord) {
            res.status(200).json({ message: "Post deleted successfully" });
          } else {
            res.status(404).json({ message: "Post not found" });
          }
        })
        .catch((err) => {
          res.status(500).json({ message: "Failed to delete post" });
        });
    }
  });
});

postapp.put("/userpost/:postId",userAuthentication, (req, res) => {
  jwt.verify(req.userId, process.env.Skey, (err, auth) => {
    if (err) {
      res.status(404).json({ message: "Authentication Failed" });
    } else {
      const postId = req.params.postId;

      Postdata.findOneAndUpdate(
        { _id: postId, user: auth._id },
        {
          $set: {
            Category:req.body.Category,
            Product_Name:req.body.Product_Name,
            Pack_Size:req.body.Pack_Size,
            MRP:req.body.MRP,
            image:req.file.path,
            Status:req.body.Status
            
          },
        },
        { new: true }
      )
        .then((updatedRecord) => {
          if (updatedRecord) {
            res
              .status(200)
              .json({ message: "Post updated successfully", data: updatedRecord });
          } else {
            res.status(404).json({ message: "Post not found" });
          }
        })
        .catch((err) => {
          res.status(500).json({ message: "Failed to update post" });
        });
    }
  });
});

function saveBase64Image(base64Data) {
  return new Promise((resolve, reject) => {
    const options = {
      fileName: Date.now(),
      type: 'png', // Adjust the image format as needed
    };

    base64Img.img(base64Data, 'uploads', options, (err, path) => {
      if (err) {
        reject(err);
      } else {
        resolve(path);
      }
    });
  });
}

module.exports = postapp;
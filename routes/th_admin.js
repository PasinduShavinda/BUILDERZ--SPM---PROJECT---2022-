const express = require("express");
const router = express.Router();
const Employee = require('../models/th_employee');
const path= require('path');
const multer = require('multer');

const fs = require('fs');
const dir = './uploads';

// Image Uploading
const upload = multer({
  storage: multer.diskStorage({

    destination: (req, file, callback) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: (req, file, callback) => { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

  }),

  fileFilter: (req, file, callback) => {
    let ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(/*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
});


// Add Employee Route
router.post('/add_Employee', upload.any(), (req, res) => {

      
      const employee = new Employee({

        employeeType:req.body.employeeType,
        fullName:req.body.fullName,
        mobile:req.body.mobile,
        email:req.body.email,
        qualifications:req.body.qualifications,
        profile_pic:req.files[0] && req.files[0].filename ? req.files[0].filename : '',
        project01_img:req.files[1] && req.files[1].filename ? req.files[1].filename : '',
        project01_disc:req.body.project01_disc,
        project02_img:req.files[2] && req.files[2].filename ? req.files[2].filename : '',
        project02_disc:req.body.project02_disc,
        project03_img:req.files[3] && req.files[3].filename ? req.files[3].filename : '',
        project03_disc:req.body.project03_disc
        
      
      });

      employee.save((err) => {
        if (err) {
          res.json({message:err.message,type:'danger'});
        }
        else{
          req.session.message={
            type:'success',
            message:'Employee sign up succssfully'
          };
          res.redirect('/get_Employee');
        }
          

      });

    });

router.get("/", (req, res) => {
      res.render("th_Home", {
        title: "Home Page",
      });
});

router.get("/add_Employee", (req, res) => {
  res.render("th_addEmployee", {
    title: "Add Employee Page",
  });
});

router.get("/employee_Management", (req, res) => {
  res.render("th_Home", {
    title: "Employee Management Home Page",
  });
});

//Get all employee route
router.get("/get_Employee", (req, res) => {
  Employee.find({}, (err, employees) => {
    if (err) {
      res.json({message:err.message})
    } else {
      res.render("th_viewEmployee", { 
        title:'All Employee',
        employees: employees });
    }
  })

});

//Get All Employees to the Garden Designers Page
router.get("/addAdminGD", (req, res) => {
  Employee.find({}, (err, employees) => {
    if (err) {
      res.json({message:err.message})
    } else {
      res.render("shvAddGardenDesigners", { 
        title:'Add Garden Designers',
        employees: employees });
    }
  })

});

//Edit employee details route
router.get('/editEmployee/:id', (req,res) => {
  let id = req.params.id;
  Employee.findById(id, (err, employees) => {
    if (err) {
      res.redirect("/");
    } else {
      if (employees == null) {
        res.redirect("/");
      } else {
        res.render("th_updateEmployee", {
          title: "Edit Employee",
          employees: employees,
        });
      }
    }
  });
});

module.exports = router;

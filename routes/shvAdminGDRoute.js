const express = require('express');
const router = express.Router();
const AdminGD = require('../models/shvAdminGDModel.js');
const multer = require('multer');
const fs = require('fs');

// Image Uploading 
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '_' + file.originalname);
        }
    }),
});

// Get All users Route
router.get("/", (req, res) => {
    AdminGD.find().exec((err, adminGds) => {
        if (err) {
            res.json({ message: err.message })
        } else {
            res.render('shvViewAllGardenDesigners', {
                title: 'All Garden Designers',
                adminGds: adminGds
            })
        }
    })
});

router.get('/addAdminGD', (req, res) => {
    res.render("shvAddGardenDesigners",
        {
            title: "Add Garden Designers"
        });
});

// Add Garden Designers Route
router.post('/addAdminGD', upload.any(), (req, res) => {
    const adminGd = new AdminGD({
        Name: req.body.Name,
        Email: req.body.Email,
        Phone: req.body.Phone,
        Qualifications: req.body.Qualifications,
        ProfilePic: req.files[0] && req.files[0].filename ? req.files[0].filename : '',
        FirstProjectPic: req.files[1] && req.files[1].filename ? req.files[1].filename : '',
        FirstProjectDesc: req.body.FirstProjectDesc,
        SecondProjectPic: req.files[2] && req.files[2].filename ? req.files[2].filename : '',
        SecondProjectDesc: req.body.SecondProjectDesc,
        ThirdProjectPic: req.files[3] && req.files[3].filename ? req.files[3].filename : '',
        ThirdProjectDesc: req.body.ThirdProjectDesc,
    });
    adminGd.save((err) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            req.session.message = {
                type: "success",
                message: "Garden Designer Added Successfully",
            };
            res.redirect("/");
        }
    })
});

// Edit User Router
router.get('/editAdminGD/:id', (req, res) => {
    let id = req.params.id;
    AdminGD.findById(id, (err, adminGd) => {
        if (err) {
            res.redirect('/');
        } else {
            if (adminGd == null) {
                res.redirect('/');
            } else {
                res.render("shvEditGardenDesigners", {
                    title: "Edit Garden Designers",
                    adminGd: adminGd,
                });
            }
        }
    });
});

// Update user route
router.post("/updateAdminGD/:id", upload.any(), (req, res) => {

    let id = req.params.id;
    let new_ProfilePic = '';
    let new_FirstProjectPic = '';
    let new_SecondProjectPic = '';
    let new_ThirdProjectPic = '';

    // Profile Pic
    if (req.file) {
        new_ProfilePic = req.files[0] && req.files[0].filename ? req.files[0].filename : '';
        try {
            fs.unlinkSync(`./uploads/${req.body.old_ProfilePic}`);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_ProfilePic = req.body.old_ProfilePic;
    }
    
    // First Project Pic
    if (req.file) {
        new_FirstProjectPic = req.files[1] && req.files[1].filename ? req.files[1].filename : '';
        try {
            fs.unlinkSync(`./uploads/${req.body.old_FirstProjectPic}`);  
        } catch (err) {
            console.log(err);
        }
    } else {
        new_FirstProjectPic = req.body.old_FirstProjectPic;
    }

    // Second Project Pic
    if (req.file) {

       new_SecondProjectPic = req.files[2] && req.files[2].filename ? req.files[2].filename : '';
    
        try {
            fs.unlinkSync(`./uploads/${req.body.old_SecondProjectPic}`);  
        } catch (err) {
            console.log(err);
        }
    } else {
        new_SecondProjectPic = req.body.old_SecondProjectPic;
    }

    // Third Project Pic
    if (req.file) {

        new_ThirdProjectPic = req.files[3] && req.files[3].filename ? req.files[3].filename : '';
     
         try {
             fs.unlinkSync(`./uploads/${req.body.old_ThirdProjectPic}`);  
         } catch (err) {
             console.log(err);
         }
     } else {
        new_ThirdProjectPic = req.body.old_ThirdProjectPic;
     }

    AdminGD.findByIdAndUpdate(id, {
        Name: req.body.Name,
        Email: req.body.Email,
        Phone: req.body.Phone,
        Qualifications: req.body.Qualifications,
        ProfilePic: new_ProfilePic,
        FirstProjectPic: new_FirstProjectPic,
        FirstProjectDesc: req.body.FirstProjectDesc,
        SecondProjectPic:new_SecondProjectPic,
        SecondProjectDesc: req.body.SecondProjectDesc,
        ThirdProjectPic:new_ThirdProjectPic,
        ThirdProjectDesc: req.body.ThirdProjectDesc,

    }, (err, result) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            req.session.message = {
                type: 'success',
                message: 'Garden Designer Updated Successfully'
            };
            res.redirect('/');
        }
    })
});

// Delete User Route
router.get('/deleteAdminGD/:id', (req, res) => {
    let id = req.params.id;
    AdminGD.findByIdAndRemove(id, (err, result) => {
        if (result.ProfilePic != '') {
            try {
                fs.unlinkSync(`./uploads/${result.ProfilePic}`);
            } catch (err) {
                console.log(err);
            }
        }
        if(result.FirstProjectPic != ''){
            try{
                fs.unlinkSync(`./uploads/${result.FirstProjectPic}`);
            }catch(err){
                console.log(err);
            }
        }
        if(result.SecondProjectPic != ''){
            try{
                fs.unlinkSync(`./uploads/${result.SecondProjectPic}`);
            }catch(err){
                console.log(err);
            }
        }
        if(result.ThirdProjectPic != ''){
            try{
                fs.unlinkSync(`./uploads/${result.ThirdProjectPic}`);
            }catch(err){
                console.log(err);
            }
        }
        if (err) {
            res.json({ message: err.message })
        } else {
            req.session.message = {
                type: 'info',
                message: 'Garden Designer Deleted Successfully'
            };
            res.redirect("/");
        }

    });
});

module.exports = router;
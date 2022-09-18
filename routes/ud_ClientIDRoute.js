const express = require("express");
const router = express.Router();
const IntiriorDesigner = require("../models/ud_AdminIDModel");
const ClientIntiriorDesigner = require("../models/ud_ClientIDModel");
const { check, validationResult } = require("express-validator");

// Get All Intirior Designers Route
router.get("/allClientIntiriorDesigner", (req, res) => {
  IntiriorDesigner.find().exec((err, intiriorDesigner) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("ud_View_ClientAll_IntiriorDesigner.ejs", {
        title: "All Intirior Designer",
        intiriorDesigner: intiriorDesigner,
      });
    }
  });
});

// Add InteriorDesigner Requirements Route
router.post(
  "/addClientInteriorDesignerReq/:id",
  [
    check("InteriorName")
      .matches(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)
      .withMessage("Invalid Name.. Please enter correct name !!"),

    check("Email")
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      .withMessage("Email is not valid.. Please enter correct email !! !"),

    check("Phone")
      .isLength({ min: 10, max: 10 })
      .withMessage(
        "Mobile number is not valid.. Please enter correct mobile number !! !"
      ),

    check("Budget")
      .matches(/^(\d*([.,](?=\d{3}))?\d+)+((?!\2)[.,]\d\d)?$/)
      .withMessage("Budget is not valid.. Please enter correct budget !! !"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      let id = req.params.id;
      IntiriorDesigner.findById(id, (err, intiriorDesigner) => {
        if (err) {
          res.json({ message: err.message });
        } else {
          res.render("ud_Add_ClientRequirements.ejs", {
            title: "Client Add Requirements",
            intiriorDesigner: intiriorDesigner,
            alert,
          });
        }
      });
    } else {
      const IntiriorDesignerReq = new ClientIntiriorDesigner({
        InteriorName: req.body.InteriorName,
        ClientName: req.body.ClientName,
        Email: req.body.Email,
        Phone: req.body.Phone,
        Location: req.body.Location,
        ThemeColour: req.body.ThemeColour,
        RoofColour: req.body.RoofColour,
        FloorColour: req.body.FloorColour,
        Funiture: req.body.Funiture,
        Pantry: req.body.Pantry,
        Deco: req.body.Deco,
        Budgetd: req.body.Budget,
        SpecialReq: req.body.SpecialReq,
      });

      IntiriorDesignerReq.save((err) => {
        if (err) {
          res.json({ message: err.message, type: "danger" });
        } else {
          req.session.message = {
            type: "success",
            message: "Requirements Successfully Submitted",
          };
          res.redirect("/SpecificIntiriorDesignerReq");
        }
      });
    }
  }
);

router.post("/addClientInteriorDesignerReq", (req, res) => {
  const IntiriorDesignerReq = new ClientIntiriorDesigner({
    InteriorName: req.body.InteriorName,
    ClientName: req.body.ClientName,
    Email: req.body.Email,
    Phone: req.body.Phone,
    Location: req.body.Location,
    ThemeColour: req.body.ThemeColour,
    RoofColour: req.body.RoofColour,
    FloorColour: req.body.FloorColour,
    Funiture: req.body.Funiture,
    Pantry: req.body.Pantry,
    Deco: req.body.Deco,
    Budgetd: req.body.Budget,
    SpecialReq: req.body.SpecialReq,
  });
 IntiriorDesignerReq.save((err) => {
   if (err) {
     res.json({ message: err.message, type: "danger" });
   } else {
     req.session.message = {
       type: "success",
       message: "Requirements Added Successfully",
     };
     res.redirect("/SpecificIntiriorDesignerReq");
   }
 });
});


// Get Specific Garden Designer Projects
router.get("/clientIntiriorDesignerProject/:id", (req, res) => {
  let id = req.params.id;
 IntiriorDesigner.findById(id, (err, intiriorDesigner) => {
   if (err) {
     res.json({ message: err.message });
   } else {
     res.render("ud_Add_ClientRequirements.ejs", {
       title: "Get Specific Projects client page",
       intiriorDesigner: intiriorDesigner,
     });
   }
 });
});

// Get Specific Requirements given to the IntiriorDesigner
router.get("/SpecificGDReq", (req, res) =>{
  ClientIntiriorDesigner.find()
    .sort({ $natural: -1 })
    .limit(1)
    .exec((err, clientIntiriorDesignerReqs) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.render("ud_View_ClientSubmitted_Requirements", {
          title: "Get Specific requirements to the IntiriorDesigner",
          clientIntiriorDesignerReqs: clientIntiriorDesignerReqs,
        });
      }
    });
});

module.exports = router;
let express = require('express');
let multer = require('multer')
const router=express.Router();
let Architect= require('../models/sug_architect');
 
  path = require('path');


let fs = require('fs');
let dir = './uploads';


let upload = multer({
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



router.get("/add_Architect",(req,res)=>{
  res.render("sug_add_architecture.ejs",{title:"add architecture"})
});




 router.get("/All_Architect", (req, res) => {
    Architect.find({}, (err, data) => {
      if (err) {
        res.json({message:err.message})
      } else {
        res.render('sug_all_architect.ejs', { 
          title:'All architects',
          data: data });
      }
    })
  
  });


router.post('/add_Architect', upload.any(), (req, res) => {

  if (!req.body && !req.files) {
    res.json({ success: false });
  } else {
    let c;
    Architect.findOne({}, (err, data) => {

      if (data) {
        c = data.unique_id + 1;
      } else {
        c = 1;
      }

      let architect = new Architect({

        unique_id: c,
        architect:req.body.architect,
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

      architect.save((err, architect) => {
        if (err)
        res.json({message:err.message,type:'danger'});
        else{
          req.session.message={
            type:'success',
            message:'Architect  added succssfully'
        };
        res.redirect('/All_Architect');
        }
          

      });

    }).sort({ _id: -1 }).limit(1);

  }

});


//Edit an user route
router.get("/edit_architect/:id",(req,res)=>{
  let id=req.params.id;
  Architect.findById(id,(err,data)=>{
      if(err){
          res.redirect("/All_Architect")
      }else{
          res.render("sug_edit_architect.ejs",{
              title:'Edit architects',
              data:data, 
          })
      }
  })
})


//update user route

router.post('/update_architect/:id',upload.any(),(req,res)=>{
  let id=req.params.id;

 

  let new_profile_pic="";
  let new_project01_img="";
  let new_project02_img="";
  let new_project03_img="";

 



  if(req.files[0]){
      new_profile_pic=req.files[0] && req.files[0].filename ? req.files[0].filename : ''
      try{
          fs.unlinkSync('./uploads/'+req.body.old_profile_pic);
          }catch(err){
          console.log(err)
        }
   }else{
      new_profile_pic=req.body.old_profile_pic;
  }



  if(req.files[1]){
    new_project01_img=req.files[1] && req.files[1].filename ? req.files[1].filename : ''
    try{
       fs.unlinkSync('./uploads/'+req.body.old_project01_img);
    }catch(err){
        console.log(err)
    }
    }else{ 
        new_project01_img=req.body.old_project01_img;
    }
     
    if(req.files[2]){
      new_project02_img=req.files[2] && req.files[2].filename ? req.files[2].filename : ''
      try{
         fs.unlinkSync('./uploads/'+req.body.old_project02_img);
      }catch(err){
          console.log(err)
      }
      }else{ 
          new_project02_img=req.body.old_project02_img;
      }
    

      if(req.files[3]){
        new_project03_img=req.files[3] && req.files[3].filename ? req.files[3].filename : ''
        try{
           fs.unlinkSync('./uploads/'+req.body.old_project03_img);
        }catch(err){
            console.log(err)
        }
        }else{ 
            new_project03_img=req.body.old_project03_img;
        }





      
  Architect.findByIdAndUpdate(id,{
     
     

      architect:req.body.architect,
      mobile:req.body.mobile,
      email:req.body.email,
      qualifications:req.body.qualifications,

      profile_pic:new_profile_pic,

      project01_img:new_project01_img,
      project01_disc:req.body.project01_disc,

      project02_img: new_project02_img,
      project02_disc:req.body.project02_disc,

      project03_img: new_project03_img,
      project03_disc:req.body.project03_disc

  },(err,result)=>{
      if(err){
          res.json({message:err.message, type:"danger"});
      }else{
          req.session.message={
              type:'success',
              message:"User updateed successfully"
          }

          res.redirect("/All_Architect")
      }
  })
});






router.get('/delete_architect/:id',(req,res)=>{
  let id=req.params.id;
  Architect.findByIdAndRemove(id,(err,result)=>{
     if(result.profile_pic!=''||result.result.project01_img!=''||result.result.project02_img!=''||result.result.project03_img!=''){
      try{
          fs.unlinkSync('./uploads/'+result.profile_pic);
          fs.unlinkSync('./uploads/'+result.project01_img);
          fs.unlinkSync('./uploads/'+result.project02_img);
          fs.unlinkSync('./uploads/'+result.project03_img);
      }catch(err){
          console.log(err);
      }
     }
  

     if (err){
      res.json({message:err.message});
     }else{
      req.session.message={
          type:'success',
          message:'Architect deleted successfully'
      };

      res.redirect("/All_Architect");
     }
  })
})



router.get("/project_architect/:id",(req,res)=>{
  let id=req.params.id;
  Architect.findById(id,(err,data)=>{
      if(err){
          res.redirect("/All_Architect")
      }else{
          res.render("sug_architects_project.ejs",{
              title:'Edit architects',
              data:data, 
          })
      }
  })
})















module.exports=router;

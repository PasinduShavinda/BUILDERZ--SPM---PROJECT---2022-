const mongoose=require("mongoose")
const architectRequirementSchema=new mongoose.Schema({
    Architecture:{
        type:String,
        required:true,
    },
    Client_Name:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
    },
    Builging_Type:{
        type:String,
        required:true,
    },
  
    No_of_floors:{
        type:String,
        required:true,
    },
    Estimated_Budget:{
    type:String,
    required:true,
},
    Location:{
    type:String,
    required:true,
},

Plan_of_the_Land:{
    type:String,
    required:true,
    
},
Bed_Rooms:{
    type:String,
    required:true,
   
},

Bathrooms:{
    type:String,
    required:true,
    
},
Parking_Area:{
    type:String,
    required:true,
    
},
Other_Requirements:{
    type:String,
    required:true
    
},
})

module.exports=mongoose.model("ArchitectRequirements",architectRequirementSchema)
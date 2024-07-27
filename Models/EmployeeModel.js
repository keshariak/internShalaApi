const mongoose = require("mongoose")

const jwt= require("jsonwebtoken")
var bcrypt = require('bcryptjs');
const employeeModel = new mongoose.Schema({
    firstname:{
        type: String,
        required:[true, "Firstname is Required"],
        
    },
    lastname:{
        type: String,
        required:[true, "Lastname is Required"],
        
    },
    
    contact:{
        type: String,
        required:[true, "Contact is Required"],
        maxLength:[10, "Password Should not exceed more than 15 characters"],
        minLength:[10, "Password should have atleast 5 characters"],
        
    },
  
    email:{
        type: String,
        required:[true, "Email is Required"],
        unique:true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
             'Please fill a valid email address'
        ]
    },
    password:{
        type:String,
        select:false,
        maxLength:[15, "Password Should not exceed more than 15 characters"],
        minLength:[5, "Password should have atleast 5 characters"],
        // match:[]
    },
    resetPasswordToken:{
    type:String,
    default:"0"

   },
   organizationlogo:{
    type: Object,

    default:{
        fileId:'',
        url:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fdummy-avatar&psig=AOvVaw3BoFZVzSnCAVVHQhj39Qhs&ust=1721550253102000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJiymMqYtYcDFQAAAAAdAAAAABAE"
    }
   },
   organizationname:{
    type: String,
    required:[true, "Organization name is Required"],
    
},
   internships:[
    {type:mongoose.Schema.Types.ObjectId, ref:'internship'}
   ],
   jobs:[
    {type:mongoose.Schema.Types.ObjectId, ref:'job'}
   ],
},

{timestamps:true}
)

employeeModel.pre("save", function(){
    if(!this.isModified("password")){
        return;
    }
    let salt=bcrypt.genSaltSync(10);
    this.password =bcrypt.hashSync(this.password, salt)
});

employeeModel.methods.comparepassword = function(password){
    return bcrypt.compareSync(password, this.password);

};

employeeModel.methods.getjwttoken= function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

const employee = mongoose.model("employee",employeeModel);
module.exports= employee;
const mongoose = require("mongoose")

var bcrypt = require('bcryptjs');
const studentModel = new mongoose.Schema({
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
}},
{timestamps:true}
)

studentModel.pre("save", function(){
    if(!this.isModifed("password")){
        return;
    }
    let salt=bcrypt.genSaltSync(10);
    this.password =bcrypt.hashSync(this.password, salt)
});

studentModel.methods.comparepassword = function(password){
    return bcrypt.compareSync(password, this.password);

};

const Student = mongoose.model("student",studentModel);
module.exports= Student;
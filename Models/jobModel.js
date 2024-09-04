const mongoose = require("mongoose")


const jobModel = new mongoose.Schema({
    students:[{type:mongoose.Schema.Types.ObjectId, ref:'student'}],
    employee:{type:mongoose.Schema.Types.ObjectId, ref:'employee'},
    title: String,
    skill: String,
    jobtype:{type: String, enum:["In office", "Remote"]},
    openings: Number,
    description:String,
    from:String,
    preferences:String,
    salary:Number,
    perks:String,
    assesments:String,   
},

{timestamps:true}
)


const Job = mongoose.model("job",jobModel);
module.exports= Job;
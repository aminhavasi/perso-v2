const mongoose=require('mongoose');
const regexValidator = /^(13[0-9][0-9]|14[0-4][0-9]|1450)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$/;

const projectSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        minlength:3,
        maxlength:255
    },
    date: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return regexValidator.test(v);
            },
        },
    },
    media:{
        type:String,
        default:'none',
        
    },
    content:{
        type:String,
        required:true,
        minlength:3
    },
    writer:{
        type:String,
        enum: ['admin', 'creator'],
        minlength:5,
        maxlength:7,
        required:true

    },
    source:{
        type:String,
        
    }
})


const Project=mongoose.model('Project',projectSchema)

module.exports=Project
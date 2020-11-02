const mongoose=require('mongoose');
const regexValidator = /^(13[0-9][0-9]|14[0-4][0-9]|1450)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$/;

const postSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        minlength:3,
        maxlength:255,
        required:true
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
        minlength:3,
        maxlength:255,
        default:'none'
    },
    content:{
        type:String,
        required:true,

    },
    writer:{
        type:String,
        enum: ['admin', 'creator'],
        minlength:5,
        maxlength:7,
        required:true

    }



})

const Post=mongoose.model('Post',postSchema)
module.exports=Post



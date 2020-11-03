const Joi=require('joi');
const createPostValidator=(post)=>{
    const schema=Joi.object({
        name:Joi.string().min(3).max(255).required(),
        media:Joi.string().min(3).max(255),
        content:Joi.string().min(3).required(),
    })

    return schema.validate(post)

}

const deletePost=(id)=>{
    const schema=Joi.object({
      _id:Joi.string().required()
    })

    return schema.validate(id)

}

const editPostValidator=(post)=>{
    const schema=Joi.object({
        
        name:Joi.string().min(3).max(255),
        media:Joi.string().min(3).max(255),
        content:Joi.string().min(3),
    })

    return schema.validate(post)

}




module.exports={
    createPostValidator,deletePost,editPostValidator
}
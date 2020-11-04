const Joi=require('joi');
const createProjectValidator=(project)=>{
    const schema=Joi.object({
        name:Joi.string().min(3).max(255).required(),
        media:Joi.string(),
        content:Joi.string().required().min(3),
        source:Joi.string()
    })

    return schema.validate(project)
}

module.exports={createProjectValidator}
const express=require('express');
const router=express.Router();

const {createProjectValidator}=require('./../validator/projectsValidator')

//admin projects


///
router.post('/create',async(req,res)=>{
    try {
        const {error}=await createProjectValidator(req.body)
    if(error)return res.status(400).send(error.details[0].message)        
    } catch (err) {
        res.status(400).send(err)
        
    }
})

module.exports=router
const express=require('express')
const router=express.Router()
const Post=require('../models/post')
const { createPostValidator,deletePost ,editPostValidator} = require('../validator/postValidation')
const persianDate=require('persian-date')
const authenticate=require('./../middleware/authenticate')
const {errorHandler}=require('./../helper/errors')

persianDate.toLocale('en')
let date=new persianDate().format('YYYY/MM/DD')

//admin access-------------------------------
router.post('/create',authenticate,async(req,res)=>{
    try {
        const {error}=await createPostValidator(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        req.body.date=date;
        req.body.writer=req.user.access;

        const newPost=await new Post(req.body)
        await newPost.save()
        res.status(201).send('post created')

    } catch (err) {
        res.status(400).send(err)
        
    }
})

router.delete('/delete',authenticate,async(req,res)=>{
    try {
        const {error}=await deletePost(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        const statusDelete=await Post.findOneAndDelete({_id:req.body._id})
        if(!statusDelete) throw errorHandler('post not found for delete',1004)
        res.status(200).send('post has been removed')
    } catch (err) {
        if(err.code===1004)return res.status(400).send(err.message)
        res.status(400).send(err)
    }
})

router.put('/edit',authenticate,async(req,res)=>{
    try {
        let _id=req.query._id;
        if(!_id) throw errorHandler('id not found',1004)
        const {error}=await editPostValidator(req.body)
        if(error)return res.status(400).send(error.details[0].message)
        await Post.findOneAndUpdate({_id},{

            $set:req.body
        },{new:true},(err,data)=>{
            if(err) throw errorHandler('something went wrong',1000)
            else res.status(200).send('success update post')
        })
    } catch (err) {
        if(err.code===1004)return res.status(404).send(err.message)
        if(err.code===1000) return res.status(400).send(err.message)
        res.status(400).send(err)
        
    }
})

//unadmin access --------------------------------
    router.get('/post',async(req,res)=>{
        try {
            let _id=req.query._id;
            if(!_id) throw errorHandler('id not found',1004)

            const post=await Post.findOne({_id})
            if(!post) return res.status(404).send('post not found')
            res.status(200).send(post)
            
        } catch (err) {
            if(err.code===1004)return res.status(404).send(err.message)
            res.status(400).send(err)
            
        }
    })


    router.get('/posts',async(req,res)=>{
        try {
         
            const posts=await Post.find({})
            if(!posts)return res.status(404).send('posts not found')
            res.status(200).send(posts)
        } catch (err) {
            if(err.code===1004)return res.status(404).send(err.message)
            res.status(400).send(err)
            
        }
    })


module.exports=router
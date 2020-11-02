const express=require('express')
const router=express.Router()
const Post=require('../models/post')
const fs=require('fs')
const path=require('path')

// router.post('/create',async(req,res)=>{
//     try {
        
//     } catch (err) {
        
//     }
// })

// router.get('/',(req,res)=>{
//     const fss=fs.readFile(path.resolve(__dirname,'./text.txt'),'utf8',(err,data)=>{
//         if(err){
//             console.log(err);
//         }
//         console.log(data);
//         res.sendFile(path.resolve(__dirname,'./text.txt'))
//     })
   

  
// })
module.exports=router
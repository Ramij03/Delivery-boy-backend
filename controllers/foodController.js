const Food=require('../models/Food');

module.exports={
    addFood: async (req,res)=>{
        const newFood= new Food(req.body)
        try{
            await newFood.save();
            res.status(200).json({status:true, message:"Food created"})
        }
        catch(err){
            res.status(500).json({status:false,message:"Food could not be created"})
        }
    },
    getFoodbyId: async(req,res)=>{
        const foodId= req.params.id;
        try{
            const food=await Food.findById(foodId);
            if(!food){
                return res.status(404).json({status:false, messgae:"Food not Found"})
            }
            res.status(200).json({status:true, food})
        }
        catch(err){
            res.status(500).json({status:false,message:"Food could not be returned"})
       
        }
    },
    getFoodbyRestaurant:async (req,res)=>{
        const restaurantId= req.parms.restaurantId;
        try{
            const foods= await Food.find({restaurant: restaurantId});

            if(!foods || foods.length===0){
                return res.status(404).json({status:false, message:"No Foods for this restaurant"})
            }
            res.status(200).json({status:true, foods})
        }
        catch(err){
            res.status(500).json({status:false,message:"Foods could not be returned"})
       
        }
    },
    deleteFoodbyId: async(req,res)=>{
        const foodId=req.params.id;
        try{
            const food= await Food.findById(foodId);
            if(!food){
                return res.status(404).json({status:false, message:"No food found"})
            }
            await Food.findByIdAndDelete(foodId);
            res.status(200).json({status:true,message:"Food deleted",food})
        }
        catch(err){
            res.status(500).json({status:false,message:"Foods could not be deleted"})
       
        }
    },
    foodAvailability: async (req,res)=>{
        const foodId=req.params.id;
        try{
            const food=await Food.findById(foodId)
            if(!food){
                return res.status(404).json({Status:false, Message:"No food found"})
            }

            food.isAvailable=!food.isAvailable;
            await food.save();

            res.status(200).json({status:true, message:"Food availablabilty toggled"})
        }
        catch(err){
            res.status(500).json({status:false,message:"Error fetching Food"})
       
        }
    },
    updateFoodbyId :async(req,res)=>{
        const foodId=req.params.id;
        try{
            const food= await Food.findById(foodId);
            if(!food){
                return res.status(404).json({status:false,messgae:"No food found"})
            }
            const updatedFood= await Food.findByIdAndUpdate(
                foodId,
                req.body,
                {
                    new:true,
                    runValidators:true
                }
            );
            res.status(200).json({status:true,message:"Food updated"})
        }
        catch(err){
            res.status(500).json({status:false,message:"Error fetching Food"})
       
        }
    },
    addFoodTags: async (req,res)=>{
        const foodId=req.params.id;
        const {tag}=req.body;
        try{
            const food=await Food.findById(foodId);
            if(!food){
                return res.status(404).json({status:false,messgae:"No food found"})
           
            }
            if(food.foodTags.includes(tag)){
                return res.status(400).json({status:false,message:"Tag already added"})

            }
            food.foodTags.push(tag);
            await food.save();
            res.status(200).json({status:true, message:"Food tag was added"})
        }
        catch(err){
            res.status(500).json({status:false,message:"Error adding FoodTags"})
       
        }
    },
    getRandomFoodbyCode: async (req,res)=>{
        try{
            const randomFood= await Food.aggregate([
                {$match:{code:req.params.code}},
                {$sample: {size:5}},
                {$project:{_id:0}}
            ]);
            res.status(200).json({status:true,randomFood})
        }
        catch(err){
            res.status(500).json({status:false,message:"Error adding FoodTags"})
       
        }

    },
    addFoodType: async (req,res)=>{
        const foodId=req.params.id;
        const {foodType}=req.body.foodType;
        try{
            const food=await Food.findById(foodId);
            if(!food){
                return res.status(404).json({status:false,message:"Food not found"})
            }
            if(food.foodType.includes(foodType)){
                return res.status(400).json({status:false, message:"Food type exists"})
            }

            food.foodType.push(foodType);
            await food.save();

            res.status(200).json({status:true,message:"Food type added "})
        }
        catch(err){
            res.status(500).json({status:false,message:"Error adding FoodType"})
       
        }
    },
    getRandomFoodbyCodeandCategory: async (req,res)=>{
        const {category, code}=req.params;
        try{
            let foods=await Food.aggregate([
                {$match:{code:code,category:category}},
                {$sample: {size:10}},
            ])
            if(!foods ||foods.length===0){
                foods=await Food.aggregate([
                    {$match:{code:code}},
                    {$sample: {size:10}},
                ])
            }
            else{
                foods=await Food.aggregate([
                    {$sample: {size:10}},
                ])
            }
            res.status(200).json(foods)
        }
        catch(err){
            res.status(500).json({status:false,message:"Error getting foods"})
       
        }

    },
}
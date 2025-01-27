const Category=require('../models/Category');

module.exports={
    createCategory: async (req,res)=>{
        const newCategory= new Category(req.body);
        try{
           await newCategory.save();

           res.status(201).json({status:true, message:"Category save successfully"})
        }
        catch(err) {
            res.status(500).json({status:true, error:err.message})
        }
    },

    updateCategory: async(req,res)=>{
        const id=req.params.id;
        const {title,value,imageUrl}=req.body;

        try{
            const updatedCategory=await Category.findByIdAndUpdate(id,
                {
                    title:title,
                    value:value,
                    imageUrl:imageUrl
                },
                    {new:true}
            );
            if(!updatedCategory){
                return res.status(404).json({status:false, message:"Category not found"})
            }
            res.status(200).json({status:true, message:"Category updated"})
        }
        catch(err){
            res.status(500).json({status:false, error:err.message})
        }
    },
    deleteCategory: async (req,res)=>{
        const id=req.params.id;
        try{
        const category= await Category.findById(id);
        if(!category){
            return res.status(404).json({status:false, message:"Category not found"});
        }
        await Category.findByIdAndDelete(id);
        res.status(200).json({status:true, message:"Category Deleted"})
        }
        catch(err){
            res.status(500).json({status:false, error:err.message})
        }
    },

    getAllcategories: async (req,res)=>{
        try{
            const categories=await Category.find({},{__v:0});
            res.status(200).json({status:true, categories})
        }
        catch(err){
            res.status(500).json({status:false, error:err.message})
        }
    },
    patchCategoryImage: async (req, res) => {
        const id = req.params.id;
        const { imageUrl } = req.body; // Extract imageUrl directly
        try {
            const updatedCategory = await Category.findByIdAndUpdate(
                id,
                { imageUrl },
                { new: true }
            );
            if (!updatedCategory) {
                return res.status(404).json({ status: false, message: "Category not found" });
            }
            res.status(200).json({ status: true, message: "Category image updated", updatedCategory });
        } catch (err) {
            res.status(500).json({ status: false, error: err.message });
        }
    },
    getRandomCategories:async(req,res)=>{
        try{
            let categories=await Category.aggregate([
                {$match:{value:{$ne:'more'}}},
                {$sample:{size:7}}
            ]);
            const moreCategories= await Category.findOne({value:"more"});
            if(moreCategories){
            categories.push(moreCategories);
            }
            
            res.status(200).json({
                status:true,
                categories
            });
        }
        catch(err){
            res.status(500).json({status:false, error:err.message})
        }
    }
}
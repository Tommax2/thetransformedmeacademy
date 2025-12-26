import Product from '../models/product.model.js';
import redis from '../lib/redis.js'; 
import cloudinary from '../lib/cloudinary.js';

export const getAllProducts = async ( req, res) =>{
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
         let featuredProducts = await redis.get("featured_products")

        if (featuredProducts) {
            return res.status(200).json(JSON.parse(featuredProducts));
        }

        featuredProducts = await Product.find({ isFeatured: true }).lean();
        
        if (!featuredProducts) {
            return res.status(404).json({ message: 'No featured products found' });
        }
    
        await redis.set("featured_products", JSON.stringify(featuredProducts), 'EX', 3600); // Cache for 1 hour
        res.status(200).json(featuredProducts);
}
    catch (error) {
        console.error('Error fetching featured products:', error);
        res.status(500).json({ message: 'Server Error' });

    }

};

export const createProducts = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;
        let cloudinaryResponse = null
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {
                folder: 'products',
            });
        }

        const product = await Product.create({

            name,
            description,
            price,  
            image: cloudinaryResponse ? cloudinaryResponse.secure_url : "",
            category,
        });

        res.status(201).json(product);
    } catch (error) {
        console.log('Error in createProduct Controller', error.message);
        res.status(500).json ({ message: "Server error", error: error.message})
    }
}

export const deleteProducts = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
   
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.image) {
            const publicId = product.image.split('/').pop().split('.')[0]
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
            } catch (error) {
                console.error('Error deleting image from Cloudinary:', error);
            }
        }
        res.status(200).json({ message: 'Product deleted successfully' });
          
    }
    catch (error) {
         console.log('Error in deleteProduct Controller', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([{
            $sample: { size: 3 }
         },
         {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                image: 1,
                price: 1
            }
         }
        ]);
        res.status(200).json(products);
    } catch (error) {
        console.log('Error in getRecommendedProducts Controller', error.message);
        res.status(500).json({ message: 'Server Error' });
    }   
};

export const getProductsByCategory = async (req, res) => {
   const { category } = req.params;
    try {
        const products = await Product.find({ category});
        res.status(200).json(products);
    }
    catch (error) {
        console.log('Error in getProductsByCategory Controller', error.message);
        res.status(500).json({ message: 'Server Error' });
    }

}

export const toggleFeaturedProduct = async (req, res) => {
    try {
       const product = await Product.findById(req.params.id);
       if (product) {
              product.isFeatured = !product.isFeatured;
              const updatedProduct = await product.save();
              await updateFeaturedProductsCache();
              return res.status(200).json(updatedProduct );
       } else {
        return res.status(404).json({ message: 'Product not found' });
       } 
    }
    catch (error) {
        
    console.log('Error in toggleFeaturedProduct Controller', error.message);
    res.status(500).json({ message: 'Server Error' });
    }
}
async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts), 'EX', 3600); // Cache for 1 hour
    } catch (error) {
        console.error('Error updating featured products cache:', error);
    }
}
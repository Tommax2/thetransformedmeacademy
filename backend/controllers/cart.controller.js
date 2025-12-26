import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.user.CartItems } });

      const CartItems = products.map(product => {
        const itemm = req.user.CartItems.find(cartItem.Id === product._id.toString());
        return {
            ...product.toJSON(),
            quantity: item.quantity
        };
      });

        res.status(200).json(CartItems);
    } catch (error) {
        console.log('Error in getCartProducts Controller', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;
        const existingCartItem = await CartItem.find(item => item.Id === productId);

        if (existingCartItem) {
            existingCartItem.quantity += 1;
          
        } else {
           user.CartItems.push(productId);
            };
           await user.save();
            res.json(user.CartItems);
            
    } catch (error) {
        console.log('Error in addToCart Controller', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const removeFromCart = async (req, res) => {
    // Implementation for removing an item from the cart
   try{
         const { productId } = req.body;
        const userId = req.user.id;
        if(!productId){
            user.CartItems = [];
        } else {
            user.CartItems = user.CartItems.filter(item => item.Id !== productId);
        }
        await user.save();
        res.json(user.CartItems);
   } catch (error) {
        console.log('Error in removeFromCart Controller', error.message);
        res.status(500).json({ message: 'Server Error' });
   }
};

export const updateCartItem = async (req, res) => {
    // Implementation for updating the quantity of a cart item
   try {
    const {id:productId } = req.body;
    const { quantity } = req.body;
    const user = req.user.id;
    const existingCartItem = await CartItem.find(item => item.Id === productId);

    if (existingCartItem) {
        if (quantity === 0) {
            user.CartItems = user.CartItems.filter(item => item.Id !== productId);
          await user.save();
            return res.json(user.CartItems);
        }
        existingCartItem.quantity = quantity;
        await user.save();
        return  res.json( user.CartItems);
    }else{
        return res.status(404).json({ message: 'Product not found in cart' });
    }
    

   }
    catch (error) {
        console.log('Error in updateCartItem Controller', error.message);
        res.status(500).json({ message: 'Server Error' });
    }       
};


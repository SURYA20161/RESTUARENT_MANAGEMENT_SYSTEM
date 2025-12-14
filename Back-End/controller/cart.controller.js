import Cart from '../model/cart.model.js';
import Product from '../model/product.model.js';
// Add product to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    // Check if the cart already exists for the user
    let cart = await Cart.findOne({ user: userId });

    // If no cart exists, create a new cart
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      // If the product exists, set the quantity to the new value
      existingItem.quantity = quantity;
    } else {
      // If the product doesn't exist in the cart, add it
      cart.items.push({ product: productId, quantity });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ message: 'Error adding product to cart' });
  }
};



// Get cart for a user
export const getCart = async (req, res) =>  {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart' });
  }
};

// Update product quantity
export const updateCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Find the user's cart and update the item quantity
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id, "items.product": productId },
      {
        $set: { "items.$.quantity": quantity },
      },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart item", error });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;
    //("Request Body:", req.body);

    if (!productId) {
      return res.status(400).json({ success: false, message: "Missing productId" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const updatedItems = cart.items.filter((item) => item.product.toString() !== productId);

    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    cart.items = updatedItems;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error in removeFromCart:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
      error: error.message,
    });
  }
};

// Get user cart count
export const getUserCartCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });

    const count = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get cart count",
      error: error.message
    });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdFromToken = req.user._id;

    // Ensure user can only clear their own cart
    if (userId !== userIdFromToken.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to clear this cart"
      });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { items: [] },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart
    });
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message
    });
  }
};


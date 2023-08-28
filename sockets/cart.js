import dataUserDB from "../models/data-user.js";
export const cartList = async (userId) => {
  const existingDataUser = await dataUserDB
    .findOne({ userId }, "cart")
    .populate({
      // Use 3 times populate get product(ref-dishes) continue get restaurant(ref-restaurants) and select field:'name'
      // 1 times get cart
      // 2 times get product(ref-dishes). Because cart is array-object
      //3 times get restaurant by model restaurants
      path: "cart",
      populate: {
        path: "product",
        model: "dishes",
        populate: {
          path: "restaurant",
          model: "restaurants",
          select: "name",
        },
      },
    });
  return existingDataUser;
};
export const addToCart = async ({ userId, cart }) => {
  const existingDataUser = await dataUserDB.findOne({ userId });
  const isNewProduct = await dataUserDB.findOneAndUpdate(
    // find product in cart
    {
      userId,
      cart: { $elemMatch: { product: cart.product } },
      // $elemMatch find object in array
    },
    // update
    {
      $inc: { "cart.$.quantity": cart.quantity || 1 },
      // $inc  increment or decrement
      // $: The positional operator in MongoDB, which represents the matched element in the array based on the previous query condition ({ $elemMatch: { product: cart.product } })
    },
    { new: true }
  );
  if (!isNewProduct) {
    await existingDataUser.updateOne({
      $push: {
        cart,
      },
    });
  }
};
export const removeProduct = async ({ userId, cart }) => {
  await dataUserDB.findOneAndUpdate(
    // find product in cart
    {
      userId,
      cart: { $elemMatch: { product: cart.product } },
      // $elemMatch find object in array
    },
    //update
    {
      $pull: { cart: { product: cart.product } },
    },
    { new: true }
  );
};

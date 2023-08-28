import authSocket from "../middleware/auth.socket.js";
import { addToCart, cartList, removeProduct } from "./cart.js";
function logMiddleware(socket, next) {
  console.log(`New connection from : ${socket.id}`);
  next();
}
const socketServer = (io) => {
  io.use(logMiddleware);
  io.on("connection", (socket) => {
    console.log("...Connected to socket.io server...");
    socket.on("cart-list", async (data) => {
      const { userId, accessToken } = data;
      if (authSocket({ userId, accessToken })) {
        const data = await cartList(userId);
        socket.emit("cart-list", data);
      }
    });
    socket.on("add-to-cart", async (data) => {
      const { userId, accessToken, cart } = data;
      if (authSocket({ userId, accessToken })) {
        await addToCart({ userId, cart });
        const data = await cartList(userId);
        socket.emit("cart-list", data);
      }
    });
    socket.on("remove-product", async (data) => {
      const { userId, accessToken, cart } = data;
      if (authSocket({ userId, accessToken })) {
        await removeProduct({ userId, cart });
        const data = await cartList(userId);
        socket.emit("cart-list", data);
      }
    });
    socket.on("disconnect", () => {
      console.log("...Disconnected to socket.io server...");
    });
  });
};
export default socketServer;

import jwt from "jsonwebtoken";
const authSocket = ({ userId, accessToken }) => {
  if (!accessToken) {
    console.log("Authentication failed: Token missing");
    return false;
  }

  return jwt.verify(accessToken, process.env.ACCESSTOKEN_KEY, (err, user) => {
    if (err) {
      console.log("Authentication failed: Invalid token");
      return false;
    }
    return userId == user.id;
  });
};
export default authSocket;

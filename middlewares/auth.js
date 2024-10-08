import jwt from "jsonwebtoken";
import { promisify } from "util";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error:
        "Authorization header missing. Please provide a valid token to proceed.",
    });
  }

  try {
    const decodedToken = await promisify(jwt.verify)(
      authHeader,
      process.env.SECRET
    );
    req.userId = decodedToken.id;
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token. Please log in again to continue.",
    });
  }

  next();
};

export default authMiddleware;

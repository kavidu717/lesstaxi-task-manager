import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";




export interface AuthRequest extends Request {
  user?: IUser;
}

interface AuthTokenPayload extends JwtPayload {
  id: string;
}


export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorization = req.headers.authorization;

    // Authorization header must exist
    if (!authorization) {
      res.status(401).json({
        status: 'fail',
        message: 'Not authorized, no token provided',
      });
      return;
    }

    // Expected format:
    // Authorization: Bearer <token>
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      res.status(401).json({
        status: 'fail',
        message: 'Not authorized, invalid authorization format',
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error('JWT_SECRET is not configured');

      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
      return;
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      secret
    ) as AuthTokenPayload;

    // JWT must contain a valid user ID
    if (!decoded.id) {
      res.status(401).json({
        status: 'fail',
        message: 'Not authorized, invalid token',
      });
      return;
    }

    const user = await User.findById(decoded.id);

     if (!user) {
      res.status(401).json({
        status: 'fail',
        message: 'Not authorized, user not found',
      });
      return;
    }

    req.user = user;
    next();

     } catch (error) {
    // JWT errors and other authentication errors
    res.status(401).json({
      status: 'fail',
      message: 'Not authorized, token failed',
    });
  }
};
  

export const admin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role === 'admin') {
    next();
    return;
  }

  res.status(403).json({
    status: 'fail',
    message: 'Access denied: Administrator privileges required',
  });
};
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { Request, Response, NextFunction } from "express";

//login rate limiter

export const loginLimiter = rateLimit({
    windowMs: 60 * 1000 *15,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        status: "fail",
        message: "Too many login attempts from this IP, please try again after 15 minutes"
    }



})

//register rate limiter

export const registerLimiter = rateLimit({
    windowMs: 60 * 1000 *15,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        status: "fail",
        message: "Too many registration attempts from this IP, please try again after 15 minutes"

        }

})

export const sanitizeData = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.body) {
    mongoSanitize.sanitize(req.body);
  }

  if (req.query) {
    mongoSanitize.sanitize(req.query);
  }

  if (req.params) {
    mongoSanitize.sanitize(req.params);
  }

  next();
};
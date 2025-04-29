import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import createDebug from "debug";
import ServerError from "../../ServerError/ServerError.js";

const debug = createDebug("posts:server:error");

const handleErrors = (
  error: ServerError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  debug("Error:", error.message);
  res.status(error.statusCode ?? 500).json({
    error:
      error instanceof ServerError ? error.message : "Internal server error",
  });
};

export default handleErrors;

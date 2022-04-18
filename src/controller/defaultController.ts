import express from "express";

const router = express.Router();

/**
 * @author LukasLJL
 * @summary get function for defaultController
 * @description Get default landing page aka default controller
 * @route   GET /
 * @access  Public
 */
router.get("/", (req: express.Request, res: express.Response) => {
  const response = {
    message: "Welcome to the Skiosa Core-Service!",
    git: "https://github.com/skiosa/core-service",
    status: "/status",
  };

  res.status(200);
  res.json(response);
});

export { router as defaultController };

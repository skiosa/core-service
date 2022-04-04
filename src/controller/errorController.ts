import express from "express";

const router = express.Router();

/**
* @author LukasLJL
* @summary get function for errorController
* @description Get a custom error-status page for non existing routes
* @route   GET /abcd...
* @access  Public
*/
router.get("/", (req: express.Request, res: express.Response) => {
  let response = {
    message: "no endpoint found",
    status: "404",
  };

  res.status(200);
  res.json(response);
});

export { router as errorController };

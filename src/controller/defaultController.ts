import express from 'express';

const router = express.Router();


// @route   GET /
// @desc    Get default landing page aka default controller
// @access  Public
router.get('/', (req: express.Request, res: express.Response) => {
    //Build JSON Object
    let response = {
        "message": "Welcome to the Skiosa Core-Service!",
        "git": "https://github.com/skiosa/core-service",
        "status": "/status"
    }

    //Response
    res.status(200);
    res.json(response);
});


export { router as defaultController }
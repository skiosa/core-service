import express from 'express';
import { ArticleService } from '../service/articleService';
import { ArticleServiceImpl } from '../service/impl/articaleServiceImpl';

const router = express.Router();


// @route   GET /article
// @desc    Get all Articles
// @access  Public
router.get('/', (req: express.Request, res: express.Response) => {
    let articleService: ArticleService = new ArticleServiceImpl();

    articleService.getArticles().then(articles => {
        res.status(200);
        res.json(articles);
    }).catch(err => {
        res.status(500);
        res.json({"message": "error in server"});
    });
});

// @route   GET /article/:id
// @desc    Get a specific article by id
// @access  Public
router.get('/:id', (req: express.Request, res: express.Response) => {
    let articleService: ArticleService = new ArticleServiceImpl();

    let artID: number = Number(req.params.id);

    articleService.getArticle(artID).then(article => {
        res.status(200);
        res.json(article);
    }).catch(err => {
        res.status(500);
        res.json({"message": "error in server"});
    });
});


export { router as articleController };

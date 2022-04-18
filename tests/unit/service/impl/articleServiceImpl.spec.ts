import { assert } from "chai";
import { ArticleServiceImpl } from "../../../../src/service/impl/articleServiceImpl";

describe("Impl-ArticleService", () => {
  const implArticleService = new ArticleServiceImpl();

  /*it("should return a list of articles", async () => {
    const articles = await implArticleService.articles();

    assert.isArray(articles);
    assert.equal(articles.length, 5);
  });

  it("should return a single article", async () => {
    const article = await implArticleService.article(1);

    assert.isObject(article);
    assert.equal(article.id, 1);
    assert.equal(article.title, "How installing linux made me gain 20lbs of muscle");
  });*/
});


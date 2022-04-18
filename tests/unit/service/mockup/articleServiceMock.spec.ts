import { assert } from "chai";
import { ArticleServiceMock } from "../../../../src/service/mockup/articleServiceMock";

describe("Mock-ArticleService", () => {
  const mockArticleService = new ArticleServiceMock();

  it("should return a list of articles", async () => {
    const articles = await mockArticleService.articles();
    assert.isArray(articles);
    assert.equal(articles.length, 5);
  });

  it("should return a single article", async () => {
    const article = await mockArticleService.article(1);

    assert.isObject(article);
    assert.equal(article.id, 1);
    assert.equal(article.title, "How installing linux made me gain 20lbs of muscle");
  });
});

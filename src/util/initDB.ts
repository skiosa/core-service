import { Article, Author, Category, Feed } from "skiosa-orm";
import { dataSource } from "skiosa-orm/lib/db";

/**
 * @author Jonas Eppard
 * @summary Initialise Database
 * @description Truncates Database and injects Mock Database content for testing
 */
export async function initDB() {
  dataSource.getRepository(Feed).query(`TRUNCATE TABLE "feed" RESTART IDENTITY CASCADE`);
  dataSource.getRepository(Article).query(`TRUNCATE TABLE "article" RESTART IDENTITY CASCADE`);
  dataSource.getRepository(Author).query(`TRUNCATE TABLE "author" RESTART IDENTITY CASCADE`);
  dataSource.getRepository(Category).query(`TRUNCATE TABLE "category" RESTART IDENTITY CASCADE`);
  dataSource.getRepository(Feed).save([
    {
      link: "https://asciiflix.de",
      ttl: 3600,
      name: "Asciiflix.de",
      description:
        " A cheap and data-saving YouTube alternative for poor People with Bad Internet Connections",
    },
    {
      link: "https://test.de",
      ttl: 4200,
      name: "testwebsite",
      description: "I am a test website",
    },
  ]);
  dataSource
    .getRepository(Author)
    .save([{ name: "Gustavo" }, { name: "Günther" }, { name: "Peter Agile" }]);

  dataSource
    .getRepository(Category)
    .save([
      { name: "News" },
      { name: "Technology" },
      { name: "Sport" },
      { name: "Entertainment" },
      { name: "Science" },
      { name: "Health" },
      { name: "Business" },
      { name: "Politics" },
      { name: "Other" },
    ]);

  const categoryMock = await dataSource.getRepository(Category).find();
  const authorMock = await dataSource.getRepository(Author).find();
  const feedMock = await dataSource.getRepository(Feed).find();
  dataSource.getRepository(Article).save([
    {
      title: "How installing linux made me gain 20lbs of muscle",
      description:
        "After installing arch linux, I did one pushup every time I told someone, that I use...",
      content:
        "After installing arch linux, I did one pushup every time I told someone, that I use it by the way. And it worked!",
      url: "https://asciiflix.de/watch/814bd1ab-18a7-41f2-8b23-7feb2bab9de2",
      categories: [categoryMock[1], categoryMock[4]],
      author: authorMock[0],
      feed: feedMock[0],
    },
    {
      title: "Windows user 200% less likely to find girlfriend",
      description:
        "A new study has come up with something we all know to be true, windows users suck...",
      content:
        "A new study has come up with something we all know to be true, windows users suck...",
      url: "https://asciiflix.de/watch/814bd1ab-18a7-41f2-8b23-7feb2bab9de2",
      categories: [categoryMock[1], categoryMock[4]],
      author: authorMock[1],
      feed: feedMock[1],
    },
    {
      title: "Mr Olympia 2021 long time gentoo user",
      description:
        "After winning the Olympia in 2021, Big Ramy started talking about his distro of choice...",
      content:
        "After winning the Olympia in 2021, Big Ramy started talking about his distro of choice...",
      url: "https://asciiflix.de/watch/814bd1ab-18a7-41f2-8b23-7feb2bab9de2",
      categories: [categoryMock[1], categoryMock[4]],
      author: authorMock[2],
      feed: feedMock[0],
    },
    {
      title: "DuckDuckGo users found to be 200% more attractive",
      description:
        "When looking to download tinder for the seventh time, this alternative may be better...",
      content:
        "When looking to download tinder for the seventh time, this alternative may be better...",
      url: "https://asciiflix.de/watch/814bd1ab-18a7-41f2-8b23-7feb2bab9de2",
      categories: [categoryMock[1], categoryMock[4]],
      author: authorMock[0],
      feed: feedMock[1],
    },
    {
      title: "How using Windows for 10 minutes ruined my life",
      description:
        "After installing arch linux, I did one pushup every time I told someone, that I use...",
      content:
        "After installing arch linux, I did one pushup every time I told someone, that I use...",
      url: "https://asciiflix.de/watch/814bd1ab-18a7-41f2-8b23-7feb2bab9de2",
      categories: [categoryMock[1], categoryMock[4]],
      author: authorMock[1],
      feed: feedMock[0],
    },
  ]);
}

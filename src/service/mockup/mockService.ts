import { Article, Author, Category, Feed } from "skiosa-orm";

export abstract class MockService {
  protected feedMock: Feed[] = [
    {
      id: 1,
      link: "https://asciiflix.de",
      ttl: 3600,
      name: "Asciiflix.de",
      description: " A cheap and data-saving YouTube alternative for poor People with Bad Internet Connections",
    },
    {
      id: 2,
      link: "https://test.de",
      ttl: 4200,
      name: "testwebsite",
      description: "I am a test website",
    },
  ];

  protected authorMock: Author[] = [
    { id: 1, name: "Gustavo" },
    { id: 2, name: "Günther" },
    { id: 3, name: "Peter Agile" },
  ];

  protected categoryMock: Category[] = [
    { id: 1, name: "News" },
    { id: 2, name: "Technology" },
    { id: 3, name: "Sport" },
    { id: 4, name: "Entertainment" },
    { id: 5, name: "Science" },
    { id: 6, name: "Health" },
    { id: 7, name: "Business" },
    { id: 8, name: "Politics" },
    { id: 9, name: "Other" },
  ];

  protected articlesMock: Article[] = [
    {
      id: 1,
      title: "How installing linux made me gain 20lbs of muscle",
      description: "After installing arch linux, I did one pushup every time I told someone, that I use...",
      content:
        "After installing arch linux, I did one pushup every time I told someone, that I use it by the way. And it worked!",
      url: "https://asciiflix.de/watch/814bd1ab-18a7-41f2-8b23-7feb2bab9de2",
      categories: [this.categoryMock[1], this.categoryMock[4]],
      author: this.authorMock[0],
      feed: this.feedMock[0],
    },
    {
      id: 2,
      title: "Windows user 200% less likely to find girlfriend",
      description: "A new study has come up with something we all know to be true, windows users suck...",
      content: "A new study has come up with something we all know to be true, windows users suck...",
      url: "https://asciiflix.de/watch/814bd1ab-18a7-41f2-8b23-7feb2bab9de2",
      categories: [this.categoryMock[1], this.categoryMock[4]],
      author: this.authorMock[1],
      feed: this.feedMock[1],
    },
    {
      id: 3,
      title: "Mr Olympia 2021 long time gentoo user",
      description: "After winning the Olympia in 2021, Big Ramy started talking about his distro of choice...",
      content: "After winning the Olympia in 2021, Big Ramy started talking about his distro of choice...",
      url: "https://asciiflix.de/watch/814bd1ab-18a7-41f2-8b23-7feb2bab9de2",
      categories: [this.categoryMock[1], this.categoryMock[4]],
      author: this.authorMock[2],
      feed: this.feedMock[0],
    },
    {
      id: 4,
      title: "DuckDuckGo users found to be 200% more attractive",
      description: "When looking to download tinder for the seventh time, this alternative may be better...",
      content: "When looking to download tinder for the seventh time, this alternative may be better...",
      url: "https://asciiflix.de/watch/814bd1ab-18a7-41f2-8b23-7feb2bab9de2",
      categories: [this.categoryMock[1], this.categoryMock[4]],
      author: this.authorMock[0],
      feed: this.feedMock[1],
    },
    {
      id: 5,
      title: "How using Windows for 10 minutes ruined my life",
      description: "After installing arch linux, I did one pushup every time I told someone, that I use...",
      content: "After installing arch linux, I did one pushup every time I told someone, that I use...",
      url: "https://asciiflix.de/watch/814bd1ab-18a7-41f2-8b23-7feb2bab9de2",
      categories: [this.categoryMock[1], this.categoryMock[4]],
      author: this.authorMock[1],
      feed: this.feedMock[0],
    },
  ];
}

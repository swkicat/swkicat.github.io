export default {
  title: `swkicat`,
  description: `swkicat`,
  language: `ko`, // `ko`, `en` => currently support versions for Korean and English
  siteUrl: `https://swkicat.github.io/`,
  ogImage: `/og-image.png`, // Path to your in the 'static' folder
  comments: {
    utterances: {
      repo: `taewooyo/gatsby-blog`,
    },
  },
  author: {
    name: `swkicat`,
    nickname: `swkicat`,
    stack: ['iOS', 'Swift'],
    bio: {
      email: `siyeon0616@gmail.com`,
      residence: 'South Korea',
      bachelorDegree: '',
    },
    social: {
      github: `https://github.com/swkicat`,
      linkedIn: `https://www.linkedin.com/in/siwon-kim-02a792178/`,
      resume: ``,
    },
  },

  // metadata for About Page
  about: {
    careers: [
      {
        date: '2023.11.21 - NOW',
        en: 'ZumInternet',
        kr: '줌인터넷',
        info: 'iOS development group',
      }
    ],

    activities: [
      {
        date: '',
        en: '',
        kr: '',
        info: '',
        link: '',
      },
    ],
  },

  // metadata for Playground Page
  playground: {
    projects: [
      {
        title: 'first portfolio application',
        description: '첫번째 포폴 사이트',
        techStack: ['Android', 'Kotlin'],
        thumbnailUrl: 'first-portfolio.png',
        links: {
          post: '',
          github: '',
          demo: '',
          googlePlay: '',
          appStore: '',
        },
      },
    ],
  },
};
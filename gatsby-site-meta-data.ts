export default {
  title: `개발자 스티치`,
  description: `개발자 스티치`,
  language: `ko`, // `ko`, `en` => currently support versions for Korean and English
  siteUrl: `https://github.com/taewooyo`,
  ogImage: `/og-image.png`, // Path to your in the 'static' folder
  comments: {
    utterances: {
      repo: `taewooyo/gatsby-blog`,
    },
  },
  author: {
    name: `스티치`,
    nickname: `stitch`,
    stack: ['Android', 'Kotlin'],
    bio: {
      email: `skaxodn97@gmail.com`,
      residence: 'South Korea',
      bachelorDegree: 'Computer Software Engineering',
    },
    social: {
      github: `https://github.com/taewooyo`,
      linkedIn: `https://www.linkedin.com/in/태우-남-449403226/`,
      resume: ``,
    },
  },

  // metadata for About Page
  about: {
    careers: [
      {
        date: '2023.01.02 - NOW',
        en: 'ZumInternet',
        kr: '줌인터넷',
        info: 'Android development group',
      },
      {
        date: '2022.07.01 - 2022.08.31',
        en: 'Woowa Brothers Corp.',
        kr: '우아한형제들',
        info: 'Woowahan Tech Camp(교육형 인턴)',
      },
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
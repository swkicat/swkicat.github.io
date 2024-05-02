import { graphql } from 'gatsby';
import React from 'react';

import FeaturedPostColumn from '../components/featuredPostColumn';
import MainBanner from '../components/mainBanner';
import Seo from '../components/seo';
import Layout from '../layout';
import PostClass from '../models/post';
import { AllMarkdownRemark, SiteMetadata } from '../type';

type HomeProps = {
  data: {
    site: { siteMetadata: SiteMetadata };
    allMarkdownRemark: AllMarkdownRemark;
  };
  location: Location;
};

const Home: React.FC<HomeProps> = ({ location, data }) => {
  const posts = data.allMarkdownRemark.edges.map(({ node }) => new PostClass(node));
  // const featuredPosts = posts.filter((node) => node.categories.find((category) => category === '컴포즈내부시리즈'));
  const { author } = data.site.siteMetadata;

  const recentPosts = posts.slice(0, 3);

  const jetpackComposeIntenral = posts.filter((node) => node.categories.find((category) => category == '컴포즈내부시리즈'))
  const dependencyIntenral = posts.filter((node) => node.categories.find((category) => category == '의존성주입'))
  // featuredPosts.filter((post) => post.categories.find((category) => category === '컴포즈내부시리즈'));
  // const livePosts = featuredPosts.filter((post) => post.categories.find((category) => category === '회고'));
  // const experiencePosts = featuredPosts.filter((post) => post.categories.find((category) => category === 'Experience'));

  return (
    <Layout location={location}>
      <Seo title='개발자 스티치' />
      <MainBanner author={author} />

      <FeaturedPostColumn title='Recent Posts' posts={recentPosts} fill={false} />
      <FeaturedPostColumn title='컴포즈 내부 시리즈' posts={jetpackComposeIntenral} />
      <FeaturedPostColumn title='의존성 주입' posts={dependencyIntenral} />
      {/* <FeaturedPostColumn title='LIFE' posts={livePosts} /> */}
      {/* <FeaturedPostColumn title='EXPERIENCE' posts={experiencePosts} /> */}
    </Layout>
  );
};

export default Home;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
      edges {
        node {
          id
          excerpt(pruneLength: 500, truncate: true)
          frontmatter {
            categories
            title
            emoji
            date(formatString: "YYYY.MM.DD")
          }
          fields {
            slug
          }
        }
      }
    }

    site {
      siteMetadata {
        siteUrl
        language
        author {
          name
          nickname
          stack
          bio {
            email
            residence
            bachelorDegree
          }
          social {
            github
            linkedIn
            resume
          }
        }
      }
    }
  }
`;
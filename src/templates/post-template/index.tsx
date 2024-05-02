import { graphql } from 'gatsby';
import React from 'react';

import PostHeader from '@/src/components/postHeader';
import PostNavigator from '@/src/components/postNavigator';
import Seo from '@/src/components/seo';
import Utterances from '@/src/components/utterances';
import Layout from '@/src/layout';
import PostClass from '@/src/models/post';
import { Post, SiteMetadata } from '@/src/type';

import * as S from './styled';

type PostTemplateProps = {
  location: Location;
  data: { prev: Post; next: Post; cur: Post; site: { siteMetadata: SiteMetadata }; markdownRemark: Post };
};

const PostTemplate: React.FC<PostTemplateProps> = ({ location, data }) => {
  const curPost = new PostClass(data.cur);
  const prevPost = data.prev && new PostClass(data.prev);
  const nextPost = data.next && new PostClass(data.next);
  const utterancesRepo = data.site.siteMetadata.comments.utterances.repo;

  return (
    <Layout location={location}>
      <Seo title={`iOS 개발자 | ${curPost?.title}`} description={curPost?.excerpt} />
      {/* <PostHeader post={curPost} viewCount={viewCount ?? 0} /> */}
      <PostHeader post={curPost} />
      <S.PostContent>
        <div className='markdown' dangerouslySetInnerHTML={{ __html: curPost.html }} />
      </S.PostContent>
      <PostNavigator prevPost={prevPost} nextPost={nextPost} />
      {utterancesRepo && <Utterances repo={utterancesRepo} path={curPost.slug} />}
    </Layout>
  );
};

export default PostTemplate;

export const pageQuery = graphql`
  query ($slug: String, $nextSlug: String, $prevSlug: String) {
    cur: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      excerpt(pruneLength: 500, truncate: true)
      frontmatter {
        date(formatString: "YYYY.MM.DD")
        title
        categories
        emoji
      }
      fields {
        slug
      }
    }

    next: markdownRemark(fields: { slug: { eq: $nextSlug } }) {
      id
      html
      frontmatter {
        date(formatString: "YYYY.MM.DD")
        title
        categories
        emoji
      }
      fields {
        slug
      }
    }

    prev: markdownRemark(fields: { slug: { eq: $prevSlug } }) {
      id
      html
      frontmatter {
        date(formatString: "YYYY.MM.DD")
        title
        categories
        emoji
      }
      fields {
        slug
      }
    }

    site {
      siteMetadata {
        siteUrl
        comments {
          utterances {
            repo
          }
        }
      }
    }
  }
`;
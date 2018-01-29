import React from 'react';
import Link from 'gatsby-link';

export default ({ data, pathContext }) => {
  // const { wordpressPage } = data
  // const { content, slug, title } = wordpressPage
  // const { transformedContent } = pathContext
  return (
    <div>
      <figure>
        <img
          src={pathContext.source_url}
          width={data.wordpressWpMedia.media_details.width}
          height={data.wordpressWpMedia.media_details.height}
        />
        <figcaption
          dangerouslySetInnerHTML={{ __html: data.wordpressWpMedia.caption }}
        />
      </figure>
      <Link to={pathContext.prev}>
        <button>Previous</button>
      </Link>
      <Link to={pathContext.next}>
        <button>Next</button>
      </Link>
      <Link to={'/' + pathContext.slug}>
        <button>Exit</button>
      </Link>
    </div>
  );
};

export const query = graphql`
  query FetchWordpressMedia($id: String!) {
    wordpressWpMedia(id: { eq: $id }) {
      id
      title
      slug
      media_details {
        dummy
        width
        height
        file
      }
      source_url
      alt_text
      mime_type
      caption
    }
  }
`;

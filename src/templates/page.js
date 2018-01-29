import React from 'react'
import Link from 'gatsby-link'

export default ({ data, pathContext }) => {
  const { wordpressPage } = data
  const { content, slug, title } = wordpressPage
  const { transformedContent } = pathContext
  console.log('???  pathContext ??? ', pathContext)
  return (
    <div>
      <h1>{title}</h1>
      <div>
        {transformedContent.map(function(galleryItem) {
          return (
            <div>
              <Link to={`/${slug}/gallery/${galleryItem.slug}`}>
              <figure>
                <img src={galleryItem.src} srcSet={galleryItem.srcset} />
              </figure>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const query = graphql`
  query FetchWordpressPage($id: String!) {
    wordpressPage(id: { eq: $id }) {
      id
      layout
      content
      slug
      title
    }
  }
`

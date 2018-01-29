import React from 'react'
import Link from 'gatsby-link'

const IndexPage = props => {
  const { data } = props
  const { allWordpressPage } = data
  const { edges } = allWordpressPage
  console.log(':?? ', edges)
  return (
    <div>
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      {edges.map(node => {
        const { slug, title } = node.node
        return <Link to={slug}>{title}</Link>
      })}
    </div>
  )
}

export default IndexPage

export const query = graphql`
  query IndexPage {
    site {
      siteMetadata {
        title
      }
    }

    allWordpressPage {
      edges {
        node {
          title
          slug
        }
      }
    }
  }
`

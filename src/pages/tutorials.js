import React from 'react'
import { graphql } from 'gatsby'
import HelmetWrapper from "../components/HelmetWrapper/HelmetWrapper";
import Masthead from '../components/Masthead/Masthead'

import PostListing from "../components/PostListing/PostListing";

import Layout from '../components/Layout/Layout'

export default class TutorialListingTemplate extends React.Component {
  render(){
    return (
      <Layout location={this.props.location}>
        <HelmetWrapper title="Tutorials" />
        <Masthead heading="Tutorials" />
        <div className="contentdiv">
          <PostListing postEdges={this.props.data.allMarkdownRemark.edges} allAuthorsInfo={this.props.data.authors.edges} filter={post => post.node.frontmatter.contentType === "tutorial"} />
        </div>
      </Layout>
    );
  }
}

export const query = graphql`
query TutorialIndexQuery {
  # authors
  authors: allMarkdownRemark (filter: { fields: { isPerson: { eq: true } } }) {
    edges {
      node {
        frontmatter {
          name
          image
          url
          bio
          location
          socialUrls
        }
        fields {
          internalURL
        }
      }
    }
  }
  # tutorial posts
  allMarkdownRemark (
    sort: { fields: [frontmatter___date], order: DESC }
    filter: {
      frontmatter: { draft: { ne: true } }
      fields: { isPost: { eq: true } }
    }
  ) {
    totalCount
    edges {
      node {
        fields {
          slug
        }
        excerpt
        frontmatter {
          title
          tags
          date(formatString: "MMMM Do, YYYY")
          authors
          draft
          contentType
        }
      }
    }
  }
}
`;

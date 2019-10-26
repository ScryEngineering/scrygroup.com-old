import React from "react";
import Helmet from "react-helmet";
import * as PropTypes from "prop-types";

import config from "../../../data/SiteConfig"

export default class HelmetWrapper extends React.Component {
  render(){
    return (
      <Helmet
        titleTemplate="%s — Scry Engineering">
        <title>{this.props.title}</title>
        <meta property="og:title" content={this.props.title + " — Scry Engineering"} />
        <meta name="twitter:title" value={this.props.title + " — Scry Engineering"} />
        <meta property="og:description" content={this.props.description} />
        <meta name="twitter:description" value={this.props.description} />
        <meta property="og:image" content={config.siteUrl + "/" + this.props.image} />
        <meta name="twitter:image" content={config.siteUrl + "/" + this.props.image} />
        <meta name="twitter:image:alt" content={this.props.imageAlt} />
        {this.props.children}
      </Helmet>
    );
  }
}

HelmetWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
}

HelmetWrapper.defaultProps = {
  description: "A versatile programming, software development and consulting firm driven by trusted industry experts.",
  image: "thumbnail.png",
  imageAlt: "Scry Engineering",
}
import React from 'react'

import HelmetWrapper from "../HelmetWrapper/HelmetWrapper";
import NavBar from '../NavBar/NavBar'
import Footer from '../Footer/Footer';

import config from '../../../data/SiteConfig';

import './reset.css'
import './Layout.scss'

require("../../styles/code.scss");
require(`katex/dist/katex.min.css`)

export default class TemplateWrapper extends React.Component {
  render() {
    return(
      <div className="wrapper">
        <HelmetWrapper title="Home">
          <meta property="og:type" content="website" />
          <meta name="twitter:domain" value="www.customprogrammingsolutions.com" />
          <meta property="og:site_name" content="Custom Programming Solutions" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:url" content={config.siteUrl + this.props.location.pathname} />
          <meta name="twitter:url" value={config.siteUrl + this.props.location.pathname} />
          <link rel="stylesheet" href="https://use.typekit.net/bae2fex.css" />
        </HelmetWrapper>
        <NavBar />
        {this.props.children}
        <Footer
          copyright={{
            label: "Custom Programming Solutions Pty Ltd",
            url: "https://www.customprogrammingsolutions.com"
          }}
        />
      </div>
    )
  }
}
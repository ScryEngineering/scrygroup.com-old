import React from 'react'
import HelmetWrapper from "../components/HelmetWrapper/HelmetWrapper";
import Masthead from '../components/Masthead/Masthead'

import Layout from '../components/Layout/Layout'

const NotFoundPage = props => (
  <Layout location={props.location}>
    <HelmetWrapper title="Not found" />
    <Masthead heading="Not found" />
    <div className="contentdiv">
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </div>
  </Layout>
)

export default NotFoundPage

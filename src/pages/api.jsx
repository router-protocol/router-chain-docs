import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { DyteSpinner, DyteTooltip } from '@dytesdk/react-ui-kit';
import { useHistory } from '@docusaurus/router';
import clsx from 'clsx';

import useBreakpoint from '../lib/useBreakpoint';
import RunInPostmanButton from '../components/RunInPostmanButton';

const API_TOOLTIP_KEY = 'dyte-api-v2-tooltip-shown';

function APIElement({ layout = 'sidebar', currentVersion = 'RPC' }) {
  return (
    <BrowserOnly
      fallback={
        <div className="loading-container">
          <DyteSpinner />
        </div>
      }
    >
      {() => {
        // eslint-disable-next-line no-undef
        const { API } = require('@stoplight/elements');
        currentVersion = currentVersion.toUpperCase()
        console.log(currentVersion)

        return (
          <div className={clsx('elements-container', layout)}>
            <API
              apiDescriptionUrl={`/api/${currentVersion}.yaml`}
              basePath="/"
              router="hash"
              layout={layout}
              hideSchemas
              className="stacked"
            />
          </div>
        );
      }}
    </BrowserOnly>
  );
}

export default function Home() {
  const router = useHistory();
  const size = useBreakpoint();

  const location = router.location;

  const url = new URL(
    `https://docs.dyte.io${location.pathname}${location.search}`
  );

  const currentVersion = url.searchParams.get('v') || 'RPC';
  console.log(currentVersion)
  return (
    <Layout
      title="API Reference"
      description="Router Protocol REST API Reference"
      noFooter
      wrapperClassName="api-reference"
    >
      <Head>
        {/* Load styles for Stoplight Elements */}
        <link rel="preload" href="/assets/css/elements.min.css" as="style" />
        <link rel="stylesheet" href="/assets/css/elements.min.css" />
      </Head>
      {/* <div className="header">
        <h2>Voyager {currentVersion} Endpoints</h2>
        <div className="aside">
          <a className="navbar__item navbar__link dev-portal-signup dev-postman-link"  target='_blank' href='' rel="noreferrer">Open Postman Collection</a>
        </div>
      </div> */}
      <APIElement
        layout={size === 'sm' ? 'stacked' : 'sidebar'}
        currentVersion={currentVersion}
      />
    </Layout>
  );
}

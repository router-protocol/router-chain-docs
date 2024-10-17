/* eslint-disable */

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');
const worker = require('node:worker_threads');

// const UIKitReferencePlugins = require('./plugins/ui-kit-reference-plugin.cjs');
const { webpackPlugin } = require('./plugins/webpack-plugin.cjs');
// const posthogPlugin = require('./plugins/posthog-plugin.cjs');

// module.exports = function(context, options) {
//   return {
//     name: 'docusaurus-plugin-add-canonical-tags',
//     injectHtmlTags({ permalink }) {
//       const canonicalTags = [
//         { path: '/develop', canonicalUrl: 'https://docs.routerprotocol.com/develop' },
//         { path: '/overview', canonicalUrl: 'https://docs.routerprotocol.com/overview' },
//         { path: '/networks', canonicalUrl: 'https://docs.routerprotocol.com/networks' },
//         { path: '/router-core', canonicalUrl: 'https://docs.routerprotocol.com/router-core' },
//         { path: '/tooling', canonicalUrl: 'https://docs.routerprotocol.com/tooling' },
//         { path: '/validators', canonicalUrl: 'https://docs.routerprotocol.com/validators' },
//         { path: '/discover', canonicalUrl: 'https://docs.routerprotocol.com/discover' },
//         { path: '/brand-assets', canonicalUrl: 'https://docs.routerprotocol.com/brand-assets' },
//         // Add more pages here
//       ];

//       // Find the canonical URL for the current page's permalink
//       const canonicalTag = canonicalTags.find(tag => permalink && permalink.includes(tag.path));

//       return {
//         headTags: canonicalTag
//           ? [{
//               tagName: 'link',
//               attributes: {
//                 rel: 'canonical',
//                 href: canonicalTag.canonicalUrl,
//               },
//             }]
//           : [],
//       };
//     },
//   };
// };



/** @type {import('@docusaurus/preset-classic').Options} */ defaultSettings = {
  remarkPlugins: [
    [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
  ],
};

/**
 * Defines a section with overridable defaults
 * @param {string} section
 * @param {import('@docusaurus/plugin-content-docs').Options} options
 */
function defineSection(section, options = {}) {
  return [
    '@docusaurus/plugin-content-docs',
    /** @type {import('@docusaurus/plugin-content-docs').Options} */
    ({
      path: `docs/${section}`,
      routeBasePath: section,
      id: section,
      sidebarPath: require.resolve('./sidebars-default.js'),
      breadcrumbs: false,
      editUrl: 'https://github.com/router-protocol/docs/tree/main/',
      ...defaultSettings,
      ...options,
    }),
  ];
}

const SECTIONS = [
  defineSection('router-core'),
  defineSection('networks'),
  // defineSection('cosmwasm'),
  // defineSection('message-transfer'),
  // defineSection('frontend'),
  // defineSection('beaker'),
  // defineSection('telescope'),
  defineSection('learn'),
  defineSection('validators'),
  defineSection('discover'),
  defineSection('overview'),
  // defineSection('apis'),
  // defineSection('voyager'),
  defineSection('develop'),
  // defineSection('omnichain-framework'),
  defineSection('tooling'),
  defineSection('brand-assets'),
];

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Router Docs',
  tagline: 'Build on a modular interoperability infrastrucutre. 🚀',
  // TODO: Update base url
  url: 'https://docs.routerprotocol.com',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: '/favicon.svg',
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'router-protocol', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  clientModules: [require.resolve('./src/client/define-ui-kit.js')],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs/home',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars-home.js'),
          breadcrumbs: false,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/router-protocol/docs/tree/main/',
          ...defaultSettings,
        },
        gtag: {
          trackingID: 'G-ZBN9NGXRCZ',
          anonymizeIP: true,
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/api-reference.css'),
          ],
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  plugins: [
    ...SECTIONS,
    // ...UIKitReferencePlugins,
    webpackPlugin,
    // posthogPlugin,
  ],

  themes: ['@docusaurus/theme-live-codeblock',
  [
    require.resolve("@easyops-cn/docusaurus-search-local"),
    /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
    ({
      // ... Your options.
      // `hashed` is recommended as long-term-cache of index file is possible.
      hashed: true,
      // For Docs using Chinese, The `language` is recommended to set to:
      // ```
      // language: ["en", "zh"],
      // ```
      docsRouteBasePath: '/'
    }),
  ]],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: '/img/router-docs-card.png',
      colorMode: {
        defaultMode: 'dark',
      },
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        // NOTE: hideOnScroll breaks on `/api`, enable when fixed
        // hideOnScroll: true,
        logo: {
          href: '/',
          src: '/logo/light.svg',
          srcDark: '/logo/dark.svg',
          alt: 'Router Docs',
          height: '26px',
          width: '114px',
        },
        items: [
          {
            label: 'Overview',
            to: '/overview',
            position: 'left',
          },
          {
            label: 'Router Core',
            to: '/router-core',
            position: 'left',
          },
          {
            label: 'Develop',
            to: '/develop',
            position: 'left',
            // className: 'new-badge',
            // activeBaseRegex: '(.*ui-kit|.*web-core)',
          },
          {
            label: 'Tooling',
            to: '/tooling',
            position: 'left',
          },
          {
            label: 'Networks',
            to: '/networks',
            position: 'left',
            // className: 'new-badge',
          },
          {
            label: 'Validators',
            to: '/validators',
            position: 'left',
            // className: 'new-badge',
          },
          {
            label: 'Discover',
            to: '/discover',
            position: 'left',
            // className: 'new-badge',
          },
          {
            label: 'Audits',
            to: 'https://github.com/router-protocol/audit-reports',
            position: 'left',
            // className: 'new-badge',
          },
          {
            label: 'Brand Assets',  
            to: '/brand-assets',
            position: 'left',
            // className: 'new-badge',
          },
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      footer: {
        logo: {
          href: '/',
          src: '/logo/light.svg',
          srcDark: '/logo/dark.svg',
          alt: 'Router Docs',
          height: '36px',
        },
        links: [
          {
            title: 'Router Protocol',
            items: [
              {
                label: 'Home',
                href: 'https://routerprotocol.com/',
              },
              {
                label: 'Nitro',
                href: 'https://app.routernitro.com/',
              },
              {
                label: 'Nitro Explorer',
                href: 'https://explorer.routernitro.com',
              },
              {
                label: 'Intent Store',
                href: 'https://store.routerintents.com/',
              },
              {
                label: 'Intent PoCs',
                href: 'https://poc.routerintents.com/all',
              },
              {
                label: 'Ecosystem',
                href: 'https://www.routerprotocol.com/ecosystem',
              },
            
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Router Chain Whitepaper',
                href: 'https://www.routerprotocol.com/router-chain-whitepaper.pdf',
              },
              {
                label: 'Router CCIF Whitepaper',
                href: 'https://www.routerprotocol.com/router-ccif-whitepaper.pdf'
              },
              {
                label: 'GitHub',
                href: 'https://github.com/router-protocol',
              },
              {
                label: 'Medium',
                href: 'https://routerprotocol.medium.com/',
              },
              {
                label: 'Careers',
                href: 'https://wellfound.com/company/router-protocol',
              },
              {
                label: 'Brand Assets',
                href: '/brand-assets',
              },
            ],
          },
          {
            title: 'Socials',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/routerprotocol',
              },
              {
                label: 'Telegram',
                href: 'https://t.me/routerprotocol',
              },
              {
                label: 'Discord',
                href: 'https://discord.com/invite/yjM2fUUHvN',
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/channel/UC3ST1tToUIjA7swKO4g5Uxw',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/router-protocol',
              },
            ],
          },
        ],
        copyright:
          'Copyright © Router Protocol since 2021. All rights reserved.',
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          'dart',
          'ruby',
          'groovy',
          'kotlin',
          'java',
          'swift',
          'objectivec',
        ],
      },
      liveCodeBlock: {
        playgroundPosition: 'bottom',
      },

      metadata: [
        {
          rel: 'canonical',
          href: 'https://docs.routerprotocol.com/overview', // default site-wide canonical URL
        },
        {
          rel: 'canonical',
          href: 'https://docs.routerprotocol.com/router-core', // default site-wide canonical URL
        },
        {
          rel: 'canonical',
          href: 'https://docs.routerprotocol.com/develop', // default site-wide canonical URL
        },
        {
          rel: 'canonical',
          href: 'https://docs.routerprotocol.com/tooling', // default site-wide canonical URL
        },
        {
          rel: 'canonical',
          href: 'https://docs.routerprotocol.com/networks', // default site-wide canonical URL
        },
        {
          rel: 'canonical',
          href: 'https://docs.routerprotocol.com/validators', // default site-wide canonical URL
        },
        {
          rel: 'canonical',
          href: 'https://docs.routerprotocol.com/discover', // default site-wide canonical URL
        },
        {
          rel: 'canonical',
          href: 'https://docs.routerprotocol.com/brand-assets', // default site-wide canonical URL
        },
      ],
    }),
};

module.exports = config;

import {
  OsmosisCore,
  Network,
  Cosmwasm,
  Beaker,
  Osmojs,
  VoyagerIcon,
  RouterIcon,
  Telescope,
  Frontend,
  LocalOsmosis,
  Omnichain,
} from './icons';

const SECTIONS = [
  // no sections for default section, i.e; home
  {
    id: 'default',
    section: false,
  },
  {
    id: 'guides',
    section: false,
  },

  // Core Development
  {
    name: 'Router Core',
    id: 'router-core',
    icon: RouterIcon,
    section: 'core',
  },
  {
    name: 'Omnichain dApps',
    id: 'middleware',
    icon: Omnichain,
    section: 'core',
  },
  {
    name: 'CrossTalk',
    id: 'crosstalk',
    icon: Network,
    section: 'core',
  },
  {
    name: 'Voyager',
    id: 'voyager',
    icon: VoyagerIcon,
    section: 'core',
  },
  //Cosmwasm
  {
    name: 'Infrastructure',
    id: 'infra',
    icon: Cosmwasm,
    section: 'tooling',
  },
  {
    name: 'Utilities',
    id: 'utils',
    icon: Beaker,
    section: 'tooling',
  },

  // UI SDKs
  // {
  //   name: 'Frontend',
  //   id: 'frontend',
  //   icon: Frontend,
  //   section: 'frontend',
  // },
  // {
  //   name: 'OsmoJS',
  //   id: 'osmojs',
  //   icon: Osmojs,
  //   section: 'frontend',
  // },
  // {
  //   name: 'Telescope',
  //   id: 'telescope',
  //   icon: Telescope,
  //   section: 'frontend',
  // },

];

const MULTI_SECTIONS = [
  [
    {
      name: 'Router Protocol',
      section: 'core',
      description: 'Development documentation for all things Router.',
    },
    {
      name: 'Tooling',
      section: 'tooling',
      description:
        'Building and interacting with smart contracts on the Router chain.',
    },
    // {
    //   name: 'Frontend & SDKs',
    //   section: 'frontend',
    //   description:
    //     'Libraries & UI components to build on top of Osmosis.',
    // }

  ],
  [
    {
      name: 'Router Core',
      section: 'mobile-core',
      isNew: true,
      description: 'Router Chain Development documentation.',
    },
    {
      name: 'Prebuilt SDK',
      section: 'mobile-sdk',
      description: 'Use our pre-built mobile SDK, ready to go',
    }
  ]
];

export { SECTIONS, MULTI_SECTIONS };

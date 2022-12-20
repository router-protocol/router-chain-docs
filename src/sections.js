import {
  OsmosisCore,
  Network,
  Cosmwasm,
  Beaker,
  Osmojs,
  Telescope,
  Frontend,
  LocalOsmosis,
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
    icon: OsmosisCore,
    section: 'core-sdk',
  },
  {
    name: 'CrossTalk',
    id: 'crosstalk',
    icon: Network,
    section: 'core-sdk',
  },
  {
    name: 'Local Router',
    id: 'localrouter',
    icon: LocalOsmosis,
    section: 'core-sdk',
  },
  //Cosmwasm
  {
    name: 'Cosmwasm',
    id: 'cosmwasm',
    icon: Cosmwasm,
    section: 'cosmwasm',
  },
  {
    name: 'Beaker',
    id: 'beaker',
    icon: Beaker,
    section: 'cosmwasm',
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
      section: 'core-sdk',
      description: 'Development documentation for all things Router.',
    },
    {
      name: 'CosmWasm',
      section: 'cosmwasm',
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

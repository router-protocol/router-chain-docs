import React from 'react';
import Layout from '@theme/Layout';
import { useHistory } from '@docusaurus/router';
import { DyteButton } from '@dytesdk/react-ui-kit';

import {
  HomepageCard as Card,
  HomepageSection as Section,
} from '../components/HomepageComponents';
import {
  APIReferenceIcon,
  TerminalIcon,
  IDEIcon,
  ModulesIcon,
  RelayerIcon,
  AssetIcon,
  Telescope,
  Osmojs,
  Createapp,
  Cosmoskit,
  Tscodegen,
  KeysIcon,
  Transaction,
  OsmosisCore,
  Contribute,
} from '../icons';
import GuidesSection from '../components/GuidesSection';

export default function Homepage() {
  const router = useHistory();

  return (
    <Layout
      description="The Router blockchain is a decentralized network built using the Cosmos SDK. Router leverages Tendermint's consensus engine and is run by a network of validators with economic incentives to act honestly."
      wrapperClassName="homepage"
    >
      <div className="pad">
        <div className="center homepage-content">
          <div className='margin-bottom--lg'>
            <h2>Router Docs</h2>
            <p>
            The Router blockchain is a decentralized network built using the Cosmos SDK. Explore our docs and examples to quickly learn, develop & integrate with the Router blockchain.
            </p>
            <DyteButton onClick={() => router.push('/router-core/')}>
              Get Started &rarr;
            </DyteButton>
          </div>



          <Section title="Learn about Router">
            <Card
              title="What is Router?"
              description="The Router chain is a layer 1 blockchain that leverages tendermint’s Byzantine Fault Tolerant (BFT) consensus engine."
              to="/overview/"
            />
            <Card
              title="Router as an Interoperability Layer"
              description="In addition to its functionalities as a blockchain network, the Router chain will serve as an interoperability framework."
              to="/overview#router-chain-as-an-interoperability-layer"
            />
            <Card
              title="The ROUTE Token"
              description="The ROUTE token is a digital asset that will serve as the primary gas and governance token on the Router chain."
              to="/overview/route"
            />
          </Section>

          <Section title="Developers" id="web-sdks" hasSubSections>
            <Section
              title="⚙️ Chain Development"
              id="core-sdks"
              HeadingTag="h4"
              description={
                <>
                  Everything that is needed to learn about development using Router's core components. 
                </>
              }
            >
             

             {/* <Card
    title="Build and Test Osmosis Source Code"
    description="Getting started with building and testing Osmosis codebase"
    to="/router-core/build"
    icon={<OsmosisCore />}
  /> */}
  <Card
    title="Installing Prerequisites"
    description="Setting up the machine for developing on the Router Chain"
    to="/router-core/installing-prerequisites"
    icon={<IDEIcon />}
  />
  <Card
    title="Router CLI"
    description="Install routerd to join the network or simple query it."
    to="/router-core/routerd"
    icon={<TerminalIcon />}
    svgFile="/icons/cli.svg"
  />
  {/* <Card
    title="Modules"
    description="Osmosis modules and their respective CLI commands"
    to="/router-core/modules"
    icon={<ModulesIcon />}
    svgFile="/icons/modules.svg"
  /> */}
  <Card
    title="Relayers"
    description=" Relay messages between Router and other chains"
    to="/router-core/category/relayer"
    icon=""
    svgFile="/icons/relayer.svg"
  />
  {/* <Card
    title="Assets"
    description="     Currently supported assets on Osmosis with their corresponding channels and IBC denoms."
    to="/router-core/asset-info"
    icon={<AssetIcon />}
  />
  <Card
    title="Key Management"
    description="Managing keys via CLI and advanced operations such as multisig wallets"
    to="/router-core/category/keys-management"
    icon={<KeysIcon />}
  />
  <Card
    title="Transaction Structure"
    description=" Understanding the structure of a transaction on the Osmosis blockchain"
    to="/router-core/guides/structure"
    icon={<Transaction />}
    svgFile="/icons/transaction.svg"
  />
  <Card
    title="Contributing"
    description=" Guidelines to contributing to Osmosis core development."
    to="/router-core/contributing"
    icon={<Contribute />}
    svgFile="/icons/octocat.svg"
  /> */}

            </Section>
          </Section>
    
   <Section title="💻 Frontend Libraries & Utilities"  HeadingTag="h4" id="front-end">
    {/* <Card
    title="OsmoJS"
    description="Compose and broadcast Osmosis and Cosmos messages, with all of the proto and amino encoding handled for you."
    to="/osmojs"
    icon={<Osmojs />}
    svgFile="/icons/osmojs.svg"
  /> */}

<Card
    title="Cosmos Kit"
    description="A wallet adapter for react with mobile WalletConnect support for the Cosmos ecosystem."
    to="https://github.com/cosmology-tech/cosmos-kit"
    icon=""
    svgFile="/icons/bag.svg"
  />

  {/* <Card
    title="Telescope"
    description="TypeScript Transpiler for Cosmos Protobufs. Telescope is used to generate libraries for Cosmos blockchains."
    to="/telescope"
    svgFile="/icons/telescope.svg"
  /> */}

<Card
    title="Create Cosmos App"
    description="Set up a modern Cosmos app by running one command"
    to="https://github.com/cosmology-tech/create-cosmos-app"
    icon={<Createapp />}
    svgFile="/icons/create-cosmos-app.svg"
  />



 <Card
    title="Chain Registry"
    description="The npm package for the Official Cosmos chain registry"
    to="https://github.com/cosmology-tech/chain-registry"
    icon={<Cosmoskit />}
    svgFile="/icons/registry.svg"
  />

  <Card
    title="TS Codegen"
    description="The quickest and easiest way to interact with CosmWasm Contracts"
    to="https://github.com/CosmWasm/ts-codegen"
    icon={<Tscodegen />}
    svgFile="/icons/tscodegen.svg"
  />   
 
  </Section>


          <Section title="🛠 Tools" HeadingTag="h4">
          <Card
    title="Application-specific Explorer"
    description="Custom explorer for projects to monitor their transactions"
    to="/router-core/category/application-specific-explorer"
    icon={<ModulesIcon />}
  />
    <Card
    title="Router Robot"
    description="A cross-chain integration testing framework"
    to="/router-core/category/router-robot"
    icon={<Osmojs />}
  />
          </Section>

          <Section title="📜 API Reference" HeadingTag="h4">
            <Card
              title="API Reference"
              description="Router RPC and LCD API Reference"
              to="#"
              icon={<APIReferenceIcon />}
            />
          </Section>
        </div>
      </div>
    </Layout>
  );
}

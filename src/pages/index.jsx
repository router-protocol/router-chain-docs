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
  Network,
  Omnichain,
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
            <div class="theme-admonition theme-admonition-info alert alert--info admonition_node_modules-@docusaurus-theme-classic-lib-theme-Admonition-styles-module">
              <div class="admonitionHeading_node_modules-@docusaurus-theme-classic-lib-theme-Admonition-styles-module">
                <span class="admonitionIcon_node_modules-@docusaurus-theme-classic-lib-theme-Admonition-styles-module"><svg viewBox="0 0 14 16"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg></span>info</div><div class="admonitionContent_node_modules-@docusaurus-theme-classic-lib-theme-Admonition-styles-module">
                  <p>The documentation provided below pertains to Router V2. If you require documentation for V1, please refer to the <b><a href="https://v1.dev.routerprotocol.com/">following link</a></b>.</p>
              </div></div>
            <h2>Router Docs</h2>
            <p>
              The Router blockchain is a decentralized network built using the Cosmos SDK. Explore our docs and examples to quickly learn, develop & integrate with the Router blockchain.
            </p>
            <DyteButton onClick={() => router.push('/develop/')}>
              Get Started &rarr;
            </DyteButton>
          </div>

          <Section title="Build your first iDapp"
            description={
              <>
                Build your first iDapp using Router's crosstalk in 5 simple steps.
              </>
            }
          >
            <Card
              title="iDapp using Stateless bridging"
              description="Build your first iDapp in 5 steps using Router crosstalk's stateless bridging."
              to="/overview/"
              icon={<Network />}
            />
            <Card
              title="iDapp using Stateful bridging"
              description="Build your first Omnichain iDapp in 5 steps using Router crosstalk's stateful bridging."
              to="/develop/message-transfer-via-crosstalk/stateful-bridging/your-first-omnichain-dapp"
              icon={<Omnichain />}
            />
            {/* <Card
              title="Router as an Interoperability Layer"
              description="In addition to its functionalities as a blockchain network, the Router chain will serve as an interoperability framework."
              to="/overview#router-chain-as-an-interoperability-layer"
            /> */}
          </Section>

          <Section title="Learn about Router">
            <Card
              title="What is Router?"
              description="The Router chain is a layer 1 blockchain that leverages tendermint’s Byzantine Fault Tolerant (BFT) consensus engine."
              to="/overview/"
            />
            <Card
              title="Choosing the Right Cross-chain Framework"
              description="Router Protocol provides a host of cross-chain solutions. Go through this guide to understand which one's right for you."
              to="/overview/choosing-the-right-framework"
            />
            {/* <Card
              title="Router as an Interoperability Layer"
              description="In addition to its functionalities as a blockchain network, the Router chain will serve as an interoperability framework."
              to="/overview#router-chain-as-an-interoperability-layer"
            /> */}
            <Card
              title="The ROUTE Token"
              description="The ROUTE token is a digital asset that will serve as the primary gas and governance token on the Router chain."
              to="/overview/route"
            />
          </Section>

          <Section title="Developers" id="web-sdks" hasSubSections>
            
          <Section title="🛠 Build iDapps using Router" HeadingTag="h4">
          <Card
              title="Message Transfer"
              description="Learn about the instruction transfer framework Crosstalk and convert your existing single/multi-chain applications to cross-chain applications."
              to="/develop/message-transfer-via-crosstalk"
              icon={<RelayerIcon />}
            />
            <Card
              title="Asset Transfer"
              description="Learn about asset transfer bridge Voyager and how to build other asset-transfer applications or sequenced cross-chain requests (asset + instruction)"
              to="/develop/voyager"
              icon={<AssetIcon />}
            />

          </Section>
          
          <Section title="🛠 Tools" HeadingTag="h4">
            <Card
              title="Router Scan"
              description="A feature-rich block explorer for monitoring transactions on the Router chain."
              to="/tooling/infra/router-scan"
              icon={<ModulesIcon />}
            />
            <Card
              title="Router Robot"
              description="A cross-chain integration testing framework"
              to="/tooling/infra/router-robot"
              icon={<Osmojs />}
            />
            <Card
              title="Router Station"
              description="A web application that makes it easier to interact with the Router chain."
              to="/tooling/infra/router-station"
              icon={<Createapp />}
            />       
            <Card
              title="Router Faucet"
              description="Get funds to interact with the Router chain."
              to="https://faucet.testnet.routerchain.dev/"
              icon={<AssetIcon />}
            />                 
            <Card
              title="Relayer"
              description="Run a custom relayer to forward messages from Router to other chains."
              to="/tooling/relayers"
              icon={<RelayerIcon />}
            />
          </Section>

            <Section
              title="⚙️ Chain Development"
              id="core-sdks"
              HeadingTag="h4"
              description={
                <>
                  Everything that is needed to learn about development using Router&apos;s core components.
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
                description="Set up your machine to start developing on the Router Chain"
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
                title="Router on a Local System"
                description="Follow the steps in this guide to run the Router blockchain on your local machine."
                to="/router-core/running-router-chain-locally"
                icon=""
                svgFile="/icons/bag.svg"
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

          {/* <Section title="💻 Utilities"  HeadingTag="h4" id="utilities">
    <Card
    title="OsmoJS"
    description="Compose and broadcast Osmosis and Cosmos messages, with all of the proto and amino encoding handled for you."
    to="/osmojs"
    icon={<Osmojs />}
    svgFile="/icons/osmojs.svg"
  />

<Card
    title="Cosmos Kit"
    description="A wallet adapter for react with mobile WalletConnect support for the Cosmos ecosystem."
    to="https://github.com/cosmology-tech/cosmos-kit"
    icon=""
    svgFile="/icons/bag.svg"
  />

  <Card
    title="Telescope"
    description="TypeScript Transpiler for Cosmos Protobufs. Telescope is used to generate libraries for Cosmos blockchains."
    to="/telescope"
    svgFile="/icons/telescope.svg"
  />

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
 
  </Section> */}

          {/* <Section title="📜 API Reference" HeadingTag="h4">
            <Card
              title="API Reference"
              description="Router RPC and LCD API Reference"
              to="#"
              icon={<APIReferenceIcon />}
            />
          </Section> */}
        </div>
      </div>
    </Layout>
  );
}

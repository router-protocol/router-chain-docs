import React from 'react';
import Layout from '@theme/Layout';
import { useHistory } from '@docusaurus/router';
import { DyteButton } from '@dytesdk/react-ui-kit';

import {
  HomepageCard as Card,
  DocVersion,
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
  VoyagerIcon,
  Contribute,
  Network,
  Omnichain,
  NitroIcon,
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
            <DocVersion />
            <h2>Router Docs</h2>
            <p>
              The Router blockchain is a decentralized network built using the Cosmos SDK. Explore our docs and examples to quickly learn, develop & integrate with the Router blockchain.
            </p>
            <DyteButton onClick={() => router.push('/develop/')}>
              Get Started &rarr;
            </DyteButton>
          </div>

          <Section title="Learn about Router">
            <Card
              title="What is Router?"
              description="The Router Chain is a layer 1 blockchain that leverages tendermint’s Byzantine Fault Tolerant (BFT) consensus engine."
              to="/overview/"
            />
            <Card
              title="Choosing the Right Cross-chain Framework"
              description="Router Protocol provides a host of cross-chain solutions. Go through this guide to understand which one's right for you."
              to="/overview/choosing-the-right-framework"
            />
        
            <Card
              title="The ROUTE Token"
              description="The ROUTE token is a digital asset that will serve as the primary gas and governance token on the Router Chain."
              to="/overview/route"
            />
          </Section>

          <Section title="Developers" id="web-sdks" hasSubSections>

            <Section title="🛠 Build iDapps using Router" HeadingTag="h4">
            <Card
                title="Asset Transfer"
                description="Learn about asset transfer bridge Nitro and how to build other asset-transfer applications or sequenced cross-chain requests (asset + instruction)"
                to="/develop/asset-transfer-via-nitro"
                icon={<AssetIcon />}
              />
              <Card
                title="Message Transfer"
                description="Learn about the instruction transfer framework Crosstalk and convert your existing single/multi-chain applications to cross-chain applications."
                to="/develop/message-transfer-via-crosstalk"
                icon={<RelayerIcon />}
              />
            

            </Section>

            <Section title="🛠 Tooling" HeadingTag="h4">
              <Card
                title="Router Scan"
                description="A feature-rich block explorer for monitoring transactions on the Router Chain."
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
                description="A web application that makes it easier to interact with the Router Chain."
                to="/tooling/infra/router-station"
                icon={<Createapp />}
              />
              <Card
                title="Router Faucet"
                description="Get funds to interact with the Router Chain."
                to="https://faucet.routerprotocol.com/"
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
    
              <Card
                title="Router on a Local System"
                description="Follow the steps in this guide to run the Router blockchain on your local machine."
                to="/router-core/running-router-chain-locally"
                icon=""
                svgFile="/icons/bag.svg"
              />
     

            </Section>
          
            <Section title="Auxillary Services" HeadingTag="h4">
              <Card
                title="Router Explorer"
                description="A block explorer to monitor cross-chain transactions."
                to="https://routerscan.io/"
                icon={<IDEIcon />}
              />
              <Card
                title="Router Station"
                description="A tool to manage contract lifecycle-related processes on the Router Chain."
                to="https://station.routerprotocol.com/"
                icon={<Transaction />}
              />
              <Card
                title="Router Faucet"
                description="A platform for users to get Router testnet tokens."
                to="https://faucet.routerprotocol.com/"
                icon={<AssetIcon />}
              />
              <Card
                title="Router Hub"
                description="A platform for delegating ROUTE tokens to validators."
                to="https://hub.routerprotocol.com/"
                icon={<Contribute />}
              />
              <Card
                title="Router Intent Store"
                description="A place where developers can add their own intent adapters or explore existing ones."
                to="https://store.routerintents.com/"
                icon={<ModulesIcon />}
              />
            </Section>
          <Section title="Important Links" id="web-sdks" hasSubSections>
            <Section title="iDapps" HeadingTag="h4">

            <Card
                title="Nitro"
                description="An asset transfer dApp built using Router that facilitates seamless cross-chain swaps."
                to="https://app.routernitro.com"
                icon={<NitroIcon />}
              />
              <Card
                title="Ping Pong"
                description="A testnet iDapp using which you can transfer a simple message from one chain to another."
                to="https://pingpong.routerprotocol.com"
                icon={<Network />}
              />
              
              <Card
                title="Texchange"
                description="A testnet iDapp to exchange testnet tokens."
                to="https://texchange.routerprotocol.com"
                icon={<TerminalIcon />}
              />
            </Section>
            
          </Section>

          
           
           
          </Section>

        </div>
      </div>
    </Layout>
  );
}

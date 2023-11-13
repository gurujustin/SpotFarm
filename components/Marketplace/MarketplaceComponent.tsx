import { configureChains, useAccount, Chain, PublicClient } from "wagmi";
import { useWalletClient } from "wagmi";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  base,
  zora,
} from "wagmi/chains";
//import { Provider } from "@ethersproject/providers";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

export default function MarketplaceComponent() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const jsonRpcUrls = {
    1: "https://mainnet.infura.io/v3/e0171a3aab904c6bbe6622e6598770ad",
    3: "https://ropsten.infura.io/v3/e0171a3aab904c6bbe6622e6598770ad",
  };

  return (
    <>
      {/* <div className="mt-12 w-[170px] sm:w-[300px] md:w-[350px] lg:w-[500px] "> */}
      <p
        className="text-3xl lg:text-3xl mt-40 text-center font-semibold px-5 text-white"
        style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
      >
        LP Marketplace
      </p>
      {/*<SwapWidget></SwapWidget>*/}
      <div className="fixed mb-10 px-2 sm:px-5 md:px-10 lg:px-10 left-0 bottom-0 bg-transparent  w-full  grid grid-cols-2 ">
        <p
          className="font-sans text-white text-[18px] sm:text-[15px] md:text-[15px] lg:text-[16px]
        col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1 "
          style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
        >
          SPOTGROUP.IO
        </p>
        <p
          className="font-sans text-white text-[12px] sm:text-[15px] md:text-[15px] lg:text-[16px]
        col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1"
          style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
        >
          SPOTGROUP2023
        </p>
      </div>
    </>
  );
}

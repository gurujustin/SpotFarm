import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  createConfig,
  useAccount,
  useEnsName,
  useContractRead,
  useContractWrite,
} from "wagmi";
import HeaderComponent from "../components/Header/HeaderComponent";
import { abiObject } from "../contracts/abi/abi.mjs";
import Image from "next/image";
import SpotLogo from "../public/SpotLogoNorm.png";
import SpotOG from "../public/SpotOGMobile.png";
import { usePublicClient } from "wagmi";
import { useWalletClient } from "wagmi";
import { useEffect, useRef, useState } from "react";
import ClaimComponent from "../components/Claim/ClaimComponent";
import Link from "next/link";
import { WagmiConfig, configureChains } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  base,
  zora,
} from 'wagmi/chains';
import { publicProvider } from "wagmi/providers/public";
const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient }: any = useWalletClient();

  useEffect(() => {
    async function ScrollpositionAnimation() {
      const targets = document.querySelectorAll(".js-show-on-scroll");
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
          // Is the element in the viewport?
          if (entry.isIntersecting) {
            // Add the fadeIn class:
            entry.target.classList.add("motion-safe:animate-fadeIn");
          } else {
            // Otherwise remove the fadein class
            entry.target.classList.remove("motion-safe:animate-fadeIn");
          }
        });
      });
      // Loop through each of the target
      targets.forEach(function (target) {
        // Hide the element
        target.classList.add("opacity-0");

        // Add the element to the watcher
        observer.observe(target);
      });
      //ScrollpositionAnimation();
    }
    ScrollpositionAnimation();
  });

  const { data: balanceOf } = useContractRead({
    address: "0x53020F42f6Da51B50cf6E23e45266ef223122376",
    abi: abiObject,
    functionName: "balanceOf",
    chainId: 1,
    args: [address],
    onSuccess(data) {
      console.log("Success", balanceOf);
    },
  });

  const { data: PendingReflections } = useContractRead({
    address: "0x53020F42f6Da51B50cf6E23e45266ef223122376",
    abi: abiObject,
    functionName: "withdrawableDividendOf",
    chainId: 1,
    args: [address],
    onSuccess(data) {
      console.log("Success", PendingReflections);
    },
  });
  // const finalnumber = Web3.utils.fromWei((PendingReflections as any).toString());
  //const fixedNumber = parseFloat(finalnumber).toFixed(6);
  //const NumberNum = Number(fixedNumber)
  console.log(typeof PendingReflections);
  console.log(PendingReflections?.toString());

  const {
    data,
    isLoading,
    isSuccess,
    write: Claimwrite,
  } = useContractWrite({
    address: "0x53020F42f6Da51B50cf6E23e45266ef223122376",
    abi: abiObject,
    functionName: "claim",
    account: address,
  });

  async function x() {
    Claimwrite();
  }

  return (
    <div className="scroll-smooth ">
      <div className="w-full mt-20 relative z-10">
        <Image
          className={
            " w-80 h-80 mx-auto"
          }
          alt={"logo"}
          src={SpotLogo}
        ></Image>
        <div className="flex flex-row mx-auto mt-12 justify-center">
          <button
            style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`, backgroundColor: "#1cbaed" }}
            type="button"
            className="hover:border-gray-700 hover:shadow-[0_0_12px_2px_rgba(123,123,123,0.6)] mt-[40px] sm:mt-0 md:mt-0 text-md
              mr-10 px-6 py-3 w-32 md:w-52 sm:py-1.5 md:py-1.5 lg:py-1.5 mb-2 cursor-pointer text-[12px] sm:text-[18px] md:text-[18px] lg:text-[22px] text-center
              text-white rounded-lg md:text-white md:p-0 dark:text-white"
          >
            <Link href={"/Staking"}>Staking</Link>
          </button>
          <button
            style={{ fontFamily: `'Plus Jakarta Sans', sans-serif` , border: "solid 2px #65d013", color: "#65d013"}}
            type="button"
            className="border-2 border-gray-700 hover:border-gray-700 hover:shadow-[0_0_12px_2px_rgba(123,123,123,0.6)] mt-[40px] sm:mt-0 md:mt-0 text-md
              px-6 py-3 w-32 md:w-52 sm:py-1.5 md:py-1.5 lg:py-1.5 mb-2 cursor-pointer text-[12px] sm:text-[18px] md:text-[18px] lg:text-[22px] text-center
              rounded-lg md:text-white md:p-0 dark:text-white"
          >
            <Link href={"/ClaimPage"}>LP Claim</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

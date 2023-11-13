import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Home.module.css";
import StakingComponent from "../../components/Stake/StakingComponent";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useRouter } from "next/router";

const StakingOverview = () => {

  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const router = useRouter();

  useEffect(() => {
    if (!address) {
      router.push("/dapp/LPstakingpage");
    }
  }, [address, router])
  return (
    <>
      <main className={`${styles.mainPage} `}>
        <div className="relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 m-auto">
            <div className="w-full">
              <StakingComponent />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default StakingOverview;

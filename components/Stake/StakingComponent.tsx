import React, { useCallback, useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import Swal from "sweetalert2";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import LPTokenAbi from "../../contracts/abi/LPTokenAbi.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import error from "next/error";
import { LPabiObject } from "../../contracts/abi/LPTokenAbi.mjs";
import { fourteenDayStackAbi } from "../../contracts/abi/14DayStackabi.mjs";
import { abiObject } from "../../contracts/abi/abi.mjs";

const StakingComponent = () => {
  const [activeStep, setActiveStep] = useState("overview");
  //@ts-ignore
  const fourteenDayContractAddress =
    "0x7A8D1608327EdBdD5C4f1367fD6dD031F21AD7eb";
  const LPtokenContract = "0xc0e1cB42ec3e2dC239F080a2C98659f58CBce9ED";
  let current_chain = 1;
  const [staked, setstaked] = useState();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [rewards, setRewards] = useState(0);
  const [claim, setClaim] = useState(0);

  const { data: getRewards } = useContractRead({
    address: fourteenDayContractAddress,
    abi: fourteenDayStackAbi,
    functionName: "calculateRewardSinceLastClaim",
    chainId: current_chain,
    args: [address],
    onSuccess(data: any) {
      setRewards(Number(data.toString()) / 10 ** 18);
    },
  });

  const { write: claimRewards } = useContractWrite({
    address: fourteenDayContractAddress,
    abi: fourteenDayStackAbi,
    functionName: "withdrawReward",
    chainId: current_chain,
    onSuccess(data) {
      Swal.fire({ icon: "success", title: "you have successfully Claimed" });
    },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with Claiming please contact support if issue perists${err.cause}`,
      });
    },
  });

  const { write: unStake } = useContractWrite({
    address: fourteenDayContractAddress,
    abi: fourteenDayStackAbi,
    functionName: "unstake",
    chainId: current_chain,
    onSuccess(data) {
      Swal.fire({ icon: "success", title: "you have successfully Claimed" });
    },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with Claiming please contact support if issue perists${err.cause}`,
      });
    },
  });

  const [MilqBalance, setMilqBalance] = useState(0);

  const { data: BalanceOfMilq } = useContractRead({
    address: LPtokenContract,
    abi: LPTokenAbi,
    functionName: "balanceOf",
    chainId: current_chain,
    args: [address],
    onSuccess(data: any) {
      setMilqBalance(Number(data.toString()) / 10 ** 18);
    },
  });

  const [LPStaked, setLPStaked] = useState(0);

  const { data: LPUserDeposits } = useContractRead({
    address: fourteenDayContractAddress,
    abi: fourteenDayStackAbi,
    functionName: "getLpDepositsForUser",
    chainId: current_chain,
    args: [address],
    onSuccess(data: any) {
      setLPStaked(Number(data.toString()) / 10 ** 18);
    },
  });
  function FetchBalances() {
    getRewards;
    BalanceOfMilq;
  }
  useEffect(() => {
    FetchBalances();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleStepChange = (step: React.SetStateAction<string>) => {
    setActiveStep(step);
  };

  return (
    <>
      <main>
        <div
          style={{ boxShadow: "0px 0px 17px -7px rgba(255,255,255,0.7)" }}
          className="py-5 px-4 sm:p-5 mt-5 sm:mt-10 md:mt-10 lg:mt-10 border-2 border-gray-700 rounded-2xl  w-[350px] sm:w-[350px] md:w-[550px] min-h-[450px] lg:w-[700px] bg-black"
        >
          <h1
            className="text-white text-xl md:text-2xl justify-center text-center items-center text-[30px]"
            style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
          >
            This Pool is depreciated you can only unstake and claim here. Go to
            our new StaQing page if you want to Staqe.
          </h1>

          <div className="mx-auto justify-center text-center text-white border-b-[1px] pb-3 border-gray-500 mt-5 mb-5">
            <div className="flex flex-col md:flex-row justify-center items-center">
              <h2
                style={{
                  boxShadow: "inset 0px 0px 15px -5px rgba(255,255,255,0.6)",
                  fontFamily: `'Plus Jakarta Sans', sans-serif` ,
                }}
                className="text-white text-center text-md mb-2 md:w-40 h-24 border border-white  px-2 py-4"
              >
                Claimable ETH:
                <br /> {rewards}
              </h2>
              <p className={"mx-3"}></p>
              <h2
                style={{
                  boxShadow: "inset 0px 0px 15px -5px rgba(255,255,255,0.6)",
                  fontFamily: `'Plus Jakarta Sans', sans-serif` ,
                }}
                className="text-white text-center text-md mb-2 md:w-40 h-24 border border-white  px-2 py-4"
              >
                Amount of LP in pool:
                <br /> {LPStaked}
              </h2>
            </div>
            <div
              className={
                "flex flex-row mx-auto text-center justify-center my-3"
              }
            >
              <button
                style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
                className="font-sans cursor-pointer text-sm md:w-40 rounded-lg text-center focus:ring-2 focus:ring-blue-500 border-white border-2 text-white bg-black py-2 px-4 sm:px-5 md:px-5"
                type="button"
                onClick={() => claimRewards()}
              >
                Claim ETH
              </button>
              <p className={"mx-3"}></p>
              <button
                style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
                className="font-sans cursor-pointer text-sm md:w-40 rounded-lg text-center focus:ring-2 focus:ring-blue-500 border-white border-2 text-white bg-black py-2 px-4 sm:px-5 md:px-5"
                type="button"
                onClick={() => unStake()}
              >
                UnStaQe
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default StakingComponent;

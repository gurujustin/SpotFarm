import { useCallback, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import {
  configureChains,
  createConfig,
  WagmiConfig,
  useAccount,
  useEnsName,
  useContractWrite,
  useContractRead,
} from "wagmi";
import utils, { ethers } from 'ethers';
import { abiObject } from "../../contracts/abi/abi.mjs";
import { usePublicClient } from "wagmi";
import { useWalletClient } from "wagmi";
import arrow from "../../public/go-toArrow.png";
import tooltipicon from "../../public/toolTipIcon.png";
import { Spin } from "antd";
import LPTokenAbi from "../../contracts/abi/LPTokenAbi.json";
import {
  toast,
  ToastContainer,
  ToastContainerProps,
  Slide,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
const fourteenDayContractAddress = "0x7A8D1608327EdBdD5C4f1367fD6dD031F21AD7eb";
const LPtokenContract = "0xc0e1cB42ec3e2dC239F080a2C98659f58CBce9ED";

export default function NewClaim() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [loading, setLoading] = useState(false);
  const [claim, setcanclaim] = useState(Boolean);

  const [Claimerish, setClaim] = useState(false);

  const [pendingreflections, setpendingreflections] = useState(Number);
  const [totaldistributed, settotaldistributed]: any = useState(Number);
  const [balance, setbalance] = useState(Number);
  const [reserves, setReserves] = useState(Number);

  const { data: PendingReflections } = useContractRead({
    address: "0x53020F42f6Da51B50cf6E23e45266ef223122376",
    abi: abiObject,
    functionName: "withdrawableDividendOf",
    chainId: 1,
    args: [address],
    onSuccess(data) {},
  });
  const { data: TotalDividends } = useContractRead({
    address: "0x53020F42f6Da51B50cf6E23e45266ef223122376",
    abi: abiObject,
    functionName: "getTotalDividendsDistributed",
    chainId: 1,
    onSuccess(data) {},
  });
  const { data: balanceOf } = useContractRead({
    address: LPtokenContract,
    abi: LPTokenAbi,
    functionName: "balanceOf",
    chainId: 1,
    args: [address],
    onSuccess(data) {},
  });
  function Fetchbalance() {
    if (!address) {
      return;
    }
    try {
      setLoading(true);
      const divisor = 1e18;
      const NumberBalance = Number(balanceOf);
      const formattedNumber = NumberBalance / divisor;
      const finalNumber = formattedNumber.toFixed(6);
      const realNumber = Number(finalNumber);
      if (Number.isNaN(realNumber)) {
        return 0;
      }
      setbalance(realNumber);
      return realNumber;
      /////
    } catch (error) {
      console.log(error, "ERROR 1111");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  const { data: getReserves } = useContractRead({
    address: LPtokenContract,
    abi: LPTokenAbi,
    functionName: "getReserves",
    chainId: 1,
    onSuccess(data) {
      console.log(getReserves, "these are my reserve values");
    },
  });

  const [realLpPrice, setrealLpPrice] = useState(Number);
  async function FetchReserves() {
    if (!address) {
      return;
    }
    try {
      setLoading(true);
      const reservesArray = Array.isArray(getReserves) ? (getReserves as bigint[]) : [];
      console.log(reservesArray, "array of bigints");
  
      const reserveToken0 = reservesArray[0];
      const reserveToken1 = reservesArray[1];
      const regReserveToken0 = ethers.formatUnits(reserveToken0, 18); 
      const regReserveToken1 = ethers.formatUnits(reserveToken1, 18); 
        console.log(regReserveToken0, "/", regReserveToken1, "divide these numbers")
      const lpPrice = parseFloat(regReserveToken1) / parseFloat(regReserveToken0);
      
      console.log("LP Price:", lpPrice);
  
      if (isNaN(lpPrice)) {
        return 0;
      }
      setrealLpPrice(lpPrice);
      return lpPrice;
    } catch (error) {
      console.error(error, "ERROR 1111");
    } finally {
      setLoading(false);
    }
  }

  function fetchPendingReflections() {
    try {
      setLoading(true);

      const stringed: string = PendingReflections?.toString() as string;
      const divisor = 1e18;
      const fixedNumber = parseFloat(stringed).toFixed(6);
      const NumberNum = Number(fixedNumber);
      const formattedNumber = NumberNum / divisor;
      const roundedNumber = Math.round(formattedNumber * 1e6) / 1e6;
      if (Number.isNaN(roundedNumber)) {
        return 0;
      }
      setpendingreflections(roundedNumber);

      return roundedNumber;
    } catch (error) {
      console.log(error, "error 2");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  function FetchDistributed() {
    try {
      setLoading(true);
      const abi = abiObject;

      const divisor = 1e18;
      const stringed: string = TotalDividends?.toString() as string;
      const fixedNumber = parseFloat(stringed);
      const NumberNum = Number(fixedNumber.toFixed(2));
      const formattedNumber = NumberNum / divisor;
      const roundedNumber = Math.round(formattedNumber * 1e6) / 1e6;
      settotaldistributed(roundedNumber);
      return roundedNumber;
    } catch (error) {
      console.log(error, "error 3");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPendingReflections();
    Fetchbalance();
    FetchReserves();
    FetchDistributed();
  }, [address]);

  const { write: Claimwrite } = useContractWrite({
    address: "0x53020F42f6Da51B50cf6E23e45266ef223122376",
    abi: abiObject,
    functionName: "claim",
    account: address,
  });

  const resolveAfter3Sec = new Promise((resolve) => setTimeout(resolve, 3000));

  async function claimWithPromise() {
    const toastId = "fetched-nationalities";
    try {
      await Claimwrite();
      toast.success("🦄 Wow so easy!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      console.log(`err: ${console.error()}`);
    }
  }
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <div
         style={{background: '#575757'}} 
        className="-translate-y-72 opacity-90 rounded-2xl py-6 px-4 sm:p-10 mt-5 sm:mt-10 md:mt-10 lg:mt-15 w-[350px] sm:w-[350px] md:w-[550px] lg:w-[650px] overflow-x-auto"
      >
        <p
          className="text-[15px] sm:text-[20px] md:text-[23px] lg:md:text-[25px] font-semibold text-white"
          style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
        >
          CLAIM LP REWARDS
        </p>
        <div
          style={{ fontFamily: "Gotham" }}
          className={
            "flex flex-row text-center text-md text-white justify-center"
          }
        >
          <p className={"border-2 border-white rounded-md px-2 py-2 w-52"}>
            Your SPOT Balance: <br />
            43,028 SPOT{" "}
          </p>
          <p className={"mx-5"}></p>
          <p className={"border-2 border-white rounded-md px-2 py-2 w-52"}>
            Your LP Balance: <br />
            {balance} LP{" "}
          </p>
        </div>
        <p
          className={
            "border-b border-white text-xl tracking-wider my-4 font-bold text-white"
          }
        >
          Total ETH claimed by user: 0.01962 ETH
        </p>

        
        <div
          style={{ fontFamily: "Gotham" }}
          className={
            "flex flex-row text-center text-md text-white justify-center"
          }
        >
          <p className={"border-2 border-white rounded-md px-2 py-2 w-52"}>
          Claimable LP in ETH: <br /> 0.00127 ETH <br />{" "}
          </p>
          <p className={"mx-5"}></p>
          <p className={"border-2 border-white rounded-md px-2 py-2 w-52"}>
          Claimable LP: <br /> {pendingreflections} LP <br />{" "}
          </p>
        </div>


        <div className="flex justify-center items-center mt-10 ">
          <button
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="font-sans cursor-pointer text-[20px] rounded-lg text-center bg-gradient-to-r from-black to-black  text-white py-2 px-5 sm:px-10 md:px-10 lg:px-10"
            type="button"
            onClick={() => claimWithPromise()}
          >
            Claim your Rev Share
          </button>
          <a
            className={""}
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Step 1: Claim Rev Share Step 2: Go swap LP for ETH
           Step 3: Approve Step 4: Get ETH"
          >
            <Image
              className={"bg-white rounded-full mx-2 w-6 h-6"}
              src={tooltipicon}
              alt="tooltip"
            ></Image>
            <Tooltip 
  style={{ backgroundColor: "#383838", color: "#ffffff", fontFamily: 'Gotham', width: '200px', }} id="my-tooltip" />
          </a>
        </div>
        <div
          className={"w-80 h-fit self-center mt-3 mx-auto text-white text-xl"}
        >
          <iframe
            className={"rounded-2xl mx-auto w-60 h-32 "}
            src="https://www.youtube.com/embed/Ea1a046RmGE"
          ></iframe>
        </div>
        <div
          className={
            "flex flex-row text-center mt-4 text-md text-white justify-center"
          }
        >
          <div
            className={
              "cursor-pointer border-2 border-white rounded-md px-2 py-2"
            }
          >
            StaQe your SPOT and earn more
          </div>
          <div className={"mx-2"}></div>
          <div
            className={
              "cursor-pointer border-2 border-white rounded-md px-2 py-2"
            }
          >
            Stake your rev share and earn more
          </div>
          <div className={"mx-2"}></div>
          <h2
            style={{ fontFamily: "Gotham" }}
            className={
              "cursor-pointer border-2 border-white rounded-md px-2 py-2"
            }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <p className="text-md text-white ">Stake your rewards to earn</p>

            <button
              style={{
                fontFamily: "Gotham",
                width: isHovered ? "" : "", // Dynamically change the button width
              }}
              className="flex flex-row text-right justify-right content-right self-end duration-500 transition-all rounded-2xl"
            >
              <Image
                src={arrow}
                alt="arrow"
                width={25}
                height={25}
                className={` duration-700 ${
                  isHovered ? "opacity-100" : "opacity-0"
                } `}
              />
            </button>
          </h2>
        </div>
        <div
          className={
            "cursor-pointer border-2 border-white rounded-md px-2 py-2 mt-2 text-md text-white "
          }
        >
          Learn more about SPOT
        </div>
      </div>

      <div className="fixed mb-10 text-white px-2 sm:px-5 md:px-10 lg:px-10 left-0 bottom-0 bg-transparent w-full grid grid-cols-2 ">
        <p
          className="font-sans text-[18px] sm:text-[15px] md:text-[15px] lg:text-[16px] 
        col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1 "
          style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
        >
          SPOTGROUP.IO
        </p>
        <p
          className="font-sans text-[12px] sm:text-[15px] md:text-[15px] lg:text-[16px] 
        col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1"
          style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
        >
          SPOTGROUP2023
        </p>
      </div>

      <style jsx>{`
        h2:hover button {
          width: 50%; /* Change the button's width when h2 is hovered */
        }

        h2:hover Image {
          opacity: 1; /* Change the p's opacity when hovered */
          transition: opacity 700ms;
          visibility: visible;
          transition-delay: 500ms; /* Add a duration only when hovered */
        }

        h2 Image:hover {
          transition: none;
          visibility: invisible;
          transition-delay: 0ms; /* Remove the duration when hovered off */
        }
      `}</style>
      {/* 
        <h5
          style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
          className="text-center mb-2 text-4xl font-bold tracking-wide self-center text-gray-300 dark:text-gray-300"
        >
          Claim LP Rewards
        </h5>
        <div className="md:grid grid-cols-2 mx-4 flex flex-col border-2 border-gray-500 rounded-xl">
          <div className={"rounded-xl text-white text-xl px-4 py-2 m-3"}>
            <p style={{fontFamily: 'GroupeMedium'}} className={"text-xl font-bold text-gray-300"}>
              Pending LP Rewards:
            </p>
          </div>
          <div className={"rounded-xl text-white text-xl px-4 py-2 m-3"}>
            <p className={"text-xl text-gray-300 "}>{pendingreflections}</p>
          </div>
          <div className={"rounded-xl text-white  text-xl px-4 py-2 m-3"}>
            <p style={{fontFamily: 'GroupeMedium'}} className={"text-xl font-bold text-gray-300"}>
              Total LP Distributed
            </p>
          </div>
          <div className={"rounded-xl text-white text-xl px-4 py-2 m-3"}>
            <p className={"text-xl text-gray-300"}>{totaldistributed}</p>
          </div>
        </div> */}

      {/* {loading ? (
          <Spin indicator={antIcon} className="add-spinner" />
        ) : (
          <>
            <div className="flex flex-row content-center mx-auto items-center max-w-screen">
              <button
                style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
                type="button"
                onClick={() => Claimtoken()}
                className="w-fit mx-0 px-20 md:px-32 self-center content-center tn:mx-0 elevation-10 hover:elevation-50 md:mx-24 h-24
                 clip-path-mycorners justify-self-center mt-10 text-gray-800 bg-gray-300 hover:bg-gray-400 hover:cursor-pointer transition ease-in-out duration-700
                 text-3xl lg:text-4xl hover:scale-95 "
              >
                Claim
              </button>
            </div>
          </>
        )} */}
    </>
  );
}

import React, { useEffect, useState } from "react";
import { MilqFarmABI } from "../../contracts/abi/MilqFarmAbi.mjs";
import LPTokenAbi from "../../contracts/abi/LPTokenAbi.json";
import Image from "next/image";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useBlockNumber,
  useNetwork,
} from "wagmi";
import error from "next/error";
import { Tooltip } from "react-tooltip";
import tooltipicon from "../../public/tooltipicon.png";
import { LPStakingabiObject } from "../../contracts/abi/LpStakingAbi.mjs";
import { LPabiObject } from "../../contracts/abi/LPTokenAbi.mjs";
import { abiObject } from "../../contracts/abi/abi.mjs";
import { Web3 } from "web3";
import Swal from "sweetalert2";
interface LpStakeTabMenuProps {
  _token: number;
  setToken: (value: number) => void;
}
export default function LpStakeTabMenu({
}: LpStakeTabMenuProps) {
  const { address } = useAccount();
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const StaqeFarm = "0xaf894A45DF2ee09Df961D159F5371d1bebe02a58";

  let { chain } = useNetwork();

  let current_chain = chain?.id;
  const LPtokenContract = "0xc0e1cB42ec3e2dC239F080a2C98659f58CBce9ED";

  const [_amountMilQ, set_amountMilQ]: any = useState('');

  let [currentTime, setCurrentTime]: any = useState(0);

  useEffect(() => {
    const fetchTimestamp = async () => {
      try {
        const web3 =
          current_chain === 1
            ? new Web3(
                "https://mainnet.infura.io/v3/e0171a3aab904c6bbe6622e6598770ad"
              )
            : new Web3(
                "https://goerli.infura.io/v3/e0171a3aab904c6bbe6622e6598770ad"
              );

        const block = await web3.eth.getBlock("latest");
        if (block) {
          const timestamp = block.timestamp; // This is the block timestamp
          setCurrentTime(timestamp);
        } else {
          console.log("Block is pending");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchTimestamp();
    const intervalId = setInterval(fetchTimestamp, 4000);

    return () => clearInterval(intervalId);
  }, [current_chain]);


  let allowance_default = +_amountMilQ > 1 ? _amountMilQ.toString() : "100";
  const { write: LPApprove, isLoading: approveLoad } = useContractWrite({
    address: LPtokenContract,
    abi: LPTokenAbi,
    functionName: "approve",
    chainId: current_chain,
    account: address,
    args: [StaqeFarm, Number(allowance_default) * 10 ** 18 * 1.2],
    onSuccess(data: any) {
      Swal.fire({
        icon: "success",
        title: "you have successfully Approved",
      });
      setAllowance(Number(allowance_default) * 10 ** 18 * 1.2);
    },
  });
  let [Allowance, setAllowance]: any = useState();

  const { data: allowance } = useContractRead({
    address: LPtokenContract,
    abi: LPTokenAbi,
    functionName: "allowance",
    chainId: current_chain,
    watch: true,
    args: [address, StaqeFarm],
    onSuccess(data: any) {
      setAllowance(Number(data.toString()) / 10 ** 18);
    },
  });

  //Begin all functions for Regular Spot Staqing
  const { write: unStaQe, isLoading: unstaqeLoad } = useContractWrite({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "unstaQe",
    args: [0, +_amountMilQ * 10 ** 18, 1],
    account: address,
    onSuccess(data) {
      Swal.fire({
        icon: "success",
        title: "you have successfully UnStake your LP",
      });
      FetchDetails();
    },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with UnStake please contact support if issue perists${err.cause}`,
      });
    },
  });
  /// rented till 2
  const { write: PerpSwitch, isLoading: perpLoad } = useContractWrite({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    chainId: current_chain,
    functionName: "ownCows",
    account: address,
    args: [1],
    onSuccess(data) {
      Swal.fire({
        icon: "success",
        title: "you have successfully Switched to Perpetual",
      });
      FetchDetails();
    },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with switching please contact support if issue perists${err.cause}`,
      });
    },
  });

  const { write: RequestUnlock } = useContractWrite({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    chainId: current_chain,
    functionName: "roundUpCows",
    args: [1],
    account: address,
    onSuccess(data) {
      Swal.fire({
        icon: "success",
        title: "you have successfully Requested Unlock",
      });
      FetchDetails();
    },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with Requesting Unlock please contact support if issue perists${err.cause}`,
      });
    },
  });

  const { write: StaQe, isLoading: staqLoad } = useContractWrite({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "staQe",
    args: [0, +_amountMilQ * 10 ** 18, 1],
    account: address,
    onSuccess(data) {
      Swal.fire({
        icon: "success",
        title: "you have successfully StaQed your LP",
      });
      FetchDetails();
    },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with UnStake please contact support if issue perists${err.cause}`,
      });
    },
  });

  const [update, setupdate] = useState("");
  function HandleStaQe() {
    if (!address) {
      return;
    }
    if (+_amountMilQ <= 0) {
      Swal.fire({
        icon: "error",
        title: `You must Stake an amount above 0 `,
      });
      return;
    }
    try {
      StaQe();
    } catch (error) {
      console.error("Staking failed:", error);
    }
  }

  function HandleUnStaQe() {
    if (!address) {
      return;
    }
    if (+_amountMilQ <= 0) {
      Swal.fire({
        icon: "error",
        title: `You must UnStake an amount above 0 `,
      });
      return;
    }
    try {
      unStaQe();
      FetchDetails();
    } catch (error) {
      console.error("Staking failed:", error);
    }
  }

  const [MilqBalance, setMilqBalance] = useState(0);

  const { data: BalanceOfMilq } = useContractRead({
    address: LPtokenContract,
    abi: LPTokenAbi,
    functionName: "balanceOf",
    chainId: current_chain,
    watch: true,
    args: [address],
    onSuccess(data: any) {
      setMilqBalance(Number(data.toString()) / 10 ** 18);
    },
  });
  let [userdetails, setUserDetails]: any = useState();
  const [owned, setOwned] = useState(false);
  const [ownedTill, setOwnedTill]: any = useState();
  const [lpstaked, setlpstaked]: any = useState(0);
  const [totalLPStaked, settotalLPStaked] = useState(0);

  const { data: bessies } = useContractRead({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    watch: true,
    functionName: "bessies",
    chainId: current_chain,

    onSuccess(data: any) {
      settotalLPStaked(Number(data.toString()) / 10 ** 18);
    },
  });
  const [qompounded, setQompounded]: any = useState();
  const [finalUserLockTime, setfinalUserLockTime]: any = useState();
  const user = '0x88eb166BbC9e35f448f7f53B4eD4FF9F989Ef969';
  const { data: UserDetails } = useContractRead({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "MilQerParlours",
    chainId: current_chain,
    watch: true,
    args: [address],
    onSuccess(data: any) {
      setUserDetails(data);
      setlpstaked(Number(data[0].toString()) / 10 ** 18);
      setQompounded(Number(data[6].toString()) / 10 ** 18);
      setUnlockTime(Number(data[2].toString()));
      setOwned(data[10]);
      setOwnedTill(Number(data[8].toString()));
    },
  });
  const calculateMaxBalance = () => {
    const maxBalance = Math.floor(MilqBalance * 100) / 100;
    set_amountMilQ(maxBalance);
  };

  const [unlocktime, setUnlockTime]: any = useState();

  const [unlockTimeInSeconds, setUnlockTimeInSeconds] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const unlockTimeInSeconds = Number(unlocktime) - Number(currentTime);
    setUnlockTimeInSeconds(unlockTimeInSeconds);
    if (unlockTimeInSeconds <= 0) {
      return;
    }
    if (Number.isNaN(unlockTimeInSeconds)) {
      return;
    }
    const hours = Math.floor(unlockTimeInSeconds / 3600);
    const remainingSeconds = unlockTimeInSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
  }, [unlocktime, currentTime]);

  
  const [unlockPerpTimeInSeconds, setPerpUnlockTimeInSeconds] = useState(0);
  const [perpHours, setperpHours] = useState(0);
  const [perpMinutes, setperpMinutes] = useState(0);
  const [perpSeconds, setperpSeconds] = useState(0);

  useEffect(() => {
    const unlockPerpTimeInSeconds = Number(ownedTill) - Number(currentTime);
    setPerpUnlockTimeInSeconds(unlockPerpTimeInSeconds);
    if (unlockPerpTimeInSeconds <= 0) {
      return;
    }
    if (Number.isNaN(unlockPerpTimeInSeconds)) {
      return;
    }
    const perpHours = Math.floor(unlockPerpTimeInSeconds / 3600);
    const remainingSeconds = unlockPerpTimeInSeconds % 3600;
    const perpMinutes = Math.floor(remainingSeconds / 60);
    const perpSeconds = remainingSeconds % 60;
    setperpHours(perpHours);
    setperpMinutes(perpMinutes);
    setperpSeconds(perpSeconds);
  }, [ownedTill, currentTime]);


  function FetchDetails() {
    UserDetails;
    bessies;
    BalanceOfMilq;
    allowance;
  }

  return (
    <div
      style={{
        border: "solid 1px #00eafd"
      }}
      className="rounded-2xl px-3 w-fit py-3 opacity-90"
    >
      <div>
        <h1 className="text-xl md:text-2xl my-16 text-white">
          LP Token Staking
        </h1>
        {owned ? (
          <h1 className="text-md mb-6 text-white">
            You are Perpetually Staked
          </h1>
        ) : (
          <h1 className="text-md mb-6 text-white">You are in Basic Staking</h1>
        )}
        <h2 className="text-lg text-white">
          Please enter the amount of tokens
        </h2>

        <h2 className="text-md my-1 text-white">
          Available LP To Stake: {MilqBalance ? MilqBalance.toFixed(2) : "0"}{" "}
        </h2>
        <div className="flex flex-col items-center justify-center">
          <div className={"flex flex-row"}>
            <input
              value={_amountMilQ}
              type="number"
              id="stakeInput"
              placeholder="Enter Number"
              className="w-64 border h-8 my-2 mr-4 border-gray-300 outline-none p-2 pr-10 text-black"
              style={{ fontFamily: "Gotham", color: "black" }}
              onChange={(e) => set_amountMilQ(e.target.value)}
            />
          <button
          style={{fontFamily: 'BebasNeue'}}
            className="text-white text-xl tracking-wide border border-white w-fit h-fit px-2 self-center rounded-sm
            hover:translate-x-1 hover:-translate-y-1 hover:scale-95 hover:duration-500"
            onClick={calculateMaxBalance}
          >
            Max
          </button>


          <a
            className={"self-center text-sm"}
            data-tooltip-id="my-tooltip"
            data-tooltip-content="You cannot use MAX button for UnStake. You can only use it for Stake."
          >
            <Image
              className={"bg-white self-center rounded-full mx-2 w-6 h-6"}
              src={tooltipicon}
              alt="tooltip"
            ></Image>
            <Tooltip 
  style={{ backgroundColor: "#383838", color: "#ffffff", fontFamily: 'Metropolis', width: '200px', }} id="my-tooltip" />
          </a>

          </div>
          {Allowance >= +_amountMilQ ? (
            <>
              {" "}
              {staqLoad ? (
                <Spin indicator={antIcon} className="add-spinner" />
              ) : (
                <>
                  <button
                    style={{ fontFamily: `'Plus Jakarta Sans', sans-serif` }}
                    className="font-sans w-64 cursor-pointer text-md rounded-lg text-center focus:ring-2 focus:ring-blue-500 border-lime-300 border-2 text-lime-300 bg-black py-2 "
                    type="button"
                    onClick={() => HandleStaQe()}
                  >
                    Stake
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {approveLoad ? (
                <Spin indicator={antIcon} className="add-spinner" />
              ) : (
                <>
                  <button
                    style={{ fontFamily: `'Plus Jakarta Sans', sans-serif` }}
                    className="font-sans  cursor-pointer w-64 text-md rounded-lg text-center border-lime-300 border-2 text-lime-300 bg-black py-2 px-4 sm:px-5 md:px-5"
                    type="button"
                    onClick={() => LPApprove()}
                  >
                    Approve
                  </button>
                </>
              )}
            </>
          )}

          <div className="flex-row justify-center my-3 items-center">
            {unstaqeLoad ? (
              <Spin size="large" indicator={antIcon} className="add-spinner" />
            ) : (
              <>
                {" "}
                <button
                  disabled={userdetails ? userdetails[0] < +_amountMilQ : true}
                  onClick={() => unStaQe()}
                  style={{ fontFamily: `'Plus Jakarta Sans', sans-serif` }}
                  className="font-sans cursor-pointer w-64 text-md rounded-lg text-center focus:ring-2 focus:ring-blue-500 border-lime-300 border-2 text-lime-300 bg-black py-2 px-4 sm:px-5 md:px-5"
                  type="button"
                >
                  UnStake
                </button>
              </>
            )}
          </div>

          <h2 className="text-lg text-red-600 w-80 mx-auto">
            Unstaking before unlock time reaches 0 has a early withdraw fee
          </h2>
          <div className="flex flex-col justify-center items-center my-1">
            {Number(unlocktime?.toString()) != 0 &&
            Number(unlocktime?.toString()) < Number(currentTime.toString()) &&
            !owned ? (
              <>
                {" "}
                {perpLoad ? (
                  <Spin
                    size="large"
                    indicator={antIcon}
                    className="add-spinner"
                  />
                ) : (
                  <button
                    onClick={() => PerpSwitch()}
                    style={{ fontFamily: `'Plus Jakarta Sans', sans-serif` }}
                    className="font-sans ml-2 cursor-pointer text-md rounded-lg text-center focus:ring-2 focus:ring-blue-500 bg-yellow-500 border-white border-2 text-white py-2 px-5 sm:px-10 md:px-10 lg:px-10"
                    type="button"
                  >
                    Switch to Perpetual
                  </button>
                )}
              </>
            ) : (
              <></>
            )}
            {owned && ownedTill == 32503680000 ? (
              <button
                onClick={() => RequestUnlock()}
                style={{ fontFamily: `'Plus Jakarta Sans', sans-serif` }}
                className="font-sans mt-3 cursor-pointer text-md rounded-lg text-center focus:ring-2 focus:ring-blue-500 bg-yellow-500 border-white border-2 text-white py-2 px-4 sm:px-5 md:px-5"
                type="button"
              >
                ReQuest Unlock
              </button>
            ) : (
              <></>
            )}
            
            <>
              {" "}
              {owned == true && ownedTill != 32503680000 ? (
                
                <div className={"flex flex-col text-white w-fit px-2 mx-auto"}>
                  <h2 className="text-white text-sm px-2 mb-1">
                    Time Until request for Unlock Ends:{" "}
                  </h2>
                  <div className={'flex flex-row text-md mx-auto border border-white py-1 px-2'}
                  style={{fontFamily: 'BebasNeue'}} >
                    <p>Hours: {perpHours}</p>
                    <p className={'mx-2'}>Minutes: {perpMinutes}</p>
                    <p>Seconds: {perpSeconds}</p>
                  </div>
                </div>
              ) : (<></>
              )}
            </>
          </div>
        </div>
        <div>
          {" "}
          {owned && ownedTill <= currentTime ? (
            <h1 className="text-white text-md">
              Your Perpetual Stake has ended
            </h1>
          ) : (
            <></>
          )}
        </div>
        <div>
          {" "}
          {lpstaked > 0 && !owned && unlocktime <= currentTime ? (
            <h1 className="text-white text-md">Your Regular Stake has ended</h1>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div
        style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
        className=" mt-5 opacity-90 flex flex-row transition-all duration-300 py-3"
      >
        <div
          className={
            "text-md grid grid-cols-3 col-span-1 gap-2 px-3 py-3 mx-auto"
          }
        >
          <h2 className="text-white md:w-40 text-sm px-2 py-2">
            StaQed LP: <br />{" "}
            {userdetails ? Number(userdetails[0].toString()) / 10 ** 18 : 0} LP
          </h2>
        <>
            <div className={"text-white text-sm mx-auto"}>
              {" "}
              <h2 className="text-white md:w-40 text-md px-2">
                Time Until Unlock:{" "}
              </h2>
              <p>Hours: {hours}</p>
              <p>Minutes: {minutes}</p>
              <p>Seconds: {seconds}</p>
            </div>
        </>
          <h2 className="text-white md:w-40 text-sm px-2 py-2">
            Your pool %: <br />{" "}
            {userdetails && totalLPStaked
              ? (
                  (Number(userdetails[0].toString()) /
                    10 ** 18 /
                    totalLPStaked) *
                  100
                ).toFixed(3)
              : 0}
            %{" "}
          </h2>
        </div>
      </div>
    </div>
  );
}

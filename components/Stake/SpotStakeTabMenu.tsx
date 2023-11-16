import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import spotABI from "../../contracts/abi/abi.json";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import Web3 from "web3";
import Swal from "sweetalert2";
import { LPStakingabiObject } from "../../contracts/abi/LpStakingAbi.mjs";
import { abiObject } from "../../contracts/abi/abi.mjs";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Image from "next/image";
import tooltipicon from "../../public/tooltipicon.png";
import { Provider } from "react-redux";
import { Log } from "viem";
interface LpStakeTabMenuProps {
  _token: number;
  setToken: (value: number) => void;
}

//// use round uptime
//need the preset value to hardcode
//if its less the preset value earse request inlcok

export default function SpotStakeTabMenu({
  _token,
  setToken,
}: LpStakeTabMenuProps) {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const { address } = useAccount();
  const spotAddress = "0x53020F42f6Da51B50cf6E23e45266ef223122376";
  const StaqeFarm = "0xaf894A45DF2ee09Df961D159F5371d1bebe02a58";

  const gspot = "0x883b91e43b334faf8C2Dc37bDA80521F5c92b319";

  let { chain } = useNetwork();

  let current_chain = chain?.id;
  const [currentTime, setCurrentTime]: any = useState(0);

  const [_amountSpoT, set_amountSpoT]: any = useState('');
  /*
  const { data } = useBlockNumber({
    chainId: current_chain,
    watch: true,
    onBlock(blockNumber) {
      setCurrentTime(blockNumber);
    },

  });

  */
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
          const timestamp = Number(block.timestamp); // This is the block timestamp
          setCurrentTime(timestamp);
        } else {
          console.log("Block is pending");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchTimestamp();
    const intervalId = setInterval(fetchTimestamp, 3000);

    return () => clearInterval(intervalId);
  }, [current_chain]);

  /*
  useEffect(() => {
    const provider = new ethers.JsonRpcProvider("https://twilight-lively-wish.discover.quiknode.pro/f952ff5ac1c946ffed4d7bc7e607f4e98eedef80/");
    provider.getBlock("latest")
    .then((block) => {
      if (block) {
        const timestamp = block.timestamp; // This is the block timestamp
        console.log(timestamp, "this is my timestamp");
        setCurrentTime(timestamp);
      } else {
        console.log("Block is pending");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}, [address]);
*/
  let [userdetails, setUserDetails]: any = useState();
  const [owned, setOwned] = useState(false);
  const [spotstaked, setSpotStaqbalance]: any = useState(0);
  const [ownedTill, setOwnedTill]: any = useState();
  const { data: UserDetails } = useContractRead({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "SpoTerParlours",
    chainId: current_chain,
    watch: true,
    args: [address],
    onSuccess(data: any) {
      setUserDetails(data);
      setSpotStaqbalance(Number(data[0].toString()) / 10 ** 18);
      setUnlockTime(Number(data[2].toString()));
      setOwnedTill(Number(data[8].toString()));
      setOwned(data[10]);
    },
  });
  const calculateMaxBalance = () => {
    const maxBalance = Math.floor(spotBalance * 100) / 100;
    set_amountSpoT(maxBalance);
  };

  const [unlocktime, setUnlockTime]: any = useState();

  const [unlockTimeInSeconds, setUnlockTimeInSeconds] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  function secondsToDHMS(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return { hours, minutes, seconds };
  }
  useEffect(() => {
    const unlockTimeInSeconds = unlocktime - currentTime;
    setUnlockTimeInSeconds(unlockTimeInSeconds);
    if (unlockTimeInSeconds <= 0 || Number.isNaN(unlockTimeInSeconds)) {
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

  ///Gspot stuff

  const { write: ApproveGspot, isLoading: gspotLoad } = useContractWrite({
    address: gspot,
    abi: spotABI,
    functionName: "approve",
    chainId: current_chain,
    account: address,
    args: [StaqeFarm, Number(spotstaked.toString()) * 10 ** 18],
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured withApproving Gspot  please contact support if issue perists${err.cause}`,
      });
    },
  });
  let [GAllowance, setGAllowance]: any = useState();

  const { data: Gallowance } = useContractRead({
    address: gspot,
    abi: spotABI,
    functionName: "allowance",
    chainId: current_chain,
    args: [address, StaqeFarm],
    watch: true,
    onSuccess(data: any) {
      setGAllowance(Number(data.toString()) / 10 ** 18);
    },
  });

  ///////

  //spot approval
  let allowance_default = +_amountSpoT > 1 ? _amountSpoT.toString() : "100";
  const { write: Approve, isLoading: approveLoad } = useContractWrite({
    address: spotAddress,
    abi: spotABI,
    functionName: "approve",
    chainId: current_chain,
    account: address,
    args: [StaqeFarm, Number(allowance_default) * 10 ** 18 * 1.2],
    onSuccess(data) {
      Swal.fire({
        icon: "success",
        title: "you have successfully Approved",
      });

      setAllowance(Number(allowance_default) * 10 ** 18 * 1.2);
    },
  });
  let [Allowance, setAllowance]: any = useState();

  const { data: allowance } = useContractRead({
    address: spotAddress,
    abi: spotABI,
    functionName: "allowance",
    chainId: current_chain,
    args: [address, StaqeFarm],
    watch: true,
    onSuccess(data: any) {
      setAllowance(Number(data.toString()) / 10 ** 18);
    },
  });
  //Begin all functions for Regular Spot Staqing
  const { write: unStaQe, isLoading: unstaqeLoad } = useContractWrite({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "unstaQe",
    args: [+_amountSpoT * 10 ** 18, 0, 0],
    account: address,
    onSuccess(data) {
      Swal.fire({
        icon: "success",
        title: "you have successfully UnStaQed your Spot",
      });
    },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with UnStaqing please contact support if issue perists${err.cause}`,
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
    args: [0],
    onSuccess(data) {
      Swal.fire({
        icon: "success",
        title: "you have successfully Switched to Perpetual",
      });
    },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with switching please contact support if issue perists ${err.cause}`,
      });
    },
  });

  const { write: RequestUnlock, isLoading: unlockLoad } = useContractWrite({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    chainId: current_chain,
    functionName: "roundUpCows",
    args: [0],
    account: address,
    onSuccess(data) {
      Swal.fire({
        icon: "success",
        title: "you have successfully Requested Unlock",
      });
    },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with Requesting unlock please contact support if issue perists${err.cause}`,
      });
    },
  });

  const { write: StaQe, isLoading: staqeLoad } = useContractWrite({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "staQe",
    args: [+_amountSpoT * 10 ** 18, 0, 0],
    account: address,
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with Staqing please contact support if issue perists${err.cause}`,
      });
    },
  });

  async function HandleStaQe() {
    if (!address) {
      return;
    }

    if (+_amountSpoT <= 0) {
      Swal.fire({
        icon: "error",
        title: `You must Stake an amount above 0 `,
      });
      return;
    }
    try {
      StaQe();
      FetchDetails();
    } catch (error) {
      console.error("Staking failed:", error);
    }
  }

  const [update, setupdate] = useState("");
  function HandleUnStaQe() {
    if (!address) {
      return;
    }
    if (+_amountSpoT <= 0) {
      Swal.fire({
        icon: "error",
        title: `You must UnStaQe an amount above 0 `,
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

  const [totalspotStaked, settotalSpotStaked] = useState(0);
  const { data: daisys } = useContractRead({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "daisys",
    watch: true,
    chainId: current_chain,
    onSuccess(data: any) {
      settotalSpotStaked(Number(data.toString()) / 10 ** 18);
    },
  });
  const [spotBalance, setspotBalance] = useState(0);

  const { data: BalanceOfSpot } = useContractRead({
    address: spotAddress,
    abi: abiObject,
    functionName: "balanceOf",
    chainId: current_chain,
    watch: true,
    args: [address],
    onSuccess(data: any) {
      setspotBalance(Number(data.toString()) / 10 ** 18);
    },
  });
  function FetchDetails() {
    UserDetails;
    daisys;
    allowance;
    Gallowance;
    BalanceOfSpot;
  }
  useEffect(() => {
    allowance;
    Gallowance;
    FetchDetails();
    const intervalId = setInterval(() => {
      UserDetails;
      FetchDetails();
    }, 3000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [_amountSpoT]);

  useEffect(() => {
    FetchDetails();
  }, []);

  return (
    <div
      style={{
        border: "solid 1px #00eafd"
      }}
      className="rounded-2xl px-3 w-fit py-3 opacity-90"
    >
      <div>
        <h1 className="text-xl md:text-2xl my-16 text-white">
          Spot Token Staking
        </h1>
        <>
          {owned ? (
            <h1 className="text-md  mb-6 text-white">
              You are Perpetually Staked
            </h1>
          ) : (
            <h1 className="text-md mb-6 text-white">
              You are in Basic Staking
            </h1>
          )}
        </>
        <h2 className="text-lg text-white">
          Please enter the amount of tokens
        </h2>

        <h2 className="text-md my-1 text-white">
          Available Spot To Stake: {spotBalance.toFixed(2)}
        </h2>

        <div className="flex flex-col items-center justify-center">
          <div className={"flex flex-row"}>
            <input
              value={_amountSpoT}
              type="number"
              id="stakeInput"
              placeholder="Enter Number"
              className="w-64 border h-8 my-2 mr-4 border-gray-300 outline-none p-2 pr-10"
              style={{ fontFamily: "Metropolis", color: "black" }}
              onChange={(e) => set_amountSpoT(e.target.value)}
            />
            <button
              style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
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
          {Allowance >= +_amountSpoT ? (
            <>
              {" "}
              {staqeLoad ? (
                <Spin
                  size="large"
                  indicator={antIcon}
                  className="add-spinner"
                />
              ) : (
                <button
                  style={{ fontFamily: `'Plus Jakarta Sans', sans-serif` }}
                  className="font-sans w-64 cursor-pointer text-md rounded-lg text-center focus:ring-2 focus:ring-blue-500 border-lime-300 border-2 text-lime-300 bg-black py-2 "
                  type="button"
                  onClick={() => HandleStaQe()}
                >
                  Stake
                </button>
              )}
            </>
          ) : (
            <>
              {" "}
              {approveLoad ? (
                <Spin
                  size="large"
                  indicator={antIcon}
                  className="add-spinner"
                />
              ) : (
                <button
                  style={{ fontFamily: `'Plus Jakarta Sans', sans-serif` }}
                  className="font-sans w-64 cursor-pointer text-md rounded-lg text-center border-lime-300 border-2 text-lime-300 bg-black py-2 px-4 sm:px-5 md:px-5"
                  type="button"
                  onClick={() => Approve()}
                >
                  Approve
                </button>
              )}
            </>
          )}

          <div className="flex-row justify-center my-3 items-center">
            {unstaqeLoad ? (
              <Spin size="large" indicator={antIcon} className="add-spinner" />
            ) : (
              <>
                {owned &&
                Number(GAllowance) <
                  Number(Number(userdetails[0].toString()) / 10 ** 18) ? (
                  <>
                    {gspotLoad ? (
                      <Spin
                        size="large"
                        indicator={antIcon}
                        className="add-spinner"
                      />
                    ) : (
                      <button
                        style={{ fontFamily: `'Plus Jakarta Sans', sans-serif` }}
                        className="font-sans w-64 cursor-pointer text-md rounded-lg text-center border-lime-300 border-2 text-lime-300 bg-black py-2 px-4 sm:px-5 md:px-5"
                        type="button"
                        onClick={() => ApproveGspot()}
                      >
                        Approve Gspot
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {unstaqeLoad ? (
                      <Spin
                        size="large"
                        indicator={antIcon}
                        className="add-spinner"
                      />
                    ) : (
                      <>
                        {" "}
                        <button
                          onClick={() => HandleUnStaQe()}
                          style={{ fontFamily: `'Plus Jakarta Sans', sans-serif` }}
                          className="font-sans cursor-pointer w-64 text-md rounded-lg text-center focus:ring-2 focus:ring-blue-500 border-lime-300 border-2 text-lime-300 bg-black py-2 px-4 sm:px-5 md:px-5"
                          type="button"
                        >
                          UnStake
                        </button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          <h2 className="text-lg text-red-600 w-80 mx-auto mb-2">
            Unstaking before unlock time reaches 0 has a early withdraw fee
          </h2>
          <div className="flex flex-col justify-center items-center">
            {Number(unlocktime?.toString()) !== 0 &&
            Number(unlocktime?.toString()) < currentTime &&
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
                    className="font-sans ml-2 cursor-pointer text-md rounded-lg text-center focus:ring-2 focus:ring-blue-500 bg-yellow-500 border-lime-300 border-2 text-lime-300 py-2 px-5 sm:px-10 md:px-10 lg:px-10"
                    type="button"
                  >
                    Switch to Perpetual
                  </button>
                )}
              </>
            ) : (
              <></>
            )}
            {owned ? (
              <>
                {unlockLoad ? (
                  <Spin
                    size="large"
                    indicator={antIcon}
                    className="add-spinner"
                  />
                ) : (
                  <>
                    {" "}
                    {owned && ownedTill == 32503680000 ? (
                      <button
                        onClick={() => RequestUnlock()}
                        style={{ fontFamily: `'Plus Jakarta Sans', sans-serif` }}
                        className="font-sans mt-3 cursor-pointer text-md rounded-lg text-center focus:ring-2 focus:ring-blue-500 bg-yellow-500 border-lime-300 border-2 text-lime-300 py-2 px-4 sm:px-5 md:px-5"
                        type="button"
                      >
                        Request Unlock
                      </button>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </>
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
            {spotstaked > 0 && !owned && unlocktime <= currentTime ? (
              <h1 className="text-white text-md">
                Your Regular Stake has ended
              </h1>
            ) : (
              <></>
            )}
          </div>
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
            Staked Spot: <br />{" "}
            {userdetails
              ? (Number(userdetails[0].toString()) / 10 ** 18).toFixed(3)
              : 0}{" "}
            Spot
          </h2>

        <>
          {owned ? (<></>
          ) : (
            <div className={"text-white text-sm mx-auto"}>
              {" "}
              <h2 className="text-white md:w-40 text-md px-2">
                Time Until Unlock:{" "}
              </h2>
              <p>Hours: {hours}</p>
              <p>Minutes: {minutes}</p>
              <p>Seconds: {seconds}</p>
            </div>
          )}
        </>
          <h2 className="text-white md:w-40 text-sm px-2">
            Your Pool %: <br />{" "}
            {userdetails
              ? (
                  (Number(userdetails[0].toString()) /
                    10 ** 18 /
                    totalspotStaked) *
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

/*

          <h2 className="text-white md:w-40 text-sm  px-2 py-2">
            Time Until Unlock:{" "}
            {owned == false ? (
              <>
                {" "}
                {unlocktime && unlocktime > currentTime
                  ? Number(unlocktime.toString()) -
                      Number(currentTime.toString()) >
                    0
                    ? Number(unlocktime.toString()) -
                      Number(currentTime.toString())
                    : "0"
                  : "0"}{" "}
                Seconds
              </>
            ) : (
              <>
                {" "}
                {ownedTill && ownedTill > currentTime
                  ? Number(ownedTill.toString()) -
                      Number(currentTime.toString()) >
                    0
                    ? Number(ownedTill.toString()) -
                      Number(currentTime.toString())
                    : "0"
                  : "0"}{" "}
                Seconds
              </>
            )}
          </h2>
            */

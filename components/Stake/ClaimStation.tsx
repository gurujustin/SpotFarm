import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import { Tooltip } from "react-tooltip";
import {
  useAccount,
  useNetwork,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { LoadingOutlined } from "@ant-design/icons";
import arrow from "../../public/arrow.png";
import LPTokenAbi from "../../contracts/abi/LPTokenAbi.json";
import { abiObject } from "../../contracts/abi/abi.mjs";
import Image from "next/image";
import { LPStakingabiObject } from "../../contracts/abi/LpStakingAbi.mjs";
import Swal from "sweetalert2";

export default function ClaimStationComponent() {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const LPtokenContract = "0xc0e1cB42ec3e2dC239F080a2C98659f58CBce9ED";
  const spotAddress = "0x53020F42f6Da51B50cf6E23e45266ef223122376";
  const StaqeFarm = "0xaf894A45DF2ee09Df961D159F5371d1bebe02a58";
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  let { chain } = useNetwork();

  let current_chain = chain?.id;
  let [pendingRewards, setPendingRewards]: any = useState();
  const [pendingLP, setPendingLP]: any = useState(0);
  const [_amountSpoT, set_amountSpoT] = useState(0);
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

  const { data: PendingLPRewards } = useContractRead({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "checkEstMilQRewards",
    watch: true,
    chainId: current_chain,
    args: [address],
    onSuccess(data: any) {
      setPendingLP(Number(data.toString()) / 10 ** 18);
    },
  });

  const { data: PendingRewards } = useContractRead({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "viewHowMuchMilk",
    watch: true,
    chainId: current_chain,
    args: [address],
    onSuccess(data: any) {
      setPendingRewards(Number(data.toString()) / 10 ** 18);
    },
  });
  let [userdetails, setUserDetails]: any = useState();

  let [pendingrewardsaddon, setPendingRewardsAddon]: any = useState();
  let [Spotpendingrewardsaddon, setSpotPendingRewardsAddon]: any = useState();
  const [qompounded, setQompounded]: any = useState();

  const { data: UserDetails } = useContractRead({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "SpoTerParlours",
    chainId: current_chain,
    watch: true,
    args: [address],
    onSuccess(data: any) {
      setUserDetails(data);
      setQompounded(Number(data[6].toString()) / 10 ** 18);
      setSpotPendingRewardsAddon(Number(data[5].toString()) / 10 ** 18);
    },
  });
  function FetchDetails() {
    UserDetails;
    PendingRewards;
    PendingLPRewards;
  }

  const [unlocktime, setUnlockTime]: any = useState();

  function FetchBalances() {
    BalanceOfSpot;
    BalanceOfMilq;
  }
  useEffect(() => {
    FetchDetails();
    FetchBalances();
  }, []);

  const { write: Qompound } = useContractWrite({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    chainId: current_chain,
    functionName: "QompoundSpoT",
    args: [10],
    account: address,
    onSuccess(data) {
      Swal.fire({
        icon: "success",
        title: "you have successfully Qompounded",
      });
      FetchDetails();
    },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with Qompounding unlock please contact support if issue perists${err.cause}`,
      });
    },
  });

  const { write: ClaimLP, isLoading } = useContractWrite({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    chainId: current_chain,
    functionName: "shipSpoTersMilQ",
    account: address,
    onSuccess(data) {
      Swal.fire({ icon: "success", title: "you have successfully ClaimedLP" });
      setLoading(true);
    },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with Claiming please contact support if issue perists${err.cause}`,
      });
    },
  });

  const { write: Claim } = useContractWrite({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    chainId: current_chain,
    functionName: "shipMilk",
    account: address,
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
  const [isHovered, setIsHovered] = useState(false);

  const boxStyles = {
    boxShadow: isHovered
      ? "inset 6px 10px 0px -8px #FFFFFF, inset 6px -12px 0px -8px #FFFFFF, inset 17px -12px 0px -8px #FFFFFF, inset -38px 4px 0px -30px #FFFFFF, inset -38px 4px 0px -30px #FFFFFF"
      : "none",
    fontFamily: `'Plus Jakarta Sans', sans-serif` ,
    textShadow: "0px 0px 6px rgba(255,255,255,0.8)",
    background: "transparent",
    transition: "box-shadow 0.3s ease-in-out",
  };

  return (
    <>
      <div
        style={{
          background:
            "linear-gradient(to bottom, #3C3C3C 0%, #000000 100%, #000000 100%)",
        }}
        className={"w-fit mx-auto flex flex-col justify-center"}
      >
        <h1
          className="text-xl mb-2 bg-black font-bold w-full mx-auto md:text-xl lg:text-3xl font-normal text-black"
          style={{
            fontFamily: `'Plus Jakarta Sans', sans-serif` ,
            textShadow: "0px 0px 6px rgba(255,255,255,0.8)",
            background: "transparent",
          }}
        >
          Qlaiming Station
        </h1>
        <h2
          style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
          className={
            "text-xl border border-white rounded-xl w-fit mx-auto text-white px-4 py-2"
          }
        >
          SPOT bought and StaQed if Qompounded: <br /> 54,445 SPOT
        </h2>

        <div className={"flex flex-row mx-auto my-2"}>
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
            className={
              "text-xl border border-white rounded-xl text-white px-4 py-2"
            }
          >
            Eth Claimable:
          </h2>
          <p className={"mx-2"}></p>
          <div className={"w-fit h-fit bg-white rounded-full self-center"}>
            <Image src={arrow} alt="arrow"></Image>
          </div>
          <p className={"mx-2"}></p>
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
            className={
              "text-xl border border-white rounded-xl text-white px-4 py-2"
            }
          >
            SPOT Bought:
          </h2>
        </div>
        <ul className={styles.ul}>
          <button
            style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
            className={`${styles.button} w-40 my-2 cursor-pointer text-lg rounded-xl text-center focus:ring-2 focus:ring-blue-500
           border-white border-2 text-white border border-yellow-400 rounded-xl py-2 px-4 sm:px-5 md:px-5`}
            onClick={() => Qompound()}
            type="button"
          >
            Qompound
          </button>
        </ul>

        <div className={"grid grid-cols-2 gap-4 mx-auto"}>
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
            className="text-white mb-2 md:w-40 border border-white rounded-xl px-2 py-2"
            onMouseEnter={() => {}}
          >
            Claimable ETH <br />{" "}
            {pendingRewards
              ? (
                  pendingRewards +
                  pendingrewardsaddon +
                  Spotpendingrewardsaddon
                ).toFixed(8)
              : "0"}
          </h2>
          <button
            style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
            className="text-white mb-2 md:w-40 border border-white rounded-xl px-2 py-2"
          >
            Claimable LP <br /> {pendingLP ? pendingLP.toFixed(8) : "0"}
          </button>

          <button
            style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
            className={`${styles.button} my-2 cursor-pointer text-lg rounded-xl text-center focus:ring-2 focus:ring-blue-500 
            text-white border-2 border-yellow-400 rounded-xl py-2 px-4 sm:px-5 md:px-5`}
            type="button"
          >
            Claim ETH
          </button>
          <button
            style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
            className={`${styles.button} my-2 cursor-pointer text-lg rounded-xl text-center focus:ring-2 focus:ring-blue-500
            text-white border-2 border-yellow-400 rounded-xl py-2 px-4 sm:px-5 md:px-5`}
            type="button"
          >
            Claim LP
          </button>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-azonix text-white border-b-2 border-white text-center text-shadow-md">
        --------------------BREAK-----------------------
      </h1>

      <div className="w-fit px-3 py-3 mx-4 md:mx-auto justify-center rounded-2xl opaacity-90 bg-gradient-to-b from-gray-700 to-black">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-azonix text-white text-center text-shadow-md">
          Qlaiming Station
        </h1>
        <h2 className="text-xl md:text-2xl text-white text-center font-bebas-neue border rounded-xl border-white px-4 py-2 my-4 bg-gray-800 shadow-lg">
          SPOT bought and StaQed if Qompounded: <br /> 54,445 SPOT
        </h2>

        <div className="flex items-center justify-center my-4">
          <h2 className="text-xl md:text-2xl text-white font-bebas-neue border rounded-xl border-white px-4 py-2 bg-gray-800 shadow-lg">
            Eth Claimable:
          </h2>
          <div className="w-8 h-8 bg-white rounded-full mx-2 hover:rotate-90 transition-transform duration-300">
            <Image src={arrow} alt="arrow" />
          </div>
          <h2 className="text-xl md:text-2xl text-white font-bebas-neue border rounded-xl border-white px-4 py-2 bg-gray-800 shadow-lg">
            SPOT Bought:
          </h2>
        </div>
        <ul className={styles.ul}>
          <button
            className={`w-40 my-2 text-lg text-white rounded-xl text-center focus:ring-2 focus:ring-blue-500 border-2 border-white border-yellow-400 rounded-xl py-2 px-4 sm:px-5 md:px-5 ${styles.button} bg-gray-900 hover:bg-gray-700 transform hover:scale-105 transition-transform duration-300`}
            onClick={() => Qompound()}
            type="button"
          >
            Qompound
          </button>
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
          <h2 className="text-white text-center font-bebas-neue border rounded-xl border-white px-4 py-2 mb-4 bg-gray-800 shadow-lg">
            Claimable ETH <br />
            {pendingRewards
              ? (
                  pendingRewards +
                  pendingrewardsaddon +
                  Spotpendingrewardsaddon
                ).toFixed(8)
              : "0"}
          </h2>
          <button className="text-white text-center font-bebas-neue border rounded-xl border-white px-4 py-2 mb-4 bg-gray-800 shadow-lg
           transition-transform duration-300">
            Claimable LP <br /> {pendingLP ? pendingLP.toFixed(8) : "0"}
          </button>

          <button
            className={`my-2 text-lg text-white rounded-xl text-center focus:ring-2 focus:ring-blue-500 border-2 border-white border-yellow-400 rounded-xl py-2 px-4 sm:px-5 md:px-5 ${styles.button} bg-gray-900 hover:bg-gray-700 transform hover:scale-105 transition-transform duration-300`}
            type="button"
          >
            Claim ETH
          </button>
          <button
            className={`my-2 text-lg text-white rounded-xl text-center focus:ring-2 focus:ring-blue-500 border-2 border-white border-yellow-400 rounded-xl py-2 px-4 sm:px-5 md:px-5 ${styles.button} bg-gray-900 hover:bg-gray-700 transform hover:scale-105 transition-transform duration-300`}
            type="button"
          >
            Claim LP
          </button>
        </div>
      </div>
    </>
  );
}

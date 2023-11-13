import { Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  usePublicClient,
  useAccount,
  useContractWrite,
  useContractRead,
  useNetwork,
} from "wagmi";
import spotabi from "../../contracts/abi/abi.json";
import { LoadingOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LPTokenAbi from "../../contracts/abi/LPTokenAbi.json";
import SpotStakeModal from "./SpotStakeModal";
import LpStakeModal from "./LpStakeModal";
import { LPabiObject } from "../../contracts/abi/LPTokenAbi.mjs";
import { abiObject } from "../../contracts/abi/abi.mjs";
import { LPStakingabiObject } from "../../contracts/abi/LpStakingAbi.mjs";
import Swal from "sweetalert2";
import ClaimStationComponent from "./ClaimStation";
export default function NewStakeComponent(_token: any) {
  const publicClient = usePublicClient();
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const LPtokenContract = "0xc0e1cB42ec3e2dC239F080a2C98659f58CBce9ED";
  const spotAddress = "0x53020F42f6Da51B50cf6E23e45266ef223122376";
  const StaqeFarm = "0xaf894A45DF2ee09Df961D159F5371d1bebe02a58";
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  let { chain } = useNetwork();

  let current_chain = chain?.id;
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

  const [isLpStakeOpen, setIsLpStakeOpen] = useState(true); // Initial state for LP Stake
  const [isSpotStakeOpen, setIsSpotStakeOpen] = useState(false); // Initial state for SPOT Stake

  const toggleModals = () => {
    setIsLpStakeOpen(!isLpStakeOpen);
    setIsSpotStakeOpen(!isSpotStakeOpen);
  };

  let [pendingRewards, setPendingRewards]: any = useState();
  const [pendingLP, setPendingLP]: any = useState(0);

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
      setlpstaked(Number(data[0].toString()) / 10 ** 18);
      setQompounded(Number(data[6].toString()) / 10 ** 18);
      setUnlockTime(Number(data[2].toString()));
      setSpotPendingRewardsAddon(Number(data[5].toString()) / 10 ** 18);
    },
  });

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
  const [finalUserLockTime, setfinalUserLockTime]: any = useState();

  let [milqerUserDetails, setMilqerUserDetails]: any = useState();
  const { data: MilqerUserDetails } = useContractRead({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "MilQerParlours",
    chainId: current_chain,
    watch: true,
    args: [address],
    onSuccess(data: any) {
      setMilqerUserDetails(data);
      setlpstaked(Number(data[0].toString()) / 10 ** 18);
      setQompounded(Number(data[6].toString()) / 10 ** 18);
      setUnlockTime(Number(data[2].toString()));
    },
  });

  let [userLPDetails, setUserLPDetails]: any = useState();

  const { data: UserDetailsLP } = useContractRead({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "MilQerParlours",
    chainId: current_chain,
    watch: true,
    args: [address],
    onSuccess(data: any) {
      setUserLPDetails(data);
      setPendingRewardsAddon(Number(data[6].toString()) / 10 ** 18);
    },
  });

  let [totalspotStaked, settotalSpotStaked] = useState(0);
  const { data: daisys } = useContractRead({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    watch: true,
    functionName: "daisys",
    chainId: current_chain,
    onSuccess(data: any) {
      settotalSpotStaked(Number(data.toString()) / 10 ** 18);
    },
  });

  const [index, setTheIndex] = useState(0);

  const { data: totalVitaliksMilkShipments } = useContractRead({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    watch: true,
    functionName: "totalVitaliksMilkShipments",
    chainId: current_chain,
    onSuccess(data: any) {
      setTheIndex(Number(data.toString()));
    },
  });

  let [Spotapr, setSpotapr]: any = useState(0);
  let [LPapr, setLPapr]: any = useState(0);

  const { data: VitaliksMilkShipments } = useContractRead({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "VitaliksMilkShipments",
    chainId: current_chain,
    watch: true,
    args: [index ? index : 1],
    onSuccess(data: any) {
      setSpotapr(Number(data[1].toString()) / 10 ** 18);
      setLPapr(Number(data[2].toString()) / 10 ** 18);
    },
  });
  const [pendinglp, setpendinglp]: any = useState();
  const { data: CheckMilQrewards } = useContractRead({
    address: StaqeFarm,
    abi: LPStakingabiObject,
    functionName: "checkEstMilQRewards",
    chainId: current_chain,
    watch: true,
    args: [address],
    onSuccess(data: any) {
      setpendinglp(Number(data.toString()) / 10 ** 18);
    },
  });

  function FetchDetails() {
    UserDetails;
    PendingRewards;
    PendingLPRewards;
    CheckMilQrewards;
    daisys;
    VitaliksMilkShipments;
    totalVitaliksMilkShipments;
    UserDetailsLP;
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
        title: `An error occured with Compounding unlock please contact support if issue perists${err.cause}`,
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
  return (
    <>
      <div className={"flex flex-col"}>
        <h1
          className="text-3xl mb-2 mt-16 md:text-4xl lg:text-4xl font-semibold text-white"
          style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
        >
          Staking
        </h1>
        <div
          style={{ border: "solid 1px #00e9f9" }}
          className={
            "flex flex-col self-center rounded-xl w-fit h-fit px-2 mx-2 md:px-10 pt-10 pb-5 opacity-90"
          }
        >
          <h1
            className="text-xl mb-2 md:text-xl lg:text-2xl font-semibold text-white"
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
          >
            User Statistics
          </h1>
          <div
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className=" mt-5 opacity-90 transition-all duration-300 py-3"
          >
            <div
              className={
                "text-md grid grid-cols-3 col-span-2 gap-2 px-3 py-3 mx-auto"
              }
            >
              <h2
                style={{
                  boxShadow: "inset 0px 0px 15px -5px rgba(255,255,255,0.6)",
                }}
                className="text-white mb-2 md:w-40 border border-white px-2 py-2"
              >
                LP In wallet <br /> {MilqBalance ? MilqBalance.toFixed(2) : "0"}{" "}
                LP Tokens
              </h2>
              <h2
                style={{
                  boxShadow: "inset 0px 0px 15px -5px rgba(255,255,255,0.6)",
                }}
                className="text-white mb-2 md:w-40 border border-white  px-2 py-2"
              >
                Spot in wallet <br />{" "}
                {spotBalance ? spotBalance.toFixed(2) : "0"} Spot
              </h2>
              <h2
                style={{
                  boxShadow: "inset 0px 0px 15px -5px rgba(255,255,255,0.6)",
                }}
                className="text-white mb-2 md:w-40 border border-white  px-2 py-2"
              >
                Eth Per Day LP Staking
                <br />{" "}
                {LPapr && userLPDetails
                  ? (
                      LPapr *
                      (Number(userLPDetails[0].toString()) / 10 ** 18) *
                      86400
                    ).toFixed(8)
                  : "0"}
              </h2>
              <h2
                style={{
                  boxShadow: "inset 0px 0px 15px -5px rgba(255,255,255,0.6)",
                }}
                className="text-white mb-2 md:w-40 border border-white  px-2 py-2"
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
              <h2
                style={{
                  boxShadow: "inset 0px 0px 15px -5px rgba(255,255,255,0.6)",
                }}
                className="text-white mb-2 md:w-40 border border-white  px-2 py-2"
              >
                ETH Per 24hr
                <br />{" "}
                {Spotapr && userdetails
                  ? (
                      Spotapr *
                      (Number(userdetails[0].toString()) / 10 ** 18) *
                      86400
                    ).toFixed(8)
                  : "0"}
              </h2>

              <h2
                style={{
                  boxShadow: "inset 0px 0px 15px -5px rgba(255,255,255,0.6)",
                }}
                className="text-white mb-2 md:w-40 border border-white  px-2 py-2"
              >
                Claimable LP <br /> {pendingLP ? pendingLP.toFixed(8) : "0"}
              </h2>
              <button
                onClick={() => Claim()}
                style={{ fontFamily: `'Plus Jakarta Sans' sans-serif` }}
                className="font-sans cursor-pointer text-base rounded-lg text-center focus:ring-2 focus:ring-blue-500 border-lime-300 border-2 text-lime-300 py-2 px-4 sm:px-5 md:px-5"
                type="button"
              >
                Claim My ETH
              </button>
              <button
                disabled={
                  pendingRewards +
                    pendingrewardsaddon +
                    Spotpendingrewardsaddon ==
                  0
                }
                onClick={() => Qompound()}
                style={{ fontFamily: `'Plus Jakarta Sans' sans-serif` }}
                className="font-sans cursor-pointer text-base rounded-lg text-center focus:ring-2 focus:ring-blue-500 border-lime-300 border-2 text-lime-200 bg-black py-2 px-4 sm:px-5 md:px-5"
                type="button"
              >
                Compound
              </button>

              {isLoading ? (
                <Spin
                  size="large"
                  indicator={antIcon}
                  className="add-spinner"
                />
              ) : (
                <>
                  {pendinglp > 0 ? (
                    <button
                      onClick={() => ClaimLP()}
                      style={{ fontFamily: `'Plus Jakarta Sans' sans-serif` }}
                      className="font-sans cursor-pointer text-base rounded-lg text-center focus:ring-2 focus:ring-blue-500 border-lime-200 border-2 text-lime-200 bg-black py-2 px-4 sm:px-5 md:px-5"
                      type="button"
                    >
                      Claim My LP
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        Swal.fire({
                          icon: "error",
                          title: `You do not have LP to Claim at this time`,
                        })
                      }
                      style={{ fontFamily: `'Plus Jakarta Sans' sans-serif` }}
                      className="font-sans cursor-pointer text-base rounded-lg text-center focus:ring-2 focus:ring-blue-500 border-lime-300 border-2 text-lime-300 bg-black py-2 px-4 sm:px-5 md:px-5"
                      type="button"
                    >
                      Claim My LP
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <p className={"mt-12 mb-5"}></p>
          <div
            className={"mx-auto self-center justify-center top-0 flex flex-col"}
          >
            <div
              style={{
                background:
                  "linear-gradient(to bottom, #58be10 0%, #58be10 100%, #fff 100%)",
              }}
              className={`flex absolute ml-96 -translate-x-72 -translate-y-80 md:-translate-y-80 md:-translate-x-52 z-20 h-12 w-52 mb-32 rounded-full bg-white ${
                isLpStakeOpen ? "bg-white" : ""
              }`}
            >
              <div
                className={`z-0 absolute top-0 left-0 w-1/2 h-full bg-white rounded-full text-black transition-transform ${
                  isLpStakeOpen
                    ? "transform translate-x-0 duration-300"
                    : "transform translate-x-full duration-300"
                }`}
              ></div>
              <button
                style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
                className={`z-10 absolute text-md top-0 right-0 w-1/2 h-full rounded-full text-black transition-transform ${
                  isSpotStakeOpen ? "" : "text-white"
                }`}
                onClick={() => {
                  toggleModals();
                }}
              >
                SPOT Stake
              </button>
              <button
                style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
                className={`z-10 absolute text-md top-0 w-1/2 h-full rounded-full text-black transition-transform ${
                  isSpotStakeOpen ? "text-white" : ""
                }`}
                onClick={() => {
                  toggleModals();
                }}
              >
                LP Stake
              </button>
            </div>
            <p className={"my-6"}></p>
            {isLpStakeOpen ? (
              <LpStakeModal
                isOpen={true}
                onClose={() => setIsLpStakeOpen(false)}
              />
            ) : (
              <SpotStakeModal
                isOpen={true}
                onClose={() => setIsSpotStakeOpen(false)}
              />
            )}
          </div>
      </div>

      {/*
      <div className="fixed mb-10 px-2 sm:px-5 md:px-10 lg:px-10 left-0 bottom-0 bg-transparent  w-full  grid grid-cols-2 ">
        <p
          className="text-black text-[18px] sm:text-[15px] md:text-[15px] lg:text-[16px]
        col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1 "
          style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
        >
          SPOTGROUP.IO
        </p>
        <p
          className="text-black text-[12px] sm:text-[15px] md:text-[15px] lg:text-[16px]
        col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1"
          style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
        >
          SPOTGROUP2023
        </p>
      </div>
      */}
    </>
  );
}


       {/*
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className=" w-fit mb-2 mx-auto text-3xl text-gray-400 opacity-90"
          >
            Account Summary
          </h2>{" "}
        <div
          className={
            "bg-black text-xl w-full grid grid-cols-2 col-span-4 mb-4 opacity-90 rounded-2xl border border-white text-white px-16 py-4 mx-auto"
          }
        >
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-left border-b border-white px-2"
          >
            SPOT Balance:
          </h2>{" "}
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-right border-b border-white px-2"
          >
            {spotBalance ? spotBalance.toFixed(2) : "0"} SPOT
          </h2>

          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-left border-b border-white px-2"
          >
            LP Balance:
          </h2>{" "}
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-right border-b border-white px-2"
          >
            {MilqBalance ? MilqBalance.toFixed(2) : "0"}{" "} LP
          </h2>


          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-left border-b border-white px-2"
          >
            SPOT StaQed:
          </h2>{" "}
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-right border-b border-white px-2"
          >
                 {userdetails
              ? (Number(userdetails[0].toString()) / 10 ** 18).toFixed(3)
              : 0}{" "}
            SPOT
          </h2>

          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-left border-b border-white px-2"
          >
            LP StaQed:
          </h2>{" "}
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-right border-b border-white px-2"
          >

            {milqerUserDetails ? Number(milqerUserDetails[0].toString()) / 10 ** 18 : 0} LP
          </h2>
        </div>

        <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className=" w-fit mb-2 mx-auto text-2xl text-gray-200 opacity-90"
          >
            Claimable Balances
          </h2>{" "}
        <div
          className={
            "bg-black text-xl w-full grid grid-cols-2 col-span-4 mb-4 opacity-90 rounded-2xl border border-white text-white px-16 py-4 mx-auto"
          }
        >
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-left border-b border-white px-2"
          >
            ETH Claimable (LP & SPOT):
          </h2>{" "}
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-right border-b border-white px-2"
          >
            {spotBalance ? spotBalance.toFixed(2) : "0"} ETH
          </h2>

          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-left border-b border-white px-2"
          >
            LP Claimable:
          </h2>{" "}
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-right border-b border-white px-2"
          >
            {pendingLP ? pendingLP.toFixed(8) : "0"} ETH
          </h2>
        </div>

        <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className=" w-fit mb-2 mx-auto text-2xl text-gray-200 opacity-90"
          >
            Earnings Summary
          </h2>{" "}
        <div
          className={
            "bg-black text-xl w-full grid grid-cols-2 col-span-4 mb-4 opacity-90 rounded-2xl border border-white text-white px-16 py-4 mx-auto"
          }
        >
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-left border-b border-white px-2"
          >
            ETH Earned (Spot + LP) Per 24hr:
          </h2>{" "}
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-right border-b border-white px-2"
          >
             SPOT
          </h2>
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-left border-b border-white px-2"
          >
            ETH Earned SPOT Per 24hr:
          </h2>{" "}
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-right border-b border-white px-2"
          >
              {Spotapr && userdetails
                  ? (
                      Spotapr *
                      (Number(userdetails[0].toString()) / 10 ** 18) *
                      86400
                    ).toFixed(8)
                  : "0"} ETH
          </h2>
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-left border-b border-white px-2"
          >
            ETH Earned LP Per 24hr:
          </h2>{" "}
          <h2
            style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
            className="text-white text-right border-b border-white px-2"
          >
            {" "}
                {LPapr && userLPDetails
                  ? (
                      LPapr *
                      (Number(userLPDetails[0].toString()) / 10 ** 18) *
                      86400
                    ).toFixed(8)
                  : "0"} ETH
          </h2>
        </div>
                */}{" "}

import {
    LoadingOutlined,
    TwitterOutlined,
    YoutubeOutlined,
} from "@ant-design/icons";
import {Spin} from "antd";
import React, {useEffect, useRef, useState} from "react";
import styles from "../../styles/Home.module.css";
import logoImage from "../../assets/images/q.png";
import discordIcon from "../../assets/images/telegram2.png";
import SpotLogo from "../../public/SpotLogoNorm.png";
import telegram from "../../public/telegram.png"
import "tailwindcss-elevation";
import HeaderComponent from "../../components/Header/HeaderComponent";
import Image from "next/image";
import StakingComponent from "./StakingComponent";
import {useRouter} from "next/router";
//import StakingOverview from "./staking-overview";
import {useAccount, usePublicClient, useWalletClient} from "wagmi";

const Staking = () => {
    const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;
    const [connected, setConnected] = useState(false);
    const router = useRouter();
    const {address, isConnected} = useAccount()


    useEffect(() => {
        if (address) {
            router.push("/dapp/staking-overview");
        }
    }, [address, router]);

    return (
        <div
            className="z-10 absolute flex flex-col justify-center items-center w-[350px] sm:w-[350px] md:w-[550px] lg:w-[650px]  ">
            <div className="flex justify-center -mt-20 items-center self-center">
                <Image
                    src={SpotLogo}
                    alt="Logo"
                    width={300}
                    height={300}
                    className="self-center  "
                />
            </div>
            <h1
                className="text-white font-sans flex justify-center mb-5 text-center items-center text-[30px]"
                style={{fontFamily: `'Plus Jakarta Sans', sans-serif`}}
            >
                Please Connect your wallet
            </h1>
            <div className="flex flex-row mb-5 justify-center items-center space-x-10">
                <a
                    href="https://youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <YoutubeOutlined style={{fontSize: 24, color: "white"}}/>
                </a>
                <a
                    href="https://x.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <TwitterOutlined style={{fontSize: 24, color: "white"}}/>
                </a>

                <a
                    href="https://t.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        src={telegram}
                        alt="telegram"
                        style={{color: "white"}}
                        width={22} // Set the desired width
                        height={22}
                    />
                </a>
            </div>
        </div>
    );
};

export default Staking;

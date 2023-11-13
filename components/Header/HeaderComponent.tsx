import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// interfaces
import { MenuDataItem } from "../../interfaces/Header/MenuDataItem.interface";

// static data
import { HeaderMenuData } from '../../static/HeaderMenuData';

// images
import MENUBar from "../../assets/images/menuBars.png";
import SPOTLogo from "../../assets/images/logoNew.png";

// styles
import styles from './Header.module.css';


export default function HeaderComponent() {
  const headerRef = useRef<any>(null);
  const [mobileMenuHidden, setMobileMenuHidden] = useState(true);
  const dropDownRef = useRef<HTMLUListElement>(null);
  const { asPath } = useRouter();

  const manageMenuVisibility = () => {
    setMobileMenuHidden((prevState) => !prevState);
  }

  useEffect(() => {
    /**
     * Check if click happened outside the ref element and do something if it did
     */
    function handleClickOutside(event: any) {
      const refItem = dropDownRef.current;
      if (refItem && !refItem.contains(event.target as HTMLElement)) {
        // close menu if clicked outside the dropdown menu
        manageMenuVisibility();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDownRef]);

  return (
    <>
      <nav className={classNames(`flex p-4 relative z-20 w-full justify-between items-center ${styles.navbar}`)}>
        <Link href={'/'}>
          <Image
            className="self-center "
            height={50}
            src={SPOTLogo}
            alt="asa"
          ></Image>
        </Link>
        <ConnectButton />
        <div className="flex transition-all flex-col items-center">
          <div
            onClick={manageMenuVisibility}
            className="bg-purplegif rounded-full w-fit px-2"
            ref={headerRef}
          >
            <Image
              className={`text-black transition-all duration-300 cursor-pointer`}
              height={35}
              width={35}
              src={MENUBar}
              alt={""}
            />
          </div>
          <div
            className={`relative dropdown-container w-fit h-fit opacity-${mobileMenuHidden ? 0 : 100} transition-all duration-300`}
          >
            {!mobileMenuHidden ? (
              <ul className="absolute top-0 right-0 text-xl text-white rounded-xl px-2 py-2 bg-[#131313]" ref={dropDownRef}>
                {
                  HeaderMenuData.map((item: MenuDataItem) => {
                    const { route: menuItemRoute, title, target } = item;
                    let conditionalAttrs = {};
                    if (target?.length) {
                      conditionalAttrs = { target };
                    }
                    return (
                      <li
                        className={classNames("pt-1 border-2 border-transparent hover:border-b-2 hover:border-b-gray-300 text-[16px] text-center", { ['border-b-gray-300']: asPath === menuItemRoute })}
                        key={title}
                      >
                        <Link href={menuItemRoute} {...conditionalAttrs}>{title}</Link>
                      </li>
                    )
                  })
                }
              </ul>) : null}
          </div>
        </div>
      </nav>
    </>
  );
}

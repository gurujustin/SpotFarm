import React, { PropsWithChildren } from "react";

// components
import HeaderComponent from "./Header";
// import BackgroundVideo from "./BackgroundVideo";

// styles
import styles from "../styles/Home.module.css";

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <HeaderComponent />
            <main>
                {children}
            </main>

        </>
    );
};
export default Layout;

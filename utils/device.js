import { isSafari } from "react-device-detect";

export const deviceBrowserWindowWidth = () => {
    switch (true) {
        case isSafari:
            return document.documentElement.clientWidth || document.body.clientWidth;
        default:
            return global.innerWidth;
    }
}

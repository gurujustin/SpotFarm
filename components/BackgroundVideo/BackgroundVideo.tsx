'use client'

import React, {useRef, useState, useEffect, useMemo} from 'react';
import { useRouter } from 'next/router';
import { throttle } from 'lodash';

// utils
import { deviceBrowserWindowWidth } from '../../utils/device';

const BackgroundVideo = () => {
    const { asPath } = useRouter();
    const wW = deviceBrowserWindowWidth();
    const [windowWidth, setWindowWidth] = useState(wW);
    const [videoSrc, setVideoSrc] = useState('');
    const videoRef = useRef(null);
    const windowResizeThrottleHandler = useMemo(() => throttle(() => setWindowWidth(deviceBrowserWindowWidth()), 500), []);


    useEffect(() => {
        // Add window resize event listeners
        global.addEventListener('resize', windowResizeThrottleHandler);
        return () => {
            global.removeEventListener('resize', windowResizeThrottleHandler);
        }
    }, []);

    useEffect(() => {
        // based on window width and route changes set correct video source
       const isHome = asPath === '/';
       let src = '';

       switch (true) {
           case isHome && windowWidth > 800:
               src = '/SpotDesktopBG.mp4';
               break;
           case isHome && windowWidth <= 800:
               src = '/SpotMobileBG.mp4';
               break;
           case !isHome && windowWidth > 800:
               src = '/SpotDesktopNew.mp4';
               break;
           default:
               src = '/SpotMobileNew.mp4';
       }

       setVideoSrc(src);
    }, [windowWidth, asPath]);

    useEffect(() => {
        // on videoSrc value change reload the video
        const videoElem: HTMLVideoElement = videoRef.current!;

        if (videoElem !== null && videoSrc.length) {
            videoElem.setAttribute('src', videoSrc);
            videoElem.load();
            videoElem.play().catch((error: any) => {
                console.log("error attempting to play", error);
            });
        }

    }, [videoSrc])

    return (
        <div className="absolute inset-0 overflow-hidden video-container">
            <video
                ref={videoRef}
                className="top-0 left-0 min-w-full min-h-full absolute object-cover"
                playsInline
                autoPlay
                loop
                muted
            />
        </div>
    )
}

export default BackgroundVideo;

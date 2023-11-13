//import useScrollPosition from '@react-hook/window-scroll'
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Swal from "sweetalert2";
export default function FooterComponent() {
  const [hidden, sethidden] = useState(true);
  //const ScrollY = useScrollPosition()
  const [message, setmessage] = useState(String);
  const [emails, setemail] = useState(String);

  const SERVICE_ID = "service_pbjqier";
  const TEMPLATE_ID = "contact_form";
  const USER_ID = "iBjsKXibozEgEn3zJ";


  const form = React.useRef() as React.MutableRefObject<HTMLFormElement>;



  return (
    <div>
      <footer className="bg-gray-200 p-5 w-full h-full">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0"></div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Resources
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <Link href="https://linktr.ee/" className="hover:underline">
                    Link Tree
                    <br/>

                  </Link>
                </li>
              </ul>
            </div>
            <div>
            </div>
            <div>
              <ul className="text-gray-600 dark:text-gray-400">
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2023{" "}
            <Link href="/" className="hover:underline">
              BlockSpot
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

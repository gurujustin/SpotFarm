import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import error from "next/error";
import LpStakeTabMenu from "./LpStakeTabMenu";
const fourteenDayContractAddress = "0x7A8D1608327EdBdD5C4f1367fD6dD031F21AD7eb";
const LPtokenContract = "0xc0e1cB42ec3e2dC239F080a2C98659f58CBce9ED";

interface LPStakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LPStakeModal: React.FC<LPStakeModalProps> = ({ isOpen, onClose }) => {

    
  if (!isOpen) return null;

  return (
    <div
    style={{ fontFamily: `'Plus Jakarta Sans', sans-serif`  }}
    className="flex flex-col mx-auto justify-center py-6 px-3"
  >
    <LpStakeTabMenu _token={1} setToken={(value) => {1}} />

  </div>
  );
};

export default LPStakeModal;

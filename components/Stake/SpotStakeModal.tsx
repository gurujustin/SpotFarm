import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import TabMenu from "./SpotStakeTabMenu";
import SpotStakeTabMenu from "./SpotStakeTabMenu";


interface SpotStakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SpotStakeModal: React.FC<SpotStakeModalProps> = ({ isOpen, onClose }) => {

  if (!isOpen) return null;
  return (
    <div
      style={{ fontFamily: `'Plus Jakarta Sans' sans-serif`  }}
      className="flex flex-col mx-auto justify-center py-6 px-3"
    >
    <SpotStakeTabMenu _token={0} setToken={(value) => {0}} />
    </div>
  );
};

export default SpotStakeModal;

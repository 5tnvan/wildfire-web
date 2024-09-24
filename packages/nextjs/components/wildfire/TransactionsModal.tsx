import React, { useEffect, useRef, useState } from "react";

import { useGlobalState } from "@/services/store/store";
import { convertEthToUsd } from "@/utils/wildfire/convertEthToUsd";
import { fetchProfileFromWalletId } from "@/utils/wildfire/fetch/fetchProfile";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { formatEther } from "viem";

import { useOutsideClick } from "@/hooks/scaffold-eth";
import { useIncomingTransactions } from "@/hooks/wildfire/useIncomingTransactions";

import { TimeAgoUnix } from "./TimeAgo";

const TransactionsModal = ({ data, onClose }: any) => {
  const incomingRes = useIncomingTransactions(data.wallet_id);
  const price = useGlobalState(state => state.nativeCurrency.price);

  const [selectedTab, setSelectedTab] = useState("ethereum");
  const [profiles, setProfiles] = useState<{ [key: string]: any }>({});

  const insideRef = useRef(null);
  useOutsideClick(insideRef, () => {
    handleClose();
  });

  const handleClose = () => {
    onClose();
  };

  const fetchProfile = async (walletId: string) => {
    if (!profiles[walletId]) {
      const profile = await fetchProfileFromWalletId(walletId);
      setProfiles(prevProfiles => ({ ...prevProfiles, [walletId]: profile }));
    }
  };

  useEffect(() => {
    const allTransactions = [
      ...(incomingRes?.ethereumData?.paymentChanges || []),
      ...(incomingRes?.baseData?.paymentChanges || []),
    ];

    allTransactions.forEach(tx => {
      fetchProfile(tx.sender);
    });
  }, [incomingRes]);

  const renderTransactions = (transactions: any) => {
    if (transactions.length === 0) {
      return (
        <>
          <div className="flex flex-row justify-center items-center grow">
            <div className="btn bg-base-100">Be first to tip 🥳</div>
          </div>
        </>
      );
    }
    return transactions.map((tx: any) => (
      <div key={tx.id} className="rounded-lg shadow-md p-4 mb-4 bg-base-100">
        <div>
          <strong>From:</strong> {profiles[tx.sender]?.username || tx.sender}
        </div>
        <div>
          <strong>Message:</strong> {tx.newMessage}
        </div>
        <div>
          <strong>USD:</strong> {convertEthToUsd(formatEther(tx.value), price)}
        </div>
        <div>
          <strong>ETH:</strong> {Number(formatEther(tx.value)).toFixed(4)}
        </div>
        <div>
          <strong>Timestamp:</strong> <TimeAgoUnix timestamp={tx.blockTimestamp} />
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div
        onClick={handleClose}
        className="btn bg-white hover:bg-white text-black self-start absolute left-2 top-2 flex items-center"
      >
        <ChevronLeftIcon width={20} color="black" />
        <span className="ml-2">Back</span>
      </div>
      <div
        ref={insideRef}
        id="wildui-fastpay"
        className="content p-5 rounded-lg bg-base-200 w-full md:w-1/2 h-2/3 overflow-hidden relative"
      >
        <div className="flex flex-col items-center mb-2">
          <div className="font-semibold items-center">@{data.username}</div>
        </div>
        <div className="mb-4">
          <button
            className={`rounded-lg px-4 py-2 mr-2 ${
              selectedTab === "ethereum" ? "bg-primary text-black" : "bg-gray-300 text-black"
            }`}
            onClick={() => setSelectedTab("ethereum")}
          >
            Ethereum
          </button>
          <button
            className={`rounded-lg px-4 py-2 ${
              selectedTab === "base" ? "bg-primary text-black" : "bg-gray-300 text-black"
            }`}
            onClick={() => setSelectedTab("base")}
          >
            Base
          </button>
        </div>
        <div className="overflow-scroll" style={{ height: "85%" }}>
          {selectedTab === "ethereum" && renderTransactions(incomingRes?.ethereumData?.paymentChanges || [])}
          {selectedTab === "base" && renderTransactions(incomingRes?.baseData?.paymentChanges || [])}
        </div>
      </div>
    </div>
  );
};

export default TransactionsModal;

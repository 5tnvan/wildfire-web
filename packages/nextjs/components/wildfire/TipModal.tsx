import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "../Avatar";
import { Address } from "../scaffold-eth/Address";
import { RainbowKitCustomConnectButton } from "../scaffold-eth/RainbowKitCustomConnectButton";
import { RainbowKitCustomSwitchNetworkButton } from "../scaffold-eth/RainbowKitCustomConnectButton/switchnetwork";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { CheckCircleIcon, ChevronLeftIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useScaffoldWriteContract, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { convertUsdToEth } from "~~/utils/wildfire/convertUsdToEth";

const TipModal = ({ data, onClose }: any) => {
  const price = useGlobalState(state => state.nativeCurrency.price);
  const { address: connectedAddress } = useAccount();
  const [ethAmountWithFee, setEthAmountWithFee] = useState(0);
  const [dollarAmount, setDollarAmount] = useState(0);
  const [dollarAmountWithFee, setDollarAmountWithFee] = useState(0);
  const [addMessage, setAddMessage] = useState(false);
  const [message, setMessage] = useState("n/a");
  const [success, setSuccess] = useState(null);

  console.log("data", data);
  /**
   * ACTION: Get network
   **/
  const [network, setNetwork] = useState("");
  const { targetNetwork } = useTargetNetwork();

  useEffect(() => {
    if (targetNetwork.id == 84532 || targetNetwork.id == 8453) {
      setNetwork("base");
    } else if (targetNetwork.id == 11155111 || targetNetwork.id == 1) {
      setNetwork("ethereum");
    }
  }, [targetNetwork]);

  /**
   * ACTION: Add message
   **/
  const addMessageClick = () => {
    if (addMessage == false) {
      setAddMessage(true);
    } else {
      setAddMessage(false);
    }
  };

  const onMessageChange = (e: any) => {
    setMessage(e.target.value);
  };

  /**
   * ACTION: Show billing
   **/
  const handleInput = (e: any) => {
    const dollarAmount = Number(e.target.value);
    const ethAmount = convertUsdToEth(dollarAmount, price);
    setDollarAmount(dollarAmount);
    setDollarAmountWithFee(dollarAmount + (dollarAmount * 3) / 100);
    //setEthAmount(ethAmount);
    setEthAmountWithFee(ethAmount + (ethAmount * 3) / 100);
  };

  /**
   * ACTION: Pay
   **/
  const handleReceipt = (hash: any) => {
    console.log("FastPayConfirm: trigger FastPayModal");
    setSuccess(hash);
  };

  const handlePay = async () => {
    try {
      await pay({
        functionName: "setPayment",
        args: [data.wallet_id, message],
        value: parseEther(ethAmountWithFee.toString()),
        blockConfirmations: 1,
        onBlockConfirmation: (txnReceipt: any) => {
          console.log("FastPayConfirm trasactionHash", txnReceipt);
          handleReceipt(txnReceipt.transactionHash);
        },
      });
    } catch (e) {
      console.error("Error setting greeting:", e);
    }
  };
  const { writeContractAsync: pay, isMining } = useScaffoldWriteContract("WildpayContract");

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div onClick={handleClose} className="btn bg-white hover:bg-white text-black self-start absolute left-2 top-2">
        <ChevronLeftIcon width={20} color="black" />
        Back
      </div>
      <div id="wildui-fastpay" className="bg-base-300 rounded-lg p-5">
        {data && data.wallet_id && !success && (
          <>
            {/* AVATAR */}
            <div className="flex flex-col items-center gap-1">
              <Avatar profile={data} width={14} height={14} />
              <div>
                <span className="font-semibold text-primary mr-1">to</span>
                <span className="font-semibold ">@{data.username}</span>
              </div>
            </div>
            {/* INPUT */}
            <div className="flex items-center pt-4 text-5xl">
              <span className="text-3xl">$</span>
              <div>
                <input
                  type="number"
                  placeholder="0.00"
                  className="text-center text-primary bg-base-300"
                  onChange={handleInput}
                />
              </div>
              <span className="text-3xl">USD</span>
            </div>
            {/* ACCOUNTING */}
            {dollarAmount > 0 && (
              <>
                {/* MESSAGE */}
                <div className="flex flex-col items-center">
                  <Link className="link-primary block mt-2" onClick={() => addMessageClick()} href={""}>
                    Leave a message
                  </Link>
                  {addMessage && (
                    <input
                      type="text"
                      placeholder="Type your message"
                      className="input block input-bordered input-primary w-full mt-2"
                      onChange={e => onMessageChange(e)}
                    />
                  )}
                </div>
                {/* BILL */}
                <div className="">
                  <div className="flex justify-between border-b pt-8 pb-3 mb-3">
                    <div>Amount</div>
                    <div className="font-semibold">${dollarAmount}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="pb-1">Total Bill</div>
                    <div className="font-semibold">{`$${dollarAmountWithFee}`}</div>
                  </div>
                  <div className="flex justify-end">
                    <div>{`${ethAmountWithFee} ETH`}</div>
                  </div>
                </div>
              </>
            )}

            {/* PAY AS */}
            <div className="mt-8">
              {!data.wallet_id && (
                <>
                  <div>You have no verified wallet, yet.</div>
                  <div className="flex justify-center">
                    <Link href="/settings" className="btn btn-neutral w-full mt-3" onClick={onClose}>
                      Verify a Wallet
                    </Link>
                  </div>
                </>
              )}
              {data.wallet_id && !connectedAddress && (
                <>
                  <div className="flex btn btn-base-100 h-full items-center justify-between pt-2 pb-2 mt-2">
                    <div className="flex items-center">
                      <span className="font-semibold text-primary mr-1 text-base">from</span>
                      <Avatar profile={data} width={8} height={8} />
                      <span className="ml-1 font-semibold text-base">{data.username}</span>
                    </div>
                    <div className="flex items-center">
                      <Address address={data.wallet_id} />
                      <span className="text-success ml-1">
                        <CheckCircleIcon width={16} />
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-12 mt-2">
                    <RainbowKitCustomConnectButton />
                  </div>
                </>
              )}
              {data.wallet_id && connectedAddress && data.wallet_id == connectedAddress && (
                <>
                  <RainbowKitCustomSwitchNetworkButton btn="base" />
                  <div className="flex btn btn-base-100 h-full items-center justify-between pt-2 pb-2 mt-2 mb-2">
                    <div className="flex items-center">
                      <span className="font-semibold text-primary mr-1 text-base">from</span>
                      <Avatar profile={data} width={8} height={8} />
                      <span className="ml-2 font-semibold text-base">{data.username}</span>
                    </div>
                    <div className="flex items-center">
                      <Address address={connectedAddress} />
                      <span className="text-green-600 ml-1">
                        <CheckCircleIcon width={16} />
                      </span>
                    </div>
                  </div>
                </>
              )}
              {data.wallet_id && connectedAddress && data.wallet_id !== connectedAddress && (
                <>
                  <div className="flex btn btn-base-100 h-full items-center justify-between pt-2 pb-2 mt-2">
                    <div className="flex items-center">
                      <span className="font-semibold text-primary mr-1 text-base">from</span>
                      <Avatar profile={data} width="8" height={undefined} />
                      <span className="ml-2 font-semibold text-base">{data.username}</span>
                    </div>
                    <div className="flex items-center">
                      <Address address={connectedAddress} />
                      <span className="text-red-600 ml-1">
                        <ExclamationCircleIcon width={16} />
                      </span>
                    </div>
                  </div>
                  <div className="text-center text-red-600 mt-2">{`Your connected address doesn't match your verified address.`}</div>
                </>
              )}
            </div>

            {/* CONFIRM */}
            {data.wallet_id && connectedAddress && data.wallet_id == connectedAddress && (
              <>
                <div className="flex justify-center">
                  <button
                    className={`${
                      dollarAmount === 0 && "btn-disabled"
                    } btn btn-accent bg-gradient-to-r from-cyan-600 via-lime-500 border-0 text-black w-full mt-3`}
                    onClick={handlePay}
                  >
                    Confirm
                    {isMining && <span className="loading loading-ring loading-md"></span>}
                  </button>
                </div>
              </>
            )}
          </>
        )}
        {data && data.wallet_id && success && (
          <>
            <div className="font-semibold text-3xl pt-10">{"Success 🎉."}</div>
            <div className="text-xl mb-5">{"Here's your receipt."}</div>
            <Link
              href={"/transaction/payment/" + network + "/" + success}
              className="btn btn-primary w-full mt-3 mb-2"
              onClick={handleClose}
            >
              Go to transaction
            </Link>
          </>
        )}
        {data && !data.wallet_id && (
          <>
            <div className="flex justify-center">
              <span className="font-semibold mr-1">@{data.username}</span>
              {" has no verified wallet, yet."}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TipModal;

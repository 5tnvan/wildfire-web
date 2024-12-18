import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "../Avatar";
import { Address } from "../scaffold-eth/Address";
import { RainbowKitCustomConnectButton } from "../scaffold-eth/RainbowKitCustomConnectButton";
import { RainbowKitCustomSwitchNetworkButton } from "../scaffold-eth/RainbowKitCustomConnectButton/switchnetwork";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { CheckCircleIcon, ChevronLeftIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { AuthUserContext } from "~~/app/context";
import { useOutsideClick, useScaffoldWriteContract, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { convertUsdToEth } from "~~/utils/wildfire/convertUsdToEth";
import { insertTip } from "~~/utils/wildfire/crud/3sec_tips";
import { insertDirectTip } from "~~/utils/wildfire/crud/direct_tips";

const TipModal = ({ data, short_id, onClose }: any) => {
  console.log("short_id", short_id);
  console.log("data", data);
  const router = useRouter();
  const ethPrice = useGlobalState(state => state.nativeCurrency.price);
  const fusePrice = useGlobalState(state => state.fuseCurrency.price);

  //CONSUME CONTEXT
  const { profile } = useContext(AuthUserContext);

  //STATES
  const { address: connectedAddress } = useAccount();
  const [tokenAmountWithFee, setTokenAmountWithFee] = useState(0);
  const [dollarAmount, setDollarAmount] = useState(0);
  const [dollarAmountWithFee, setDollarAmountWithFee] = useState(0);
  const [addMessage, setAddMessage] = useState(false);
  const [message, setMessage] = useState("n/a");
  const [successHash, setSuccessHash] = useState(null);

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
    } else if (targetNetwork.id == 122 || targetNetwork.id == 123) {
      setNetwork("fuse");
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
    if (network == "ethereum" || network == "base") {
      const ethAmount = convertUsdToEth(dollarAmount, ethPrice);
      setDollarAmount(dollarAmount);
      setDollarAmountWithFee(dollarAmount + (dollarAmount * 3) / 100);
      setTokenAmountWithFee(ethAmount + (ethAmount * 3) / 100);
    } else if (network == "fuse") {
      const fuseAmount = convertUsdToEth(dollarAmount, fusePrice);
      setDollarAmount(dollarAmount);
      setDollarAmountWithFee(dollarAmount + (dollarAmount * 3) / 100);
      setTokenAmountWithFee(fuseAmount + (fuseAmount * 3) / 100);
    }
  };

  /**
   * ACTION: Show receipt
   **/
  const handleReceipt = (hash: any) => {
    console.log("Receipt hash", hash);
    setSuccessHash(hash);
  };

  /**
   * ACTION: Save transaction
   **/
  const saveTransaction = (hash: any) => {
    console.log(
      "saveTransaction",
      short_id,
      targetNetwork.id,
      hash,
      tokenAmountWithFee,
      "ETH/FUSE",
      message,
      connectedAddress,
    );
    {short_id && insertTip(short_id, targetNetwork.id, hash, tokenAmountWithFee, "currency", message, connectedAddress)}
    {!short_id && insertDirectTip(targetNetwork.id, hash, tokenAmountWithFee, message, connectedAddress, data.wallet_id)}
    
    setSuccessHash(hash);
  };

  /**
   * ACTION: Pay
   **/
  const handlePay = async () => {
    const constructedMessage = short_id ? `${short_id} ${message}` : message;

    try {
      await pay(
        {
          functionName: "setPayment",
          args: [data.wallet_id, constructedMessage],
          value: parseEther(tokenAmountWithFee.toString()),
        },
        {
          blockConfirmations: 1,
          onBlockConfirmation: (txnReceipt: any) => {
            console.log("FastPayConfirm trasactionHash", txnReceipt);
            handleReceipt(txnReceipt.transactionHash);
            saveTransaction(txnReceipt.transactionHash);
          },
        },
      );
    } catch (e) {
      console.error("Error setting payment", e);
    }
  };

  const { writeContractAsync: pay, isMining } = useScaffoldWriteContract("WildpayEthContract");

  const insideRef = useRef<any>(null);

  useOutsideClick(insideRef, () => {
    handleClose();
  });

  const handleClose = () => {
    if (successHash) {
      router.push("/v/" + short_id);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div onClick={handleClose} className="btn bg-white hover:bg-white text-black self-start absolute left-2 top-2">
        <ChevronLeftIcon width={20} color="black" />
        Back
      </div>
      <div ref={insideRef} id="wildui-fastpay" className="glow bg-base-300 rounded-lg p-5">
        {data && data.wallet_id && !successHash && (
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
                    <div>{`${tokenAmountWithFee.toFixed(4)} ${network == "fuse" ? "FUSE" : "ETH"}`}</div>
                  </div>
                </div>
              </>
            )}

            {/* PAY AS */}
            <div className="mt-8">
              {!profile.wallet_id && (
                <>
                  <div>You have no verified wallet, yet.</div>
                  <div className="flex justify-center">
                    <Link href="/account" className="btn btn-neutral w-full mt-3" onClick={onClose}>
                      Verify a Wallet
                    </Link>
                  </div>
                </>
              )}
              {profile.wallet_id && !connectedAddress && (
                <>
                  <div className="flex btn btn-base-100 h-full items-center justify-between pt-2 pb-2 mt-2">
                    <div className="flex items-center">
                      <span className="font-semibold text-primary mr-1 text-base">from</span>
                      <Avatar profile={profile} width={8} height={8} />
                      <span className="ml-1 font-semibold text-base">{profile.username}</span>
                    </div>
                    <div className="flex items-center">
                      <Address address={profile.wallet_id} />
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
              {profile.wallet_id && connectedAddress && profile.wallet_id == connectedAddress && (
                <>
                  <RainbowKitCustomSwitchNetworkButton btn="base" />
                  <div className="flex btn btn-base-100 h-full items-center justify-between pt-2 pb-2 mt-2 mb-2">
                    <div className="flex items-center">
                      <span className="font-semibold text-primary mr-1 text-base">from</span>
                      <Avatar profile={profile} width={8} height={8} />
                      <span className="ml-2 font-semibold text-base">{profile.username}</span>
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
              {profile.wallet_id && connectedAddress && profile.wallet_id !== connectedAddress && (
                <>
                  <div className="flex btn btn-base-100 h-full items-center justify-between pt-2 pb-2 mt-2">
                    <div className="flex items-center">
                      <span className="font-semibold text-primary mr-1 text-base">from</span>
                      <Avatar profile={profile} width="8" height={undefined} />
                      <span className="ml-2 font-semibold text-base">{profile.username}</span>
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
            {profile.wallet_id && connectedAddress && profile.wallet_id == connectedAddress && (
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
        {successHash && (
          <>
            <div className="font-semibold text-3xl pt-10">{"Success 🎉."}</div>
            <div className="text-xl mb-5">{"Here's your receipt."}</div>
            <Link
              href={"https://www.wildpay.app/transaction/payment/" + network + "/" + successHash}
              className="btn btn-primary w-full mt-3 mb-2"
              onClick={handleClose}
              target="_blank"
            >
              See receipt.
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

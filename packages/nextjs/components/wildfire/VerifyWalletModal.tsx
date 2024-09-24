import React, { useContext, useEffect, useRef, useState } from "react";

import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { recoverMessageAddress } from "viem";
import { useAccount, useSignMessage } from "wagmi";

import { AuthUserContext } from "@/app/context";
import { useOutsideClick } from "@/hooks/scaffold-eth";
import { checkWalletExist, updateProfileWallet } from "@/utils/wildfire/crud/profile";

import { Address } from "../scaffold-eth/Address";
import { RainbowKitCustomConnectButton } from "../scaffold-eth/RainbowKitCustomConnectButton";
import { TimeAgo } from "./TimeAgo";

const VerifyWalletModal = ({ onClose }: any) => {
  //CONSUME CONTEXT
  const { profile, refetchAuthUser } = useContext(AuthUserContext);

  const { address } = useAccount();
  const { data: signMessageData, error, signMessage, variables } = useSignMessage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>();

  useEffect(() => {
    (async () => {
      const bool = await checkWalletExist(address);
      if (bool) {
        setErrorMessage("This wallet belongs to an account. Please, use another wallet.");
      } else {
        setErrorMessage(null);
      }
      if (variables?.message && signMessageData) {
        await recoverMessageAddress({
          message: variables?.message,
          signature: signMessageData,
        });
      }
      if (signMessageData) {
        setIsProcessing(false);
        updateProfileWallet(profile.id, address, signMessageData, new Date().toISOString());
        refetchAuthUser();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, signMessageData, variables?.message]);

  const insideRef = useRef<any>(null);

  useOutsideClick(insideRef, () => {
    handleClose();
  });

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div onClick={handleClose} className="btn bg-white hover:bg-white text-black self-start absolute left-2 top-2">
        <ChevronLeftIcon width={20} color="black" />
        Back
      </div>
      <div ref={insideRef} id="wildui-fastpay" className="bg-base-300 rounded-lg p-6 w-full md:w-max">
        {profile.wallet_id && profile.wallet_sign_hash ? (
          <>
            <div className="font-semibold text-3xl">{"It's done 🎉"}</div>
            <div className="mb-5">You are all set.</div>
          </>
        ) : (
          <>
            <div className="font-semibold text-3xl">{"Verify your wallet"}</div>
            <div className="mb-5">{"It’s free of charge."}</div>
          </>
        )}

        {/* Steps */}
        <div className="w-full overflow-hidden flex flex-col gap-5">
          {/* 1.Link your wallet */}
          {!profile.wallet_id && (
            <>
              <div className="flex flex-row items-center gap-1">
                <span className={`badge ${address ? "badge-primary" : ""}`}>1</span>
                {address ? (
                  <span className="font-semibold flex flex-row">Wallet Linked</span>
                ) : (
                  <span>Link your wallet</span>
                )}
              </div>
              <div className="flex mb-10">
                <RainbowKitCustomConnectButton />
              </div>
            </>
          )}
          {profile.wallet_id && (
            <>
              <div className="flex flex-row items-center gap-1">
                <span className=" badge badge-primary">1</span>
                <span className="font-semibold">Wallet Linked</span>
              </div>
              <Address address={profile.wallet_id} />
            </>
          )}
          {/* 2.Verify ownership */}
          {!profile.wallet_id && !address && (
            <>
              <div className="flex flex-row items-center gap-1">
                <span className="badge">2</span>
                <span>Verify Ownership</span>
              </div>
            </>
          )}
          {!profile.wallet_id && address && (
            <>
              {!errorMessage && (
                <>
                  <div className="flex flex-row items-center gap-1">
                    <span className="badge">2</span>
                    <span>Verify Ownership</span>
                  </div>
                  <div className="min-w-max">Sign a message to verify the ownership of your wallet.</div>
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => {
                      setIsProcessing(true);
                      signMessage({ message: "I'm signing to prove the ownership of my wallet." });
                    }}
                    disabled={!isProcessing && signMessageData != undefined}
                  >
                    Sign a message {!error && isProcessing && <span className="loading loading-ring loading-md"></span>}
                  </button>
                </>
              )}
              {errorMessage && (
                <>
                  <div className="flex flex-row items-center gap-1">
                    <span className="badge">2</span>
                    <span>Verify Ownership</span>
                  </div>
                  <div role="alert" className="flex alert alert-error">
                    <span className="text-sm">
                      This wallet address belongs to another account. <br />
                      Please try with another wallet.
                    </span>
                  </div>
                </>
              )}
            </>
          )}
          {profile.wallet_id && profile.wallet_sign_hash && (
            <>
              <div className="flex flex-row items-center gap-1">
                <span className="badge badge-primary">2</span>
                <span className="font-semibold">Ownership Verified</span>
              </div>
              <div className="w-72 text-left">
                {
                  <>
                    <div className="font-medium">Signed hash:</div>
                    <div className="text-ellipsis overflow-hidden">{profile.wallet_sign_hash}</div>
                    <div className="flex gap-1">
                      <TimeAgo timestamp={profile.wallet_sign_timestamp} /> ago
                    </div>
                  </>
                }
              </div>
            </>
          )}
        </div>

        {error && <div>{error.message}</div>}
      </div>
    </div>
  );
};

export default VerifyWalletModal;

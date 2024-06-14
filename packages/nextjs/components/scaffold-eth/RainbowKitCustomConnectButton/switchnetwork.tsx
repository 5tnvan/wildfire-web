"use client";

import { SwitchNetworkDropdown } from "./SwitchNetworkDropdown";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

type RainbowKitCustomConnectButtonProps = {
  btn: string;
};
/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomSwitchNetworkButton = ({ btn }: RainbowKitCustomConnectButtonProps) => {
  const { targetNetwork } = useTargetNetwork();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button
                    className={`${
                      btn == "small" ? "btn-sm" : "w-full"
                    } btn btn-accent bg-gradient-to-r from-cyan-600 via-lime-500 text-black`}
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== targetNetwork.id) {
                return <WrongNetworkDropdown />;
              }

              return <SwitchNetworkDropdown chainName={chain.name} btn="base" />;
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};

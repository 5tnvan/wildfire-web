import React, { useRef, useState } from "react";

import { ArrowsRightLeftIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import { BaseIcon } from "@/components/assets/BaseIcon";
import { EthIcon } from "@/components/assets/EthIcon";
import { useOutsideClick } from "@/hooks/scaffold-eth";
import { getTargetNetworks } from "@/utils/scaffold-eth";

import { NetworkOptions } from "./NetworkOptions";

const allowedNetworks = getTargetNetworks();

type SwitchNetworkDropdownProps = {
  chainName: any;
  btn: any;
};

export const SwitchNetworkDropdown = ({ chainName, btn }: SwitchNetworkDropdownProps) => {
  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    setSelectingNetwork(false);
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);

  return (
    <>
      <details ref={dropdownRef} className={`dropdown dropdown-end leading-3 ${btn == "small" ? "" : "w-full"}`}>
        <summary
          tabIndex={0}
          className={`btn btn-base-200 ${
            btn == "small" ? "btn-sm px-2" : "flex flex-row justify-between px-4"
          } dropdown-toggle gap-0 !h-auto`}
        >
          <div className="flex flex-row items-center">
            <span className="text-primary font-semibold text-base mr-1">network</span>
            {(chainName == "Base" || chainName == "Base Sepolia") && <BaseIcon width={18} height={18} fill="#3C3C3C" />}
            {(chainName == "Ethereum" || chainName == "Sepolia") && <EthIcon width={18} height={18} fill="#3C3C3C" />}
            <span className="ml-1 text-base">{chainName}</span>
          </div>
          <div>
            <ChevronDownIcon className="h-6 w-4 ml-1" />
          </div>
        </summary>
        <ul
          tabIndex={0}
          className="dropdown-content menu z-[2] p-2 mt-2 shadow-center shadow-accent bg-base-200 rounded-box gap-1"
        >
          <NetworkOptions hidden={!selectingNetwork} />
          {allowedNetworks.length > 1 ? (
            <li className={selectingNetwork ? "hidden" : ""}>
              <button
                className="btn-sm !rounded-xl flex gap-3 py-3"
                type="button"
                onClick={() => {
                  setSelectingNetwork(true);
                }}
              >
                <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" /> <span>Switch Network</span>
              </button>
            </li>
          ) : null}
        </ul>
      </details>
    </>
  );
};

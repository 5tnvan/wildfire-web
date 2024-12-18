"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { Avatar } from "../../../components/Avatar";
import { TimeAgo } from "../../../components/wildfire/TimeAgo";
import { AuthContext, AuthUserAccountContext, AuthUserContext } from "../../context";
import type { NextPage } from "next";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Address } from "~~/components/scaffold-eth/Address";
import { BentoGrid, BentoGridItem } from "~~/components/ui/bento-grid";
import VerifyWalletModal from "~~/components/wildfire/VerifyWalletModal";

const Account: NextPage = () => {
  //CONSUME PROVIDERS
  const { user } = useContext(AuthContext);
  const { loadingAuthUser, profile } = useContext(AuthUserContext);
  const { account } = useContext(AuthUserAccountContext);

  const MyAccount = () => (
    <>
      {user && profile && (
        <div className="flex flex-col items-center gap-2 py-5">
          <Avatar profile={profile} width={16} height={16} />
          <div className="flex flex-row items-center font-semibold">{user.email}</div>
          <div className="flex flex-col items-center">
            <div className="mb-1">Created at:</div>
            <div className="bg-base-100 px-3 rounded-full text-sm">
              <TimeAgo timestamp={user.created_at} />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-1">Last signed in:</div>
            <div className="bg-base-100 px-3 rounded-full text-sm">
              <TimeAgo timestamp={user.last_sign_in_at} />
            </div>
          </div>
        </div>
      )}
    </>
  );
  const MyVerifiedWallet = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-100 dark:from-neutral-950 dark:to-neutral-900 to-neutral-50">
      <div className="flex flex-col justify-center items-center gap-1 w-full">
        {profile?.wallet_id && (
          <div className="flex gap-2">
            <Address address={profile?.wallet_id} />
            <CheckCircleIcon width="18" className="text-green-600" />
          </div>
        )}
        {!profile?.wallet_id && (
          <div className="">
            <div>No Wallet</div>
          </div>
        )}
      </div>
    </div>
  );
  const MyVerifiedWalletCTA = () => (
    <>
      {profile?.wallet_id && (
        <div className="link font-normal" onClick={() => setVerifyWalletModalOpen(true)}>
          View
        </div>
      )}
      {!profile?.wallet_id && (
        <div className="link font-normal" onClick={() => setVerifyWalletModalOpen(true)}>
          Verify Wallet
        </div>
      )}
    </>
  );
  const DeleteAccount = () => (
    <>
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-100 dark:from-neutral-950 dark:to-neutral-900 to-neutral-50">
        {!loadingAuthUser && account && account.length > 0 && (
          <div className="w-full flex flex-col items-center justify-center gap-3">
            <div className="font-semibold px-3">You requested to delete your:</div>
            <div className="flex flex-row gap-2 items-center">
              <div className="mb-1">Account</div>
              {account[0].delete_account ? (
                <div className="bg-primary px-3 rounded-full text-sm">true</div>
              ) : (
                <div className="bg-base-100 px-3 rounded-full text-sm">false</div>
              )}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="mb-1">Data</div>
              {account[0].delete_data ? (
                <div className="bg-primary px-3 rounded-full text-sm">true</div>
              ) : (
                <div className="bg-base-100 px-3 rounded-full text-sm">false</div>
              )}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="mb-1">Requested</div>
              <div className="bg-base-100 px-3 rounded-full text-sm">
                <TimeAgo timestamp={account[0].created_at} />
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="mb-1">Completion</div>
              {account[0].completed ? (
                <div className="bg-success px-3 rounded-full text-sm">Completed</div>
              ) : (
                <div className="bg-primary px-3 rounded-full text-sm">In Progress</div>
              )}
            </div>
          </div>
        )}
        {!loadingAuthUser && account && account.length == 0 && (
          <div className="w-full flex flex-col items-center gap-3 my-10 px-5">
            <Link href="/account/delete-account" className="btn btn-small w-full">
              Delete account
            </Link>
            <Link href="account/delete-data" className="btn btn-small w-full">
              Delete data, and keep account
            </Link>
          </div>
        )}
      </div>
    </>
  );
  const items = [
    {
      header: <MyAccount />,
    },
    {
      header: <MyVerifiedWallet />,
      title: <div>My Verified Wallet</div>,
      cta: <MyVerifiedWalletCTA />,
    },
    {
      header: <DeleteAccount />,
      title: <div className="m-auto">Delete Account</div>,
    },
  ];

  //TIP MODAL
  const [isVerifyWalletModalOpen, setVerifyWalletModalOpen] = useState(false);

  const closeVerifyWalletModal = () => {
    setVerifyWalletModalOpen(false);
  };

  return (
    <div className="grow h-screen-custom overflow-scroll flex justify-center items-center">
      {isVerifyWalletModalOpen && <VerifyWalletModal data={profile} onClose={closeVerifyWalletModal} />}
      <BentoGrid className="max-w-4xl mx-auto">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            header={item.header}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            cta={item.cta}
            title={item.title}
          />
        ))}
      </BentoGrid>
    </div>
  );
};

export default Account;

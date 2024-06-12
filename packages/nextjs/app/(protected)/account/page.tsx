"use client";

import { useContext } from "react";
import Link from "next/link";
import { AuthContext, AuthUserContext } from "../../context";
import type { NextPage } from "next";
import { Avatar } from "~~/components/Avatar";
import { TimeAgo } from "~~/components/TimeAgo";

const Account: NextPage = () => {
  const { user } = useContext(AuthContext);
  const { loadingAuthUser, profile, account } = useContext(AuthUserContext);

  return (
    <div className="grow">
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
      {!loadingAuthUser && account && account.length == 0 && (
        <div className="w-full flex flex-col items-center gap-3 my-10">
          <Link href="/account/delete-account" className="btn btn-outline btn-small">
            Delete account
          </Link>
          <Link href="account/delete-data" className="btn btn-small btn-outline">
            Delete data, and keep account
          </Link>
        </div>
      )}
      {!loadingAuthUser && account && account.length > 0 && (
        <div className="w-full flex flex-col items-center gap-3 my-10">
          <div className="font-semibold">You requested to delete your:</div>
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

          <Link href="help" className="btn btn-small btn-outline">
            Get help
          </Link>
        </div>
      )}
    </div>
  );
};

export default Account;

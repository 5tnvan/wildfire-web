"use client";

import { useContext, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar } from "@/components/Avatar";
import { requestDeleteData } from "@/utils/wildfire/crud/account";

import { AuthContext, AuthUserAccountContext, AuthUserContext } from "../../../context";

const DeleteData: NextPage = () => {
  const router = useRouter();

  //CONSUME PROVIDERS
  const { user } = useContext(AuthContext);
  const { profile, refetchAuthUser } = useContext(AuthUserContext);
  const { account } = useContext(AuthUserAccountContext);

  //STATES
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmIrreversible, setConfirmIrreversible] = useState(false);
  const canDelete = confirmDelete && confirmIrreversible;

  const handleConfirmDelete = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmDelete(event.target.checked);
  };

  const handleConfirmIrreversible = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmIrreversible(event.target.checked);
  };

  const handleDelete = async () => {
    await requestDeleteData(user?.id);
    refetchAuthUser();
    router.push("/account");
  };

  return (
    <div className="p-2 flex flex-col">
      {user && profile && (
        <div className="flex flex-col items-center grow gap-2 py-5">
          <Avatar profile={profile} width={16} height={16} />
          <div className="flex flex-row items-center font-semibold">{user.email}</div>
        </div>
      )}
      {account &&
        (account.length == 0 || (account.length > 0 && account[0].completed)) && ( // if there is no request, or request has been completed
          <>
            <div className="form-control w-fit self-center my-10 grow">
              <div className="font-semibold text-secondary self-center">Delete Data</div>
              <label className="label cursor-pointer justify-center gap-2">
                <input type="checkbox" checked={confirmDelete} onChange={handleConfirmDelete} className="checkbox" />
                <span className={`label-text ${confirmDelete ? "font-medium" : ""}`}>
                  I hereby confirm the deletion of my data
                </span>
              </label>
              <label className="label cursor-pointer justify-center gap-2">
                <input
                  type="checkbox"
                  checked={confirmIrreversible}
                  onChange={handleConfirmIrreversible}
                  className="checkbox"
                />
                <span className={`label-text ${confirmIrreversible ? "font-medium" : ""}`}>
                  I understand that this will delete all content and data associated with my account within 14 days.
                </span>
              </label>
              <div
                className={`btn btn-primary btn-small ${!canDelete ? "btn-disabled" : ""} my-2`}
                onClick={handleDelete}
              >
                Delete data, but keep account
              </div>
            </div>
            <Link href="/account/delete-account" className="link self-center text-sm my-4">
              Want to delete account?
            </Link>
          </>
        )}
      {account && account.length > 0 && !account[0].completed && (
        <div className="form-control w-fit self-center my-10 grow">
          <div>You cannot make another request at the moment.</div>
          <Link className={`btn btn-outline btn-small my-2`} href="/account">
            Go back to My Account
          </Link>
        </div>
      )}
    </div>
  );
};

export default DeleteData;

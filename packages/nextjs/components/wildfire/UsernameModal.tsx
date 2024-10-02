import React, { useContext, useRef, useState } from "react";

import { ChevronLeftIcon, XCircleIcon } from "@heroicons/react/24/solid";

import { AuthUserContext } from "@/app/context";
import { useOutsideClick } from "@/hooks/scaffold-eth";
import { isUsernameTaken, isUsernameUpdated, updateUsername } from "@/utils/wildfire/changeUsername";

import { Avatar } from "../Avatar";

const UsernameModal = ({ onClose }: any) => {
  const { profile, refetchAuthUser } = useContext(AuthUserContext);

  const [errorClient, setErrorClient] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("");

  const handleUsernameChange = async () => {
    setIsProcessing(true);
    setErrorClient(null);

    // Validate username pattern
    const usernamePattern = /^[a-z][a-z0-9_]{2,15}$/;
    if (!usernamePattern.test(newUsername)) {
      setErrorClient(
        "Username must be 3-15 characters long and include only lowercase letters, numbers, and underscores.",
      );
      setIsProcessing(false);
      return;
    }

    try {
      // Check if username exists and if it was updated recently
      const usernameTaken = await isUsernameTaken(newUsername);
      const lastUpdated = await isUsernameUpdated(profile.username);

      const now = new Date();
      const daysDifference = lastUpdated
        ? Math.floor((now.getTime() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      if (usernameTaken) {
        setErrorClient("Username is taken");
      } else if (lastUpdated != null && daysDifference < 29) {
        setErrorClient("Username was updated recently. Ensure 29 days have passed.");
      } else {
        const res = await updateUsername(newUsername);
        if (res) {
          setErrorClient("Something went wrong. Please try again.");
        } else {
          onClose();
          refetchAuthUser();
        }
      }
    } catch (error) {
      console.error(error);
      setErrorClient("An error occurred while checking the username. Please try again.");
    }

    setIsProcessing(false);
  };

  const handleClose = () => {
    onClose();
  };

  const insideRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(insideRef, () => {
    handleClose();
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div onClick={handleClose} className="btn bg-white hover:bg-white text-black self-start absolute left-2 top-2">
        <ChevronLeftIcon width={20} color="black" />
        Back
      </div>
      <div
        ref={insideRef}
        className="content w-full md:w-fit p-8 rounded-lg bg-base-200 overflow-scroll flex flex-col items-center mb-2 gap-1"
      >
        <Avatar profile={profile} width={16} height={16} />
        <div className="mb-2 font-semibold">{profile.username}</div>
        <>
          <input
            type="text"
            placeholder="Type new username"
            className="input input-bordered w-full min-w-xs"
            pattern="^[a-z][a-z0-9_]{2,15}$"
            title="3-15 characters & only lowercase letters, numbers, and underscores."
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
          />
          {errorClient && (
            <div role="alert" className="alert alert-error mt-3" onClick={() => setErrorClient(null)}>
              <XCircleIcon width={20} />
              <span>{errorClient}</span>
            </div>
          )}
          <div className="flex justify-center w-full">
            <button
              className={`btn btn-primary w-full mt-3 ${isProcessing ? "btn-disabled" : ""}`}
              onClick={handleUsernameChange}
              disabled={isProcessing}
            >
              Change
              {isProcessing && <span className="loading loading-ring loading-md"></span>}
            </button>
          </div>
        </>
      </div>
    </div>
  );
};

export default UsernameModal;

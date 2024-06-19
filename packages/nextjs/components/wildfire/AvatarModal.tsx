import React, { useContext, useRef, useState } from "react";
import { Avatar } from "../Avatar";
import { ChevronLeftIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { AuthUserContext, AuthUserFollowsContext } from "~~/app/context";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import {
  checkFileExists,
  deleteProfileAvatars,
  getPublicURL,
  updateProfileAvatar,
  uploadProfileAvatar,
} from "~~/utils/wildfire/crud/profile";

const AvatarModal = ({ onClose }: any) => {
  const { profile, refetchAuthUser } = useContext(AuthUserContext);
  const { refetchAuthUserFollows } = useContext(AuthUserFollowsContext);

  const [screen, setScreen] = useState("init");
  const [fileImg, setFileImg] = useState("");
  const [errorClient, setErrorClient] = useState<any>();
  const [isProcessing, setIsProcessing] = useState<any>();

  const handleFileImg = (e: any) => {
    const selectedFile = e.target.files[0];
    setErrorClient(null);
    if (selectedFile.size <= 1024 * 1024) {
      setFileImg(selectedFile);
    } else {
      setErrorClient("File size exceeds 1MB. Please try again.");
    }
  };

  const handleFileSave = async () => {
    if (fileImg) {
      setIsProcessing(true);

      //set up file
      const fileData = new FormData();
      fileData.append("file", fileImg);

      //check if there is any file in uer's storage folder
      const fileExists = await checkFileExists(profile.id);

      // delete old file from storage
      if (fileExists?.bool) {
        deleteProfileAvatars(fileExists?.data);
      }

      // upload new avatar
      const data1 = await uploadProfileAvatar(fileData);

      // update profile table
      const data2 = await getPublicURL(data1?.path);
      updateProfileAvatar(data2.publicUrl);

      //close and refetch
      setIsProcessing(false);
      onClose();
      refetchAuthUser();
      refetchAuthUserFollows();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleChangeAvatar = () => {
    setScreen("change-avatar");
  };

  const handleRemoveAvatar = async () => {
    updateProfileAvatar(null);
    onClose();
    refetchAuthUser();
    refetchAuthUserFollows();
  };

  const insideRef = useRef<any>(null);

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
        className="content p-8 rounded-lg bg-base-200 overflow-scroll flex flex-col items-center mb-2 gap-1"
      >
        <Avatar profile={profile} width={16} height={16} />
        <div className="mb-2 font-semibold">{profile.username}</div>
        {screen == "change-avatar" && (
          <>
            {/* upload profile picture here */}
            <input
              type="file"
              className="file-input file-input-bordered file-input-accent w-full mt-5"
              accept=".png, .jpg, .jpeg, .gif"
              onChange={handleFileImg}
            />
            {errorClient && (
              <div role="alert" className="alert alert-error mt-3">
                <XCircleIcon width={20} />
                <span>{errorClient}</span>
              </div>
            )}
            <div className="flex justify-center w-full">
              <button
                className={`btn btn-primary w-full mt-3 ${(errorClient || !fileImg) && "btn-disabled"}`}
                onClick={handleFileSave}
              >
                Upload
                {isProcessing && <span className="loading loading-ring loading-md"></span>}
              </button>
            </div>
          </>
        )}

        {screen == "init" && (
          <>
            <div className="btn btn-primary" onClick={handleChangeAvatar}>
              Change avatar
            </div>
            <div className="btn btn-outline" onClick={handleRemoveAvatar}>
              Remove avatar
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AvatarModal;

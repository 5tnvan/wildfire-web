"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { BellAlertIcon } from "@heroicons/react/24/solid";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useNotifications } from "~~/hooks/wildfire/useNotifications";
import { Avatar } from "../Avatar";
import { TimeAgo } from "./TimeAgo";
import { convertEthToUsd } from "~~/utils/wildfire/convertEthToUsd";
import { useGlobalState } from "~~/services/store/store";
import { updateCommentRead, updateFireRead, updateFollowerRead, updateTipRead } from "~~/utils/wildfire/crud/notifications";

export const Notification = () => {
  const { followersNotifications, firesNotifications, commentsNotifications, tipsNotifications, refetch } = useNotifications();
  const price = useGlobalState((state) => state.nativeCurrency.price);

  // Merge notifications into a single array
  const allNotifications = [
    ...(followersNotifications ?? []).map((notif: any) => ({
      ...notif,
      type: "follow",
      created_at: notif.follower_created_at, // Use follower_created_at for sorting
      isUnread: !notif.follower_read,
    })),
    ...(firesNotifications ?? []).map((notif: any) => ({
      ...notif,
      type: "like",
      isUnread: !notif.read,
    })),
    ...(commentsNotifications ?? []).map((notif: any) => ({
      ...notif,
      type: "comment",
      isUnread: !notif.read,
    })),
    ...(tipsNotifications ?? []).map((notif: any) => ({
      ...notif,
      type: "tip",
      isUnread: !notif.read,
    })),
  ];

  // Count unread notifications
  const unreadCount = allNotifications.filter((notif) => notif.isUnread).length;

  // Sort and slice notifications for display
  const displayedNotifications = allNotifications
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10); // Limit to the latest 10 notifications

  // Dropdown
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);

  // Update read status and refetch notifications
  const handleNotificationClick = async (notif: any) => {
    closeDropdown();

    if (notif.isUnread) {
      switch (notif.type) {
        case "follow":
          await updateFollowerRead(notif.id);
          break;
        case "like":
          await updateFireRead(notif.id);
          break;
        case "comment":
          await updateCommentRead(notif.id);
          break;
        case "tip":
          await updateTipRead(notif.id);
          break;
        default:
          break;
      }
      refetch();
    }
  };

  return (
    <>
      <details ref={dropdownRef} className="dropdown dropdown-end">
        <summary className="btn bg-base-100">
          <div className="relative">
            <BellAlertIcon width={20} />
            {unreadCount > 0 && <div className="w-2 h-2 rounded-full bg-red-600 absolute top-0 right-0"></div>}
          </div>
          {unreadCount > 0 && <span>{unreadCount}</span>}
        </summary>
        <ul className="p-2 menu dropdown-content z-20 bg-base-100 rounded-box w-96 border border-base-200">
          <div className="max-h-screen overflow-y-auto">
            {displayedNotifications.map((notif, index) => {
              let message: React.ReactNode = "";

              if (notif.type === "follow") {
                message = (
                  <Link
                    href={"/" + notif.follower.username}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex items-center p-2 mb-1 rounded-md ${notif.isUnread && "bg-base-200"}`}
                  >
                    <div className="flex flex-row justify-between w-full items-center">
                      <div className="flex flex-row gap-1 items-center">
                        <Avatar profile={notif.follower} width={6} height={6} />
                        <span className="font-semibold">{notif.follower.username}</span> followed you.
                      </div>
                      <div className="text-xs opacity-75">
                        <TimeAgo timestamp={notif.created_at} />
                      </div>
                    </div>
                  </Link>
                );
              } else if (notif.type === "like") {
                message = (
                  <Link
                    href={"/v/" + notif.post_id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex items-center p-2 mb-1 rounded-md ${notif.isUnread && "bg-base-200"}`}
                  >
                    <div className="flex flex-row justify-between w-full items-center">
                      <div className="flex flex-row gap-1 items-center">
                        <Avatar profile={notif.liker} width={6} height={6} />
                        <span className="font-semibold">{notif.liker.username}</span> liked your post.
                      </div>
                      <div className="text-xs opacity-75">
                        <TimeAgo timestamp={notif.created_at} />
                      </div>
                    </div>
                  </Link>
                );
              } else if (notif.type === "comment") {
                message = (
                  <Link
                    href={"/v/" + notif.post_id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex items-center p-2 mb-1 rounded-md ${notif.isUnread && "bg-base-200"}`}
                  >
                    <div className="flex flex-row justify-between w-full items-center">
                      <div className="flex flex-row gap-1 items-center">
                        <Avatar profile={notif.commenter} width={6} height={6} />
                        <span className="font-semibold">{notif.commenter.username}</span> commented on your post.
                      </div>
                      <div className="text-xs opacity-75">
                        <TimeAgo timestamp={notif.created_at} />
                      </div>
                    </div>
                  </Link>
                );
              } else if (notif.type === "tip") {
                message = (
                  <Link
                    href={"/v/" + notif["3sec_tips"].video_id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex items-center p-2 mb-1 rounded-md ${notif.isUnread && "bg-base-200"}`}
                  >
                    <div className="flex flex-row justify-between w-full items-center">
                      <div className="flex flex-row gap-1 items-center">
                        <Avatar profile={notif["3sec_tips"].tipper} width={6} height={6} />
                        <span className="font-semibold">{notif["3sec_tips"].tipper.username}</span> tipped you{" "}
                        <div className="badge badge-primary">${convertEthToUsd(notif["3sec_tips"].amount, price)}</div>
                      </div>
                      <div className="text-xs opacity-75">
                        <TimeAgo timestamp={notif.created_at} />
                      </div>
                    </div>
                  </Link>
                );
              }

              return <li key={index}>{message}</li>;
            })}
            {displayedNotifications.length > 0 && (
              <li className="flex flex-row justify-center opacity-70">
                <a href="/notifications">View all</a>
              </li>
            )}
            {displayedNotifications.length === 0 && (
              <span>Welcome to your notification space.</span>
            )}
          </div>
        </ul>
      </details>
    </>
  );
};

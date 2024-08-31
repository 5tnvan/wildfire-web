"use client";

import type { NextPage } from "next";
import Link from "next/link";
import { useRef } from "react";
import { Avatar } from "~~/components/Avatar";
import { TimeAgo } from "~~/components/wildfire/TimeAgo";
import { useOutsideClick } from "~~/hooks/scaffold-eth/useOutsideClick";
import { useNotifications } from "~~/hooks/wildfire/useNotifications";
import { useGlobalState } from "~~/services/store/store";
import { convertEthToUsd } from "~~/utils/wildfire/convertEthToUsd";
import { updateCommentRead, updateFireRead, updateFollowerRead, updateTipRead } from "~~/utils/wildfire/crud/notifications";

const Notifications: NextPage = () => {
  const { followersNotifications, firesNotifications, commentsNotifications, tipsNotifications, refetch } = useNotifications();
  const price = useGlobalState(state => state.nativeCurrency.price);

  console.log("notif", firesNotifications);

  // Dropdown
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);

  // Merge and sort notifications by date
  const allNotifications = [
    ...(followersNotifications ?? []).map((notif: any) => ({
      ...notif,
      type: "follow",
      created_at: notif.follower_created_at,  // Use follower_created_at for sorting
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
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Handle notification click
  const handleNotificationClick = async (notif: any) => {
    // Check if the notification is unread
    if (notif.isUnread) {
      // Determine which update function to call based on notification type
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

      // Refetch notifications after updating read status
    refetch();
    }
  };

  return (
    <div className="flex flex-col h-screen-custom lg:w-1/2 m-auto overflow-y-auto scroll items-top gap-1 p-4 rounded-2xl">
      {/* {allNotifications?.length > 0 && (
        <>
          <details ref={dropdownRef} className="dropdown dropdown-end w-fit self-end">
            <summary className="btn bg-base-200">
              <EllipsisVerticalIcon width={22} />
            </summary>
            <ul className="p-2 menu dropdown-content z-20 bg-base-100 rounded-box border border-base-200">
              <li>
                <Link href={"/"}>Mark All As Read</Link>
              </li>
            </ul>
          </details>
        </>
      )} */}
      {allNotifications.map((notif) => {
        let message: React.ReactNode = "";

        if (notif.type === "follow") {
          message = (
            <Link
              href={"/" + notif.follower.username}
              onClick={() => handleNotificationClick(notif)}
              className={`flex items-center p-4 rounded-md ${notif.isUnread && "bg-base-200"}`}
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
              className={`flex items-center p-4 rounded-md ${notif.isUnread && "bg-base-200"}`}
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
              className={`flex items-center p-4 rounded-md ${notif.isUnread && "bg-base-200"}`}
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
              className={`flex items-center p-4 rounded-md ${notif.isUnread && "bg-base-200"}`}
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

        return <>{message}</>;
      })}
    </div>
  );
};

export default Notifications;

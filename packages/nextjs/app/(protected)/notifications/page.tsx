"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { Avatar } from "~~/components/Avatar";
import { TimeAgo } from "~~/components/wildfire/TimeAgo";
import { useOutsideClick } from "~~/hooks/scaffold-eth/useOutsideClick";
import { useNotifications } from "~~/hooks/wildfire/useNotifications";
import { useGlobalState } from "~~/services/store/store";
import { convertEthToUsd } from "~~/utils/wildfire/convertEthToUsd";
import {
  updateCommentRead,
  updateDirectTipRead,
  updateFireRead,
  updateFollowerRead,
  updateReplyRead,
  updateTipRead,
} from "~~/utils/wildfire/crud/notifications";

const Notifications: NextPage = () => {
  const { followersNotifications, firesNotifications, commentsNotifications, repliesNotifications, tipsNotifications, directTipsNotifications, refetch } =
    useNotifications();
  const ethPrice = useGlobalState(state => state.nativeCurrency.price);
  const fusePrice = useGlobalState(state => state.fuseCurrency.price);

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
    ...(repliesNotifications ?? []).map((notif: any) => ({
      ...notif,
      type: "reply",
      isUnread: !notif.read,
    })),
    ...(tipsNotifications ?? []).map((notif: any) => ({
      ...notif,
      type: "tip",
      isUnread: !notif.read,
    })),
    ...(directTipsNotifications ?? []).map((notif: any) => ({
      ...notif,
      type: "direct_tip",
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
        case "reply":
          await updateReplyRead(notif.id);
          break;
        case "tip":
          await updateTipRead(notif.id);
          break;
          case "direct_tip":
            await updateDirectTipRead(notif.id);
            break;
        default:
          break;
      }

      // Refetch notifications after updating read status
      refetch();
    }
  };

  // Pagination state
  const [visibleNotifications, setVisibleNotifications] = useState(10);

  // Handle "Show More" button click
  const showMoreNotifications = () => {
    setVisibleNotifications(prev => prev + 10);
  };

  return (
    <div className="flex flex-col h-screen-custom lg:w-1/2 m-auto overflow-y-auto scroll items-top gap-1 p-4 rounded-2xl">
      {allNotifications.slice(0, visibleNotifications).map((notif: any, index: number) => {
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
        } else if (notif.type === "reply") {
          message = (
            <Link
              href={"/v/" + notif.post_id}
              onClick={() => handleNotificationClick(notif)}
              className={`flex items-center p-4 rounded-md ${notif.isUnread && "bg-base-200"}`}
            >
              <div className="flex flex-row justify-between w-full items-center">
                <div className="flex flex-row gap-1 items-center">
                  <Avatar profile={notif.replier} width={6} height={6} />
                  <span className="font-semibold">{notif.replier.username}</span> replied to you on a post.
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
                  <span className="font-semibold">{notif["3sec_tips"].tipper.username}</span> sent you love{" "}
                  <div className="badge badge-primary">
                    $
                    {convertEthToUsd(
                      notif["3sec_tips"].amount,
                      notif["3sec_tips"].network === 122 ? fusePrice : ethPrice,
                    )}
                  </div>
                </div>
                <div className="text-xs opacity-75">
                  <TimeAgo timestamp={notif.created_at} />
                </div>
              </div>
            </Link>
          );
        }
        else if (notif.type === "direct_tip") {
          message = (
            <Link
            href={`https://www.kinnectwallet.com/transaction/payment/${
              notif.direct_tips.network === 84532 || notif.direct_tips.network === 8453
                ? "base"
                : notif.direct_tips.network === 11155111 || notif.direct_tips.network === 1
                ? "ethereum"
                : notif.direct_tips.network === 122
                ? "fuse"
                : ""
            }/${notif.direct_tips.transaction_hash}`}
              onClick={() => handleNotificationClick(notif)}
              className={`flex items-center p-4 rounded-md ${notif.isUnread && "bg-base-200"}`}
            >
              <div className="flex flex-row justify-between w-full items-center">
                <div className="flex flex-row gap-1 items-center">
                  <Avatar profile={notif.direct_tips.tipper} width={6} height={6} />
                  <span className="font-semibold">{notif.direct_tips.tipper.username}</span> sent you love{" "}
                  <div className="badge badge-primary">
                    $
                    {convertEthToUsd(
                      notif.direct_tips.amount,
                      notif.direct_tips.network === 122 ? fusePrice : ethPrice,
                    )}
                  </div>
                </div>
                <div className="text-xs opacity-75">
                  <TimeAgo timestamp={notif.created_at} />
                </div>
              </div>
            </Link>
          );
        }

        return <span key={index}>{message}</span>;
      })}
      {visibleNotifications < allNotifications.length && (
        <button
          onClick={showMoreNotifications}
          className="btn btn-primary w-full mt-4"
        >
          Show More
        </button>
      )}
    </div>
  );
};

export default Notifications;

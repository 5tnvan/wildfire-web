"use client";

import { useState } from "react";
import Image from "next/image";
import { NextPage } from "next";
import { TimeAgo } from "~~/components/wildfire/TimeAgo";
import { useLikes } from "~~/hooks/wildfire/useLikes";
// Updated hook import
import { updateApprove, updateView } from "~~/utils/wildfire/crud/3sec";
import { insertLike } from "~~/utils/wildfire/crud/3sec_fires";

const Admin: NextPage = () => {
  const { loading, feeds, fetchMore, hasMore } = useLikes(); // Updated useAdmin hook

  // Store view counts in state
  const [viewCounts, setViewCounts] = useState<{ [key: string]: number }>({});
  const [showToast, setShowToast] = useState<null | string>(null);

  // Handle approve action
  function handleApprove(id: any) {
    updateApprove(id);
  }

  // Handle update view count
  async function handleUpdateView(id: any) {
    const view = viewCounts[id] || 0;
    const success = await updateView(id, view);

    console.log("success", success);

    if (success) {
      console.log("View count updated successfully");
      setShowToast("View count updated successfully");
      setTimeout(() => {
        setShowToast(null);
      }, 1000);
    } else {
      console.log("Failed to update view count");
    }
  }

  // Handle input change for views
  function handleInputChange(id: any, value: number) {
    setViewCounts(prev => ({
      ...prev,
      [id]: value,
    }));
  }

  // Handle like action
  async function handleLike(user_id: any, video_id: any) {
    const error = await insertLike(video_id);
    if (!error) {
      setShowToast("Post liked successfully");

      // Set the toast back to null after 4 seconds
      setTimeout(() => {
        setShowToast(null);
      }, 1000);
    }
  }

  return (
    <>
      <div id="feed-page" className="flex flex-col h-screen-custom overflow-scroll ml-2">
        {/* Render feeds */}
        <div className="video-list flex flex-col gap-2">
          {feeds.map(feed => (
            <>
              {feed.liked == false && (
                <div key={feed.id} className="video-item flex flex-row gap-2">
                  <div className="flex flex-col w-52 border rounded-lg p-2">
                    <div className="flex flex-row gap-1">
                      <p>{feed.profile.username}</p>
                      <p>
                        <TimeAgo timestamp={feed.created_at} />
                      </p>
                    </div>
                    <Image
                      src={feed.thumbnail_url}
                      alt={feed.profile.username}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                    <a href={`/v/` + feed.id} target="_blank" rel="noopener noreferrer" className="text-primary mt-2">
                      Watch Video
                    </a>
                  </div>
                  <div className="w-48 border rounded-lg p-2">
                    <p>{feed[`3sec_views`][0].view_count} views</p>
                    <p>{feed[`3sec_fires`][0].count} likes</p>
                    <p>{feed[`3sec_comments`].length} comments</p>
                    {feed.suppressed ? (
                      <div className="btn btn-primary" onClick={() => handleApprove(feed.id)}>
                        Approve
                      </div>
                    ) : (
                      <div className="btn">Undo Approve</div>
                    )}
                  </div>
                  <div className="border rounded-lg p-2">
                    {/* Input for updating view count */}
                    <input
                      type="number"
                      placeholder="Update views"
                      value={viewCounts[feed.id] || 0}
                      onChange={e => handleInputChange(feed.id, parseInt(e.target.value))}
                      className="border rounded-lg p-2 mr-2"
                    />
                    <div className="btn" onClick={() => handleUpdateView(feed.id)}>
                      Update Views
                    </div>
                  </div>
                  <div className="border rounded-lg p-2">
                    {feed.liked ? (
                      <div className="btn">Unlike</div>
                    ) : (
                      <div className="btn btn-primary" onClick={() => handleLike(feed.profile.id, feed.id)}>
                        Like
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ))}
        </div>

        {/* Toast message */}
        {showToast !== null && (
          <div className="absolute bottom-0 right-0 toast">
            <div className="alert alert-info">
              <span>{showToast}</span>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loading && <p>Loading...</p>}

        {/* Pagination Buttons */}
        <div className="pagination-controls flex justify-between mt-4">
          <button
            className={`btn btn-primary ${!hasMore && "opacity-50 cursor-not-allowed"}`}
            disabled={!hasMore}
            onClick={fetchMore}
          >
            Load More
          </button>
        </div>
      </div>
    </>
  );
};

export default Admin;

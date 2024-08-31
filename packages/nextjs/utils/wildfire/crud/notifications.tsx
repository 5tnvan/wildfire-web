"use server";

import { createClient } from "~~/utils/supabase/server";

export async function updateFollowerRead(notification_id: any) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("notifications")
        .update({ follower_read: true })
        .eq("id", notification_id);
    if (error) {
        return null;
    }
    return data;
}

export async function updateFireRead(notification_id: any) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("notifications_fires")
        .update({ read: true })
        .eq("id", notification_id);
    if (error) {
        return null;
    }
    return data;
}


export async function updateCommentRead(notification_id: any) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("notifications_comments")
        .update({ read: true })
        .eq("id", notification_id);
    if (error) {
        return null;
    }
    return data;
}

export async function updateTipRead(notification_id: any) {
    console.log("im here", notification_id);
    const supabase = createClient();

    const { data, error } = await supabase
        .from("notifications_tips")
        .update({ read: true })
        .eq("id", notification_id);
    if (error) {
        console.log(error);
        return null;
    }
    return data;
}
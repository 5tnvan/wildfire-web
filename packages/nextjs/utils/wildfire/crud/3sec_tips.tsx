"use server";

import { createClient } from "@/utils/supabase/server";

export async function insertTip(
  video_id: any,
  network: any,
  transaction_hash: any,
  amount: any,
  currency: any,
  comment: any,
  wallet_id: any,
) {
  const supabase = createClient();

  console.log("insertTip", video_id, network, transaction_hash, amount, currency, comment, wallet_id);

  const { error } = await supabase.from("3sec_tips").insert({
    video_id: video_id,
    network: network,
    transaction_hash: transaction_hash,
    amount: amount,
    currency: currency,
    comment: comment,
    wallet_id: wallet_id,
  });

  if (error) {
    console.log("insertTip", error);
    return error;
  }
}

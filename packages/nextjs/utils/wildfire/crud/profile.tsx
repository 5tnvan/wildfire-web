"use server";

import { createClient } from "@/utils/supabase/server";

/* UPDATE USER SOCIAL LINKS */
export async function updateProfileSocial(social: any, inputVal: any) {
  const supabase = createClient();

  //get user from supabase db
  const { data } = await supabase.auth.getUser();

  if (!data?.user?.id) {
    return null;
  } else {
    //otherwise fetch user profile using user ID
    const { error } = await supabase
      .from("profiles")
      .update({ [social]: inputVal })
      .eq("id", data.user.id);

    if (error) {
      console.log(error.hint);
      console.log(error.message);
    }
  }
}

/* GET PUBLIC URL */
export async function getPublicURL(filePath: any) {
  const supabase = createClient();
  const { data } = supabase.storage.from("avatars").getPublicUrl(`${filePath}`);
  return data;
}

/* CHECK IF FILES EXIST */
export async function checkFileExists(profile_id: any) {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("avatars").list(`${profile_id}`);

  if (error) {
    console.error(error);
    return { bool: false, data: null };
  }
  if (data.length == 0) {
    return { bool: false, data: null };
  }
  if (data.length > 0) {
    return { bool: true, data: data };
  }
}

/* UPLOAD PROFILE PIC */
export async function uploadProfileAvatar(user_id: any, file: any) {
  const supabase = createClient();

  if (user_id) {
    const { data: paths, error } = await supabase.storage.from("avatars").upload(`${user_id}/${Date.now()}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      throw new Error(error.message);
    }
    return paths;
  }
}

/* DELETE PROFILE PIC */
export async function deleteProfileAvatars(user_id: any, files: any) {
  const supabase = createClient();

  if (user_id) {
    const filesToDelete = files.map((item: any) => `${user_id}/${item.name}`) || [];
    const { error } = await supabase.storage.from("avatars").remove(filesToDelete);
    if (error) console.log("delete", error);
  }
}

/* UPDATE AVATAR LINK */
export async function updateProfileAvatar(user_id: any, url: any) {
  const supabase = createClient();

  if (user_id) {
    const { error } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", user_id);

    if (error) {
      return error;
    }
  }
}

/* UPDATE PROFILE */
export async function updateProfileWallet(
  user_id: any,
  wallet_id: any,
  wallet_sign_hash: string,
  wallet_sign_timestamp: string,
) {
  const supabase = createClient();

  //if user not found
  if (user_id) {
    //otherwise update user profile using user ID
    const { error } = await supabase
      .from("profiles")
      .update({
        wallet_id: wallet_id,
        wallet_sign_hash: wallet_sign_hash,
        wallet_sign_timestamp: wallet_sign_timestamp,
      })
      .eq("id", user_id);

    if (error) {
      console.log(error);
    }
  }
}

/* RESET PROFILE */
export async function resetProfileWallet() {
  const supabase = createClient();

  //get user from supabase db
  const { data, error } = await supabase.auth.getUser();

  //if user not found
  if (error || !data?.user) {
    return { user: data, error: error };
  } else {
    //otherwise update user profile using user ID
    const { error } = await supabase
      .from("profiles")
      .update({
        wallet_id: null,
        wallet_sign_hash: null,
        wallet_sign_timestamp: null,
      })
      .eq("id", data.user.id);

    if (error) {
      console.log(error);
    }
  }
}

/* WALLET EXISTS? */
export async function checkWalletExist(wallet_id: any) {
  const supabase = createClient();

  const { data } = await supabase.from("profiles").select("*").eq("wallet_id", wallet_id);
  if (data && data?.length > 0) {
    return true;
  } else {
    return false;
  }
}

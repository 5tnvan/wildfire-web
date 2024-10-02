"use client";

import { createContext } from "react";

import { User } from "@supabase/supabase-js";

const AuthContext = createContext<{
  loadingAuth: boolean;
  isAuthenticated: boolean | undefined;
  user: User | null;
  refetchAuth: () => void;
}>({
  loadingAuth: false,
  isAuthenticated: undefined,
  user: null,
  refetchAuth: () => {
    /* */
  },
});
const AuthUserContext = createContext<{
  loadingAuthUser: boolean;
  profile: any;
  refetchAuthUser: () => void;
}>({
  loadingAuthUser: false,
  profile: null,
  refetchAuthUser: () => {
    /* */
  },
});
const AuthUserAccountContext = createContext<{
  account: any;
  refetchAuthUserAccount: () => void;
}>({
  account: null,
  refetchAuthUserAccount: () => {
    /* */
  },
});
const AuthUserFollowsContext = createContext<{
  loadingFollows: boolean;
  followers: any;
  following: any;
  followed: any;
  refetchAuthUserFollows: () => void;
}>({
  loadingFollows: false,
  followers: null,
  following: null,
  followed: null,
  refetchAuthUserFollows: () => {
    /* */
  },
});

export { AuthContext, AuthUserContext, AuthUserAccountContext, AuthUserFollowsContext };

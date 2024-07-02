"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { AuthContext, AuthUserAccountContext, AuthUserContext, AuthUserFollowsContext } from "~~/app/context";
import { login, signInWithGoogle } from "~~/utils/login";

const Login: NextPage = () => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<any>();

  const { refetchAuth } = useContext(AuthContext);
  const { refetchAuthUser } = useContext(AuthUserContext);
  const { refetchAuthUserFollows } = useContext(AuthUserFollowsContext);
  const { refetchAuthUserAccount } = useContext(AuthUserAccountContext);

  const handleLogin = async (event: any) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      await login(formData); // Wait for login process to finish
      await refetchAuth();
      await refetchAuthUser();
      await refetchAuthUserFollows();
      await refetchAuthUserAccount();
      router.push("/feed");
    } catch (error) {
      setError("Login failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* CONTENT */}
      <div className="flex flex-col justify-center items-center px-5 grow">
        <h1 className="text-3xl my-5">Welcome back</h1>
        <form onSubmit={handleLogin} className="w-full lg:w-[450px]">
          <label className="input input-bordered flex items-center gap-2 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input type="text" name="email" className="grow bg-base-100" placeholder="Email" />
          </label>
          <label className="input input-bordered flex items-center gap-2 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input type="password" name="password" placeholder="Password" className="grow bg-base-100" />
          </label>

          <button type="submit" className="btn btn-primary text-base w-full" onClick={() => setIsProcessing(true)}>
            Login {isProcessing && <span className="loading loading-ring loading-md"></span>}
          </button>

          {error && (
            <div role="alert" className="flex alert alert-error mt-3">
              <div className="cursor-pointer">
                <XCircleIcon width={20} onClick={() => setError(null)} />
              </div>
              <span>{error}</span>
            </div>
          )}
        </form>
        <div className="flex flex-col items-center my-5">
          <div className="flex flex-col gap-3 items-center justify-center">
            <button
              className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
              onClick={() => signInWithGoogle()}
            >
              <Image
                className="w-6 h-6"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
                width={10}
                height={10}
              />
              <span>Login with Google</span>
            </button>
            <Link
              className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
              href="https://www.wildpay.app/getstarted"
            >
              <Image
                className="w-6 h-6"
                src="/wildpay-logo.svg"
                loading="lazy"
                alt="google logo"
                width={10}
                height={10}
              />
              <span>Register with Wildpay</span>
            </Link>
          </div>
          {/* <div>
            {`Forgot Password `}
            <Link href="/login/forgotpassword" className="link link-secondary">
              Reset
            </Link>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Login;

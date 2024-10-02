"use client";

import React from "react";
import type { NextPage } from "next";
import Link from "next/link";

const Help: NextPage = () => {
  return (
    <>
      <div className="grow px-5">
        <h1 className="text-3xl py-5 flex flex-row mb-3 justify-center">{`We're here to help.`}</h1>
        <div className="flex flex-col lg:flex-row gap-3 mb-3 justify-center">
          <div className="card w-full lg:w-96 bg-base-100 text-primary-content">
            <div className="card-body">
              <h2 className="card-title">What is Wildfire?</h2>
              <p>Wildfire is a content sharing app based on 3 seconds video.</p>
              <div className="card-actions justify-end">
                <Link href="/" className="btn">
                  Visit Wildfire
                </Link>
              </div>
            </div>
          </div>

          <div className="card w-full lg:w-96 bg-base-100 text-primary-content">
            <div className="card-body">
              <h2 className="card-title">What is Wildpay?</h2>
              <p>Wildfire is a social payment app, allowing anyone to pay or tip to anyone</p>
              <div className="card-actions justify-end">
                <Link href="https://wwww.wildpay.app" className="btn">
                  Go to Wildpay
                </Link>
              </div>
            </div>
          </div>

          <div className="card w-full lg:w-96 bg-base-100 text-primary-content">
            <div className="card-body">
              <h2 className="card-title">How do I register?</h2>
              <p>Register a Wildpay account using your email.</p>
              <div className="card-actions justify-end">
                <Link href="https://wwww.wildpay.app/getstarted" className="btn">
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          <div className="card w-full lg:w-96 bg-base-100 text-primary-content">
            <div className="card-body">
              <h2 className="card-title">How do I log in?</h2>
              <p>Login with your Wildpay & Wildfire account, using the same username and password</p>
              <div className="card-actions justify-end">
                <Link href="/login" className="btn">
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-3 mb-3 justify-center">
          <div className="card w-full lg:w-96 bg-base-100 text-primary-content">
            <div className="card-body">
              <h2 className="card-title">Can I delete my data?</h2>
              <p>Yes, you can delete your data and keep your account.</p>
              <div className="card-actions justify-end">
                <Link href="/account/delete-data" className="btn">
                  Request
                </Link>
              </div>
            </div>
          </div>

          <div className="card w-full lg:w-96 bg-base-100 text-primary-content">
            <div className="card-body">
              <h2 className="card-title">Can I delete my account?</h2>
              <p>Yes, you can delete your account and all your data.</p>
              <div className="card-actions justify-end">
                <Link href="/account/delete-account" className="btn">
                  Request
                </Link>
              </div>
            </div>
          </div>

          <div className="card w-full lg:w-96 bg-base-100 text-primary-content">
            <div className="card-body">
              <h2 className="card-title">How do I get paid?</h2>
              <p>Creators are tipped by followers. Upon verifiying your wallet, you are ready to receive tips.</p>
              <div className="card-actions justify-end">
                <Link href="https://www.wildpay.com" className="btn">
                  Visit Wildpay
                </Link>
              </div>
            </div>
          </div>

          <div className="card w-full lg:w-96 bg-base-100 text-primary-content">
            <div className="card-body">
              <h2 className="card-title">How do I withdraw?</h2>
              <p>You can withdraw on Wildpay, instantly at anytime.</p>
              <div className="card-actions justify-end">
                <Link href="https://www.wildpay.app/settings" className="btn">
                  Withdraw
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row mt-10 justify-center">
          <span className="mr-1">Still need help? Email to: </span>
          <Link className="link" href="mailto:help@micalabs.org">
            help@micalabs.org
          </Link>
        </div>
      </div>
    </>
  );
};

export default Help;

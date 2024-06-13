"use client";

import type { NextPage } from "next";

const PrivacyPage: NextPage = () => {
  return (
    <>
      <div className="grow p-5 w-full">
        <h1 className="text-3xl py-5">{`Privacy Policy`}</h1>
        <div>
          <p>
            <strong>Effective Date:</strong> June 11, 2024
          </p>

          <p>
            Welcome to Wildfire! This Privacy Policy explains how Wildfire {`"we," "our," or "us"`} collects, uses, and
            protects your personal information when you use our 3-second content-sharing video app.
          </p>

          <h2 className="text-xl">1. Information We Collect</h2>

          <h3 className="text-lg mt-5">1.1. Information You Provide</h3>
          <ul>
            <li>
              <strong>Account Information:</strong> When you create an account, we collect your username, email address,
              and password.
            </li>
            <li>
              <strong>Profile Information:</strong> You may choose to provide additional information, such as a profile
              picture and bio.
            </li>
            <li>
              <strong>Social Media Accounts:</strong> If you choose to link your social media accounts, we store the
              link to your other social media accounts.
            </li>
            <li>
              <strong>Content:</strong> Any videos, comments, and other content you share on the App.
            </li>
          </ul>

          <h2 className="text-xl mt-8">2. Information We DO NOT Collect</h2>

          <h3 className="text-lg mt-5">2.1. Information That Might Be Automatically Collected</h3>
          <ul>
            <li>
              <strong>We Do Not Collect Usage Information:</strong> Details about how you use the App, including how
              long {`you've`} been on the app or your watch history.
            </li>
            <li>
              <strong>We Do Not Collect Device Information:</strong> Information about the device you use to access the
              App, such as IP address, device type, operating system, and mobile network information.
            </li>
            <li>
              <strong>We Do Not Collect Location Information:</strong> We do not collect your location based on your IP
              address or, with or without your consent, precise location data from your device.
            </li>
          </ul>

          <h2 className="text-xl mt-8">3. How We Use Your Information</h2>

          <h3 className="text-lg mt-5">3.1. To Provide and Improve Our Services</h3>
          <ul>
            <li>Operate and maintain the App.</li>
            <li>Personalize your experience.</li>
            <li>Improve, test, and enhance the {`App's`} functionality.</li>
          </ul>

          <h3 className="text-lg mt-5">3.2. To Communicate with You</h3>
          <ul>
            <li>Send you updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and requests.</li>
          </ul>

          <h3 className="text-lg mt-5">3.3. To Ensure Safety and Security</h3>
          <ul>
            <li>Monitor content and comments to detect and prevent fraudulent activities.</li>
            <li>Enforce our terms of service and other policies.</li>
          </ul>

          <h2 className="text-xl mt-8">4. How We Share Your Information</h2>

          <h3 className="text-lg mt-5">4.1. With Other Users</h3>
          <p>Your profile information and the content you share are visible to other users of the App.</p>

          <h3>4.2. With Service Providers</h3>
          <p>
            We may share your information with third-party service providers who perform services on our behalf, such as
            content hosting and database systems.
          </p>

          <h3 className="text-lg mt-5">4.3. For Legal Reasons</h3>
          <p>
            We may disclose your information if required by law or in response to a legal process, such as a court order
            or subpoena.
          </p>

          <h2 className="text-xl mt-8">5. Your Choices</h2>

          <h3 className="text-lg mt-5">5.1. Access and Update Your Information</h3>
          <p>You can access and update your profile information through the App.</p>

          <h3 className="text-lg mt-5">5.2. Delete Your Account</h3>
          <p>
            You can delete your account or delete your data. Upon deletion, your account, profile or data will be
            removed from the App within 14 days, although some information may be retained for legal or administrative
            purposes.
          </p>

          <h3 className="text-lg mt-5">5.3. Opt-Out of Communications</h3>
          <p>
            You can opt-out of receiving notifications or promotional messages from us by following the instructions in those messages.
          </p>

          <h2 className="text-xl mt-8">6. Security</h2>
          <p>
            We implement reasonable security measures to protect your information. However, no method of transmission
            over the Internet or electronic storage is completely secure, so we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl mt-8">{`7. Children's Privacy`}</h2>
          <p>
            Wildfire is not intended for children under 13. We do not knowingly collect personal information from
            children under 13. If we become aware that a child under 13 has provided us with personal information, we
            will take steps to delete such information.
          </p>

          <h2 className="text-lg mt-5">8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on the App and updating the effective date. Your continued use of the App after any changes
            to the Privacy Policy constitutes your acceptance of the changes.
          </p>

          <h2 className="text-lg mt-5">9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>

          <p>
            <strong>Email:</strong> tran@micalabs.com
          </p>

          <p>Thank you for using Wildfire!</p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;

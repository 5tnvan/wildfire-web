"use client";

import type { NextPage } from "next";

const PrivacyPage: NextPage = () => {
  return (
    <>
      <div className="grow p-5 w-1/2 m-auto">
        <h1 className="text-3xl py-5">{`Terms`} and Conditions</h1>
        <div>
          <p>
            <strong>Effective Date:</strong> June 11, 2024
          </p>

          <p>
            Welcome to Wildfire! These Terms and Conditions {`("Terms")`} govern your use of our 3-second
            content-sharing video app {`("App")`}. By using Wildfire, you agree to be bound by these Terms. If you do
            not agree, please do not use the App.
          </p>

          <h2 className="text-xl mt-8">1. Acceptance of Terms</h2>
          <p>
            By creating an account or using the App, you agree to comply with and be bound by these Terms, our Privacy
            Policy, and any additional terms and conditions that may apply to specific sections of the App or to
            products and services available through the App.
          </p>

          <h2 className="text-xl mt-8">2. Eligibility</h2>
          <p>
            You must be at least 13 years old to use the App. By using the App, you represent and warrant that you meet
            this age requirement.
          </p>

          <h2 className="text-xl mt-8">3. Account Registration</h2>
          <p>
            To access certain features of the App, you must create an account. You agree to provide accurate, current,
            and complete information during the registration process and to update such information to keep it accurate,
            current, and complete. You are responsible for safeguarding your account information and for all activities
            that occur under your account.
          </p>

          <h2 className="text-xl mt-8">4. User Conduct</h2>
          <p>When using the App, you agree not to:</p>
          <ul>
            <li>
              Post or share content that is unlawful, harmful, threatening, abusive, defamatory, or otherwise
              objectionable.
            </li>
            <li>
              Impersonate any person or entity, or falsely state or otherwise misrepresent yourself or your affiliation
              with any person or entity.
            </li>
            <li>
              Engage in any activity that interferes with or disrupts the App or the servers and networks connected to
              the App.
            </li>
            <li>Use the App for any illegal or unauthorized purpose.</li>
          </ul>

          <h2 className="text-xl mt-8">5. Content Ownership and Rights</h2>
          <p>
            You retain ownership of any content you post or share on the App. By posting or sharing content on the App,
            you grant us a non-exclusive, royalty-free, worldwide, sublicensable, and transferable license to use,
            reproduce, distribute and display the content in connection with the App.
          </p>

          <h2 className="text-xl mt-8">6. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the App at our sole discretion, without prior notice
            or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the
            App will immediately cease.
          </p>

          <h2 className="text-xl mt-8">7. Disclaimers</h2>
          <p>
            The App is provided on an {`"as is" and "as available"`} basis. We make no warranties, expressed or implied,
            regarding the App, including but not limited to, implied warranties of merchantability, fitness for a
            particular purpose, and non-infringement. We do not warrant that the App will be uninterrupted, secure, or
            error-free.
          </p>

          <h2 className="text-xl mt-8">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or
            indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (i) your use or
            inability to use the App; (ii) any unauthorized access to or use of our servers and/or any personal
            information stored therein; (iii) any bugs, viruses, trojan horses, or the like that may be transmitted to
            or through the App by any third party; or (iv) any errors or omissions in any content or for any loss or
            damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made
            available through the App.
          </p>

          <h2 className="text-xl mt-8">9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which
            Wildfire is based, without regard to its conflict of law provisions.
          </p>

          <h2 className="text-xl mt-8">10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material, we will provide at least 30 {`days'`} notice prior to any new terms taking effect. What
            constitutes a material change will be determined at our sole discretion. Your continued use of the App after
            any such changes constitutes your acceptance of the new Terms.
          </p>

          <h2 className="text-xl mt-8">11. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>

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

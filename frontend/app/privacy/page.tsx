"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Header */}
        <section className="w-full py-12 md:py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Link
                  href="/"
                  className="inline-flex items-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Home
                </Link>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Privacy Policy
                </h1>
                <p className="text-muted-foreground">
                  Last updated: April 3, 2025
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="w-full py-12 md:py-16">
          <div className="container mx-auto px-4 py-8 m-4">
            <style jsx global>{`
              [data-custom-class="body"],
              [data-custom-class="body"] * {
                background: transparent !important;
              }
              [data-custom-class="title"],
              [data-custom-class="title"] * {
                font-family: Arial !important;
                font-size: 26px !important;
                color: #000000 !important;
              }
              [data-custom-class="subtitle"],
              [data-custom-class="subtitle"] * {
                font-family: Arial !important;
                color: #595959 !important;
                font-size: 14px !important;
              }
              [data-custom-class="heading_1"],
              [data-custom-class="heading_1"] * {
                font-family: Arial !important;
                font-size: 19px !important;
                color: #000000 !important;
              }
              [data-custom-class="heading_2"],
              [data-custom-class="heading_2"] * {
                font-family: Arial !important;
                font-size: 17px !important;
                color: #000000 !important;
              }
              [data-custom-class="body_text"],
              [data-custom-class="body_text"] * {
                color: #595959 !important;
                font-size: 14px !important;
                font-family: Arial !important;
              }
              [data-custom-class="link"],
              [data-custom-class="link"] * {
                color: #3030f1 !important;
                font-size: 14px !important;
                font-family: Arial !important;
                word-break: break-word !important;
              }
              ul {
                list-style-type: square;
              }
              ul > li > ul {
                list-style-type: circle;
              }
              ul > li > ul > li > ul {
                list-style-type: square;
              }
              ol li {
                font-family: Arial;
              }
            `}</style>

            <div data-custom-class="body">
              <div>
                <strong>
                  <span style={{ fontSize: "26px" }}>
                    <span data-custom-class="title">
                      <h1>PRIVACY POLICY</h1>
                    </span>
                  </span>
                </strong>
              </div>
              <div>
                <span style={{ color: "rgb(127, 127, 127)" }}>
                  <strong>
                    <span style={{ fontSize: "15px" }}>
                      <span data-custom-class="subtitle">
                        Last updated April 15, 2025
                      </span>
                    </span>
                  </strong>
                </span>
              </div>
              <div className="mt-6">
                <span style={{ color: "rgb(127, 127, 127)" }}>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "15px" }}>
                    <span data-custom-class="body_text">
                      This Privacy Notice for Taskpilot Labs ('
                      <strong>we</strong>', '<strong>us</strong>', or '
                      <strong>our</strong>'), describes how and why we might
                      access, collect, store, use, and/or share ('
                      <strong>process</strong>') your personal information when
                      you use our services ('<strong>Services</strong>'),
                      including when you:
                    </span>
                  </span>
                </span>
              </div>
              <ul>
                <li data-custom-class="body_text" style={{ lineHeight: 1.5 }}>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    Visit our website at{" "}
                    <span style={{ color: "rgb(0, 58, 250)" }}>
                      <a
                        href="https://taskpilot.xyz"
                        target="_blank"
                        data-custom-class="link"
                      >
                        https://taskpilot.xyz
                      </a>
                    </span>
                    , or any website of ours that links to this Privacy Notice
                  </span>
                </li>
                <li data-custom-class="body_text" style={{ lineHeight: 1.5 }}>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    Engage with us in other related ways, including any sales,
                    marketing, or events
                  </span>
                </li>
              </ul>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px", color: "rgb(127, 127, 127)" }}>
                  <span data-custom-class="body_text">
                    <strong>Questions or concerns? </strong>
                    Reading this Privacy Notice will help you understand your
                    privacy rights and choices. We are responsible for making
                    decisions about how your personal information is processed.
                    If you do not agree with our policies and practices, please
                    do not use our Services. If you still have any questions or
                    concerns, please contact us at{" "}
                    <strong>contact.taskpilot@gmail.com</strong>.
                  </span>
                </span>
              </div>

              {/* Summary of Key Points */}
              <div style={{ lineHeight: 1.5 }} className="mt-8">
                <strong>
                  <span style={{ fontSize: "15px" }}>
                    <span data-custom-class="heading_1">
                      <h2>SUMMARY OF KEY POINTS</h2>
                    </span>
                  </span>
                </strong>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    <strong>
                      <em>
                        This summary provides key points from our Privacy
                        Notice, but you can find out more details about any of
                        these topics by clicking the link following each key
                        point or by using our{" "}
                      </em>
                    </strong>
                    <a data-custom-class="link" href="#toc">
                      <strong>
                        <em>table of contents</em>
                      </strong>
                    </a>
                    <strong>
                      <em> below to find the section you are looking for.</em>
                    </strong>
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    <strong>What personal information do we process?</strong>{" "}
                    When you visit, use, or navigate our Services, we may
                    process personal information depending on how you interact
                    with us and the Services, the choices you make, and the
                    products and features you use. Learn more about{" "}
                    <a data-custom-class="link" href="#personalinfo">
                      personal information you disclose to us
                    </a>
                    .
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    <strong>
                      Do we process any sensitive personal information?{" "}
                    </strong>
                    We do not process sensitive personal information.
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    <strong>
                      Do we collect any information from third parties?
                    </strong>{" "}
                    We do not collect any information from third parties.
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    <strong>How do we process your information?</strong> We
                    process your information to provide, improve, and administer
                    our Services, communicate with you, for security and fraud
                    prevention, and to comply with law. We may also process your
                    information for other purposes with your consent. Learn more
                    about{" "}
                    <a data-custom-class="link" href="#infouse">
                      how we process your information
                    </a>
                    .
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    <strong>
                      In what situations and with which parties do we share
                      personal information?
                    </strong>{" "}
                    We may share information in specific situations and with
                    specific third parties. Learn more about{" "}
                    <a data-custom-class="link" href="#whoshare">
                      when and with whom we share your personal information
                    </a>
                    .
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    <strong>How do we keep your information safe?</strong> We
                    have adequate organisational and technical processes and
                    procedures in place to protect your personal information.
                    However, no electronic transmission over the internet or
                    information storage technology can be guaranteed to be 100%
                    secure, so we cannot promise or guarantee that hackers,
                    cybercriminals, or other unauthorised third parties will not
                    be able to defeat our security and improperly collect,
                    access, steal, or modify your information. Learn more about{" "}
                    <a data-custom-class="link" href="#infosafe">
                      how we keep your information safe
                    </a>
                    .
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    <strong>What are your rights?</strong> Depending on where
                    you are located geographically, the applicable privacy law
                    may mean you have certain rights regarding your personal
                    information. Learn more about{" "}
                    <a data-custom-class="link" href="#privacyrights">
                      your privacy rights
                    </a>
                    .
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    <strong>How do you exercise your rights?</strong> The
                    easiest way to exercise your rights is by submitting a{" "}
                    <a
                      data-custom-class="link"
                      href="https://app.termly.io/notify/21237ff5-323f-4141-b106-87079f31384d"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      data subject access request
                    </a>
                    , or by contacting us. We will consider and act upon any
                    request in accordance with applicable data protection laws.
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    Want to learn more about what we do with any information we
                    collect?{" "}
                    <a data-custom-class="link" href="#toc">
                      Review the Privacy Notice in full
                    </a>
                    .
                  </span>
                </span>
              </div>

              {/* Table of Contents */}
              <div id="toc" style={{ lineHeight: 1.5 }} className="mt-8">
                <span style={{ fontSize: "15px", color: "rgb(127, 127, 127)" }}>
                  <span style={{ color: "rgb(0, 0, 0)" }}>
                    <strong>
                      <span data-custom-class="heading_1">
                        <h2>TABLE OF CONTENTS</h2>
                      </span>
                    </strong>
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <a data-custom-class="link" href="#infocollect">
                    <span style={{ color: "rgb(0, 58, 250)" }}>
                      1. WHAT INFORMATION DO WE COLLECT?
                    </span>
                  </a>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <a data-custom-class="link" href="#infouse">
                    <span style={{ color: "rgb(0, 58, 250)" }}>
                      2. HOW DO WE PROCESS YOUR INFORMATION?
                    </span>
                  </a>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <a data-custom-class="link" href="#whoshare">
                    <span style={{ color: "rgb(0, 58, 250)" }}>
                      3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL
                      INFORMATION?
                    </span>
                  </a>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <a data-custom-class="link" href="#ai">
                    <span style={{ color: "rgb(0, 58, 250)" }}>
                      4. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?
                    </span>
                  </a>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <a data-custom-class="link" href="#inforetain">
                    <span style={{ color: "rgb(0, 58, 250)" }}>
                      5. HOW LONG DO WE KEEP YOUR INFORMATION?
                    </span>
                  </a>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <a data-custom-class="link" href="#infosafe">
                    <span style={{ color: "rgb(0, 58, 250)" }}>
                      6. HOW DO WE KEEP YOUR INFORMATION SAFE?
                    </span>
                  </a>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <a data-custom-class="link" href="#privacyrights">
                    <span style={{ color: "rgb(0, 58, 250)" }}>
                      7. WHAT ARE YOUR PRIVACY RIGHTS?
                    </span>
                  </a>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <a data-custom-class="link" href="#DNT">
                    <span style={{ color: "rgb(0, 58, 250)" }}>
                      8. CONTROLS FOR DO-NOT-TRACK FEATURES
                    </span>
                  </a>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <a data-custom-class="link" href="#policyupdates">
                    <span style={{ color: "rgb(0, 58, 250)" }}>
                      9. DO WE MAKE UPDATES TO THIS NOTICE?
                    </span>
                  </a>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <a data-custom-class="link" href="#contact">
                    <span style={{ color: "rgb(0, 58, 250)" }}>
                      10. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                    </span>
                  </a>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <a data-custom-class="link" href="#request">
                    <span style={{ color: "rgb(0, 58, 250)" }}>
                      11. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE
                      COLLECT FROM YOU?
                    </span>
                  </a>
                </span>
              </div>

              {/* Section 1: What Information Do We Collect */}
              <div
                id="infocollect"
                style={{ lineHeight: 1.5 }}
                className="mt-8"
              >
                <span style={{ color: "rgb(0, 0, 0)" }}>
                  <span style={{ fontSize: "15px" }}>
                    <strong>
                      <span data-custom-class="heading_1">
                        <h2>1. WHAT INFORMATION DO WE COLLECT?</h2>
                      </span>
                    </strong>
                  </span>
                </span>
                <span
                  data-custom-class="heading_2"
                  id="personalinfo"
                  style={{ color: "rgb(0, 0, 0)" }}
                >
                  <span style={{ fontSize: "15px" }}>
                    <strong>
                      <h3>Personal information you disclose to us</h3>
                    </strong>
                  </span>
                </span>
                <span style={{ color: "rgb(127, 127, 127)" }}>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "15px" }}>
                    <span data-custom-class="body_text">
                      <strong>
                        <em>In Short:</em>
                      </strong>
                      <em>
                        {" "}
                        We collect personal information that you provide to us.
                      </em>
                    </span>
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                  <span data-custom-class="body_text">
                    We collect personal information that you voluntarily provide
                    to us when you register on the Services, express an interest
                    in obtaining information about us or our products and
                    Services, when you participate in activities on the
                    Services, or otherwise when you contact us.
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                  <span data-custom-class="body_text">
                    <strong>Personal Information Provided by You.</strong> The
                    personal information that we collect depends on the context
                    of your interactions with us and the Services, the choices
                    you make, and the products and features you use. The
                    personal information we collect may include the following:
                  </span>
                </span>
              </div>
              <ul>
                <li data-custom-class="body_text" style={{ lineHeight: 1.5 }}>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    names
                  </span>
                </li>
                <li data-custom-class="body_text" style={{ lineHeight: 1.5 }}>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    email addresses
                  </span>
                </li>
                <li data-custom-class="body_text" style={{ lineHeight: 1.5 }}>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    usernames
                  </span>
                </li>
              </ul>
              <div
                id="sensitiveinfo"
                style={{ lineHeight: 1.5 }}
                className="mt-4"
              >
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    <strong>Sensitive Information.</strong> We do not process
                    sensitive information.
                  </span>
                </span>
              </div>

              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                  <span data-custom-class="body_text">
                    All personal information that you provide to us must be
                    true, complete, and accurate, and you must notify us of any
                    changes to such personal information.
                  </span>
                </span>
              </div>

              {/* Section 2: How Do We Process Your Information */}
              <div id="infouse" style={{ lineHeight: 1.5 }} className="mt-8">
                <span style={{ color: "rgb(127, 127, 127)" }}>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "15px" }}>
                    <span
                      style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}
                    >
                      <span id="control" style={{ color: "rgb(0, 0, 0)" }}>
                        <strong>
                          <span data-custom-class="heading_1">
                            <h2>2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
                          </span>
                        </strong>
                      </span>
                    </span>
                  </span>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "15px" }}>
                    <span data-custom-class="body_text">
                      <strong>
                        <em>In Short: </em>
                      </strong>
                      <em>
                        We process your information to provide, improve, and
                        administer our Services, communicate with you, for
                        security and fraud prevention, and to comply with law.
                        We may also process your information for other purposes
                        with your consent.
                      </em>
                    </span>
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                  <span data-custom-class="body_text">
                    <strong>
                      We process your personal information for a variety of
                      reasons, depending on how you interact with our Services,
                      including:
                    </strong>
                  </span>
                </span>
              </div>
              <ul>
                <li data-custom-class="body_text" style={{ lineHeight: 1.5 }}>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    <strong>
                      To facilitate account creation and authentication and
                      otherwise manage user accounts.{" "}
                    </strong>
                    We may process your information so you can create and log in
                    to your account, as well as keep your account in working
                    order.
                  </span>
                </li>
              </ul>

              {/* Section 3: When and With Whom Do We Share Your Personal Information */}
              <div id="whoshare" style={{ lineHeight: 1.5 }} className="mt-8">
                <span style={{ color: "rgb(127, 127, 127)" }}>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "15px" }}>
                    <span
                      style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}
                    >
                      <span id="control" style={{ color: "rgb(0, 0, 0)" }}>
                        <strong>
                          <span data-custom-class="heading_1">
                            <h2>
                              3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL
                              INFORMATION?
                            </h2>
                          </span>
                        </strong>
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    <span data-custom-class="body_text">
                      <strong>
                        <em>In Short:</em>
                      </strong>
                      <em>
                        {" "}
                        We may share information in specific situations
                        described in this section and/or with the following
                        third parties.
                      </em>
                    </span>
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    We may need to share your personal information in the
                    following situations:
                  </span>
                </span>
              </div>
              <ul>
                <li data-custom-class="body_text" style={{ lineHeight: 1.5 }}>
                  <span style={{ fontSize: "15px" }}>
                    <span data-custom-class="body_text">
                      <strong>Business Transfers.</strong> We may share or
                      transfer your information in connection with, or during
                      negotiations of, any merger, sale of company assets,
                      financing, or acquisition of all or a portion of our
                      business to another company.
                    </span>
                  </span>
                </li>
              </ul>

              {/* Section 4: Do We Offer Artificial Intelligence-Based Products */}
              <div id="ai" style={{ lineHeight: 1.5 }} className="mt-8">
                <span style={{ fontSize: "15px" }}>
                  <strong>
                    <span data-custom-class="heading_1">
                      <h2>
                        4. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?
                      </h2>
                    </span>
                  </strong>
                  <strong>
                    <em>
                      <span data-custom-class="body_text">In Short:</span>
                    </em>
                  </strong>
                  <em>
                    <span data-custom-class="body_text">
                      {" "}
                      We offer products, features, or tools powered by
                      artificial intelligence, machine learning, or similar
                      technologies.
                    </span>
                  </em>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    As part of our Services, we offer products, features, or
                    tools powered by artificial intelligence, machine learning,
                    or similar technologies (collectively, 'AI Products'). These
                    tools are designed to enhance your experience and provide
                    you with innovative solutions. The terms in this Privacy
                    Notice govern your use of the AI Products within our
                    Services.
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <strong>
                    <span data-custom-class="body_text">Our AI Products</span>
                  </strong>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-2">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    Our AI Products are designed for the following functions:
                  </span>
                </span>
              </div>
              <ul>
                <li data-custom-class="body_text" style={{ lineHeight: 1.5 }}>
                  <span style={{ fontSize: "15px" }}>
                    <span data-custom-class="body_text">AI applications</span>
                  </span>
                </li>
              </ul>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <strong>
                    <span data-custom-class="body_text">
                      How We Process Your Data Using AI
                    </span>
                  </strong>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-2">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    All personal information processed using our AI Products is
                    handled in line with our Privacy Notice and our agreement
                    with third parties. This ensures high security and
                    safeguards your personal information throughout the process,
                    giving you peace of mind about your data's safety.
                  </span>
                </span>
              </div>

              {/* Section 5: How Long Do We Keep Your Information */}
              <div id="inforetain" style={{ lineHeight: 1.5 }} className="mt-8">
                <span style={{ color: "rgb(127, 127, 127)" }}>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "15px" }}>
                    <span
                      style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}
                    >
                      <span id="control" style={{ color: "rgb(0, 0, 0)" }}>
                        <strong>
                          <span data-custom-class="heading_1">
                            <h2>5. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
                          </span>
                        </strong>
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    <span data-custom-class="body_text">
                      <strong>
                        <em>In Short: </em>
                      </strong>
                      <em>
                        We keep your information for as long as necessary to
                        fulfil the purposes outlined in this Privacy Notice
                        unless otherwise required by law.
                      </em>
                    </span>
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                  <span data-custom-class="body_text">
                    We will only keep your personal information for as long as
                    it is necessary for the purposes set out in this Privacy
                    Notice, unless a longer retention period is required or
                    permitted by law (such as tax, accounting, or other legal
                    requirements). No purpose in this notice will require us
                    keeping your personal information for longer than the period
                    of time in which users have an account with us.
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                  <span data-custom-class="body_text">
                    When we have no ongoing legitimate business need to process
                    your personal information, we will either delete or
                    anonymise such information, or, if this is not possible (for
                    example, because your personal information has been stored
                    in backup archives), then we will securely store your
                    personal information and isolate it from any further
                    processing until deletion is possible.
                  </span>
                </span>
              </div>

              {/* Section 6: How Do We Keep Your Information Safe */}
              <div id="infosafe" style={{ lineHeight: 1.5 }} className="mt-8">
                <span style={{ color: "rgb(127, 127, 127)" }}>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "15px" }}>
                    <span
                      style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}
                    >
                      <span id="control" style={{ color: "rgb(0, 0, 0)" }}>
                        <strong>
                          <span data-custom-class="heading_1">
                            <h2>6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
                          </span>
                        </strong>
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    <span data-custom-class="body_text">
                      <strong>
                        <em>In Short: </em>
                      </strong>
                      <em>
                        We aim to protect your personal information through a
                        system of organisational and technical security
                        measures.
                      </em>
                    </span>
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                  <span data-custom-class="body_text">
                    We have implemented appropriate and reasonable technical and
                    organisational security measures designed to protect the
                    security of any personal information we process. However,
                    despite our safeguards and efforts to secure your
                    information, no electronic transmission over the Internet or
                    information storage technology can be guaranteed to be 100%
                    secure, so we cannot promise or guarantee that hackers,
                    cybercriminals, or other unauthorised third parties will not
                    be able to defeat our security and improperly collect,
                    access, steal, or modify your information. Although we will
                    do our best to protect your personal information,
                    transmission of personal information to and from our
                    Services is at your own risk. You should only access the
                    Services within a secure environment.
                  </span>
                </span>
              </div>

              {/* Section 7: What Are Your Privacy Rights */}
              <div
                id="privacyrights"
                style={{ lineHeight: 1.5 }}
                className="mt-8"
              >
                <span style={{ color: "rgb(127, 127, 127)" }}>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "15px" }}>
                    <span
                      style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}
                    >
                      <span id="control" style={{ color: "rgb(0, 0, 0)" }}>
                        <strong>
                          <span data-custom-class="heading_1">
                            <h2>7. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
                          </span>
                        </strong>
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    <span data-custom-class="body_text">
                      <strong>
                        <em>In Short:</em>
                      </strong>
                      <em>
                        {" "}
                        You may review, change, or terminate your account at any
                        time, depending on your country, province, or state of
                        residence.
                      </em>
                    </span>
                  </span>
                </span>
              </div>
              <div
                id="withdrawconsent"
                style={{ lineHeight: 1.5 }}
                className="mt-4"
              >
                <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                  <span data-custom-class="body_text">
                    <strong>
                      <u>Withdrawing your consent:</u>
                    </strong>{" "}
                    If we are relying on your consent to process your personal
                    information, you have the right to withdraw your consent at
                    any time. You can withdraw your consent at any time by
                    contacting us by using the contact details provided in the
                    section{" "}
                    <a data-custom-class="link" href="#contact">
                      HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                    </a>
                    below.
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    However, please note that this will not affect the
                    lawfulness of the processing before its withdrawal nor, when
                    applicable law allows, will it affect the processing of your
                    personal information conducted in reliance on lawful
                    processing grounds other than consent.
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="heading_2">
                    <strong>
                      <h3>Account Information</h3>
                    </strong>
                  </span>
                </span>
                <span data-custom-class="body_text">
                  <span style={{ fontSize: "15px" }}>
                    If you would at any time like to review or change the
                    information in your account or terminate your account, you
                    can:
                  </span>
                </span>
              </div>
              <ul>
                <li data-custom-class="body_text" style={{ lineHeight: 1.5 }}>
                  <span data-custom-class="body_text">
                    <span style={{ fontSize: "15px" }}>
                      Log in to your account settings and update your user
                      account.
                    </span>
                  </span>
                </li>
                <li data-custom-class="body_text" style={{ lineHeight: 1.5 }}>
                  <span data-custom-class="body_text">
                    <span style={{ fontSize: "15px" }}>
                      Contact us using the contact information provided.
                    </span>
                  </span>
                </li>
              </ul>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    Upon your request to terminate your account, we will
                    deactivate or delete your account and information from our
                    active databases. However, we may retain some information in
                    our files to prevent fraud, troubleshoot problems, assist
                    with any investigations, enforce our legal terms and/or
                    comply with applicable legal requirements.
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span data-custom-class="body_text">
                  <span style={{ fontSize: "15px" }}>
                    If you have questions or comments about your privacy rights,
                    you may email us at{" "}
                    <strong>contact.taskpilot@gmail.com</strong>.
                  </span>
                </span>
              </div>

              {/* Section 8: Controls for Do-Not-Track Features */}
              <div id="DNT" style={{ lineHeight: 1.5 }} className="mt-8">
                <span style={{ color: "rgb(127, 127, 127)" }}>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "15px" }}>
                    <span
                      style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}
                    >
                      <span id="control" style={{ color: "rgb(0, 0, 0)" }}>
                        <strong>
                          <span data-custom-class="heading_1">
                            <h2>8. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
                          </span>
                        </strong>
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    <span data-custom-class="body_text">
                      Most web browsers and some mobile operating systems and
                      mobile applications include a Do-Not-Track ('DNT') feature
                      or setting you can activate to signal your privacy
                      preference not to have data about your online browsing
                      activities monitored and collected. At this stage, no
                      uniform technology standard for recognising and
                      implementing DNT signals has been finalised. As such, we
                      do not currently respond to DNT browser signals or any
                      other mechanism that automatically communicates your
                      choice not to be tracked online. If a standard for online
                      tracking is adopted that we must follow in the future, we
                      will inform you about that practice in a revised version
                      of this Privacy Notice.
                    </span>
                  </span>
                </span>
              </div>

              {/* Section 9: Do We Make Updates to This Notice */}
              <div
                id="policyupdates"
                style={{ lineHeight: 1.5 }}
                className="mt-8"
              >
                <span style={{ color: "rgb(127, 127, 127)" }}>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "15px" }}>
                    <span
                      style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}
                    >
                      <span id="control" style={{ color: "rgb(0, 0, 0)" }}>
                        <strong>
                          <span data-custom-class="heading_1">
                            <h2>9. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
                          </span>
                        </strong>
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    <span data-custom-class="body_text">
                      <em>
                        <strong>In Short: </strong>Yes, we will update this
                        notice as necessary to stay compliant with relevant
                        laws.
                      </em>
                    </span>
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                  <span data-custom-class="body_text">
                    We may update this Privacy Notice from time to time. The
                    updated version will be indicated by an updated 'Revised'
                    date at the top of this Privacy Notice. If we make material
                    changes to this Privacy Notice, we may notify you either by
                    prominently posting a notice of such changes or by directly
                    sending you a notification. We encourage you to review this
                    Privacy Notice frequently to be informed of how we are
                    protecting your information.
                  </span>
                </span>
              </div>

              {/* Section 10: How Can You Contact Us About This Notice */}
              <div id="contact" style={{ lineHeight: 1.5 }} className="mt-8">
                <span style={{ color: "rgb(127, 127, 127)" }}>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "15px" }}>
                    <span
                      style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}
                    >
                      <span id="control" style={{ color: "rgb(0, 0, 0)" }}>
                        <strong>
                          <span data-custom-class="heading_1">
                            <h2>
                              10. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                            </h2>
                          </span>
                        </strong>
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    <span data-custom-class="body_text">
                      If you have questions or comments about this notice, you
                      may email us at{" "}
                      <strong>contact.taskpilot@gmail.com</strong> or contact us
                      by post at:
                    </span>
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }} className="mt-4">
                <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                  <span data-custom-class="body_text">Taskpilot Labs</span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    Shilp Complex, Sama-Savli Rd,
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    Raghuvir Nagar, Kasturba Nagar, New Sama, Vadodara, Gujarat
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">
                    Vadodara, Gujarat 390024
                  </span>
                </span>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <span style={{ fontSize: "15px" }}>
                  <span data-custom-class="body_text">India</span>
                </span>
              </div>

              {/* Section 11: How Can You Review, Update, or Delete the Data We Collect From You */}
              <div id="request" style={{ lineHeight: 1.5 }} className="mt-8">
                <span style={{ color: "rgb(127, 127, 127)" }}>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "15px" }}>
                    <span
                      style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}
                    >
                      <span id="control" style={{ color: "rgb(0, 0, 0)" }}>
                        <strong>
                          <span data-custom-class="heading_1">
                            <h2>
                              11. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA
                              WE COLLECT FROM YOU?
                            </h2>
                          </span>
                        </strong>
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: "15px", color: "rgb(89, 89, 89)" }}>
                    <span data-custom-class="body_text">
                      You have the right to request access to the personal
                      information we collect from you, details about how we have
                      processed it, correct inaccuracies, or delete your
                      personal information. You may also have the right to
                      withdraw your consent to our processing of your personal
                      information. These rights may be limited in some
                      circumstances by applicable law. To request to review,
                      update, or delete your personal information, please fill
                      out and submit a{" "}
                      <span style={{ color: "rgb(0, 58, 250)" }}>
                        <a
                          data-custom-class="link"
                          href="https://app.termly.io/notify/21237ff5-323f-4141-b106-87079f31384d"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          data subject access request
                        </a>
                      </span>
                      .
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TaskPilot Labs. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

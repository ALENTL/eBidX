---
title: "Software Requirements Specification"
subtitle: "for eBidX: Online Auction System"
author:
  - "Sanju M B"
  - "Sreejith P V"
  - "Nikhil Sreekumar"
  - "Alen T L"
date: "2026-01-06"
geometry: "margin=1in"
fontsize: 12pt
header-includes:
  - \usepackage{fancyhdr}
  - \pagestyle{fancy}
  - \fancyhead[L]{eBidX SRS}
  - \fancyhead[R]{}
  - \fancyfoot[L]{2026}
  - \fancyfoot[C]{}
  - \fancyfoot[R]{Page \thepage}
  - \renewcommand{\headrulewidth}{0.4pt}
  - \renewcommand{\footrulewidth}{0.4pt}
---

\newpage

\tableofcontents

\newpage

# Revision History

| Name     | Date       | Reason For Changes    | Version |
| :------- | :--------- | :-------------------- | :------ |
| Alen T L | 2026-01-06 | Initial Draft Created | 1.0     |
|          |            |                       |         |

\newpage

# Introduction

## Purpose

The purpose of this document is to specify the Software Requirements Specification (SRS) for **eBidX**, an Online Auction System. The system facilitates real-time bidding on products, allowing users to list items for sale and place bids in a competitive environment. This SRS outlines the system's features, interfaces, and constraints.

## Document Conventions

- Headings are formatted in bold and numbered.
- Key terms like _Bidder_, _Seller_, and _Wallet_ will be capitalized when first introduced.
- Functional requirements are labeled as **REQ-1**, **REQ-2**, etc.
- Placeholder values are marked as **TBD** (To Be Determined).

## Intended Audience and Reading Suggestions

This document is for developers, project managers, and testers to understand the system's functionalities.

- **Developers:** Focus on Section 3 (Interfaces) and Section 4 (System Features).
- **Testers:** Focus on Functional Requirements (REQ tags) for validation.

## Product Scope

eBidX is a web-based platform designed to democratize online auctions. Unlike traditional e-commerce sites with fixed prices, eBidX allows dynamic pricing through competitive bidding. It offers a secure environment for transactions, real-time bid updates, and an automated wallet system to manage funds.

## References

- IEEE Software Requirements Specification (SRS) Template.
- Django Documentation (Backend).
- React/Vite Documentation (Frontend).

# Overall Description

## Product Perspective

eBidX is a self-contained web application. It replaces manual/offline auction processes with a digital solution.

- **Frontend:** React.js single-page application (SPA).
- **Backend:** Django REST Framework API.
- **Database:** PostgreSQL (for robust concurrency and data integrity).

## Product Functions

The system will perform the following major functions:

1.  **User Authentication:** Secure Signup/Login using JWT.
2.  **Auction Management:** Sellers can list items with images, descriptions, and base prices.
3.  **Real-Time Bidding:** Bidders can place bids; the highest bid updates instantly.
4.  **Wallet System:** Users can add funds; funds are "locked" during active bids.
5.  **Admin Dashboard:** Admins can ban users or remove illegal listings.

## User Classes and Characteristics

- **Guest:** Can view auctions but cannot bid.
- **Registered User:**
  - **As Seller:** Lists items for auction. Frequency: Occasional.
  - **As Bidder:** Places bids, manages wallet. Frequency: Frequent.
- **Administrator:** Technical user. Manages the platform health and users.

## Operating Environment

- **Client:** Any modern web browser (Chrome, Firefox, Edge).
- **Server:** Linux-based server (Ubuntu 20.04+).
- **Network:** Requires stable internet connection for real-time updates.

## Design and Implementation Constraints

- **Hardware:** The server must handle concurrent requests during high-traffic auctions.
- **Software:** Frontend is strictly React.js; Backend is Django (Python).
- **Database:** PostgreSQL is required for ACID compliance.

## User Documentation

- **On-line Help:** A "How it Works" page will be available on the website.
- **Developer Guide:** A `README.md` file in the repository explaining setup.

## Assumptions and Dependencies

- Users have basic knowledge of online payments.
- The system depends on the system clock being synchronized (NTP) for accurate auction timers.

# External Interface Requirements

## User Interfaces

- **Design:** Clean, modern UI using CSS Grid/Flexbox.
- **Navigation:** Persistent Navbar with links to _Home_, _Auctions_, _Dashboard_, and _Login_.
- **Responsiveness:** The layout must adapt to Desktop, Tablet, and Mobile screens.

## Hardware Interfaces

- **Server:** Standard HTTP interaction over TCP/IP.
- **Client Devices:** No specific hardware sensors required.

## Software Interfaces

- **Database:** PostgreSQL.
- **APIs:** RESTful API endpoints for communication between React and Django.

## Communications Interfaces

- **Protocol:** HTTPS for secure data transmission.
- **Format:** JSON for API responses.

# System Features

## Auction Listing (Seller)

### Description

Registered users can create a new auction listing by providing product details.

### Stimulus/Response Sequences

- **Stimulus:** User fills "Create Auction" form and clicks Submit.
- **Response:** System validates data, saves to DB, and redirects to the new Product Page.

### Functional Requirements

- **REQ-1:** System shall validate that the _Base Price_ is a positive integer.
- **REQ-2:** System shall require an _End Time_ strictly in the future.
- **REQ-3:** System shall allow image uploads (JPG/PNG).

## Bidding Engine (Bidder)

### Description

The core feature where users compete for items.

### Functional Requirements

- **REQ-4:** A new bid must be higher than the current highest bid + minimum increment.
- **REQ-5:** System must reject bids placed after the auction _End Time_.
- **REQ-6:** System must deduct the bid amount from the User's Wallet immediately.
- **REQ-7:** If a user is outbid, the system must refund the locked amount to their wallet.

## Wallet Management

### Description

Manages virtual currency for the user.

### Functional Requirements

- **REQ-8:** Users can view their current balance.
- **REQ-9:** Users can "Add Funds" (Simulated transaction).

# Other Nonfunctional Requirements

## Performance Requirements

- **Latency:** Bid updates should reflect within 1 second.
- **Throughput:** System should support at least 50 concurrent users.

## Safety Requirements

- **Data Integrity:** Wallet balances must never be negative.

## Security Requirements

- **Passwords:** Must be hashed using PBKDF2 (Django default).
- **Auth:** API endpoints must be protected via JWT.
- **HTTPS:** All traffic must be encrypted.

## Software Quality Attributes

- **Reliability:** 99% Uptime during active auctions.
- **Maintainability:** Codebase separated into Backend (API) and Frontend (Client).

# Other Requirements

## Appendix A: Glossary

- **Bid Increment:** The minimum amount a new bid must be higher than the previous one.
- **Sniper:** A user who bids in the last seconds of an auction.

## Appendix B: Analysis Models

_(Diagrams to be added here)_

## Appendix C: To Be Determined List

- **TBD:** Integration with a real Payment Gateway (Stripe/Razorpay).
- **TBD:** WebSocket implementation for "Live" updates without refreshing.

---
geometry: "margin=1in"
fontsize: 12pt
mainfont: "Times New Roman"
header-includes:
  - \usepackage{fancyhdr}
  - \usepackage{setspace}
  - \usepackage{titlesec}
  - \usepackage{float}
  - \usepackage{graphicx}
  - \onehalfspacing
  - \pagestyle{fancy}
  - \fancyhf{}
  - \fancyhead[L]{\small\textit{Software Requirements Specification for eBidX}}
  - \fancyhead[R]{\textit{Page \thepage}}
  - \renewcommand{\headrulewidth}{0pt}
  - \renewcommand{\footrulewidth}{0pt}
  - \fancypagestyle{plain}{\fancyhf{}\fancyhead[L]{\small\itshape Software Requirements Specification for eBidX}\fancyhead[R]{\itshape Page \thepage}\renewcommand{\headrulewidth}{0pt}}
---

\begin{titlepage}
\thispagestyle{empty}
\flushright
\vspace{1in}
{\Large \textbf{Software Requirements Specification}}\\[1cm]
{\large for}\\[1cm]
{\Large \textbf{eBidX: Online Auction System}}\\[1cm]
Version 1.0 Approved\\[1cm]
Prepared by\\[0.5cm]
\textbf{Sreejith P V}\\
\textbf{Aswin Raju}\\
\textbf{Alen T L}\\
\textbf{Nikhil Sreekumar}\\
\textbf{Sanju M B}\\[1cm]
Department of Computer Science\\
2026-01-05
\end{titlepage}

\setcounter{page}{2}
\tableofcontents
\newpage

# Revision History

| Name     | Date       | Reason for Changes    | Version |
| :------- | :--------- | :-------------------- | :------ |
| Alen T L | 2026-01-05 | Initial draft created | 1.0     |

\newpage

# 1. Introduction

## Purpose

The purpose of this document is to specify the Software Requirements Specification (SRS) for **eBidX**, an online auction system. [cite_start]The system facilitates real-time bidding on products, allowing users to list items for sale and place bids in a competitive environment [cite: 37-38]. [cite_start]This SRS outlines the system's features, interfaces, and constraints[cite: 39].

## Document Conventions

- [cite_start]Headings are numbered automatically[cite: 41].
- [cite_start]Key terms such as _Bidder_ and _Seller_ are capitalized when first introduced[cite: 42].
- [cite_start]Functional requirements are labeled as **REQ-1**, **REQ-2**, etc[cite: 43].
- [cite_start]Placeholder values are marked as **TBD**[cite: 44].

## Intended Audience and Reading Suggestions

[cite_start]This document is intended for developers, project managers, and testers[cite: 46].

- [cite_start]**Developers:** Focus on Section 3 and Section 5[cite: 47].
- [cite_start]**Testers:** Focus on functional requirements (REQ tags)[cite: 48].

## Product Scope

eBidX is a web-based platform designed to support dynamic pricing through competitive bidding. [cite_start]It provides a secure environment for transactions and real-time bid updates [cite: 50-51].

## Definitions, Acronyms, and Abbreviations

- **SRS:** Software Requirements Specification
- **SPA:** Single Page Application
- **JWT:** JSON Web Token
- **DFD:** Data Flow Diagram
- **ERD:** Entity Relationship Diagram
- **API:** Application Programming Interface
- [cite_start]**HTTPS:** HyperText Transfer Protocol Secure [cite: 52-58]

## References

- [cite_start]IEEE 29148:2018 — Systems and Software Engineering — Life Cycle Processes — Requirements Engineering [cite: 60]
- [cite_start]IEEE Software Requirements Specification (SRS) Template [cite: 62]
- [cite_start]Django Documentation [cite: 63]
- [cite_start]React / Vite Documentation [cite: 64]

# 2. Overall Description

## Product Perspective

[cite_start]eBidX is a self-contained web application that replaces traditional offline auction processes[cite: 73].

- [cite_start]**Frontend:** React.js (SPA) [cite: 74]
- [cite_start]**Backend:** Django REST Framework [cite: 75]
- [cite_start]**Database:** PostgreSQL [cite: 76]

## Product Functions

The major system functions include:

1. [cite_start]**User Authentication:** Secure signup and login using JWT [cite: 79]
2. [cite_start]**Auction Management:** Item listing with images and base price [cite: 80]
3. [cite_start]**Real-Time Bidding:** Instant updates of highest bid [cite: 81]
4. [cite_start]**Admin Controls:** User moderation and listing removal [cite: 82]

## User Classes and Characteristics

- [cite_start]**Guest:** View-only access [cite: 84]
- [cite_start]**Registered User:** [cite: 85]
  - [cite_start]_Seller:_ Lists auction items [cite: 86]
  - [cite_start]_Bidder:_ Places bids frequently [cite: 87]
- [cite_start]**Administrator:** Manages system and users [cite: 88]

## Operating Environment

- [cite_start]Client: Modern web browsers [cite: 90]
- [cite_start]Server: Ubuntu Linux (20.04 or higher) [cite: 91]
- [cite_start]Network: Stable internet connection [cite: 91]

## Design and Implementation Constraints

- [cite_start]Frontend must use React.js [cite: 93]
- [cite_start]Backend must use Django [cite: 94]
- [cite_start]PostgreSQL is mandatory [cite: 95]

## User Documentation

- [cite_start]Online help via "How It Works" page [cite: 100]
- [cite_start]Developer documentation via repository README [cite: 101]

## Assumptions and Dependencies

- [cite_start]System clock synchronization via NTP [cite: 103]

# 3. External Interface Requirements

[cite_start]This section describes how the eBidX system interacts with users, hardware components, external software systems, and communication protocols[cite: 105].

## User Interfaces

- [cite_start]Clean, modern responsive UI [cite: 107]
- [cite_start]Persistent navigation bar [cite: 107]

## Hardware Interfaces

- [cite_start]Standard HTTP over TCP/IP [cite: 109]

## Software Interfaces

- [cite_start]RESTful APIs [cite: 111]
- [cite_start]PostgreSQL database [cite: 112]

## Communications Interfaces

- [cite_start]HTTPS protocol [cite: 114]
- [cite_start]JSON data format [cite: 115]

# 4. System Features

## Auction Listing (Seller)

### Description

[cite_start]Registered users can create auction listings by providing product details[cite: 119].

### Stimulus / Response Sequences

- [cite_start]**Stimulus:** User submits auction form [cite: 121]
- [cite_start]**Response:** System validates data and creates listing [cite: 122]

### Functional Requirements

- [cite_start]**REQ-1:** Base price must be a positive integer [cite: 127]
- [cite_start]**REQ-2:** End time must be in the future [cite: 128]
- [cite_start]**REQ-3:** Image uploads must support JPG and PNG [cite: 129]

## Bidding Engine (Bidder)

### Description

[cite_start]Users compete by placing bids on active auctions[cite: 132].

### Functional Requirements

- [cite_start]**REQ-4:** Bid must exceed current highest bid plus increment [cite: 134]
- [cite_start]**REQ-5:** Bids after end time are rejected [cite: 135]
- [cite_start]**REQ-6:** Highest bid updates instantly [cite: 136]

# 5. Other Nonfunctional Requirements

## Performance Requirements

- [cite_start]Bid update latency <= 1 second [cite: 142]
- [cite_start]Support at least 50 concurrent users [cite: 142]

## Safety Requirements

- [cite_start]No bids allowed on closed auctions [cite: 144]

## Security Requirements

- [cite_start]Password hashing via PBKDF2 [cite: 147]
- [cite_start]JWT-protected APIs [cite: 148]
- [cite_start]Enforced HTTPS [cite: 149]

## Software Quality Attributes

- [cite_start]**Reliability:** 99% uptime during auctions [cite: 154]
- [cite_start]**Maintainability:** Modular frontend and backend [cite: 155]

# 6. Other Requirements

## Requirement Traceability Matrix (RTM)

| Requirement ID | Description             | Related Use Case | System Module        |
| :------------- | :---------------------- | :--------------- | :------------------- |
| REQ-1          | Validate base price     | Create Auction   | Auction Management   |
| REQ-2          | End time must be future | Create Auction   | Auction Management   |
| REQ-3          | Image upload support    | Create Auction   | Media Service        |
| REQ-4          | Enforce bid increment   | Place Bid        | Bidding Engine       |
| REQ-5          | Reject late bids        | Place Bid        | Bidding Engine       |
| REQ-6          | Real-time bid update    | Place Bid        | Notification Service |

[cite_start][cite: 217]

## Detailed Functional Requirements

### FR-1 User Registration

- [cite_start]**Description:** System shall allow new users to register using email and password[cite: 221].
- [cite_start]**Inputs:** Email, Password [cite: 222]
- [cite_start]**Outputs:** User account created [cite: 223]
- [cite_start]**Priority:** High [cite: 224]

### FR-2 User Login

- [cite_start]**Description:** System shall authenticate users and issue JWT tokens[cite: 226].
- [cite_start]**Inputs:** Credentials [cite: 227]
- [cite_start]**Outputs:** Access token [cite: 228]
- [cite_start]**Priority:** High [cite: 229]

### FR-3 Create Auction

- [cite_start]**Description:** Seller can create auction listings with product details[cite: 231].
- [cite_start]**Inputs:** Product info, images, base price [cite: 232]
- [cite_start]**Outputs:** Auction listing [cite: 233]
- [cite_start]**Priority:** High [cite: 234]

### FR-4 Place Bid

- [cite_start]**Description:** Bidder places a bid higher than current highest bid[cite: 236].
- [cite_start]**Inputs:** Bid amount [cite: 240]
- [cite_start]**Outputs:** Updated highest bid [cite: 241]
- [cite_start]**Priority:** High [cite: 242]

### FR-5 Close Auction

- [cite_start]**Description:** System automatically closes auction at end time[cite: 244].
- **Priority:** Medium

## Risk Analysis

| Risk                                 | Impact | Mitigation                    |
| :----------------------------------- | :----- | :---------------------------- |
| Server overload during live auctions | High   | Load balancing, caching       |
| Time synchronization issues          | Medium | NTP synchronization           |
| Fraudulent bidding                   | High   | Bid validation and monitoring |
| Network latency                      | Medium | Optimized APIs                |

[cite_start][cite: 258]

## Future Enhancements

- [cite_start]Integration with payment gateways [cite: 263]
- [cite_start]WebSocket-based real-time bidding [cite: 263]
- [cite_start]Mobile application support [cite: 263]

\appendix

# Appendix A: Glossary

- [cite_start]**Bid Increment:** Minimum amount above previous bid [cite: 265]
- [cite_start]**Sniper:** User bidding at last seconds [cite: 266]

# Appendix B: Analysis Models

## B.1 Use Case Diagram

The use case diagram illustrates interactions between users and the system.

\begin{figure}[H]
\centering
\includegraphics[width=0.7\textwidth]{images/useCase.png}
\caption{Use Case Diagram for eBidX}
\end{figure}

## B.2 Data Flow Diagrams

### Level 0: Context Diagram

\begin{figure}[H]
\centering
\includegraphics[width=0.6\textwidth]{images/dfdLevel0.png}
\caption{Level 0 Data Flow Diagram}
\end{figure}

### Level 1: Process Decomposition Diagram

\begin{figure}[H]
\centering
\includegraphics[width=0.85\textwidth]{images/dfdLevel1.png}
\caption{Level 1 Data Flow Diagram}
\end{figure}

## B.3 Activity Diagram

\begin{figure}[H]
\centering
\includegraphics[width=0.5\textwidth]{images/activity.png}
\caption{Activity Diagram for Bidding Process}
\end{figure}

## B.4 Entity Relationship Diagram

\begin{figure}[H]
\centering
\includegraphics[width=0.9\textwidth]{images/erDiagram.png}
\caption{Entity Relationship Diagram for eBidX Database}
\end{figure}

## B.5 Sequence Diagram

\begin{figure}[H]
\centering
\includegraphics[width=0.9\textwidth]{images/sequence.png}
\caption{Sequence Diagram for eBidX Database}
\end{figure}

# Appendix C: To Be Determined

- [cite_start]**TBD:** Payment gateway integration [cite: 385]
- [cite_start]**TBD:** WebSocket-based live updates [cite: 386]

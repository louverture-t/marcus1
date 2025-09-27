# Marucs by Goldman Sachs - Savings Goal Feature Update

## Table of Contents:
1. [Overview](###overview)
2. [Discovery](##discovery)
3. [Defining the Problem](##defining-the-problem)
4. [Proposed Solution](##proposed-solution)
5. [Future Key Features](##future-key-features)

## Overview
This project is a feature set update for the app Marcus by Goldman Sachs. 
This lifestyle-finance app aims to improve the financial behavioral orientations of friend and family groups. The updated features will function as a gateway to introduce new users to Marcus’ ecosystem of accessible financial products and must account for Goldman Sachs goal of making financial well-being equitable.

The web app allows users to create a goal, set a target amount, and then add to their progress toward that savings goal.[^1] 
[^1]: Current features as of 9/27/2025. The inital version of the web app is designed to establish the foundational framework of the feature to be developed further. 

## Discovery
The original goal of Marcus was for Goldman to move into the consumer lending market. Goldman’s traditional business focuses on accredited investors which require less robust CIP procedures. GS faced regulatory pressure over CIP and Apple credit card procedures and rolled back their lending and credit through Marcus. Although GS has a competitive advantage in lending, it does not have the infrastructure to keep up with rapid growth within this segment. Two solutions: 1.) Technology should be used to help with CIP 2.) The app should focus on asset accumulation rather than lending.[^2]

Additionally, the Mint budgeting app was shut down on March 23, 2024, and users were no longer able to access their data. Mint's parent company, Intuit, encouraged users to switch to Credit Karma, a free app that offers some similar features to Mint, such as viewing linked accounts and transactions. However, Credit Karma lacks many of Mint's budgeting features. This was a big player in the personal finance/budgeting app space and leaves a large portion of market share available for acquisition. With Goldman Sachs resources and suite of financial products, we believe Marcus is uniquely positioned to capture significant market share and introduce new users to its financial products and wealth management services.

[^2]: "How Marcus met its end in 2022" (EMarketer 2022) - https://www.emarketer.com/content/how-marcus-met-its-end-2022

## Defining the Problem
Saving money is a crucial habit necessary to reach big financial goals and improve quality of life while avoiding the pitfalls of crippling debt. Following the pandemic, we saw an influx of savings but now the financial landscape of households looks very different. Although interest rates have increased during this time, savings rates have not kept pace and the struggle is now being felt beyond people’s wallets.

## Proposed Solution
## Features
Project name-Marcus 1 by Goldman Sachs Savings Goal Feature
A simple, responsive web app for setting and tracking your personal savings goals. Our new technologies used include Tailwind CSS (D), ARTIFICIAL INTELLIGENCE (J) for guidance and ideas.
Link to the KanBan Board -https://github.com/users/louverture-t/projects/1
Link to the Project Repo -https://github.com/louverture-t/marcus1
Overview of the project -  This project is a feature set update for Marcus by Goldman Sachs. This lifestyle-finance app aims to improve the financial behavioral orientations of friend and family groups. The updated features will function as a gateway to introduce new users to Marcus’ ecosystem of accessible financial products and must account for Goldman Sachs goal of making financial well-being equitable.
https://github.com/louverture-t/marcus1
- Add, complete, and delete savings goals
- Track progress visually with stats and cards
- Responsive design (desktop & mobile)
- Light and dark mode with theme toggle
- All data stored locally in your browser (no account needed)

## How It Works

1. **Add a Goal:** Click “New Goal,” fill in the form, and submit.
2. **Track Progress:** See your active and completed goals at a glance.
3. **Complete or Delete:** Mark goals as complete or remove them anytime.
4. **Switch Theme:** Use the ☀️/🌙 button to toggle light/dark mode.

## File Overview

- `index.html` – Main structure, links to CSS/JS, uses Tailwind utility classes.
- `styles.css` – Custom theming, layout, and responsive styles.
- `goals.js` – All app logic: storage, rendering, validation, theme, and events.
- `assets/logos/` – SVG logo files for both light and dark themes.
- `prd.md` – Product Requirements Document (project summary).

## CSS & Tailwind

- Tailwind is loaded via CDN for utility classes (e.g., `p-4`, `flex`, `text-sm`).
- Custom CSS variables and classes provide theming and component styles.
- Responsive and accessible by design.

## Getting Started

Just open `index.html` in your browser. No installation required!


## Future Key Features
**Accessible**
- Simple interface, minimal buttons and styling
- Focuses on income vs expenses foremost

**Tracking & Monitoring**
- Track amount saved and Interest earned (year to date and total)
- Auto-categorizes expenses into broad general categories. Nudges to increase saving amount by X based on trends (research top budgeting apps)
- Each goal is linked to its own savings account. When creating a new goal you can either link an unused savings account or create a new one (once the goal is complete have the option to close the account and consolidate remaining funds to another savings account).

**Accountability**
- App notifications of savings transfers and nudge to view progress. Savings is automated but notifies a day before and prompts users to click a button to “save” or confirm.
- Save button screen coupled with a mindset statement, allows users to feel the positive effects of participating in the habit of saving. Your automated transfer is scheduled for tomorrow. Click to save for your future today. (phone notification with haptics vibration & sound)
- Confirmation screen with positive mindset statement “many people are spending money they don’t have on things they don’t need. But you are wiser and investing in yourself.” “Small good decisions over time add up. That’s the power of compounding”
- Streak counter (based on automated transfer setting [weekly/monthly])
- Possibility Forecast (shows what savings trend could do if invested in Goldman Sachs ActiveBeta U.S. Large Cap Equity ETF) (1yr/5yr/10yr/30yr) *with disclaimer
- Can add people to a savings goal (user links their savings account or creates new one - pooled)


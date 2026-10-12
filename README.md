# State 266 Portal | Whiteout Survival
> The official community portal for **Whiteout Survival State #266**.

[![Deploy to GitHub Pages](https://github.com/Zcross091/StateWeb/actions/workflows/deploy.yml/badge.svg)](https://github.com/Zcross091/StateWeb/actions/workflows/deploy.yml)

**Live Website:** [https://zcross091.github.io/StateWeb/](https://zcross091.github.io/StateWeb/)

---

## About State 266 & Endeavour
- **In-Game Name:** `[AVM] ༒ Endeavour ༒`
- **Player ID:** `16278053`
- **Combat Stats:** **942.5M Power** • **157.5M PvP Kills**
- **Furnace Level:** **Fire Crystal 10 (FC 10 - Apex Tier)**
- **Server Heritage:** **Initial State: State 91** (Original launch server veteran) → Transferred to **State 266**
- **Roles:** Leader in **`[AVM] Shadow Wolves`**, former official **Whiteout Survival Discord Moderator**, dedicated coach who trained newcomers for over a year before retiring from mod duties.
- **Home Realm:** **State 266** — A disciplined, high-power realm with over **154.4 Billion Power** across the top coalition, protected by a mutual **NAP-3** non-aggression agreement.

---

## The Big 3 Active Alliances

| Crest | Tag & Name | Rank | Leader / Contact | Power | Members | Focus & Notes |
| :---: | :--- | :---: | :--- | :---: | :---: | :--- |
| AVM | **[AVM] ༒ SHAÐØW ༒ WØLVES ༒** | #1 | `༒ Endeavour ༒ (Duke Ragnar)` / `༒ ZØRØ ༒AvM` | **76.10 B** | 97/100 | Apex fighting force, Sunfire Castle rally spearhead. |
| SOK | **[SOK] SilenceOfKittens** | #2 | `TrulyBee` | **43.47 B** | 73/100 | High-harmony community, fortress defense, loyal & friendly. |
| ORA | **[ORA] OriginDesAstres** | #3 | `LululaKastagne` | **34.86 B** | 83/100 | Tactical English-speaking elite, 13:00 & 19:00 UTC event slots, FC5+ req. |

---

## Features

1. **Atmospheric Glacial & Ember Engine**:
   - Interactive HTML5 canvas particle snowfall with rising furnace embers.
2. **Real-Time Universal Clock & Event Scheduler**:
   - Live **UTC Server Clock** matching in-game reset times.
   - Instant timezone converter (EST, PST, CET, GMT, IST, JST, AEST, etc.).
   - Live countdowns for Bear Trap (13:00 / 19:00 UTC), daily reset, Crazy Joe, and Sunfire Castle.
3. **Endeavour's Survival Academy**:
   - Battle-tested strategies from Endeavour's coaching legacy: Bear Trap joiner multipliers (Jessie/Jero meta), Fire Crystal prioritization, hero gear synergy, SvS preparation point hoarding, and zero-loss hospital defense.
4. **Interactive Calculators**:
   - **Fire Crystal (FC) Calculator:** Estimates required standard and refined crystals from Furnace 30 up to FC8.
   - **SvS Speedup Points Calculator:** Previews exact point totals for construction, research, and training days.
5. **State Concordat & Governance**:
   - Complete rules for NAP-3, tile protection, Kill Event (KE) boundaries, and Castle rotation.
   - **One-Click Minister Title Request Helper:** Formats instant title requests for in-game state chat.
6. **State Transfer Portal**:
   - Real-time application letter generator with one-click clipboard copy to submit to AVM, SOK, or ORA leadership.

---

## Running Locally

No npm dependencies or compilation steps required—pure modern HTML5, CSS3, and JavaScript:

1. Clone the repository:
   ```bash
   git clone https://github.com/Zcross091/StateWeb.git
   ```
2. Open `index.html` in any modern web browser, or serve locally with any static server:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```

---

## GitHub Pages Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to **GitHub Pages** whenever changes are pushed to `main`.

To verify your GitHub Pages settings:
1. Go to repository **Settings** > **Pages**.
2. Under **Build and deployment**, ensure **Source** is set to **GitHub Actions** (or `Deploy from a branch` -> `main` / root).

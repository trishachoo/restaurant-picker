# 🍜 Restaurant Picker

A couple's restaurant decision-making app for Singapore. Filter by cuisine and area, then both people swipe yes/no on the same device. Shows mutual matches and picks a winner!

## Setup

### 1. Clone & install

```bash
git clone <your-repo>
cd restaurant-picker
npm install
```

### 2. Set up your Google Sheet

Create a Google Sheet with **two tabs**:

**Tab 1: Favorites**
| Name | Cuisine | Area | Address | Notes | Our Rating |
|------|---------|------|---------|-------|------------|
| Odette | French | CBD / Marina Bay | 1 St Andrew's Rd | Fine dining | 5 |

**Tab 2: Want To Go**
| Name | Cuisine | Area | Address | Notes | Added By |
|------|---------|------|---------|-------|----------|
| Burnt Ends | Western | Dempsey / Holland Village | 20 Teck Lim Rd | BBQ omakase | Trish |

Then publish each tab as CSV:
1. **File → Share → Publish to web**
2. Select the tab → choose **Comma-separated values (.csv)**
3. Click **Publish** → copy the URL
4. Repeat for the second tab

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and paste your two CSV URLs. Optionally set your names.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import your repo
3. Add the environment variables from `.env.local` in Vercel's project settings
4. Deploy — done! Bookmark the URL on both your phones.

## Updating restaurants

- **Sheet data**: Edit the Google Sheet directly — changes reflect on the next page load.
- **Local additions**: Use the **+ Add** button in the app — saved in browser `localStorage`.

## Customising

- **Cuisine/area options**: Edit `lib/constants.ts` — `CUISINES[]` and `AREAS[]` arrays.
- **Names**: Set `NEXT_PUBLIC_PERSON_1_NAME` and `NEXT_PUBLIC_PERSON_2_NAME` in `.env.local`.
- **Colors**: Edit the CSS variables in `app/globals.css`.

## Tech stack

- Next.js 14 (App Router)
- Tailwind CSS
- Framer Motion (swipe animations)
- PapaParse (CSV parsing)
- canvas-confetti (results celebration)

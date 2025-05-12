# Gaming Content Locker React with AdBlueMedia Integration

A React application that demonstrates how to implement content locking for game downloads using a **single AdBlueMedia CPA campaign** for multiple games.

## 🎮 Live Demo

Visit the live demo at: [https://gamevault-six.vercel.app/](https://gamevault-six.vercel.app/)

## 🚀 Ready to Use!

This project is already configured with a working AdBlueMedia campaign ID. You can:
1. Clone this repository
2. Run the project locally
3. Test the AdBlueMedia integration immediately

If you want to use your own AdBlueMedia campaign, simply update the campaign ID in `src/data/lockerConfig.ts`.

## 🔑 The Problem This Solves

If you have a gaming store with many games, you traditionally would need to create a separate CPA locker campaign in AdBlueMedia for each game. This can be very time-consuming and hard to maintain.

**Our solution:** Use a single AdBlueMedia campaign ID for all games, with dynamic redirects based on the game ID. This means:

1. You only need to set up ONE campaign in AdBlueMedia
2. The system automatically redirects users to the correct game download after they complete an offer
3. You can add new games without creating new lockers in AdBlueMedia

## 🎮 About

This project showcases a gaming content platform where users can browse games and download them after completing CPA offers through AdBlueMedia. Each game appears to have its own locker, but behind the scenes, they all use the same AdBlueMedia campaign.

## 🚀 How It Works

1. **User Clicks Download:** When a user clicks to download a game, we open a dialog with the AdBlueMedia locker
2. **Single Campaign ID:** The locker uses a single AdBlueMedia campaign ID for all games
3. **Dynamic Redirect URL:** We pass a redirect URL with the game ID as a parameter
4. **Complete Offer:** User completes the AdBlueMedia CPA offer
5. **Smart Redirect:** AdBlueMedia redirects to our handler page, which extracts the game ID
6. **Game-Specific Download:** The handler redirects to the correct game download URL

## 📋 Quick Start

### 1. AdBlueMedia Setup

1. Create a single campaign in your AdBlueMedia dashboard
2. Set the "Allow Back" option to True in campaign settings
3. Copy your campaign ID

### 2. Configuration

Open `src/data/lockerConfig.ts` and update:

```typescript
// Replace with your actual AdBlueMedia campaign ID
export const ADBLUE_CAMPAIGN_ID = "REPLACE_WITH_YOUR_ADBLUE_CAMPAIGN_ID";

// Add your game download URLs
export const DOWNLOAD_URLS: Record<string, string> = {
  "clash-of-clans": "https://dl.example.com/games/clash-of-clans.apk",
  "free-fire": "https://dl.example.com/games/free-fire.apk",
  // Add more games as needed
};
```

Also, update the redirect URL if you're deploying to a custom domain:

```typescript
// Change this to your actual domain
return `https://your-domain.com/?game=${encodeURIComponent(gameId)}`;
```

### 3. Run the Project

```bash
# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

## 🧩 Key Components

### AdBlueMediaDirectLocker.tsx

This component loads the AdBlueMedia locker script and renders it in a dialog:

```tsx
window.cpaLocker.init({
  campaignId: ADBLUE_CAMPAIGN_ID, // One campaign ID for all games
  container: 'adblue-locker-container',
  callback: (result) => {
    if (result.status === 'completed') {
      // Mark as unlocked and redirect
      localStorage.setItem(`unlocked_${contentId}`, 'true');
      window.location.href = redirectUrl;
    }
  },
  callbackUrl: redirectUrl // URL includes game ID as parameter
});
```

### DownloadHandlerPage.tsx

This page handles the redirect after offer completion:

```tsx
// Extract gameId from URL parameters
const gameId = searchParams.get("gameId") || searchParams.get("game") || "";

// Get the download URL for this specific game
const downloadUrl = getDownloadUrl(gameId);

// Redirect to the correct download URL
window.location.href = downloadUrl;
```

## 🛠️ Adding New Games

To add a new game to your store:

1. Add the game details to `src/data/games.ts`
2. Add the game's download URL to `DOWNLOAD_URLS` in `lockerConfig.ts`:

```typescript
export const DOWNLOAD_URLS: Record<string, string> = {
  // Existing games...
  "new-game-id": "https://your-download-url.com/new-game.apk"
};
```

3. No need to create a new campaign in AdBlueMedia!

## 📝 AdBlueMedia Implementation Details

The integration uses:

- A single container element where AdBlueMedia renders its content
- The official AdBlueMedia script (`https://cpa-locker.adbluemedia.com/locker.js`)
- Their standard callback interface to detect completed offers
- URL parameters to track which game was selected

## 🧪 Testing Without AdBlueMedia

For testing without a real AdBlueMedia account:

1. Set `localStorage.setItem('unlocked_GAMEID', 'true')` in your browser console
2. This will bypass the locker for that specific game

## 🚀 Deployment

When deploying to production, make sure to:

1. Update the `getRedirectUrl` function in `lockerConfig.ts` to use your production domain
2. Set your real AdBlueMedia campaign ID
3. Set real download URLs for your games

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for game publishers using AdBlueMedia CPA offers

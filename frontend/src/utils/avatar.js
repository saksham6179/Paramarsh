export const defaultAvatars = [
  "https://api.dicebear.com/7.x/notionists/svg?seed=Felix",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Jasmine",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Kitty",
  "https://api.dicebear.com/7.x/notionists/svg?seed=George",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Jack",

  "https://api.dicebear.com/7.x/notionists/svg?seed=Angel",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Shadow",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Midnight",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Max",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Lucy",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Tiger",

  "https://api.dicebear.com/7.x/notionists/svg?seed=Milo",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Oreo",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Luna",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Simon",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Chloe",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Bandit",

  "https://api.dicebear.com/7.x/notionists/svg?seed=Nala",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Gizmo",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Nova",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Raven",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Echo",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Storm",

  "https://api.dicebear.com/7.x/notionists/svg?seed=Blaze",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Pixel",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Zen",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Comet",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Orbit",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Drift",

  "https://api.dicebear.com/7.x/notionists/svg?seed=Cloud",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Snow",
  "https://api.dicebear.com/7.x/notionists/svg?seed=River",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Leaf",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Ash",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Flame",
];

// GET USER AVATAR
export function getUserAvatar(user) {
  // NO USER
  if (!user) {
    return defaultAvatars[0];
  }

  // ✅ ALWAYS USE SAVED AVATAR
  if (user.avatar) {
    return user.avatar;
  }

  // FINAL FALLBACK
  return defaultAvatars[0];
}
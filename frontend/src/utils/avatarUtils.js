// Helper utility for generating 3D stylized avatars instead of real human photos

export const MALE_3D_AVATARS = [
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Alex&hair=short01,short02&backgroundColor=b6e3f4,c0aedd,d1d4f9",
  "https://api.dicebear.com/7.x/micah/svg?seed=Carlos&baseColor=f9c9b6&backgroundColor=b6e3f4,c0aedd",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=David&hair=short04&backgroundColor=d1d4f9,ffd5dc",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=James&top=shortHair&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/micah/svg?seed=Michael&backgroundColor=c0aedd,d1d4f9"
];

export const FEMALE_3D_AVATARS = [
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Elena&hair=long01,long02&backgroundColor=ffd5dc,c0aedd",
  "https://api.dicebear.com/7.x/micah/svg?seed=Sophia&baseColor=f9c9b6&backgroundColor=b6e3f4,ffd5dc",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Sarah&backgroundColor=d1d4f9,b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&top=longHair&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/micah/svg?seed=Olivia&backgroundColor=c0aedd,b6e3f4"
];

export const NEUTRAL_3D_AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=SkillSwap1&backgroundColor=b6e3f4,c0aedd",
  "https://api.dicebear.com/7.x/bottts/svg?seed=SkillSwap2&backgroundColor=d1d4f9,ffd5dc",
  "https://api.dicebear.com/7.x/notionists/svg?seed=P2P1&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/notionists/svg?seed=P2P2&backgroundColor=c0aedd"
];

export const get3DAvatarUrl = (gender = "other", name = "Swapper") => {
  const cleanName = name ? encodeURIComponent(name.trim()) : "Swapper";
  const g = (gender || "").toLowerCase();

  if (g === "female" || g === "f") {
    return `https://api.dicebear.com/7.x/lorelei/svg?seed=${cleanName}&backgroundColor=ffd5dc,c0aedd,b6e3f4`;
  }
  if (g === "male" || g === "m") {
    return `https://api.dicebear.com/7.x/lorelei/svg?seed=${cleanName}&backgroundColor=b6e3f4,c0aedd,d1d4f9`;
  }
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanName}&backgroundColor=b6e3f4,c0aedd`;
};

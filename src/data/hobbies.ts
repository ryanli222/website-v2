export interface HobbyPhoto {
  src: string;
  caption?: string;
  tall?: boolean; // makes the card taller in the masonry grid
}

export interface HobbyCategory {
  slug: string;
  title: string;
  emoji: string;
  photos: HobbyPhoto[];
}

export const hobbyCategories: HobbyCategory[] = [
  {
    slug: "food",
    title: "Food",
    emoji: "🍜",
    photos: [
      // Add your photos to public/hobbies/ and list them here:
      // { src: "/hobbies/ramen.jpg", caption: "homemade ramen", tall: true },
      // { src: "/hobbies/steak.jpg", caption: "reverse sear" },
    ],
  },
  {
    slug: "music",
    title: "Music",
    emoji: "🎵",
    photos: [
      // { src: "/hobbies/guitar.jpg", caption: "late night jam" },
      // { src: "/hobbies/vinyl.jpg", caption: "collection", tall: true },
    ],
  },
];

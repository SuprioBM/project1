export type Product = {
  id: string;
  name: string;
  description: string;
  image: string[]; // Array of image URLs
  price: number;
  size: Record<string, number>[]; // e.g., [{ S: 3 }, { M: 5 }]
};

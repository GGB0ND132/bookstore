export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  description: string;
  coverImage: string;
  quantity?: number;
} 
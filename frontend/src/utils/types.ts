export interface Poll {
  uuid: string;
  title: string;
  budget: number;
}

export interface Product {
  id: number;
  title: string;
  link: string;
  image: string;
  rating: number;
  price: number;
  created_at: string;
}


export interface User {

  username: string;
  email: string;
  created_at: string;

}

export interface ProductSearch {
    title: string;
    link: string;
    image: string;
    rating: number | null;
    price: number | null;
}

export interface GiftIdea {
    name: string;
    description: string;
}

export interface SearchProps {
    userSearch?: string;
}
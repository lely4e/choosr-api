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
  votes: number;
  comments: number;
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

export interface Comment {
  id: number,
  text: string,
  created_by: string
}

export interface Vote {
  user_id: number;
  product_id: number;
}
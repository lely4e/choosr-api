export interface UserContext {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  updateUser: (updateUser: User) => void
  loading: boolean;
}

export interface Poll {
  uuid: string;
  title: string;
  budget: number;
  user_id: number
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
  has_voted: boolean;
  user_id: number;
}

export interface ProductsProps {
  uuid?: string;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  getProducts: () => Promise<void>;
}

export interface IdeasProps {
  getProducts?: () => Promise<void>;
}

export interface User {
id: number;
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
  id: number;
  text: string;
  created_by: string;
  user_id: number;
  created_at: EpochTimeStamp
}

export interface Vote {
  user_id: number;
  product_id: number;
  has_voted: boolean;
}
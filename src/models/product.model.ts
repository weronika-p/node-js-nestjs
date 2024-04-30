import { User } from "./user.model";

export interface Product {
  title?: string,
  imageUrl?: string,
  description?: string,
  price?: number,
  id?: string,
  qty?: number,
  user?: User
}
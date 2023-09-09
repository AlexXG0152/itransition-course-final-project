export interface IUser {
  id: number;
  email: string;
  name: string;
  banned: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: null;
  roles?: RolesEntity[] | null;
  reviews?: ReviewsEntity[] | null;
  ratings?: RatingsEntity[] | null;
  comments?: CommentsEntity[] | null;
  likes?: LikesEntity[] | null;
  totalLikes?: number;
}
export interface RolesEntity {
  id: number;
  value: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: null;
  UserRoles?: UserRoles;
}
export interface UserRoles {
  id: number;
  roleId: number;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: null;
}
export interface ReviewsEntity {
  id: number;
  title: string;
  content: string;
  imageslinks?: string;
  reviewRating: number;
  like?: number | null;
  userId: number;
  productId: number;
  productTitle: string;
  categoryId: number;
  subcategoryId: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: null;
}
export interface RatingsEntity {
  id: number;
  userId: number;
  productId: number;
  rate: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: null;
}
export interface CommentsEntity {
  id: number;
  commentTitle: string;
  commentText: string;
  edited: boolean;
  userId: number;
  reviewId: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: null;
}
export interface LikesEntity {
  id: number;
  userId: number;
  reviewId: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: null;
}

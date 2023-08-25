export interface IReviewCreateAttrs {
  id: number;
  title: string;
  category: string;
  tags: string;
  content: string;
  imageslinks?: string;
  reviewRating: number;
  userId: number;
  productId?: number;
  productTitle: string;
}

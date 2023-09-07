export interface IReviewCreateAttrs {
  id: number;
  title: string;
  tags: string[];
  content: string;
  imageslinks?: string;
  reviewRating: number;
  userId: number;
  productId?: number;
  productTitle: string;
}

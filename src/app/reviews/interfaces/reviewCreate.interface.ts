export interface IReviewCreateAttrs {
  id: number;
  title: string;
  category: string;
  tags: string;
  text: string;
  imageslinks?: string;
  rating: number;
  userId: number;
  productId: number;
}

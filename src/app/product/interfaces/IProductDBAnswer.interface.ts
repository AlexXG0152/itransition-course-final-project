import { IReviewCreateAttrs } from 'src/app/reviews/interfaces/reviewCreate.interface';

export interface IProductDBAnswer {
  dataValues: {
    id: number;
    productTitle: string;
    productRating?: string;
    avgRating?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: null;
  };
  reviews: IReviewCreateAttrs[];
}

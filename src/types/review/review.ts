// types/review/review.ts

export type ReviewType = 'EVENT' | 'PLACE';

export interface ImageData {
  id: number;
  uuid: string;
  fileName: string;
  fileUrl: string;
}

export interface RouteItem {
  name: string;
  placeId: number;
  itemOrder: number;
}

export interface Route {
  routeId: number;
  routeItems: RouteItem[];
}

export interface ReviewDetail {
  reviewId: number;
  animationName: string;
  title: string;
  view: number;
  content: string;
  reviewImages: ImageData[];
  userName: string;
  profileImage: ImageData;
  createdAt: string;
  route: Route;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

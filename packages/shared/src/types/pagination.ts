export type PaginationParam = {
  page: number;
  limit: number;
};

export type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  next: number;
  prev: number;
};

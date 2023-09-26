/**
 * Get Data List By Paginate Input DTO
 */
export class GetPaginateDto {
  /** Page Size */
  limit?: number;
  /** Page Number */
  page?: number;
}

/**
 * Get Users List By Paginate Input DTO
 */
export class GetUsersDto {
  /** Filters */
  filters?: any;
  /** Paginate Options */
  options?: GetPaginateDto;
}

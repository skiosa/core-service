import { PaginationArg } from "../model/paginationArg";
export function paginate<T>(arr: T[], pagination?: PaginationArg): T[] {
  return pagination ? arr.slice(pagination.skip ?? 0, (pagination.skip ?? 0) + pagination.take) : arr;
}

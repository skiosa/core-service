import { PaginationArg } from "../model/paginationArg";

/**
 * @author Jonas Eppard
 * @summary Apply Pagination to a list
 * @description Skip the first n elements and take the next n elements from the list
 * @param {T[]} list - List to paginate
 * @param {PaginationArg} paginated - Pagination Arguments skip and take
 * @returns {T[]} List of paginated elements
 */
export function paginate<T>(arr: T[], pagination?: PaginationArg): T[] {
  return pagination ? arr.slice(pagination.skip ?? 0, (pagination.skip ?? 0) + pagination.take) : arr;
}

import { HttpParams } from "@angular/common/http";

export const Filters: string[] = ['Food','Travel','Shopping'];
export const FoodFilter: HttpParams = new HttpParams().set('filter','food');
export const ShoppingFilter: HttpParams = new HttpParams().set('filter','shopping');
export const TravelFilter: HttpParams = new HttpParams().set('filter','travel');
export const QueryParams = (limit: number, offset: number, filter: string, search: string): HttpParams => {
  return new HttpParams()
  .set('limit',limit)
  .set('offset',offset)
  .set('filter',filter)
  .set('search',search)
}
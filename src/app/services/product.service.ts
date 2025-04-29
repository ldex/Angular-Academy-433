import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  catchError,
  delay,
  shareReplay,
  tap,
  first,
  map,
  mergeAll,
  BehaviorSubject,
  switchMap,
  of,
  filter,
  throwError,
} from 'rxjs';
import { Product } from '../products/product.interface';
import { environment } from 'src/environments/environment';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = `${environment.apiUrl}/products`;
  products$: Observable<Product[]>;

  private loadingService = inject(LoadingService)

  constructor(private http: HttpClient) {
    this.initProducts();
  }

  initProducts() {
    const params = {
        sortBy: 'modifiedDate',
        order: 'desc'
    };

    const options = {
      params: params,
    };

    this.products$ = this.http
      .get<Product[]>(this.baseUrl, options)
      .pipe(
        delay(1500),
        //tap(console.table),
        shareReplay(),
        catchError(this.handleError)
      );

      this.loadingService.showLoaderUntilCompleted(this.products$)

  }

  private handleError(error) {
    console.log('Error:' + error.message);
    return throwError(() => { return 'Error on the product service' });
  }

  insertProduct(newProduct: Product): Observable<Product> {
    newProduct.modifiedDate = new Date();
    return this.http.post<Product>(this.baseUrl, newProduct).pipe(
      delay(1000),
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id).pipe(
      catchError(this.handleError));
  }

  resetList() {
    this.initProducts();
  }
}

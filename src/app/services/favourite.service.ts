import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { Product } from '../products/product.interface';
import { log, logWithPrefix2 } from '../shared/log.operator';


@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  private favouriteAdded = new BehaviorSubject<Product>(null);
  favouriteAdded$: Observable<Product> = this
                                    .favouriteAdded
                                    .asObservable()
                                    .pipe(
                                      logWithPrefix2('New favourite:')
                                    );

  constructor() { }

  private favourites: Set<Product> = new Set();

  addToFavourites(product: Product) {
    this.favourites.add(product);
    this.favouriteAdded.next(product);
    setTimeout(() => this.favouriteAdded.next(null), 2000);
  }

  reset() {
    this.favouriteAdded.next(null)
  }

  getFavouritesNb(): number {
    return this.favourites.size;
  }
}

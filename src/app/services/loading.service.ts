import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, finalize, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loading = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loading.asObservable();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): void {
    of(null)
        .pipe(
            tap(() => this.loadingOn()),
            concatMap(() => obs$),
            finalize(() => this.loadingOff())
        ).subscribe();
  }

  constructor() { }

  private loadingOn() {
    this.loading.next(true);
  }

  private loadingOff() {
    this.loading.next(false);
  }
}

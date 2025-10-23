import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'http://localhost:5272/api/Heroes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      const ofResult = of(result as T);

      return ofResult;
    };
  }

  getHeroes(): Observable<Hero[]> {
    const heroes = this.http
      .get<Hero[]>(this.heroesUrl)
      .pipe(catchError(this.handleError<Hero[]>('getHeroes', [])));

    return heroes;
  }

  getHero(id: number | null): Observable<Hero | undefined> {
    if (id === null || id === undefined) {
      this.log('getHero skipped: id is null or undefined');
      const hero = of(undefined);

      return hero;
    }

    const url = `${this.heroesUrl}/${id}`;

    const hero = this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );

    return hero;
  }

  updateHero(hero: Hero): Observable<Hero> {
    const url = `${this.heroesUrl}/${hero.id}`;

    const heroObservable = this.http
      .put<Hero>(url, hero, this.httpOptions)
      .pipe(
        tap((_) => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<Hero>('updateHero'))
      );

    return heroObservable;
  }

  addHero(name: string): Observable<Hero> {
    const hero = { name } as Hero;

    hero.cityId = null;

    const heroObservable = this.http
      .post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );

    return heroObservable;
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    const deletedHero = this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );

    return deletedHero;
  }

  searchHeroes(term: string): Observable<Hero[]> {
    term = term.trim();

    if (term === null || term === undefined || term === '') {
      const ofReturn = of([]);

      return ofReturn;
    }

    const search = this.http
      .get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap((x) => {
          if (0 < x.length) {
            this.log(`Found heroes matching ${term}`);
          } else {
            this.log(`Could not find a hero matching ${term}`);
          }
        }),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );

    return search;
  }
}

import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { City } from './city';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes';
  private citiesUrl = 'api/cities';

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
      return of(result as T);
    };
  }

  getCities(): Observable<City[]> {
    return this.http
      .get<City[]>(this.citiesUrl)
      .pipe(catchError(this.handleError<City[]>('getCities', [])));
  }

  getHeroes(): Observable<Hero[]> {
    return this.http
      .get<Hero[]>(this.heroesUrl)
      .pipe(catchError(this.handleError<Hero[]>('getHeroes', [])));
  }

  getCity(id: number | null): Observable<City | undefined> {
    if (id == null) {
      this.log('getCity skipped: id is null or undefined');
      return of(undefined);
    }

    const url = `${this.citiesUrl}/${id}`;

    return this.http.get<City>(url).pipe(
      tap((_) => this.log(`fetched city id=${id}`)),
      catchError(this.handleError<City>(`getCity id=${id}`))
    );
  }

  getHero(id: number | null): Observable<Hero | undefined> {
    if (id == null) {
      this.log('getHero skipped: id is null or undefined');
      return of(undefined);
    }

    const url = `${this.heroesUrl}/${id}`;

    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateCityHeroes(city: City): Observable<City> {
    const url = `${this.citiesUrl}/${city.id}`;
    return this.http.put<City>(url, city, this.httpOptions);
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addCity(city: City): Observable<City> {
    return this.http.post<City>(this.citiesUrl, city, this.httpOptions);
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteCity(id: number): Observable<City> {
    const url = `${this.citiesUrl}/${id}`;
    return this.http.delete<City>(url, this.httpOptions);
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchCity(term: string): Observable<City[]> {
    if (!term.trim()) {
      of([]);
    }
    return this.http.get<City[]>(`${this.citiesUrl}/?name=${term}`);
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
      //Could be returned as Hero object
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found heroes matching "${term}"`)
          : this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
}

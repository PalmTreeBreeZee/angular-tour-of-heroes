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

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(this.citiesUrl);
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl);
  }

  getCity(id: number | null): Observable<City | undefined> {
    if (id == null) {
      this.log('getCity skipped: id is null or undefined');
      return of(undefined);
    }

    const url = `${this.citiesUrl}/${id}`;

    return this.http.get<City>(url);
  }

  getHero(id: number | null): Observable<Hero | undefined> {
    if (id == null) {
      this.log('getHero skipped: id is null or undefined');
      return of(undefined);
    }

    const url = `${this.heroesUrl}/${id}`;

    return this.http.get<Hero>(url);
  }

  updateCityHeroes(city: City): Observable<City> {
    const url = `${this.citiesUrl}/${city.id}`;
    return this.http.put<City>(url, city, this.httpOptions);
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions);
  }

  addCity(city: City): Observable<City> {
    return this.http.post<City>(this.citiesUrl, city, this.httpOptions);
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions);
  }

  deleteCity(id: number): Observable<City> {
    const url = `${this.citiesUrl}/${id}`;
    return this.http.delete<City>(url, this.httpOptions);
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions);
  }

  searchCity(term: string): Observable<City[]> {
    if (term === null || term === undefined || term === '') {
      return of([]);
    }

    return this.http.get<City[]>(`${this.citiesUrl}/?name=${term}`);
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (term === null || term === undefined || term === '') {
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`);
  }
}

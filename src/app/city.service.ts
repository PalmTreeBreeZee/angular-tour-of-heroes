import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { City } from './city';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private citiesUrl = 'http://localhost:5272/api/Cities';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private log(message: string) {
    this.messageService.add(`CityService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      const ofResult = of(result as T);

      return ofResult;
    };
  }

  getCities(): Observable<City[]> {
    const cities = this.http
      .get<City[]>(this.citiesUrl)
      .pipe(catchError(this.handleError<City[]>('getCities', [])));

    return cities;
  }

  getCity(id: number): Observable<City> {
    const url = `${this.citiesUrl}/${id}`;

    const city = this.http.get<City>(url).pipe(
      tap((_) => this.log(`fetched city id=${id}`)),
      catchError(this.handleError<City>(`getCity id=${id}`))
    );

    return city;
  }

  updateCity(city: City): Observable<City> {
    const url = `${this.citiesUrl}/${city.id}`;

    const update = this.http.put<City>(url, city, this.httpOptions).pipe(
      tap((_) => this.log(`City at ${city.id} has been updated`)),
      catchError(this.handleError<City>('updateCity'))
    );

    return update;
  }

  addCity(name: string): Observable<City> {
    const city = { name } as City;

    const cityObservable = this.http
      .post<City>(this.citiesUrl, city, this.httpOptions)
      .pipe(
        tap((newCity: City) => this.log(`added city w/ id=${newCity.id}`)),
        catchError(this.handleError<City>('addcity'))
      );

    return cityObservable;
  }

  deleteCity(id: number): Observable<City> {
    const url = `${this.citiesUrl}/${id}`;

    const deletedCity = this.http.delete<City>(url, this.httpOptions).pipe(
      tap((_) => this.log(`City at ${id} has been deleted`)),
      catchError(this.handleError<City>('deleteCity'))
    );

    return deletedCity;
  }

  searchCity(term: string): Observable<City[]> {
    term = term.trim();

    if (term === null || term === undefined || term === '') {
      const ofReturn = of([]);

      return ofReturn;
    }

    const search = this.http
      .get<City[]>(`${this.citiesUrl}/?name=${term}`)
      .pipe(
        tap((x) => {
          if (0 < x.length) {
            this.log(`Found cities matching ${term}`);
          } else {
            this.log(`Could not find a city matching ${term}`);
          }
        }),
        catchError(this.handleError<City[]>('searchCity', []))
      );

    return search;
  }
}

import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 12, name: 'Dr. Nice', city: 1 },
      { id: 13, name: 'Bombasto', city: 1 },
      { id: 14, name: 'Celeritas', city: 2 },
      { id: 15, name: 'Magneta', city: 2 },
      { id: 16, name: 'RubberMan', city: 3 },
      { id: 17, name: 'Dynama', city: 3 },
      { id: 18, name: 'Dr. IQ', city: 4 },
      { id: 19, name: 'Magma', city: 4 },
      { id: 20, name: 'Tornado', city: 4 },
    ];

    const cities = [
      { id: 1, name: 'Charlotte', heroes: [12, 13] },
      { id: 2, name: 'Greensboro', heroes: [14, 15] },
      { id: 3, name: 'Wilmington', heroes: [16, 17] },
      { id: 4, name: 'Havelock', heroes: [18, 19, 20] },
    ];

    return { heroes, cities };
  }

  genId(heroes: Hero[]): number {
    //Break this up NO TERRINARY CODE
    return heroes.length > 0
      ? Math.max(...heroes.map((hero) => hero.id)) + 1
      : 11;
  }
}

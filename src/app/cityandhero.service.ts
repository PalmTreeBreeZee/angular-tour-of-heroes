import { Injectable } from '@angular/core';
import { HeroService } from './hero.service';
import { concatMap, Observable, of, map, forkJoin } from 'rxjs';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class CityandheroService {
  constructor(private heroService: HeroService) {}

  removeHeroFromCity(heroId: number): Observable<Hero | undefined> {
    const removedHero = this.heroService.getHero(heroId).pipe(
      concatMap((hero) => {
        if (hero === undefined || hero.cityId === null) {
          const ofReturn = of(hero);

          return ofReturn;
        }

        hero.cityId = null;
        const ofReturn = of(hero);

        return this.heroService.updateHero(hero);
      })
    );

    return removedHero;
  }

  addHeroToCity(
    heroId: number,
    cityId: number
  ): Observable<Hero | null | undefined> {
    const addHero = this.heroService.getHero(heroId).pipe(
      concatMap((hero) => {
        if (hero === undefined || hero === null) {
          const ofReturn = of(hero);

          return ofReturn;
        }

        hero.cityId = cityId;
        return this.heroService.updateHero(hero);
      })
    );

    return addHero;
  }

  updateHeroNoCity(cityId: number): Observable<Hero[] | null> {
    const updateHero = this.heroService.getHeroes().pipe(
      concatMap((heroes) => {
        if (heroes === null || heroes === undefined) {
          const ofReturn = of(heroes);

          return ofReturn;
        }

        const heroesWithCity = heroes.filter((hero) => hero.cityId === cityId);

        const updateObservables = heroesWithCity.map((hero) => {
          hero.cityId = null;

          return this.heroService.updateHero(hero);
        });

        if (updateObservables.length === 0) {
          const ofReturn = of(heroes);

          return ofReturn;
        }

        return forkJoin(updateObservables).pipe(map(() => heroes));
      })
    );

    return updateHero;
  }
}

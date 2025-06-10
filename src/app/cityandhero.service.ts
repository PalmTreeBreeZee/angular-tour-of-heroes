import { Injectable } from '@angular/core';
import { HeroService } from './hero.service';
import { CityService } from './city.service';

@Injectable({
  providedIn: 'root',
})
export class CityandheroService {
  constructor(
    private cityService: CityService,
    private heroService: HeroService
  ) {}

  removeHeroFromCity(heroId: number, callback?: () => void): void {
    this.heroService.getHero(heroId).subscribe((hero) => {
      if (hero === undefined || hero.city === null) {
        if (callback !== undefined) {
          callback();
        }

        return;
      }

      this.cityService.getCity(hero.city).subscribe((city) => {
        city.heroes = city.heroes.filter((h) => h !== heroId);

        this.cityService.updateCity(city).subscribe(() => {
          hero.city = null;

          this.heroService.updateHero(hero).subscribe(() => {
            if (callback !== undefined) {
              callback();
            }
          });
        });
      });
    });
  }

  addHeroToCity(heroId: number, cityId: number, callback?: () => void): void {
    this.heroService.getHero(heroId).subscribe((hero) => {
      if (hero === undefined || hero.city !== null) {
        if (callback !== undefined) {
          callback();
        }

        return;
      }

      this.cityService.getCity(cityId).subscribe((city) => {
        city.heroes.push(heroId);

        this.cityService.updateCity(city).subscribe(() => {
          hero.city = cityId;

          this.heroService.updateHero(hero).subscribe(() => {
            if (callback !== undefined) {
              callback();

              return;
            }
          });
        });
      });
    });
  }

  updateHeroNoCity(cityId: number, callback?: () => void): void {
    this.heroService.getHeroes().subscribe((heroes) => {
      const heroesWithCity = heroes.filter((hero) => hero.city === cityId);

      heroesWithCity.forEach((hero) => {
        hero.city = null;

        this.heroService.updateHero(hero).subscribe(() => {
          if (callback !== undefined) {
            callback();

            return;
          }
        });
      });
    });
  }
}

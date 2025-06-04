import { Component, OnInit } from '@angular/core';
import { City } from '../city';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { NgFor, NgIf } from '@angular/common';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [NgFor, NgIf, HeroDetailComponent, RouterLink],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css',
})
export class CitiesComponent implements OnInit {
  cities: City[] = [];
  heroes: Hero[] = [];
  selectedCity?: City;

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.getCities();
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }

  getCities(): void {
    this.heroService.getCities().subscribe((cities) => (this.cities = cities));
  }

  getHeroesByCity(cityId: number): Hero[] {
    return this.heroes.filter((hero) => hero.city === cityId);
  }

  onSelect(city: City): void {
    this.selectedCity = city;
  }

  add(name: string): void {
    if (name === '' || name === null || name === undefined || name.length < 0) {
      return;
    }

    name = name.trim();

    this.heroService.addCity({ name } as City).subscribe((city) => {
      this.cities.push(city);
      this.getCities();
      this.getHeroes();
    });
  }

  removeCity(city: City): void {
    this.heroes.filter((hero) => {
      if (city.heroes !== undefined) {
        for (let i = 0; i < city.heroes.length + 1; i++) {
          if (city.heroes[i] === hero.id) {
            hero.city = null;
          }
        }
      }

      this.heroService.updateHero(hero).subscribe({
        next: () => {
          this.heroService.deleteCity(city.id).subscribe(() => {
            this.getCities();
            this.getHeroes();
          });
        },
      });
    });
  }
}

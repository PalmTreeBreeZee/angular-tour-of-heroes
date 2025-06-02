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
    name = name.trim();
    if (!name) {
      return;
    }
    this.heroService.addCity({ name } as City).subscribe((city) => {
      this.cities.push(city);
    });
  }

  removeCity(id: number): void {
    const city = this.cities.filter((city) => city.id === id);
    this.heroes.filter((hero) => {
      for (let i = 0; i < city[0].heroes.length; i++) {
        if (city[0].heroes[i] === hero.id) {
          hero.city = null;
        }
      }
      this.heroService.updateHero(hero).subscribe();
    });

    this.heroService.deleteCity(id).subscribe();
    this.getCities();
    this.getHeroes();
  }
}

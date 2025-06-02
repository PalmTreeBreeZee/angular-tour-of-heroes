import { Component, Input, OnInit } from '@angular/core';
import { City } from '../city';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { Location, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './city-detail.component.html',
  styleUrl: './city-detail.component.css',
})
export class CityDetailComponent implements OnInit {
  @Input() city?: City;
  heroes: Hero[] = [];

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getCity();
    this.getHeroes();
  }

  getCity(): void {
    const param = this.route.snapshot.paramMap.get('id');
    const id = Number(param);

    if (param == null) {
      return;
    } else if (isNaN(id) || id <= 0) {
      return;
    }

    this.heroService.getCity(id).subscribe((city) => (this.city = city));
  }

  saveCity(): void {
    if (!this.city) {
      console.error('There is no City!!!');
      return;
    }

    this.heroService.updateCityHeroes(this.city).subscribe({});
  }

  getHeroesByCity(cityId: number): Hero[] {
    return this.heroes.filter((hero) => hero.city === cityId);
  }

  goBack(): void {
    this.location.back();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }

  getHeroesNotInCity(cityId: number): Hero[] {
    return this.heroes.filter((hero) => hero.city !== cityId && !hero.city);
  }

  removeHero(heroId: number): void {
    if (!this.city || !this.city.heroes) return;
    const hero = this.heroes.find((h) => h.id === heroId);

    this.city.heroes = this.city.heroes.filter((id) => id !== heroId);

    if (!hero) {
      console.warn(`Hero with ID ${heroId} not found`);
      return;
    }

    hero.city = null;

    this.heroService.updateHero(hero).subscribe({
      next: () => {
        this.saveCity();
      },
    });
  }

  addHero(heroId: number): void {
    const hero = this.heroes.find((h) => h.id === heroId);

    if (!hero) {
      console.warn(`Hero with ID ${heroId} not found`);
      return;
    }

    hero.city = this.city!.id;

    this.heroService.updateHero(hero).subscribe({
      next: () => {
        this.saveCity();
      },
    });
  }
}

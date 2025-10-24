import { Component, Input, OnInit } from '@angular/core';
import { City } from '../city';
import { Hero } from '../hero';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CityService } from '../city.service';
import { HeroService } from '../hero.service';
import { CityandheroService } from '../cityandhero.service';

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './city-detail.component.html',
  styleUrl: './city-detail.component.css',
})
export class CityDetailComponent implements OnInit {
  @Input() city?: City;
  heroes?: Hero[];

  constructor(
    private route: ActivatedRoute,
    private cityService: CityService,
    private cityAndHeroService: CityandheroService,
    private heroService: HeroService
  ) {}

  ngOnInit() {
    this.getCity();
    this.getHeroes();
  }

  getCity(): void {
    const param = this.route.snapshot.paramMap.get('id');
    const cityId = Number(param);

    this.cityService.getCity(cityId).subscribe((city) => (this.city = city));
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }

  removeHero(hero: Hero): void {
    if (this.city === undefined) {
      console.warn('There is no City');
      return;
    }

    this.cityAndHeroService.removeHeroFromCity(hero.id).subscribe(() => {
      this.getHeroes();
    });
  }

  addHero(hero: Hero): void {
    if (this.city === undefined) {
      console.warn('There is no City');
      return;
    }

    this.cityAndHeroService
      .addHeroToCity(hero.id, this.city.id)
      .subscribe(() => {
        this.getHeroes();
      });
  }

  saveCity(): void {
    if (this.city === undefined) {
      console.warn('There is not city');
      return;
    }

    this.cityService.updateCity(this.city).subscribe(() => {
      this.getCity();
    });
  }
}

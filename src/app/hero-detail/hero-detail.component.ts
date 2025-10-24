import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { City } from '../city';
import { Location, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { CityService } from '../city.service';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [NgIf, UpperCasePipe, FormsModule, NgFor],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css',
})
export class HeroDetailComponent implements OnInit {
  @Input() hero?: Hero;
  cities: City[] = [];
  heroes: Hero[] = [];

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private cityService: CityService
  ) {}

  ngOnInit(): void {
    this.getHero();
    this.getCities();
  }

  getHero(heroId?: number): void {
    const param = this.route.snapshot.paramMap.get('id');
    const id = Number(param);

    if (heroId === undefined) {
      if (id === 0) {
        return;
      }

      this.heroService.getHero(id).subscribe((hero) => (this.hero = hero));
    } else if (heroId !== undefined) {
      this.heroService.getHero(heroId).subscribe((hero) => (this.hero = hero));
    }
  }

  getCities(): void {
    this.cityService.getCities().subscribe((cities) => (this.cities = cities));
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.hero == undefined) {
      return;
    }

    this.heroService.updateHero(this.hero).subscribe(() => {
      this.getHero();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HeroService } from '../hero.service';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { MessagesComponent } from '../messages/messages.component';
import { RouterLink } from '@angular/router';
import { CityandheroService } from '../cityandhero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css',
  standalone: true,
  imports: [
    NgFor,
    HeroDetailComponent,
    MessagesComponent,
    RouterLink,
    NgIf,
    CommonModule,
  ],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];
  selectedHero?: Hero;

  constructor(
    private heroService: HeroService,
    private cityAndHeroService: CityandheroService
  ) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

  add(name: string): void {
    if (name === undefined || name === null) {
      return;
    }

    name = name.trim();

    this.heroService.addHero(name).subscribe(() => {
      this.getHeroes();
    });
  }

  delete(hero: Hero): void {
    this.cityAndHeroService.removeHeroFromCity(hero.id).subscribe(() => {
      this.heroService.deleteHero(hero.id).subscribe(() => {
        this.selectedHero = undefined;

        this.getHeroes();
      });
    });
  }
}

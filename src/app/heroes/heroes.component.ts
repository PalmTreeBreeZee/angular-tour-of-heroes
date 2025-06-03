import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HeroService } from '../hero.service';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { MessagesComponent } from '../messages/messages.component';
import { RouterLink } from '@angular/router';

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

  constructor(private heroService: HeroService) {}

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
    if (name === undefined) {
      return;
    }

    name = name.trim();

    this.heroService.addHero({ name } as Hero).subscribe((hero) => {
      this.heroes.push(hero);
      this.getHeroes();
    });
  }

  delete(hero: Hero): void {
    this.heroService.deleteHero(hero.id).subscribe(() => {
      this.getHeroes();
    });
  }
}

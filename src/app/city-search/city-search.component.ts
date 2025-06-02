import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { City } from '../city';

@Component({
  selector: 'app-city-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './city-search.component.html',
  styleUrl: './city-search.component.css',
})
export class CitySearchComponent implements OnInit {
  cities$!: Observable<City[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.cities$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchCity(term))
    );
  }
}

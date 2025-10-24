import { Component, OnInit } from '@angular/core';
import { City } from '../city';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CityService } from '../city.service';
import { CityandheroService } from '../cityandhero.service';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css',
})
export class CitiesComponent implements OnInit {
  cities: City[] = [];
  selectedCity?: City;

  constructor(
    private cityService: CityService,
    private cityAndHeroService: CityandheroService
  ) {}

  ngOnInit(): void {
    this.getCities();
  }

  getCities(): void {
    this.cityService.getCities().subscribe((cities) => (this.cities = cities));
  }

  onSelect(city: City): void {
    this.selectedCity = city;
  }

  add(name: string): void {
    this.cityService.addCity(name).subscribe(() => {
      this.getCities();
    });
  }

  removeCity(city: City): void {
    const cityId = city.id;

    this.cityAndHeroService.updateHeroNoCity(cityId).subscribe(() => {
      this.cityService.deleteCity(city.id).subscribe(() => {
        this.getCities();
      });
    });
  }
}

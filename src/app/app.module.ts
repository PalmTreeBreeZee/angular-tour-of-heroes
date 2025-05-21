import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HeroesComponent } from "./heroes/heroes.component";
import { AppComponent } from "./app.component";
import { HeroDetailComponent } from "./hero-detail/hero-detail.component";
import { MessagesComponent } from "./messages/messages.component";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { HttpClientXsrfModule } from "@angular/common/http";



@NgModule({
    imports: [BrowserModule, FormsModule, CommonModule, RouterLink, HttpClientXsrfModule],
    declarations: [AppComponent, HeroesComponent, MessagesComponent, HeroDetailComponent, MessagesComponent],
    bootstrap:[AppComponent]
})

export class AppModule{}
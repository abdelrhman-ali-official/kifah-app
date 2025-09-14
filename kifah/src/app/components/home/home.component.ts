import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { VictimStatsComponent } from '../victim-stats/victim-stats.component';
import { VictimListComponent } from '../victim-list/victim-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroSectionComponent, VictimStatsComponent, VictimListComponent],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <app-hero-section></app-hero-section>
      
      <!-- Victim Stats Section -->
      <app-victim-stats></app-victim-stats>
      
      <!-- Victims Section -->
      <app-victim-list></app-victim-list>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {

  ngOnInit() {
    // Add any initialization logic here
  }
}

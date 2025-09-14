import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VictimService, Victim } from '../../services/victim.service';
import { VictimCardComponent } from '../victim-card/victim-card.component';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

interface SearchFilters {
  name?: string;
  gender?: string;
  ageRange?: string;
  governorate?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}

interface PaginationInfo {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, VictimCardComponent],
  template: `
    <section class="min-h-screen flex items-center justify-center relative overflow-hidden">
      <!-- Enhanced Background Effects -->
      <div class="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
      
      <!-- Animated Background Particles -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div class="absolute top-1/2 right-1/3 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <!-- Add spacing to push content down -->
      <div class="pt-16 md:pt-20 lg:pt-24"></div>
      
      <div class="container mx-auto px-4 text-center relative z-10 pb-32 pt-10 md:pt-16 lg:pt-20">
        <!-- Enhanced Arabic Text with Typewriter Effect -->
        <div class="mb-20 mt-24 md:mt-32">
          <h2 
            class="text-4xl md:text-6xl lg:text-7xl font-bold font-custom text-white mb-6 min-h-[4.5rem] flex items-center justify-center"
            [@fadeInUp]
          >
            <span class="typewriter-text">
              {{ displayText }}<span class="cursor"></span>
            </span>
          </h2>
          <p class="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto" [@fadeInUp]>
            Search for victims, remember their stories, honor their memory
          </p>
        </div>

        <!-- Enhanced Search Section -->
        <div class="max-w-4xl mx-auto mb-8">
          <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="space-y-6">
            <!-- Main Search Input -->
            <div class="relative">
              <input 
                type="text" 
                formControlName="name"
                placeholder="Search by name or family..."
                class="w-full px-8 py-4 text-lg bg-glass backdrop-blur-md border border-red-500/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all duration-300 glow-hover"
                [@searchAnimation]
              />
              <div class="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-2xl pointer-events-none"></div>
              <button 
                type="submit"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-primary-red transition-colors duration-300 p-2 rounded-lg hover:bg-red-500/20"
                [disabled]="loading"
              >
                <svg *ngIf="!loading" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <div *ngIf="loading" class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </button>
            </div>

            <!-- Advanced Search Filters -->
            <div class="flex justify-center">
              <button 
                type="button"
                (click)="toggleAdvancedSearch()"
                class="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2"
              >
                <span>{{ showAdvanced ? 'Hide' : 'Show' }} Advanced Filters</span>
                <svg 
                  class="w-4 h-4 transform transition-transform duration-300" 
                  [class.rotate-180]="showAdvanced"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>

            <!-- Advanced Filters -->
            <div 
              class="overflow-hidden transition-all duration-500 ease-in-out"
              [style.max-height]="showAdvanced ? '600px' : '0px'"
              [style.opacity]="showAdvanced ? '1' : '0'"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-black/20 backdrop-blur-sm rounded-2xl border border-red-500/20">
                <!-- Gender Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select 
                    formControlName="gender"
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Genders</option>
                    <option value="m">Male</option>
                    <option value="f">Female</option>
                  </select>
                </div>

                <!-- Governorate Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Governorate</label>
                  <select 
                    formControlName="governorate"
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Governorates</option>
                    <option value="Gaza Strip">Gaza Strip</option>
                    <option value="North Gaza">North Gaza</option>
                    <option value="Gaza">Gaza</option>
                    <option value="Deir al-Balah">Deir al-Balah</option>
                    <option value="Khan Yunis">Khan Yunis</option>
                    <option value="Rafah">Rafah</option>
                    <option value="West Bank">West Bank</option>
                    <option value="Jerusalem">Jerusalem</option>
                    <option value="Ramallah">Ramallah</option>
                    <option value="Bethlehem">Bethlehem</option>
                    <option value="Hebron">Hebron</option>
                    <option value="Nablus">Nablus</option>
                    <option value="Jenin">Jenin</option>
                    <option value="Tulkarm">Tulkarm</option>
                    <option value="Qalqilya">Qalqilya</option>
                    <option value="Salfit">Salfit</option>
                    <option value="Tubas">Tubas</option>
                    <option value="Jericho">Jericho</option>
                  </select>
                </div>

                <!-- Sort Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                  <select 
                    formControlName="sort"
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Default</option>
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                    <option value="date_desc">Date (Newest First)</option>
                    <option value="date_asc">Date (Oldest First)</option>
                    <option value="age_asc">Age (Youngest First)</option>
                    <option value="age_desc">Age (Oldest First)</option>
                  </select>
                </div>

                <!-- Start Date Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">From Date</label>
                  <input 
                    type="date"
                    formControlName="startDate"
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <!-- End Date Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">To Date</label>
                  <input 
                    type="date"
                    formControlName="endDate"
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <!-- Results Per Page -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Results Per Page</label>
                  <select 
                    [(ngModel)]="pagination.pageSize"
                    (ngModelChange)="onPageSizeChange($event)"
                    [ngModelOptions]="{standalone: true}"
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                <!-- Clear Filters Button -->
                <div class="flex items-end">
                  <button 
                    type="button"
                    (click)="clearFilters()"
                    class="w-full px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors duration-300 border border-red-500/30 flex items-center justify-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span>Clear Filters</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Enhanced Call to Action -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button 
            type="button" 
            class="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
            (click)="onSearch()" 
            [disabled]="loading"
            [@fadeInUp]
          >
            <span class="flex items-center space-x-2">
              <svg *ngIf="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <div *ngIf="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{{ loading ? 'Searching...' : 'Search Now' }}</span>
            </span>
          </button>
          <button 
            class="px-8 py-3 glass-effect text-white rounded-xl font-semibold hover:text-primary-red transition-all duration-300 glow-hover border border-white/20"
            (click)="scrollToVictims()"
            [@fadeInUp]
            style="animation-delay: 0.2s;"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>View All Victims</span>
            </span>
          </button>
        </div>

        <!-- Enhanced Search Results -->
        <div class="max-w-7xl mx-auto mt-12" *ngIf="submitted">
          <!-- Search Summary & Pagination Info -->
          <div *ngIf="!loading && victims.length > 0" class="text-center mb-8">
            <div class="inline-flex flex-col items-center space-y-2">
              <div class="inline-flex items-center px-6 py-3 bg-red-900/20 backdrop-blur-sm rounded-full border border-red-500/30">
                <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-red-200">
                  Found {{ pagination.totalCount | number }} victim{{ pagination.totalCount !== 1 ? 's' : '' }}
                </span>
                <span *ngIf="searchSummary" class="text-gray-400 ml-2">{{ searchSummary }}</span>
              </div>
              <div class="text-sm text-gray-400">
                Showing {{ getResultsRange() }} of {{ pagination.totalCount | number }} results
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="flex flex-col items-center py-16" [@fadeInUp]>
            <div class="relative">
              <div class="w-16 h-16 border-4 border-red-600/30 border-t-red-500 rounded-full animate-spin"></div>
              <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-l-red-400 rounded-full animate-spin animate-reverse" style="animation-delay: 0.3s;"></div>
            </div>
            <p class="text-gray-400 mt-4 animate-pulse">Searching through records...</p>
          </div>

          <!-- No Results -->
          <div *ngIf="!loading && victims.length === 0" class="text-center py-16" [@fadeInUp]>
            <div class="max-w-md mx-auto">
              <svg class="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <h3 class="text-xl font-semibold text-gray-300 mb-2">No results found</h3>
              <p class="text-gray-500 mb-6">Try adjusting your search criteria or browse all victims</p>
              <button 
                (click)="clearSearch()"
                class="px-6 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors duration-300 border border-red-500/30"
              >
                Clear Search
              </button>
            </div>
          </div>

          <!-- Results Grid -->
          <div *ngIf="!loading && victims.length > 0" class="space-y-8">
            <!-- View Toggle -->
            <div class="flex justify-center mb-6">
              <div class="inline-flex rounded-lg bg-gray-800/50 backdrop-blur-sm p-1 border border-gray-600/30">
                <button
                  type="button"
                  (click)="viewMode = 'grid'"
                  class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  [class]="viewMode === 'grid' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'"
                >
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                  Grid
                </button>
                <button
                  type="button"
                  (click)="viewMode = 'list'"
                  class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  [class]="viewMode === 'list' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'"
                >
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                  </svg>
                  List
                </button>
              </div>
            </div>

            <!-- Grid View -->
            <div 
              *ngIf="viewMode === 'grid'" 
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              [@staggerAnimation]
            >
              <div *ngFor="let victim of victims; trackBy: trackByVictim" [@cardAnimation]>
                <app-victim-card [victim]="victim"></app-victim-card>
              </div>
            </div>

            <!-- List View -->
            <div 
              *ngIf="viewMode === 'list'" 
              class="space-y-4"
              [@staggerAnimation]
            >
              <div *ngFor="let victim of victims; trackBy: trackByVictim" [@cardAnimation]>
                <app-victim-card [victim]="victim"></app-victim-card>
              </div>
            </div>

            <!-- Enhanced Pagination -->
            <div *ngIf="pagination.totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between mt-12 space-y-4 sm:space-y-0">
              <!-- Page Info -->
              <div class="text-sm text-gray-400">
                Page {{ pagination.pageIndex }} of {{ pagination.totalPages }}
              </div>

              <!-- Pagination Controls -->
              <div class="flex items-center space-x-2">
                <!-- First Page -->
                <button
                  (click)="goToPage(1)"
                  [disabled]="!pagination.hasPreviousPage || loading"
                  class="px-3 py-2 text-sm bg-gray-800/50 text-gray-400 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⟪
                </button>

                <!-- Previous Page -->
                <button
                  (click)="goToPage(pagination.pageIndex - 1)"
                  [disabled]="!pagination.hasPreviousPage || loading"
                  class="px-4 py-2 text-sm bg-gray-800/50 text-gray-400 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <!-- Page Numbers -->
                <div class="flex space-x-1">
                  <button
                    *ngFor="let page of getVisiblePages()"
                    (click)="page !== '...' && goToPage(+page)"
                    [disabled]="page === '...' || loading"
                    class="px-3 py-2 text-sm rounded-lg transition-colors duration-300"
                    [class]="page == pagination.pageIndex ? 
                      'bg-red-600 text-white' : 
                      page === '...' ? 
                        'text-gray-500 cursor-default' : 
                        'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'"
                  >
                    {{ page }}
                  </button>
                </div>

                <!-- Next Page -->
                <button
                  (click)="goToPage(pagination.pageIndex + 1)"
                  [disabled]="!pagination.hasNextPage || loading"
                  class="px-4 py-2 text-sm bg-gray-800/50 text-gray-400 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>

                <!-- Last Page -->
                <button
                  (click)="goToPage(pagination.totalPages)"
                  [disabled]="!pagination.hasNextPage || loading"
                  class="px-3 py-2 text-sm bg-gray-800/50 text-gray-400 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⟫
                </button>
              </div>

              <!-- Quick Jump -->
              <div class="flex items-center space-x-2 text-sm">
                <span class="text-gray-400">Go to page:</span>
                <input
                  type="number"
                  [value]="pagination.pageIndex"
                  (keyup.enter)="goToPage(+$any($event.target).value)"
                  (blur)="goToPage(+$any($event.target).value)"
                  [min]="1"
                  [max]="pagination.totalPages"
                  class="w-16 px-2 py-1 bg-gray-800/50 border border-gray-600 rounded text-white text-center focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-12 left-[40%] md:left-[46%] transform -translate-x-1/2 animate-bounce" *ngIf="!submitted">
          <div class="flex flex-col items-center space-y-3">
            <span class="text-gray-300 text-sm font-medium">Scroll to explore</span>
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .typewriter-text {
      position: relative;
      display: inline-block;
      white-space: nowrap;
      direction: rtl;
      unicode-bidi: isolate;
      text-shadow: 0 0 30px rgba(220, 38, 38, 0.6), 0 0 60px rgba(220, 38, 38, 0.3);
      font-family: 'TheYearofHandicrafts', 'Cairo', 'Amiri', Arial, sans-serif;
      font-weight: 900;
      letter-spacing: 0.05em;
      margin-top: 2rem; /* Add extra margin to push text down */
    }
    
    .cursor {
      position: absolute;
      inset-inline-end: -2px;
      top: 50%;
      transform: translateY(-55%);
      width: 3px;
      height: 1.1em;
      background: linear-gradient(to bottom, #ffffff, #ef4444);
      animation: blink 1s infinite;
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
      border-radius: 1px;
    }
    
    @keyframes blink {
      0%, 50% { opacity: 1; transform: translateY(-55%) scaleY(1); }
      51%, 100% { opacity: 0; transform: translateY(-55%) scaleY(0.8); }
    }

    @keyframes animate-float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(1deg); }
      66% { transform: translateY(10px) rotate(-1deg); }
    }

    @keyframes animate-float-delayed {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(15px) rotate(-1deg); }
      66% { transform: translateY(-10px) rotate(1deg); }
    }

    .animate-float {
      animation: animate-float 6s ease-in-out infinite;
    }

    .animate-float-delayed {
      animation: animate-float-delayed 8s ease-in-out infinite;
    }

    .animate-reverse {
      animation-direction: reverse;
    }

    .glass-effect {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .glow-hover {
      transition: all 0.3s ease;
    }

    .glow-hover:hover {
      box-shadow: 0 0 30px rgba(220, 38, 38, 0.3);
      transform: translateY(-2px);
    }
  `],
  animations: [
    trigger('searchAnimation', [
      state('in', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.9)' }),
        animate('0.6s ease-out')
      ])
    ]),
    trigger('fadeInUp', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.5s ease-out')
      ])
    ]),
    trigger('cardAnimation', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(50px) scale(0.8)' }),
        animate('0.6s ease-out')
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger(100, [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  victims: Victim[] = [];
  loading = false;
  submitted = false;
  showAdvanced = false;
  viewMode: 'grid' | 'list' = 'grid';
  searchSummary = '';
  
  // Pagination properties
  pagination: PaginationInfo = {
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  };
  
  // Typewriter effect properties
  displayText = '';
  currentTextIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;
  timeoutId: any;

  arabicTexts = [
    'رُوحُ الرُّوحِ، هَذِي رُوحُ الرُّوحِ',
    'مَتْعَيَّطِشْ يَا زَلَمِة، كِلْنَا مَشَارِيع شُهَدَاءَ',
    'شَعْرُهُ كِيرْلِيٌّ وَأَبْيَضَانِيٌّ وَحِلْوٌ',
    'أُوصِيكُمْ بِفِلَسْطِينَ',
    'أُوصِيكُمْ بِقُرَّةِ عَيْنِي، ابْنَتِي الْحَبِيبَةِ شَام',
    'يَابَا، مِشْ كَانَ بَدَّكْ تِطْلَعْ صَحَفِيًّ؟',
    'مِينْ ضَلَّ عَايِشً؟!',
    'هِيَ وَاللَّهِ هِيَ، بَعْرِفْ أُمِّي مِنْ شَعْرِهَا',
    'وَيْنَ الْعَرَبُ؟'
  ];

  constructor(
    private fb: FormBuilder, 
    private victimService: VictimService
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      gender: [''],
      governorate: [''],
      startDate: [''],
      endDate: [''],
      sort: ['']
    });
  }

  ngOnInit() {
    this.typeWriter();
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  typeWriter() {
    const txt = this.arabicTexts[this.currentTextIndex];

    if (this.isDeleting) {
      this.displayText = txt.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      this.displayText = txt.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }

    let speed = this.isDeleting ? 50 : 120;

    if (!this.isDeleting && this.currentCharIndex === txt.length) {
      speed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentTextIndex = (this.currentTextIndex + 1) % this.arabicTexts.length;
      speed = 500;
    }

    this.timeoutId = setTimeout(() => this.typeWriter(), speed);
  }

  toggleAdvancedSearch() {
    this.showAdvanced = !this.showAdvanced;
  }

  onSearch() {
    this.pagination.pageIndex = 1; // Reset to first page on new search
    this.performSearch();
  }

  performSearch() {
    this.submitted = true;
    const formValue = this.searchForm.value;
    
    // Build search summary
    this.buildSearchSummary(formValue);
    
    this.loading = true;
    
    // Build search parameters matching the API specification
    const searchParams: any = {
      PageIndex: this.pagination.pageIndex,
      PageSize: this.pagination.pageSize
    };

    if (formValue.name?.trim()) {
      searchParams.Name = formValue.name.trim();
    }

    if (formValue.governorate) {
      searchParams.Governorate = formValue.governorate;
    }

    if (formValue.gender) {
      searchParams.Gender = formValue.gender;
    }

    if (formValue.startDate) {
      searchParams.StartDate = new Date(formValue.startDate).toISOString();
    }

    if (formValue.endDate) {
      // Set end date to end of day
      const endDate = new Date(formValue.endDate);
      endDate.setHours(23, 59, 59, 999);
      searchParams.EndDate = endDate.toISOString();
    }

    if (formValue.sort) {
      searchParams.Sort = formValue.sort;
    }

    this.victimService.getVictims(searchParams).subscribe({
      next: (response) => {
        console.log('Search results:', response);
        console.log('First victim data:', response.data?.[0]);
        this.victims = response.data || [];
        this.updatePagination(response);
        this.loading = false;
        
        // Scroll to results if not on first search
        if (this.pagination.pageIndex > 1) {
          this.scrollToResults();
        }
      },
      error: (error) => {
        console.error('Search error:', error);
        this.victims = [];
        this.resetPagination();
        this.loading = false;
      }
    });
  }

  private updatePagination(response: any) {
    this.pagination = {
      pageIndex: response.pageIndex || 1,
      pageSize: response.pageSize || 20,
      totalCount: response.totalCount || 0,
      totalPages: Math.ceil((response.totalCount || 0) / (response.pageSize || 20)),
      hasNextPage: (response.pageIndex || 1) < Math.ceil((response.totalCount || 0) / (response.pageSize || 20)),
      hasPreviousPage: (response.pageIndex || 1) > 1
    };
  }

  private resetPagination() {
    this.pagination = {
      pageIndex: 1,
      pageSize: this.pagination.pageSize,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }

  private buildSearchSummary(formValue: any) {
    const criteria = [];
    
    if (formValue.gender) {
      criteria.push(formValue.gender === 'f' ? 'female' : 'male');
    }
    
    if (formValue.governorate) {
      criteria.push(`in ${formValue.governorate}`);
    }
    
    if (formValue.startDate || formValue.endDate) {
      if (formValue.startDate && formValue.endDate) {
        criteria.push(`from ${formValue.startDate} to ${formValue.endDate}`);
      } else if (formValue.startDate) {
        criteria.push(`from ${formValue.startDate}`);
      } else {
        criteria.push(`until ${formValue.endDate}`);
      }
    }

    if (formValue.sort) {
      const sortLabels: { [key: string]: string } = {
        'name_asc': 'sorted by name A-Z',
        'name_desc': 'sorted by name Z-A',
        'date_desc': 'newest first',
        'date_asc': 'oldest first',
        'age_asc': 'youngest first',
        'age_desc': 'oldest first'
      };
      criteria.push(sortLabels[formValue.sort] || 'sorted');
    }

    this.searchSummary = criteria.length > 0 ? `(${criteria.join(', ')})` : '';
  }

  goToPage(page: number) {
    if (page < 1 || page > this.pagination.totalPages || page === this.pagination.pageIndex || this.loading) {
      return;
    }
    
    this.pagination.pageIndex = page;
    this.performSearch();
  }

  onPageSizeChange(newSize: number) {
    this.pagination.pageSize = newSize;
    this.pagination.pageIndex = 1; // Reset to first page when changing page size
    if (this.submitted) {
      this.performSearch();
    }
  }

  getVisiblePages(): (number | string)[] {
    const current = this.pagination.pageIndex;
    const total = this.pagination.totalPages;
    const delta = 2; // Number of pages to show on each side of current page
    
    if (total <= 7) {
      // Show all pages if total is small
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    // Add ellipsis if needed
    if (current > delta + 2) {
      pages.push('...');
    }
    
    // Add pages around current page
    const start = Math.max(2, current - delta);
    const end = Math.min(total - 1, current + delta);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if needed
    if (current < total - delta - 1) {
      pages.push('...');
    }
    
    // Always show last page if it's not already included
    if (total > 1) {
      pages.push(total);
    }
    
    return pages;
  }

  getResultsRange(): string {
    const start = (this.pagination.pageIndex - 1) * this.pagination.pageSize + 1;
    const end = Math.min(this.pagination.pageIndex * this.pagination.pageSize, this.pagination.totalCount);
    return `${start}-${end}`;
  }

  clearSearch() {
    this.searchForm.reset();
    this.victims = [];
    this.submitted = false;
    this.searchSummary = '';
    this.showAdvanced = false;
    this.resetPagination();
    this.pagination.pageSize = 20; // Reset to default page size
  }

  clearFilters() {
    this.searchForm.patchValue({
      gender: '',
      governorate: '',
      startDate: '',
      endDate: '',
      sort: ''
    });
    
    // If search was already submitted, re-search with cleared filters
    if (this.submitted) {
      this.onSearch();
    }
  }

  scrollToVictims() {
    const victimsSection = document.getElementById('victims-section');
    if (victimsSection) {
      victimsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToResults() {
    // Scroll to results section after page change
    setTimeout(() => {
      const resultsSection = document.querySelector('.max-w-7xl.mx-auto.mt-12');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  trackByVictim(index: number, victim: Victim): any {
    return victim.id || index;
  }
}
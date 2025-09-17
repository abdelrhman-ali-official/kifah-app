import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';
import { VictimService, VictimsResponse, Victim, VictimQuery } from '../../services/victim.service';

@Component({
  selector: 'app-victim-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styles: [`
    .arabic-text {
      font-family: 'arabic', Arial, sans-serif;
      font-weight: bold;
    }
    .text-shadow-lg {
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6);
    }
    .glass-card {
      background: linear-gradient(135deg, 
        rgba(0, 0, 0, 0.85) 0%, 
        rgba(20, 20, 20, 0.9) 25%,
        rgba(40, 40, 40, 0.8) 50%,
        rgba(0, 0, 0, 0.9) 100%);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(255, 255, 255, 0.05);
    }
    .glass-card:hover {
      background: linear-gradient(135deg, 
        rgba(220, 38, 38, 0.15) 0%, 
        rgba(0, 0, 0, 0.9) 25%,
        rgba(40, 40, 40, 0.85) 50%,
        rgba(0, 0, 0, 0.95) 100%);
      border: 1px solid rgba(220, 38, 38, 0.3);
      box-shadow: 
        0 20px 40px rgba(220, 38, 38, 0.2),
        0 8px 32px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        inset 0 -1px 0 rgba(220, 38, 38, 0.1);
    }
    .logo-container {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 20;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 6px;
      backdrop-filter: blur(10px);
    }
    .logo-container img {
      width: 24px;
      height: 24px;
      object-fit: contain;
      filter: brightness(0) invert(1);
      opacity: 0.9;
    }
  `],
  template: `
    <section id="victims-section" class="py-20 bg-gradient-dark">
      <div class="container mx-auto px-4">
        <!-- Header with Controls -->
        <div class="text-center mb-8">
          <div class="mb-6">
            <h2 class="text-4xl md:text-5xl font-bold text-white arabic-text mb-3" [@fadeInUp]>
              الشهداء
            </h2>
            <p class="text-lg text-gray-300" [@fadeInUp]>
              {{ totalCount.toLocaleString() }} victims found • Page {{ pageIndex }} of {{ totalPages.toLocaleString() }}
            </p>
          </div>

          <div class="flex flex-wrap gap-4 items-center justify-center">
            <!-- Page Size Selector -->
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-300">Show:</label>
              <select 
                [(ngModel)]="pageSize" 
                (change)="onPageSizeChange()"
                class="px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                [disabled]="loading"
              >
                <option value="10" class="bg-gray-800">10 per page</option>
                <option value="25" class="bg-gray-800">25 per page</option>
                <option value="50" class="bg-gray-800">50 per page</option>
                <option value="100" class="bg-gray-800">100 per page</option>
              </select>
            </div>
            
            <!-- Action Buttons -->
            <a routerLink="/victims/submit" 
               class="px-6 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Submit Victim
            </a>
          </div>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-100">
          {{ errorMessage }}
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p class="text-gray-300 mt-4">Loading victims...</p>
        </div>

        <!-- Victims Grid -->
        <div *ngIf="!loading && victims.length > 0" 
             class="grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
             [@staggerIn]>
          <div *ngFor="let victim of victims; trackBy: trackByVictimId"
               class="group glass-card rounded-2xl p-6 transition-all duration-500 cursor-pointer transform hover:-translate-y-3 hover:scale-105"
               [@fadeInUp]
               (click)="goToVictim(victim.id)">
            
            <!-- Victim Custom Block -->
            <div class="relative mb-6 overflow-hidden rounded-xl shadow-2xl">
              <div class="w-full h-56 bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center group-hover:scale-110 transition-all duration-700 shadow-inner border border-gray-200 relative filter brightness(110%) contrast(105%)">
                
                <!-- Enhanced Logo Container -->
                <div class="logo-container">
                  <img src="/assets/black-logo.png" alt="Kifah Logo">
                </div>
                
                <div class="relative z-10 text-center px-6 py-4">
                  <div class="text-black text-2xl md:text-3xl font-bold arabic-text leading-tight mb-3 filter drop-shadow-sm">
                    {{ getVictimFirstLast(victim.name) }}
                  </div>
                  <div class="text-gray-700 text-sm md:text-base font-semibold filter drop-shadow-sm" *ngIf="victim.enName">
                    {{ getVictimFirstLast(victim.enName) }}
                  </div>
                </div>
                
                <!-- Red accent overlay on hover -->
                <div class="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl"></div>
                
                <!-- Shimmer effect -->
                <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl transform -skew-x-12"></div>
              </div>
            </div>

            <!-- Victim Info -->
            <div class="space-y-3">
              <div class="text-center border-b border-white/20 pb-3 mb-4">
                <h3 class="text-xl font-bold text-white group-hover:text-red-400 transition-colors arabic-text leading-relaxed filter drop-shadow-sm">
                  {{ victim.name }}
                </h3>
                <p class="text-gray-300 text-sm mt-1 filter drop-shadow-sm" *ngIf="victim.enName">
                  {{ victim.enName }}
                </p>
              </div>
              
              <div class="flex items-center text-sm text-gray-200 bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10 transition-all duration-300 hover:bg-black/30 hover:border-red-500/30">
                <svg class="w-4 h-4 mr-3 text-red-400 filter drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="font-medium">Age: {{ victim.age || 'Unknown' }}</span>
              </div>
              
              <div class="flex items-center text-sm text-gray-300 bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                <svg class="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="font-medium">{{ (victim.governorate || 'Gaza') }}{{ victim.district ? ', ' + victim.district : '' }}</span>
              </div>
              
              <div class="flex items-center text-sm text-gray-200 bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10 transition-all duration-300 hover:bg-black/30 hover:border-red-500/30" *ngIf="victim.eventDate">
                <svg class="w-4 h-4 mr-3 text-red-400 filter drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="font-medium">{{ getEventDateDisplay(victim.eventDate) }}</span>
              </div>

              <div class="flex items-center text-sm text-gray-200 bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10 transition-all duration-300 hover:bg-black/30 hover:border-red-500/30" *ngIf="victim.gender">
                <svg class="w-4 h-4 mr-3 text-red-400 filter drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="font-medium">{{ getGenderLabel(victim.gender) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results State -->
        <div *ngIf="!loading && victims.length === 0" class="text-center py-12">
          <div class="max-w-md mx-auto">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="text-lg font-medium text-white mt-4">No victims found</h3>
            <p class="text-gray-400 mt-2">Try adjusting your search criteria or check back later.</p>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div *ngIf="!loading && victims.length > 0 && totalPages > 1" class="mt-12">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <!-- Results Info -->
            <div class="text-sm text-gray-300">
              Showing {{ getStartIndex().toLocaleString() }} to {{ getEndIndex().toLocaleString() }} of {{ totalCount.toLocaleString() }} victims
            </div>

            <!-- Pagination Buttons -->
            <div class="flex items-center gap-2">
              <!-- First Page -->
              <button *ngIf="pageIndex > 1"
                (click)="goToPage(1)"
                class="px-3 py-2 rounded-lg bg-glass-dark border border-glass-border text-gray-300 hover:bg-glass-light hover:text-white transition-all duration-200"
                [disabled]="loading">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                </svg>
              </button>

              <!-- Previous Page -->
              <button *ngIf="pageIndex > 1"
                (click)="goToPage(pageIndex - 1)"
                class="px-3 py-2 rounded-lg bg-glass-dark border border-glass-border text-gray-300 hover:bg-glass-light hover:text-white transition-all duration-200"
                [disabled]="loading">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <!-- Page Numbers -->
              <div class="flex items-center gap-1">
                <ng-container *ngFor="let page of getVisiblePages()">
                  <button *ngIf="page !== '...'"
                    (click)="goToPage(page)"
                    class="px-3 py-2 rounded-lg transition-all duration-200"
                    [ngClass]="{
                      'bg-primary-red text-white': page === pageIndex,
                      'bg-glass-dark border border-glass-border text-gray-300 hover:bg-glass-light hover:text-red': page !== pageIndex
                    }"
                    [disabled]="loading">
                    {{ page }}
                  </button>
                  <span *ngIf="page === '...'" class="px-2 text-gray-400">...</span>
                </ng-container>
              </div>

              <!-- Next Page -->
              <button *ngIf="pageIndex < totalPages"
                (click)="goToPage(pageIndex + 1)"
                class="px-3 py-2 rounded-lg bg-glass-dark border border-glass-border text-gray-300 hover:bg-glass-light hover:text-white transition-all duration-200"
                [disabled]="loading">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              <!-- Last Page -->
              <button *ngIf="pageIndex < totalPages"
                (click)="goToPage(totalPages)"
                class="px-3 py-2 rounded-lg bg-glass-dark border border-glass-border text-gray-300 hover:bg-glass-light hover:text-white transition-all duration-200"
                [disabled]="loading">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Jump to Page -->
          <div class="flex items-center justify-center gap-2 mt-4">
            <span class="text-sm text-gray-300">Go to page:</span>
            <input type="number" 
              [(ngModel)]="jumpToPage" 
              (keyup.enter)="onJumpToPage()"
              [min]="1" 
              [max]="totalPages"
              placeholder="Page"
              class="w-20 px-2 py-1 rounded border bg-glass-dark border-glass-border text-black text-sm focus:outline-none focus:ring-2 focus:ring-primary-red/50">
            <button 
              (click)="onJumpToPage()"
              class="px-3 py-1 rounded bg-primary-red hover:bg-red-600 text-white text-sm transition-colors"
              [disabled]="loading">
              Go
            </button>
          </div>
        </div>

        <!-- Refresh Button -->
        <div class="mt-8 text-center">
          <button 
            (click)="refreshCurrentPage()"
            class="px-4 py-2 rounded-lg bg-glass-dark border border-glass-border text-gray-300 hover:bg-glass-light hover:text-white transition-all duration-200"
            [disabled]="loading">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </section>
  `,
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class VictimListComponent implements OnInit {
  victims: Victim[] = []; // Current page victims from server
  loading = false;
  errorMessage = '';

  pageIndex = 1;
  pageSize = 25; // Default page size for server-side pagination
  totalCount = 0;
  jumpToPage: number | null = null;

  totalPages = 0;

  constructor(
    private victimService: VictimService, 
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Now that backend pagination is fixed, use proper server-side pagination
    console.log('DEBUG: Using server-side pagination with fixed backend...');
    
    this.route.queryParams.subscribe(params => {
      const page = parseInt(params['page']) || 1;
      const size = parseInt(params['size']) || this.pageSize;
      
      this.pageIndex = page;
      this.pageSize = size;
      
      this.loadVictims();
    });
  }

  loadVictims() {
    this.loading = true;
    this.errorMessage = '';
    
    console.log(`Loading victims - Page: ${this.pageIndex}, Size: ${this.pageSize}`);
    
    const query: VictimQuery = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize
    };
    
    console.log('Sending query to API:', query);
    
    this.victimService.getVictims(query).subscribe({
      next: (response: VictimsResponse) => {
        console.log('Full API Response:', response);
        console.log('Total Count from API:', response.totalCount);
        console.log('Page Index from API:', response.pageIndex);
        console.log('Page Size from API:', response.pageSize);
        console.log('Data Length:', response.data?.length);
        
        this.loading = false;
        this.victims = response.data || [];
        this.totalCount = response.totalCount || 0;
        this.pageIndex = response.pageIndex || this.pageIndex;
        this.pageSize = response.pageSize || this.pageSize;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        
        console.log(`Server-side pagination - Total: ${this.totalCount}, Pages: ${this.totalPages}, Current Page: ${this.pageIndex}`);
        console.log(`Data received: ${this.victims.length} victims for page ${this.pageIndex}`);
      },
      error: (error: any) => {
        console.error('Error loading victims:', error);
        this.loading = false;
        
        // Handle specific error cases
        if (error.status === 404 && this.pageIndex > 1) {
          // Page not found, redirect to page 1
          console.log('Page not found, redirecting to page 1');
          this.updateURL(1, this.pageSize);
          return;
        }
        
        // If we get an error but we're trying to load page 1, might be a server issue
        if (this.pageIndex === 1) {
          this.errorMessage = 'Unable to load victims data. The server might be temporarily unavailable.';
        } else {
          // For other pages, show a more specific error
          this.errorMessage = `Page ${this.pageIndex} could not be loaded.`;
        }
      }
    });
  }

  goToPage(page: number | string) {
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    if (pageNum >= 1 && pageNum !== this.pageIndex && !this.loading) {
      console.log(`Attempting to go to page ${pageNum} (current totalPages: ${this.totalPages})`);
      
      // With server-side pagination, let the server validate the page number
      this.updateURL(pageNum, this.pageSize);
    }
  }

  onPageSizeChange() {
    console.log(`Page size changed to ${this.pageSize}`);
    // Reset to page 1 when page size changes
    this.updateURL(1, this.pageSize);
  }

  private updateURL(page: number, size: number) {
    // Update the URL with new pagination parameters
    const url = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: { page, size },
      queryParamsHandling: 'merge'
    }).toString();
    
    this.location.go(url);
    
    // Update local state and load data
    this.pageIndex = page;
    this.pageSize = size;
    this.loadVictims();
  }

  onJumpToPage() {
    if (this.jumpToPage && this.jumpToPage >= 1 && this.jumpToPage <= this.totalPages) {
      this.updateURL(this.jumpToPage, this.pageSize);
      this.jumpToPage = null;
    }
  }

  refreshCurrentPage() {
    // For server-side pagination, just reload the current page
    console.log('Refreshing current page data...');
    this.loadVictims();
  }

  getVisiblePages(): (number | string)[] {
    const current = this.pageIndex;
    const total = this.totalPages;
    const pages: (number | string)[] = [];

    if (total <= 7) {
      // Show all pages if there are 7 or fewer
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current <= 4) {
        // Near the beginning
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        // Near the end
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  }

  getStartIndex(): number {
    if (this.totalCount === 0) return 0;
    return (this.pageIndex - 1) * this.pageSize + 1;
  }

  getEndIndex(): number {
    if (this.totalCount === 0) return 0;
    return Math.min(this.pageIndex * this.pageSize, this.totalCount);
  }

  goToVictim(id: number) {
    this.router.navigate(['/victim', id]);
  }

  trackByVictimId(index: number, victim: Victim): number {
    return victim.id;
  }

  // Helper function to get the first and last word of a victim's name
  getVictimFirstLast(name: string): string {
    if (!name) return '';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0];
    if (words.length === 2) return words.join(' ');
    return `${words[0]} ${words[words.length - 1]}`;
  }

  // Legacy function for backward compatibility (now calls getVictimFirstLast)
  getVictimInitials(name: string): string {
    return this.getVictimFirstLast(name);
  }

  // Helper function to convert gender codes to readable labels
  getGenderLabel(gender: string): string {
    if (!gender) return '';
    
    switch (gender.toLowerCase()) {
      case 'f':
        return 'Female';
      case 'm':
        return 'Male';
      default:
        return gender;
    }
  }

  // Helper function to display event date with "Unknown" for dates before 2023
  getEventDateDisplay(eventDate: string): string {
    if (!eventDate) return '';
    
    try {
      const date = new Date(eventDate);
      if (isNaN(date.getTime())) return '';
      
      // If date is before 2023, show "Unknown"
      if (date.getFullYear() < 2023) return 'Unknown';
      
      // Format the date for display
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return '';
    }
  }
}

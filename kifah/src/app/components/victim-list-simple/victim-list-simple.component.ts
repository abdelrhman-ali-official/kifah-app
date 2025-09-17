import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VictimService, Victim, VictimsResponse } from '../../services/victim.service';

@Component({
  selector: 'app-victim-list-simple',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-4">Victims List</h1>
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p class="text-gray-300">Total: {{ totalCount }} victims</p>
            <div class="flex items-center gap-2">
              <label class="text-gray-300 text-sm">Show per page:</label>
              <select 
                [(ngModel)]="pageSize" 
                (change)="onPageSizeChange()"
                class="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                [disabled]="loading"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>
          </div>
          <div class="flex gap-4">
            <a routerLink="/victims/submit" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
              Submit Victim
            </a>
            <a routerLink="/victims/mine" class="px-4 py-2 border border-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
              My Submissions
            </a>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p class="text-gray-300 mt-4">Loading victims...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage" class="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
        {{ errorMessage }}
      </div>

      <!-- Victims Grid -->
      <div *ngIf="!loading && !errorMessage" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          *ngFor="let victim of victims" 
          class="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer"
          (click)="goToVictim(victim.id)"
        >
          <div class="mb-4">
            <div class="w-full h-32 bg-gray-700 rounded flex items-center justify-center mb-4">
              <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">{{ victim.name }}</h3>
            <p *ngIf="victim.enName" class="text-gray-400 text-sm mb-2">{{ victim.enName }}</p>
          </div>
          
          <div class="space-y-2 text-sm text-gray-300">
            <div *ngIf="victim.age !== null">
              <span class="font-medium">Age:</span> {{ victim.age }}
            </div>
            <div *ngIf="victim.gender">
              <span class="font-medium">Gender:</span> {{ victim.gender }}
            </div>
            <div *ngIf="victim.governorate">
              <span class="font-medium">Location:</span> {{ victim.governorate }}
              <span *ngIf="victim.district">, {{ victim.district }}</span>
            </div>
            <div *ngIf="victim.eventDate">
              <span class="font-medium">Date:</span> {{ getEventDateDisplay(victim.eventDate) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !errorMessage && victims.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
          <h3 class="text-xl font-semibold text-white mb-2">No victims found</h3>
          <p class="text-gray-400">There are currently no victims in the database.</p>
        </div>
      </div>

      <!-- Enhanced Pagination -->
      <div *ngIf="!loading && !errorMessage && totalPages > 1" class="mt-8">
        <!-- Pagination Info -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div class="text-sm text-gray-400">
            Showing {{ getStartIndex() }} to {{ getEndIndex() }} of {{ totalCount }} victims
          </div>
          <div class="text-sm text-gray-400">
            Page {{ pageIndex }} of {{ totalPages }}
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-center items-center gap-2">
          <!-- First Page -->
          <button 
            (click)="goToPage(1)"
            [disabled]="pageIndex === 1 || loading"
            class="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="First Page"
          >
            ≪
          </button>

          <!-- Previous Page -->
          <button 
            (click)="goToPage(pageIndex - 1)"
            [disabled]="pageIndex === 1 || loading"
            class="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous Page"
          >
            ←
          </button>

          <!-- Page Numbers -->
          <div class="flex gap-1">
            <button 
              *ngFor="let page of getPageNumbers()"
              (click)="goToPage(page)"
              [disabled]="loading"
              [class]="page === pageIndex 
                ? 'px-4 py-2 bg-red-600 text-white rounded font-semibold shadow-lg' 
                : 'px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors'"
            >
              {{ page }}
            </button>
          </div>

          <!-- Next Page -->
          <button 
            (click)="goToPage(pageIndex + 1)"
            [disabled]="pageIndex === totalPages || loading"
            class="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next Page"
          >
            →
          </button>

          <!-- Last Page -->
          <button 
            (click)="goToPage(totalPages)"
            [disabled]="pageIndex === totalPages || loading"
            class="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Last Page"
          >
            ≫
          </button>
        </div>

        <!-- Quick Jump -->
        <div class="flex justify-center items-center gap-2 mt-4">
          <span class="text-sm text-gray-400">Go to page:</span>
          <input 
            type="number" 
            [(ngModel)]="jumpToPage"
            (keyup.enter)="onJumpToPage()"
            [min]="1" 
            [max]="totalPages"
            class="w-16 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 text-center focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="1"
          >
          <button 
            (click)="onJumpToPage()"
            class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            [disabled]="loading"
          >
            Go
          </button>
        </div>
      </div>

      <!-- Page Info -->
      <div *ngIf="!loading && !errorMessage && totalCount > 0" class="text-center mt-4 text-gray-400 text-sm">
        Page {{ pageIndex }} of {{ totalPages }} ({{ totalCount }} total victims)
      </div>

      <!-- Debug Info -->
      <div class="text-center mt-2 text-xs text-yellow-400" *ngIf="!loading">
        Debug: totalCount={{ totalCount }}, pageSize={{ pageSize }}, totalPages={{ totalPages }}, shouldShowPagination={{ totalPages > 1 }}
      </div>
    </div>
  `
})
export class VictimListSimpleComponent implements OnInit {
  victims: Victim[] = [];
  loading = false;
  errorMessage = '';
  
  pageIndex = 1;
  pageSize = 25; // Server-side page size
  totalCount = 0;
  totalPages = 0;
  jumpToPage: number | null = null;

  constructor(private victimService: VictimService) {}

  ngOnInit() {
    this.loadVictims();
  }

  loadVictims() {
    this.loading = true;
    this.errorMessage = '';
    
    console.log(`Loading page ${this.pageIndex} with page size ${this.pageSize}`);
    
    this.victimService.getVictims({
      PageIndex: this.pageIndex,
      PageSize: this.pageSize
    }).subscribe({
      next: (response: VictimsResponse) => {
        console.log('API Response:', response);
        this.loading = false;
        this.victims = response.data || [];
        this.totalCount = response.totalCount || 0;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        
        console.log(`Loaded ${this.victims.length} victims for page ${this.pageIndex}, total: ${this.totalCount}, pages: ${this.totalPages}`);
        console.log(`Pagination should show: ${this.totalPages > 1 ? 'YES' : 'NO'}`);
      },
      error: (error) => {
        console.error('Error loading victims:', error);
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Failed to load victims. Please try again.';
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.pageIndex && !this.loading) {
      console.log(`Going to page ${page}`);
      this.pageIndex = page;
      this.loadVictims(); // Server-side pagination - make API call for each page
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const start = Math.max(1, this.pageIndex - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  onPageSizeChange() {
    this.pageIndex = 1; // Reset to first page when changing page size
    this.loadVictims(); // Reload with new page size
    console.log(`Page size changed to ${this.pageSize}`);
  }

  onJumpToPage() {
    if (this.jumpToPage && this.jumpToPage >= 1 && this.jumpToPage <= this.totalPages) {
      this.goToPage(this.jumpToPage);
      this.jumpToPage = null;
    }
  }

  getStartIndex(): number {
    return (this.pageIndex - 1) * this.pageSize + 1;
  }

  getEndIndex(): number {
    return Math.min(this.pageIndex * this.pageSize, this.totalCount);
  }

  goToVictim(id: number) {
    console.log(`Navigating to victim ${id}`);
    // Navigate to victim detail page
    // this.router.navigate(['/victim', id]);
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

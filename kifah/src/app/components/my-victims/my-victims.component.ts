import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VictimService, SubmissionStatus, MyVictim, MyVictimsResponse } from '../../services/victim.service';

@Component({
  selector: 'app-my-victims',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="py-10 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Enhanced Header -->
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
            My Submissions
          </h2>
          <p class="text-lg text-gray-300 max-w-2xl mx-auto">
            Track the status of your victim submissions and their approval process
          </p>
          <div class="w-24 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <!-- Enhanced Glass Card -->
        <div class="bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-red-500/20">
          <!-- Loading State -->
          <div *ngIf="loading" class="flex items-center justify-center py-20">
            <div class="text-center">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
              <p class="text-white text-lg">Loading your submissions...</p>
            </div>
          </div>

          <!-- Error State -->
          <div *ngIf="errorMessage && !loading" class="p-8 text-center">
            <div class="bg-red-900/30 border border-red-500/50 rounded-xl p-6">
              <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h3 class="text-xl font-bold text-white mb-2">Error Loading Submissions</h3>
              <p class="text-red-300 mb-4">{{ errorMessage }}</p>
              <button 
                (click)="load()" 
                class="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>

          <!-- Table Content -->
          <div *ngIf="!loading && !errorMessage" class="overflow-hidden">
            <!-- Desktop Table -->
            <div class="hidden md:block overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead class="bg-gradient-to-r from-red-900/20 to-red-800/20 border-b border-red-500/20">
                  <tr>
                    <th class="px-6 py-4 text-red-300 font-semibold uppercase tracking-wider">Name</th>
                    <th class="px-6 py-4 text-red-300 font-semibold uppercase tracking-wider">Age</th>
                    <th class="px-6 py-4 text-red-300 font-semibold uppercase tracking-wider">Gender</th>
                    <th class="px-6 py-4 text-red-300 font-semibold uppercase tracking-wider">Location</th>
                    <th class="px-6 py-4 text-red-300 font-semibold uppercase tracking-wider">Date</th>
                    <th class="px-6 py-4 text-red-300 font-semibold uppercase tracking-wider">Status</th>
                    <th class="px-6 py-4 text-red-300 font-semibold uppercase tracking-wider">Source</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-red-500/10">
                  <tr *ngFor="let v of items; let i = index" 
                      class="hover:bg-red-500/5 transition-colors duration-300"
                      [style.animation-delay.ms]="i * 50">
                    <td class="px-6 py-4 text-white font-medium">{{ v.name }}</td>
                    <td class="px-6 py-4 text-gray-300">{{ v.age ?? '-' }}</td>
                    <td class="px-6 py-4 text-gray-300">{{ v.gender ?? '-' }}</td>
                    <td class="px-6 py-4 text-gray-300">
                      <div class="max-w-40">
                        {{ v.governorate ?? 'Gaza' }}{{ v.district ? ', ' + v.district : '' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-gray-300">{{ v.eventDate | date: 'MMM d, y' }}</td>
                    <td class="px-6 py-4">
                      <span [ngClass]="statusClass(v.submissionStatus)" class="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center space-x-1">
                        <span class="w-2 h-2 rounded-full" [ngClass]="statusDotClass(v.submissionStatus)"></span>
                        <span>{{ statusLabel(v.submissionStatus) }}</span>
                      </span>
                    </td>
                    <td class="px-6 py-4 text-gray-300">
                      <div class="max-w-48 truncate" [title]="v.source">
                        {{ v.source ?? '-' }}
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="items.length === 0">
                    <td colspan="7" class="px-6 py-16 text-center text-gray-400">
                      <div class="flex flex-col items-center space-y-4">
                        <svg class="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <div>
                          <p class="text-lg font-medium text-gray-400 mb-2">No submissions yet</p>
                          <p class="text-sm text-gray-500">Submit your first victim to get started</p>
                        </div>
                        <a 
                          routerLink="/victims/submit" 
                          class="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300"
                        >
                          Submit Victim
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Cards -->
            <div class="md:hidden p-4 space-y-4">
              <div *ngFor="let v of items; let i = index" 
                   class="bg-red-900/10 border border-red-500/20 rounded-xl p-4 hover:bg-red-900/20 transition-all duration-300"
                   [style.animation-delay.ms]="i * 50">
                <div class="flex justify-between items-start mb-3">
                  <h3 class="text-white font-bold text-lg">{{ v.name }}</h3>
                  <span [ngClass]="statusClass(v.submissionStatus)" class="px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center space-x-1">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="statusDotClass(v.submissionStatus)"></span>
                    <span>{{ statusLabel(v.submissionStatus) }}</span>
                  </span>
                </div>
                
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span class="text-gray-400">Age:</span>
                    <span class="text-gray-300 ml-2">{{ v.age ?? '-' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Gender:</span>
                    <span class="text-gray-300 ml-2">{{ v.gender ?? '-' }}</span>
                  </div>
                  <div class="col-span-2">
                    <span class="text-gray-400">Location:</span>
                    <span class="text-gray-300 ml-2">{{ v.governorate ?? 'Gaza' }}{{ v.district ? ', ' + v.district : '' }}</span>
                  </div>
                  <div class="col-span-2">
                    <span class="text-gray-400">Date:</span>
                    <span class="text-gray-300 ml-2">{{ v.eventDate | date: 'MMM d, y' }}</span>
                  </div>
                  <div class="col-span-2" *ngIf="v.source">
                    <span class="text-gray-400">Source:</span>
                    <span class="text-gray-300 ml-2 break-words">{{ v.source }}</span>
                  </div>
                </div>
              </div>

              <div *ngIf="items.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-lg font-medium text-gray-400 mb-2">No submissions yet</p>
                <p class="text-sm text-gray-500 mb-4">Submit your first victim to get started</p>
                <a 
                  routerLink="/victims/submit" 
                  class="inline-block px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300"
                >
                  Submit Victim
                </a>
              </div>
            </div>

            <!-- Enhanced Pagination -->
            <div *ngIf="items.length > 0" class="border-t border-red-500/20 px-6 py-4 bg-gradient-to-r from-red-900/5 to-red-800/5">
              <div class="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                <div class="text-gray-300 text-sm">
                  <span class="font-medium">{{ totalCount }}</span> total submissions
                  <span class="hidden sm:inline">• Page {{ pageIndex }} of {{ totalPages }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button 
                    (click)="prevPage()" 
                    [disabled]="pageIndex === 1 || loading"
                    class="px-4 py-2 bg-red-800/20 border border-red-500/30 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-800/40 transition-all duration-300 flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    <span class="hidden sm:inline">Previous</span>
                  </button>
                  
                  <div class="sm:hidden text-sm text-gray-400">
                    Page {{ pageIndex }} of {{ totalPages }}
                  </div>
                  
                  <button 
                    (click)="nextPage()" 
                    [disabled]="pageIndex >= totalPages || loading"
                    class="px-4 py-2 bg-red-800/20 border border-red-500/30 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-800/40 transition-all duration-300 flex items-center space-x-2"
                  >
                    <span class="hidden sm:inline">Next</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class MyVictimsComponent implements OnInit {
  private readonly victimService = inject(VictimService);

  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;
  items: MyVictim[] = [];
  loading = false;
  errorMessage = '';

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.victimService.getMyVictims(this.pageIndex, this.pageSize).subscribe({
      next: (res: MyVictimsResponse) => {
        this.loading = false;
        this.items = res.data;
        this.totalCount = res.totalCount;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Failed to load submissions.';
      }
    });
  }

  prevPage(): void {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.load();
    }
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;
      this.load();
    }
  }

  statusLabel(status: SubmissionStatus): string {
    switch (status) {
      case SubmissionStatus.Approved:
        return 'Approved';
      case SubmissionStatus.Rejected:
        return 'Rejected';
      default:
        return 'Pending';
    }
  }

  statusClass(status: SubmissionStatus): string {
    switch (status) {
      case SubmissionStatus.Approved:
        return 'bg-green-900/30 text-green-300 border border-green-800';
      case SubmissionStatus.Rejected:
        return 'bg-red-900/30 text-red-300 border border-red-800';
      default:
        return 'bg-yellow-900/30 text-yellow-300 border border-yellow-800';
    }
  }

  statusDotClass(status: SubmissionStatus): string {
    switch (status) {
      case SubmissionStatus.Approved:
        return 'bg-green-400';
      case SubmissionStatus.Rejected:
        return 'bg-red-400';
      default:
        return 'bg-yellow-400';
    }
  }
}




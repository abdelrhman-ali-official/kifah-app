import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VictimService, Victim } from '../../services/victim.service';
import { VictimCardComponent } from '../victim-card/victim-card.component';

@Component({
  selector: 'app-victim-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, VictimCardComponent],
  template: `
    <section class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-24">
      <div class="container mx-auto px-4">
        <!-- Back Button -->
        <div class="mb-8">
          <button 
            (click)="goBack()"
            class="inline-flex items-center gap-2 px-6 py-3 bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-white rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/60"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Search
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="flex flex-col items-center justify-center py-32">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-red-600/30 border-t-red-500 rounded-full animate-spin"></div>
            <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-l-red-400 rounded-full animate-spin animate-reverse" style="animation-delay: 0.3s;"></div>
          </div>
          <p class="text-gray-400 mt-4 animate-pulse">Loading memorial...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error && !loading" class="max-w-2xl mx-auto text-center py-32">
          <div class="mb-8">
            <svg class="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <h3 class="text-2xl font-bold text-white mb-4">Memorial Not Found</h3>
            <p class="text-gray-400 mb-4">The memorial you're looking for could not be found or may have been removed.</p>
            <p class="text-gray-500 text-sm mb-8">ID: {{ currentId }} | Error: {{ errorMessage }}</p>
            <button 
              (click)="goBack()"
              class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Return to Search
            </button>
          </div>
        </div>

        <!-- Victim Memorial -->
        <div *ngIf="victim && !loading && !error" class="max-w-4xl mx-auto">
          <!-- Memorial Header -->
          <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 arabic-text">
              
            {{ victim.name }}    :Memorial for
            </h1>
            <p class="text-xl text-gray-300 mb-6">
              {{ victim.enName }}
            </p>
            <div class="inline-flex items-center px-6 py-3 bg-red-900/20 backdrop-blur-sm rounded-full border border-red-500/30">
              <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span class="text-red-200">May their memory live on</span>
            </div>
          </div>

          <!-- Memorial Card -->
          <div class="flex justify-center">
            <app-victim-card [victim]="victim"></app-victim-card>
          </div>

          <!-- Additional Memorial Content -->
          <div class="mt-16 text-center">
            <div class="max-w-2xl mx-auto">
              <h2 class="text-2xl font-bold text-white mb-6 arabic-text">Remembering Their Story</h2>
              <p class="text-gray-300 leading-relaxed mb-8">
                Every life lost is a story untold, a future unfulfilled, a family forever changed. 
                We honor their memory and stand in solidarity with their loved ones.
              </p>
              
              <!-- Memorial Quote -->
              <blockquote class="border-l-4 border-red-500 pl-6 italic text-gray-300 text-lg">
                "The dead cannot cry out for justice. It is a duty of the living to do so for them."
              </blockquote>
              
              <!-- Action Buttons -->
              <div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  (click)="shareMemorial()"
                  class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                  </svg>
                  Share This Memorial
                </button>
                <button 
                  (click)="searchMore()"
                  class="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  Search More Memorials
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .arabic-text { 
      font-family: 'Cairo', 'Amiri', 'Tajawal', 'Noto Sans Arabic', Arial, sans-serif; 
      direction: rtl; 
      text-align: right;
      line-height: 1.4;
    }
    
    .animate-reverse {
      animation-direction: reverse;
    }
  `]
})
export class VictimDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private victimService = inject(VictimService);

  victim: Victim | null = null;
  loading = true;
  error = false;
  currentId: number | null = null;
  errorMessage = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.currentId = id;
      if (id && !isNaN(id)) {
        this.loadVictim(id);
      } else {
        this.error = true;
        this.errorMessage = 'Invalid ID format';
        this.loading = false;
      }
    });
  }

  private loadVictim(id: number) {
    this.loading = true;
    this.error = false;
    
    console.log('Loading victim with ID:', id);
    
    this.victimService.getVictimById(id).subscribe({
      next: (victim) => {
        console.log('Victim loaded successfully:', victim);
        this.victim = victim;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading victim:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        this.error = true;
        this.errorMessage = error.message || `HTTP ${error.status}: ${error.statusText}`;
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  shareMemorial() {
    if (this.victim) {
      const shareUrl = `${window.location.origin}/victim/${this.victim.id}`;
      const text = `Remembering ${this.victim.name}${this.victim.enName ? ` (${this.victim.enName})` : ''}. May their memory live on. 🕊️ #Palestine #Memorial`;
      
      if (navigator.share) {
        navigator.share({
          title: `Memorial for ${this.victim.name}`,
          text: text,
          url: shareUrl
        });
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${text}\n\n${shareUrl}`);
        alert('Memorial link copied to clipboard!');
      }
    }
  }

  searchMore() {
    this.router.navigate(['/']);
  }
}

import { Component, Input, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Victim } from '../../services/victim.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-victim-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      #cardElement
      class="group relative p-6 rounded-2xl border border-red-500/30 bg-gradient-to-br from-black/70 via-gray-900/60 to-black/80 backdrop-blur-md text-white shadow-[0_10px_30px_rgba(220,38,38,0.2)] hover:shadow-[0_25px_70px_rgba(220,38,38,0.35)] transition-all duration-500 hover:border-red-500/50 hover:-translate-y-2 overflow-hidden"
      [@cardAnimation]
    >
      <!-- Background Glow Effect -->
      <div class="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <!-- Decorative Corner Elements -->
      <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-500/20 to-transparent rounded-bl-3xl"></div>
      <div class="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-red-500/15 to-transparent rounded-tr-2xl"></div>
      
      <!-- Watermark for shared images -->
      <div class="absolute bottom-2 right-2 text-xs text-gray-500 opacity-50 font-mono hidden" id="watermark">
        PalestineMemorial.org
      </div>
      
      <div class="relative z-10 flex flex-col gap-4">
        <!-- Header with Name and Gender Badge -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-xl font-extrabold arabic-text text-white group-hover:text-red-100 transition-colors duration-300">
                {{ victim?.name || 'غير محدد' }}
              </h3>
              <!-- Gender Badge -->
              <div 
                class="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold shadow-lg transition-all duration-300 group-hover:scale-110"
                [class]="getGenderBadgeClasses()"
                [title]="getGenderFullText()"
              >
              </div>
            </div>
            
            <div 
              class="text-sm text-red-200/80 font-medium tracking-wide"
              *ngIf="victim?.enName"
            >
              {{ victim?.enName }}
            </div>
          </div>
          
          <!-- Status Indicator -->
          <div class="flex flex-col items-end">
            <div class="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50 animate-pulse"></div>
            <span class="text-xs text-gray-400 mt-1">Victim</span>
          </div>
        </div>

        <!-- Information Grid -->
        <div class="grid grid-cols-2 gap-3">
          <!-- Age -->
          <div class="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10 hover:border-red-500/30 transition-colors duration-300">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <div class="text-xs text-gray-400 uppercase tracking-wider">Age</div>
                <div class="text-sm font-semibold text-white">{{ getAgeDisplay() }}</div>
              </div>
            </div>
          </div>

          <!-- Gender -->
          <div class="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10 hover:border-red-500/30 transition-colors duration-300">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <div>
                <div class="text-xs text-gray-400 uppercase tracking-wider">Gender</div>
                <div class="text-sm font-semibold text-white">{{ getGenderFullText() }}</div>
              </div>
            </div>
          </div>

          <!-- Date -->
          <div class="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10 hover:border-red-500/30 transition-colors duration-300">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <div>
                <div class="text-xs text-gray-400 uppercase tracking-wider">Date</div>
                <div class="text-sm font-semibold text-white">{{ formatEventDate() }}</div>
              </div>
            </div>
          </div>

          <!-- Governorate -->
          <div class="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10 hover:border-red-500/30 transition-colors duration-300">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <div>
                <div class="text-xs text-gray-400 uppercase tracking-wider">Gov</div>
                <div class="text-sm font-semibold text-white">{{ victim?.governorate || '—' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Info Section -->
        <div *ngIf="hasAdditionalInfo()" class="pt-3 border-t border-white/10">
          <div class="flex items-center justify-between text-xs text-gray-400">
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              ID: {{ victim?.id || 'N/A' }}
            </span>
            <span class="opacity-60">{{ getTimeAgo() }}</span>
          </div>
        </div>

        <!-- Share Button with Dropdown -->
        <div class="relative mt-2">
          <button 
            class="w-full py-2 px-4 bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-white rounded-lg transition-all duration-300 border border-red-500/30 hover:border-red-500/60 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
            (click)="toggleShareMenu()"
            style="transition-delay: 0.1s;"
            #shareButton
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
              Share Memorial
            </span>
          </button>

          <!-- Share Dropdown Menu -->
          <div 
            *ngIf="showShareMenu"
            class="absolute bottom-full left-0 right-0 mb-2 bg-gray-900/95 backdrop-blur-md border border-red-500/30 rounded-lg shadow-2xl z-50 overflow-hidden"
            [@shareMenuAnimation]
          >
            <!-- Download as Image -->
            <button
              (click)="downloadAsImage()"
              class="w-full px-4 py-3 text-left text-white hover:bg-red-600/20 transition-colors duration-200 flex items-center gap-3 border-b border-gray-700/50"
              [disabled]="isGeneratingImage"
            >
              <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <div>
                <div class="text-sm font-medium">Download Image</div>
                <div class="text-xs text-gray-400">Save as PNG</div>
              </div>
              <div *ngIf="isGeneratingImage" class="ml-auto">
                <div class="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
              </div>
            </button>

            <!-- Copy Share Link -->
            <button
              (click)="copyShareLink()"
              class="w-full px-4 py-3 text-left text-white hover:bg-red-600/20 transition-colors duration-200 flex items-center gap-3 border-b border-gray-700/50"
            >
              <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              <div>
                <div class="text-sm font-medium">Copy Link</div>
                <div class="text-xs text-gray-400">Share memorial link</div>
              </div>
              <div *ngIf="linkCopied" class="ml-auto text-green-400 text-xs">Copied!</div>
            </button>

            <!-- Share to Twitter -->
            <button
              (click)="shareToTwitter()"
              class="w-full px-4 py-3 text-left text-white hover:bg-red-600/20 transition-colors duration-200 flex items-center gap-3 border-b border-gray-700/50"
            >
              <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
              <div>
                <div class="text-sm font-medium">Share on X</div>
                <div class="text-xs text-gray-400">Post to X (Twitter)</div>
              </div>
            </button>

            <!-- Share to Facebook -->
            <button
              (click)="shareToFacebook()"
              class="w-full px-4 py-3 text-left text-white hover:bg-red-600/20 transition-colors duration-200 flex items-center gap-3 border-b border-gray-700/50"
            >
              <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
              </svg>
              <div>
                <div class="text-sm font-medium">Share on Facebook</div>
                <div class="text-xs text-gray-400">Post to Facebook</div>
              </div>
            </button>

            <!-- Share to WhatsApp -->
            <button
              (click)="shareToWhatsApp()"
              class="w-full px-4 py-3 text-left text-white hover:bg-red-600/20 transition-colors duration-200 flex items-center gap-3"
            >
              <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"></path>
              </svg>
              <div>
                <div class="text-sm font-medium">Share on WhatsApp</div>
                <div class="text-xs text-gray-400">Send via WhatsApp</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
      
      <!-- Memorial Candle Effect -->
      <div class="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" style="box-shadow: 0 0 10px rgba(251, 191, 36, 0.6);"></div>
    </div>

    <!-- Hidden canvas for image generation -->
    <canvas #hiddenCanvas style="display: none;"></canvas>
  `,
  styles: [`
    .arabic-text { 
      font-family: 'Cairo', 'Amiri', 'Tajawal', 'Noto Sans Arabic', Arial, sans-serif; 
      direction: rtl; 
      text-align: right;
      line-height: 1.4;
    }
    
    /* Gender Badge Animations */
   /* .gender-badge-female {
      background: linear-gradient(135deg, #ec4899, #8b5cf6);
      box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
    }
    
    .gender-badge-male {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
    }
    
    .gender-badge-unknown {
      background: linear-gradient(135deg, #6b7280, #4b5563);
      box-shadow: 0 0 15px rgba(107, 114, 128, 0.3);
    }
      */

    /* Enhanced Hover Effects */
   /* .group:hover .gender-badge-female {
      box-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
    }
    
    .group:hover .gender-badge-male {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
    }
    
    .group:hover .gender-badge-unknown {
      box-shadow: 0 0 20px rgba(107, 114, 128, 0.5);
    }
      */

    /* Share menu animation */
    .share-menu-backdrop {
      backdrop-filter: blur(8px);
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
      .grid-cols-2 > div {
        padding: 0.5rem;
      }
      
      .text-xl {
        font-size: 1.125rem;
        line-height: 1.5;
      }
    }

    /* Image generation specific styles */
    .share-card-image {
      background: linear-gradient(135deg, #000000 0%, #1f2937 50%, #000000 100%);
      font-family: 'Cairo', 'Amiri', 'Tajawal', 'Noto Sans Arabic', Arial, sans-serif;
    }
  `],
  animations: [
    trigger('cardAnimation', [
      state('in', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ]),
    trigger('shareMenuAnimation', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(10px) scale(0.95)' }),
        animate('0.2s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition('* => void', [
        animate('0.15s cubic-bezier(0.4, 0, 1, 1)', style({ opacity: 0, transform: 'translateY(5px) scale(0.95)' }))
      ])
    ])
  ]
})
export class VictimCardComponent implements AfterViewInit {
  @Input() victim?: Victim;
  @ViewChild('cardElement') cardElement!: ElementRef;
  @ViewChild('hiddenCanvas') hiddenCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('shareButton') shareButton!: ElementRef;

  showShareMenu = false;
  isGeneratingImage = false;
  linkCopied = false;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Close share menu when clicking outside
      document.addEventListener('click', (event) => {
        if (this.showShareMenu && !this.cardElement.nativeElement.contains(event.target as Node)) {
          this.showShareMenu = false;
        }
      });
    }
  }

  toggleShareMenu() {
    this.showShareMenu = !this.showShareMenu;
    if (this.linkCopied) {
      setTimeout(() => this.linkCopied = false, 3000);
    }
  }

  async downloadAsImage() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isGeneratingImage = true;
    
    try {
      // Import html2canvas dynamically for better performance
      const html2canvas = (await import('html2canvas')).default;
      
      // Hide the share menu and button before capturing
      const shareMenu = this.cardElement.nativeElement.querySelector('[class*="absolute bottom-full"]');
      const shareButton = this.cardElement.nativeElement.querySelector('button[class*="w-full py-2 px-4 bg-red-600"]');
      
      const originalShareMenuDisplay = shareMenu ? shareMenu.style.display : '';
      const originalShareButtonDisplay = shareButton ? shareButton.style.display : '';
      
      if (shareMenu) shareMenu.style.display = 'none';
      if (shareButton) shareButton.style.display = 'none';
      
      // Show watermark temporarily
      const watermark = this.cardElement.nativeElement.querySelector('#watermark');
      if (watermark) {
        watermark.classList.remove('hidden');
      }
      
      // Generate canvas from the card element
      const canvas = await html2canvas(this.cardElement.nativeElement, {
        backgroundColor: '#000000',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        removeContainer: true,
        imageTimeout: 0,
        height: this.cardElement.nativeElement.offsetHeight,
        width: this.cardElement.nativeElement.offsetWidth,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (element) => {
          // Exclude share menu and button from capture
          return element === shareMenu || element === shareButton;
        }
      });
      
      // Restore original display states
      if (shareMenu) shareMenu.style.display = originalShareMenuDisplay;
      if (shareButton) shareButton.style.display = originalShareButtonDisplay;
      
      // Hide watermark again
      if (watermark) {
        watermark.classList.add('hidden');
      }
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `memorial-${this.victim?.name?.replace(/\s+/g, '-') || 'victim'}-${Date.now()}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);
      
      this.showShareMenu = false;
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Sorry, there was an error generating the image. Please try again.');
    } finally {
      this.isGeneratingImage = false;
    }
  }

  async copyShareLink() {
    if (!isPlatformBrowser(this.platformId)) return;

    const shareUrl = this.generateShareUrl();
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      this.linkCopied = true;
      setTimeout(() => this.linkCopied = false, 3000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Unable to copy link. Please copy it manually: ' + shareUrl);
    }
  }

  shareToTwitter() {
    const shareUrl = this.generateShareUrl();
    const text = this.generateShareText();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=Palestine,Memorial,RememberThem`;
    
    this.openShareWindow(twitterUrl);
    this.showShareMenu = false;
  }

  shareToFacebook() {
    const shareUrl = this.generateShareUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(this.generateShareText())}`;
    
    this.openShareWindow(facebookUrl);
    this.showShareMenu = false;
  }

  shareToWhatsApp() {
    const shareUrl = this.generateShareUrl();
    const text = this.generateShareText() + '\n\n' + shareUrl;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    
    this.openShareWindow(whatsappUrl);
    this.showShareMenu = false;
  }

  private generateShareUrl(): string {
    const baseUrl = isPlatformBrowser(this.platformId) ? window.location.origin : 'https://yoursite.com';
    console.log('Generating share URL for victim:', this.victim);
    console.log('Victim ID:', this.victim?.id);
    return `${baseUrl}/victim/${this.victim?.id || 'unknown'}`;
  }

  private generateShareText(): string {
    const name = this.victim?.name || 'Unknown';
    const enName = this.victim?.enName ? ` (${this.victim.enName})` : '';
    const age = this.victim?.age ? `, ${this.victim.age} years old` : '';
    const location = this.victim?.governorate ? ` from ${this.victim.governorate}` : '';
    
    return `Remembering ${name}${enName}${age}${location}. May their memory live on. 🕊️ #Palestine #Memorial`;
  }

  private openShareWindow(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      const width = 600;
      const height = 400;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      window.open(
        url,
        'share',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );
    }
  }

  getGenderFullText(): string {
    if (!this.victim?.gender) return 'Unknown';
    const gender = this.victim.gender.toLowerCase();
    if (gender === 'f') return 'Female';
    if (gender === 'm') return 'Male';
    return 'Unknown';
  }

  getGenderBadgeClasses(): string {
    if (!this.victim?.gender) return 'gender-badge-unknown';
    const gender = this.victim.gender.toLowerCase();
    if (gender === 'f') return 'gender-badge-female';
    if (gender === 'm') return 'gender-badge-male';
    return 'gender-badge-unknown';
  }

  getAgeDisplay(): string {
    if (!this.victim?.age) return '—';
    const age = Number(this.victim.age);
    if (isNaN(age)) return '—';
    return `${age} years`;
  }

  formatEventDate(): string {
    if (!this.victim?.eventDate) return '—';
    
    try {
      const date = new Date(this.victim.eventDate);
      if (isNaN(date.getTime())) return '—';
      
      // If date is before 2023, show "Unknown"
      if (date.getFullYear() < 2023) return 'Unknown';
      
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) {
        return 'Today';
      } else if (diffInDays === 1) {
        return 'Yesterday';
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
      } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      return '—';
    }
  }

  getTimeAgo(): string {
    if (!this.victim?.eventDate) return '';
    
    try {
      const date = new Date(this.victim.eventDate);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
      }
    } catch (error) {
      return '';
    }
  }

  hasAdditionalInfo(): boolean {
    return !!(this.victim?.id || this.victim?.eventDate);
  }
}
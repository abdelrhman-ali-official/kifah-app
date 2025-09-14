import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import {
  trigger, state, style, transition, animate,
  query, stagger, keyframes
} from '@angular/animations';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header 
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      [class.header-scrolled]="isScrolled"
      [@headerAnimation]="headerState"
    >
      <!-- Background Elements -->
      <div class="absolute inset-0 backdrop-blur-md bg-gradient-to-r from-black/80 via-gray-900/70 to-black/80"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/5 to-transparent opacity-50"></div>
      
      <!-- Animated Border -->
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
      <div 
        class="absolute bottom-0 left-0 h-px bg-gradient-to-r from-red-500 via-red-400 to-red-500 transition-all duration-1000"
        [style.width.%]="borderWidth"
      ></div>

      <nav class="relative container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Enhanced Logo and Brand -->
          <a routerLink="/" class="flex items-center space-x-3 lg:space-x-4 rtl:space-x-reverse group cursor-pointer">
            <div class="relative flex items-center space-x-2 lg:space-x-3 rtl:space-x-reverse">
              <!-- Logo Container with Glow Effect -->
              <div 
                class="relative p-1.5 lg:p-2 rounded-xl transition-all duration-500 hover:scale-110"
                [@logoContainer]
              >
                <div class="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="absolute inset-0 bg-red-500/10 rounded-xl animate-pulse opacity-0 group-hover:opacity-100"></div>
                <img 
                  src="assets/logo.png" 
                  alt="Kifah Logo" 
                  class="w-8 h-8 lg:w-10 lg:h-10 object-contain relative z-10 filter drop-shadow-lg"
                  [@logoAnimation]="logoState"
                />
                <!-- Logo Glow Ring -->
                <div class="absolute -inset-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500 rounded-full opacity-0 group-hover:opacity-30 blur-sm transition-all duration-500 animate-spin-slow"></div>
              </div>
              
              <!-- Enhanced Brand Name with Heartbeat Animation -->
              <div class="relative overflow-hidden">
                <h1 
                  class="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent font-english relative z-10 brand-heartbeat"
                  [@brandAnimation]="brandState"
                >
                  <span class="brand-text">KIFAH</span>
                </h1>
                <!-- Heartbeat Glow Effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-red-500/30 via-red-400/30 to-red-500/30 blur-lg opacity-0 brand-glow"></div>
              </div>
            </div>
          </a>

          <!-- Enhanced Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-6 xl:space-x-8 rtl:space-x-reverse">
            <ng-container *ngFor="let item of navItems; let i = index">
              <a 
                [routerLink]="item.path" 
                routerLinkActive="nav-active"
                class="relative px-3 xl:px-4 py-2 text-sm xl:text-base text-white font-medium transition-all duration-500 group nav-link overflow-hidden"
                [style.animation-delay.ms]="i * 100"
                [@navItemAnimation]
                (mouseenter)="onNavHover(i)"
                (mouseleave)="onNavLeave(i)"
              >
                <!-- Background Glow -->
                <div class="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-lg"></div>
                
                <!-- Text Content -->
                <span class="relative z-10 transition-colors duration-300 group-hover:text-red-300">
                  {{item.label}}
                </span>
                
                <!-- Animated Underline -->
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-red-400 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                
                <!-- Side Glow Effects -->
                <div class="absolute -left-2 top-1/2 w-1 h-6 bg-red-500/50 transform -translate-y-1/2 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 rounded-full blur-sm"></div>
                <div class="absolute -right-2 top-1/2 w-1 h-6 bg-red-500/50 transform -translate-y-1/2 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 rounded-full blur-sm"></div>
              </a>
            </ng-container>

            <!-- My Victims Link (Visible when logged in) -->
            <ng-container *ngIf="isLoggedIn$ | async">
              <a 
                routerLink="/victims/mine" 
                routerLinkActive="nav-active"
                class="relative px-3 xl:px-4 py-2 text-sm xl:text-base text-white font-medium transition-all duration-500 group nav-link overflow-hidden flex items-center space-x-2"
                [@navItemAnimation]
                (mouseenter)="onNavHover(navItems.length)"
                (mouseleave)="onNavLeave(navItems.length)"
              >
                <!-- Background Glow -->
                <div class="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-lg"></div>
                
                <!-- My Victims Icon -->
                <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                </svg>
                
                <!-- Text Content -->
                <span class="relative z-10 transition-colors duration-300 group-hover:text-red-300">
                  My Victims
                </span>
                
                <!-- Animated Underline -->
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-red-400 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                
                <!-- Side Glow Effects -->
                <div class="absolute -left-2 top-1/2 w-1 h-6 bg-red-500/50 transform -translate-y-1/2 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 rounded-full blur-sm"></div>
                <div class="absolute -right-2 top-1/2 w-1 h-6 bg-red-500/50 transform -translate-y-1/2 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 rounded-full blur-sm"></div>
              </a>
            </ng-container>
          </div>

          <!-- Enhanced Auth Buttons / User Info -->
          <div class="hidden lg:flex items-center space-x-3 xl:space-x-4 rtl:space-x-reverse" [@authButtonsAnimation]>
            <ng-container *ngIf="!(isLoggedIn$ | async); else loggedInTpl">
              <!-- Login Button -->
              <a 
                [routerLink]="['/login']"
                class="relative group px-4 xl:px-6 py-2 xl:py-2.5 text-sm xl:text-base text-white font-medium border border-red-500/30 rounded-xl overflow-hidden transition-all duration-500 hover:scale-105"
                [@buttonAnimation]
              >
                <span class="relative z-10 transition-colors duration-300 group-hover:text-red-300">Login</span>
              </a>
              
              <!-- Register Button -->
              <a 
                [routerLink]="['/signup']"
                class="relative group px-4 xl:px-6 py-2 xl:py-2.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white rounded-xl font-semibold overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 text-sm xl:text-base"
                [@buttonAnimation]
              >
                <span class="relative z-10">Sign Up</span>
              </a>
            </ng-container>
            <ng-template #loggedInTpl>
              <div class="flex items-center space-x-2 xl:space-x-3 rtl:space-x-reverse text-xs xl:text-sm text-red-200 bg-white/5 border border-red-500/20 rounded-xl px-3 xl:px-4 py-2">
                <span class="font-semibold truncate max-w-20 xl:max-w-none">{{ (user$ | async)?.displayName }}</span>
                <span class="text-red-400 hidden xl:inline">( {{ (user$ | async)?.email }} )</span>
                <button (click)="onLogout()" class="ml-2 xl:ml-3 px-2 xl:px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-700 text-white text-xs xl:text-sm">Logout</button>
              </div>
            </ng-template>
          </div>

          <!-- Enhanced Mobile Menu Button -->
          <button 
            class="lg:hidden relative group p-2 text-white hover:text-red-400 transition-all duration-500 rounded-lg overflow-hidden"
            (click)="toggleMobileMenu()"
            [@mobileButtonAnimation]
          >
            <!-- Background Glow -->
            <div class="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
            
            <!-- Hamburger Icon with Animation -->
            <div class="relative z-10 w-6 h-6">
              <span 
                class="absolute left-0 w-6 h-0.5 bg-current transition-all duration-300"
                [class.rotate-45]="isMobileMenuOpen"
                [class.translate-y-2]="isMobileMenuOpen"
                [style.top]="isMobileMenuOpen ? '50%' : '2px'"
              ></span>
              <span 
                class="absolute left-0 top-1/2 w-6 h-0.5 bg-current transition-all duration-300"
                [class.opacity-0]="isMobileMenuOpen"
                [class.scale-0]="isMobileMenuOpen"
              ></span>
              <span 
                class="absolute left-0 w-6 h-0.5 bg-current transition-all duration-300"
                [class.-rotate-45]="isMobileMenuOpen"
                [class.-translate-y-2]="isMobileMenuOpen"
                [style.bottom]="isMobileMenuOpen ? '50%' : '2px'"
              ></span>
            </div>
          </button>
        </div>

        <!-- Enhanced Mobile Navigation -->
        <div 
          class="lg:hidden overflow-hidden"
          [@mobileMenuAnimation]="isMobileMenuOpen ? 'open' : 'closed'"
        >
          <div class="mt-4 py-4 border-t border-red-500/20">
            <div class="flex flex-col space-y-2">
              <ng-container *ngFor="let item of navItems; let i = index">
                <a 
                  [routerLink]="item.path" 
                  routerLinkActive="text-red-400"
                  class="relative group px-4 py-3 text-white hover:text-red-400 transition-all duration-300 font-medium rounded-lg overflow-hidden"
                  (click)="closeMobileMenu()"
                  [style.animation-delay.ms]="i * 50"
                  [@mobileNavItem]
                >
                  <div class="absolute inset-0 bg-red-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span class="relative z-10">{{item.label}}</span>
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                </a>
              </ng-container>
              
              <!-- Mobile Auth Buttons / User Info -->
              <div class="flex flex-col space-y-3 pt-4 mt-4 border-t border-red-500/20" [@mobileAuthAnimation]>
                <ng-container *ngIf="!(isLoggedIn$ | async); else mobileLoggedInTpl">
                  <a 
                    [routerLink]="['/login']"
                    class="relative group px-4 py-3 text-white hover:text-red-400 transition-all duration-300 font-medium border border-red-500/30 rounded-lg text-center overflow-hidden"
                    (click)="closeMobileMenu()"
                  >
                    <span class="relative z-10">Login</span>
                  </a>
                  <a 
                    [routerLink]="['/signup']"
                    class="relative group px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold text-center overflow-hidden transition-all duration-300 hover:scale-105"
                    (click)="closeMobileMenu()"
                  >
                    <span class="relative z-10">Sign Up</span>
                  </a>
                </ng-container>
                <ng-template #mobileLoggedInTpl>
                  <!-- Mobile User Info -->
                  <div class="flex items-center space-x-3 px-4 py-3 text-red-200 bg-white/5 border border-red-500/20 rounded-lg mb-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="font-semibold text-white">{{ (user$ | async)?.displayName }}</div>
                      <div class="text-red-400 text-xs">{{ (user$ | async)?.email }}</div>
                    </div>
                  </div>

                  <!-- My Victims Link -->
                  <a 
                    routerLink="/victims/mine"
                    routerLinkActive="text-red-400 bg-red-500/20"
                    class="relative group px-4 py-3 text-white hover:text-red-400 transition-all duration-300 font-medium rounded-lg overflow-hidden flex items-center space-x-3 mb-3"
                    (click)="closeMobileMenu()"
                    [@mobileNavItem]
                  >
                    <div class="absolute inset-0 bg-red-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    
                    <!-- Icon -->
                    <svg class="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    </svg>
                    
                    <!-- Label -->
                    <span class="relative z-10">My Victims</span>
                    
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                  </a>

                  <!-- Mobile Logout Button -->
                  <button 
                    (click)="onLogout(); closeMobileMenu()" 
                    class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <span>Logout</span>
                  </button>
                </ng-template>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    /* If you use Tailwind, @apply will be processed. Keep as in your project. */
    .header-scrolled { @apply bg-black/90 backdrop-blur-xl shadow-2xl shadow-red-500/10; }
    .nav-active { @apply text-red-400; }
    .account-nav-active { @apply text-white bg-red-500/30; }

    /* Heartbeat Animation for Brand */
    .brand-heartbeat {
      animation: heartbeat 2s ease-in-out infinite;
    }

    .brand-glow {
      animation: glowPulse 2s ease-in-out infinite;
    }

    @keyframes heartbeat {
      0%, 20%, 40%, 60%, 80%, 100% {
        transform: scale(1);
      }
      10%, 30% {
        transform: scale(1.05);
      }
    }

    @keyframes glowPulse {
      0%, 20%, 40%, 60%, 80%, 100% {
        opacity: 0;
      }
      10%, 30% {
        opacity: 1;
      }
    }

    @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .animate-spin-slow { animation: spin-slow 3s linear infinite; }

    /* Brand text styling */
    .brand-text {
      display: inline-block;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    /* Responsive font adjustments */
    @media (max-width: 768px) {
      .brand-heartbeat {
        animation: heartbeat 2.5s ease-in-out infinite;
      }
    }

    /* Additional responsive utilities */
    @media (max-width: 1024px) and (min-width: 768px) {
      /* Tablet specific styles if needed */
    }
  `],
  animations: [
    trigger('headerAnimation', [
      state('visible', style({ transform: 'translateY(0)', opacity: 1 })),
      state('hidden',  style({ transform: 'translateY(-100%)', opacity: 0 })),
      transition('* <=> *', animate('0.45s cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),

    trigger('logoContainer', [
      transition('void => *', [
        style({ transform: 'scale(0) rotate(-180deg)', opacity: 0 }),
        animate('0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)')
      ])
    ]),

    trigger('logoAnimation', [
      transition('void => *', [
        style({ transform: 'scale(0) rotate(-180deg)', opacity: 0 }),
        animate('0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)')
      ])
    ]),

    trigger('brandAnimation', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('0.8s 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    trigger('navItemAnimation', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)')
      ])
    ]),

    trigger('authButtonsAnimation', [
      transition('void => *', [
        query('a', [
          style({ opacity: 0, transform: 'scale(0.9) translateY(-8px)' }),
          stagger(80, [
            animate('0.45s cubic-bezier(0.68, -0.55, 0.265, 1.55)', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ]),

    trigger('buttonAnimation', [
      transition('void => *', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('0.45s cubic-bezier(0.68, -0.55, 0.265, 1.55)')
      ])
    ]),

    trigger('mobileButtonAnimation', [
      transition('void => *', [
        style({ transform: 'rotate(180deg) scale(0)', opacity: 0 }),
        animate('0.45s cubic-bezier(0.68, -0.55, 0.265, 1.55)')
      ])
    ]),

    trigger('mobileMenuAnimation', [
      state('closed', style({ height: '0px', opacity: 0, transform: 'translateY(-10px)' })),
      state('open',   style({ height: '*', opacity: 1, transform: 'translateY(0)' })),
      transition('closed => open', [ animate('0.35s cubic-bezier(0.25,0.46,0.45,0.94)') ]),
      transition('open => closed', [ animate('0.28s cubic-bezier(0.55,0,0.45,0.54)') ])
    ]),

    trigger('mobileNavItem', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)')
      ])
    ]),

    trigger('mobileAuthAnimation', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.35s 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94)')
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  // state
  isMobileMenuOpen = false;
  isScrolled = false;
  headerState: 'visible' | 'hidden' = 'visible';
  logoState = 'in';
  brandState = 'in';
  borderWidth = 0;

  // removed typing animation properties since we're using solid text now
  private borderInterval?: number;
  private routerSub?: Subscription;

  navItems = [
    { path: '/about', label: 'About' },
    { path: '/victims', label: 'Victims' },
    { path: '/stats', label: 'Statistics' },
    { path: '/contact', label: 'Contact' }
  ];

  private lastScrollTop = 0;

  constructor(private router: Router, private elementRef: ElementRef, private auth: AuthService) {}

  ngOnInit(): void {
    // Animate border on load
    setTimeout(() => {
      this.borderWidth = 100;
    }, 500);

    // Reset border animation periodically (keep reference to clear later)
    this.borderInterval = window.setInterval(() => {
      this.borderWidth = 0;
      setTimeout(() => (this.borderWidth = 100), 100);
    }, 10000);

    // Listen to route changes for smooth transitions
    this.routerSub = this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.closeMobileMenu();
    });
  }

  ngOnDestroy(): void {
    if (this.borderInterval) { window.clearInterval(this.borderInterval); this.borderInterval = undefined; }
    if (this.routerSub) { this.routerSub.unsubscribe(); this.routerSub = undefined; }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement?.scrollTop ||
      (document.body ? document.body.scrollTop : 0) ||
      0;

    this.isScrolled = scrollTop > 50;

    if (scrollTop > this.lastScrollTop && scrollTop > 100) {
      // Scrolling down
      this.headerState = 'hidden';
    } else {
      // Scrolling up or at top
      this.headerState = 'visible';
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  toggleMobileMenu(): void { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
  closeMobileMenu(): void { this.isMobileMenuOpen = false; }
  onNavHover(index: number): void { /* optional hover logic */ }
  onNavLeave(index: number): void { /* optional hover leave logic */ }
  
  // auth reactive state
  isLoggedIn$ = this.auth.isLoggedIn$;
  user$ = this.auth.user$;
  onLogout(): void { 
    this.auth.logout(); 
    this.router.navigateByUrl('/login'); 
  }
}
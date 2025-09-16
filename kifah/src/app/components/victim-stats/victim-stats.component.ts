import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, stagger, query, keyframes } from '@angular/animations';
import { VictimStatsService, VictimStatsData } from '../../services/victim-stats.service';

interface StatCard {
  id: string;
  title: string;
  value: number;
  iconSvg: string;
  color: string;
  description: string;
  category: 'casualties' | 'wounded' | 'violence' | 'media';
  gradient: string;
  backgroundImage: string;
}

@Component({
  selector: 'app-victim-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <!-- Enhanced Animated Background with Blood Effect -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Blood rain effect -->
        <div class="blood-rain">
          <div class="blood-drop" *ngFor="let i of [].constructor(50); let idx = index" 
               [style.left]="(idx * 2) + '%'"
               [style.animation-delay]="(idx * 0.1) + 's'"
               [style.animation-duration]="getRandomDuration(idx) + 's'"></div>
        </div>
        
        <!-- Floating particles -->
        <div class="blood-particles">
          <div class="blood-particle" *ngFor="let i of [].constructor(20); let idx = index" 
               [style.animation-delay]="(idx * 0.5) + 's'"></div>
        </div>
      </div>

      <!-- Professional Blood Filter Overlay -->
      <div class="blood-filter-overlay"></div>
      
      <!-- Dynamic Background Gradient -->
      <div class="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-red-950/30"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-red-950/10 to-transparent"></div>
      
      <div class="container mx-auto px-2 sm:px-4 lg:px-4 relative z-10">
        <!-- Enhanced Section Header with Blood Typography -->
        <div class="text-center mb-12 sm:mb-16 lg:mb-24">
          <div class="inline-block mb-8">
            <div class="relative blood-title-container">
              <!-- Main title with enhanced blood effect -->
              <h2 class="blood-title text-6xl md:text-8xl font-black text-red-600 mb-8 arabic-text tracking-tight drop-shadow-lg" 
                  [@titleAnimation]>
                Victims Statistics
              </h2>
              
              <!-- Multiple blood drip effects -->
              <div class="blood-drips">
                <div class="blood-drip blood-drip-1"></div>
                <div class="blood-drip blood-drip-2"></div>
                <div class="blood-drip blood-drip-3"></div>
                <div class="blood-drip blood-drip-4"></div>
                <div class="blood-drip blood-drip-5"></div>
              </div>
              
              <!-- Pulsing blood stain -->
              <div class="blood-stain"></div>
            </div>
          </div>
          
          <p class="text-2xl md:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed arabic-text mb-8" [@subtitleAnimation]>
            الأرقام الحقيقية للضحايا في غزة - شهادة على الصمود والمقاومة
          </p>
          
          <!-- Enhanced Memorial Ribbon with blood effect -->
          <div class="memorial-ribbon" [@ribbonAnimation]>
            <div class="ribbon-blood-effect"></div>
            <div class="ribbon-content">
              <svg class="w-6 h-6 text-red-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              </svg>
              <span class="text-red-200 font-bold text-lg px-4">لن ننسى • لن نغفر • فلسطين حرة</span>
              <svg class="w-6 h-6 text-red-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              </svg>
            </div>
          </div>
        </div>

        <!-- Professional Loading State with Blood Animation -->
        <div *ngIf="isLoading" class="flex flex-col justify-center items-center py-32">
          <div class="blood-loader mb-8">
            <div class="blood-circle blood-circle-1"></div>
            <div class="blood-circle blood-circle-2"></div>
            <div class="blood-circle blood-circle-3"></div>
            <div class="loader-heart">
              <svg class="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          <p class="text-white text-2xl font-bold arabic-text mb-4">جاري تحميل البيانات...</p>
          <div class="loading-dots">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        </div>

        <!-- Enhanced Error State -->
        <div *ngIf="hasError" class="max-w-2xl mx-auto">
          <div class="error-card-enhanced">
            <div class="error-blood-stream"></div>
            <div class="error-content">
              <div class="error-icon-wrapper">
                <svg class="w-16 h-16 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h3 class="text-3xl font-black text-white mb-6 arabic-text">خطأ في تحميل البيانات</h3>
              <p class="text-xl text-gray-300 mb-8 arabic-text leading-relaxed">تعذر تحميل الإحصائيات. يرجى التحقق من الاتصال والمحاولة مرة أخرى.</p>
              <button 
                (click)="loadData()"
                class="enhanced-retry-btn"
              >
                <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                </svg>
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>

        <!-- Enhanced Stats Grid with Background Images -->
        <div 
          *ngIf="!isLoading && !hasError && statCards.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          [@staggerAnimation]
        >
          <div 
            *ngFor="let card of statCards; trackBy: trackByCardId; let i = index"
            class="enhanced-stat-card"
            [class.featured-card]="card.category === 'casualties'"
            [@cardAnimation]
            (mouseenter)="onCardHover(card.id)"
            (mouseleave)="onCardLeave(card.id)"
          >
            <!-- Background Image with Professional Blood Filter -->
            <div class="card-background">
              <img [src]="card.backgroundImage" 
                   [alt]="card.title"
                   class="background-image"
                   loading="lazy"
                   decoding="async"
                   [style.object-position]="getImagePosition(card.category)">
              <div class="background-overlay"></div>
              <div class="blood-filter-layer"></div>
              <div class="gradient-overlay" [style.background]="card.gradient"></div>
            </div>

            <!-- Animated Blood Effects -->
            <div class="card-blood-effects">
              <div class="blood-splatter-top" 
                   [class.active]="hoveredCard === card.id"></div>
              <div class="blood-drip-side" 
                   [class.active]="hoveredCard === card.id"
                   [style.background]="'linear-gradient(180deg, ' + card.color + ', #991b1b)'"></div>
            </div>
            
            <!-- Main Card Content -->
            <div class="card-content-wrapper">
              <!-- Enhanced Icon Section with Glow -->
              <div class="card-header">
                <div class="enhanced-icon-container" 
                     [style.box-shadow]="'0 0 30px ' + card.color + '40'">
                  <div class="icon-glow-ring" [style.border-color]="card.color + '60'"></div>
                  <div class="icon-inner-glow" [style.background]="card.color + '20'"></div>
                  <div class="icon-content" [innerHTML]="card.iconSvg"></div>
                </div>
                
                <!-- Enhanced Number Display -->
                <div class="number-display">
                  <div class="stat-number-enhanced" 
                       [style.color]="card.color"
                       [style.text-shadow]="'0 0 20px ' + card.color + '80'">
                    {{ formatNumber(card.value) }}
                  </div>
                  <div class="number-pulse" [style.background]="card.color"></div>
                  <div class="number-glow" [style.box-shadow]="'0 0 40px ' + card.color + '60'"></div>
                </div>
              </div>
              
              <!-- Enhanced Content Section -->
              <div class="card-info-section">
                <h3 class="card-title-enhanced arabic-text">
                  {{ card.title }}
                </h3>
                <p class="card-description arabic-text">
                  {{ card.description }}
                </p>
                
                <!-- Enhanced Category Badge -->
                <div class="enhanced-category-badge" 
                     [style.background]="'linear-gradient(135deg, ' + card.color + '30, ' + card.color + '10)'"
                     [style.border-color]="card.color + '50'">
                  <span [style.color]="card.color">{{ getCategoryLabel(card.category) }}</span>
                  <div class="badge-glow" [style.background]="card.color + '20'"></div>
                </div>
              </div>
            </div>

            <!-- Memorial Elements for High Numbers -->
            <div *ngIf="card.value > 5000" class="memorial-elements">
              <div class="memorial-candle">
                <div class="candle-flame"></div>
              </div>
              <div class="memorial-stars">
                <svg class="memorial-star" *ngFor="let star of [1,2,3]" 
                     fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>

            <!-- Hover Blood Splatter Animation -->
            <div class="hover-blood-splatter" 
                 [class.active]="hoveredCard === card.id">
              <div class="splatter-particle" *ngFor="let particle of [1,2,3,4,5,6,7,8]"
                   [style.animation-delay]="(particle * 0.05) + 's'"></div>
            </div>
          </div>
        </div>

        <!-- Enhanced Footer with Blood Memorial -->
        <div *ngIf="!isLoading && !hasError" class="footer-section">
          <div class="memorial-footer">
            <div class="footer-blood-line"></div>
            <div class="footer-content">
              <div class="update-info">
                <svg class="w-6 h-6 text-red-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                <div class="update-text">
                  <p class="arabic-text text-xl font-bold text-red-400 mb-2">
                    آخر تحديث: {{ lastUpdated | date:'full':'ar' }}
                  </p>
                  <p class="arabic-text text-gray-400">
                    البيانات محدثة كل 6 ساعات من مصادر موثوقة • وزارة الصحة الفلسطينية
                  </p>
                </div>
              </div>
              
              <!-- Memorial Message -->
              <div class="memorial-message">
                <p class="arabic-text text-lg text-red-300 font-semibold">
                  "كل رقم هنا يمثل حياة إنسان، وكل حياة تستحق أن تُذكر وتُحترم"
                </p>
                <div class="memorial-line"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Enhanced Card Design with Background Images */
    .enhanced-stat-card {
      @apply relative h-96 bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-3xl overflow-hidden transition-all duration-700 cursor-pointer;
      box-shadow: 
        0 10px 40px rgba(0, 0, 0, 0.8),
        0 0 50px rgba(220, 38, 38, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      will-change: transform, box-shadow;
    }

    .enhanced-stat-card:hover {
      @apply transform scale-105 border-red-400/60;
      box-shadow: 
        0 25px 80px rgba(0, 0, 0, 0.9),
        0 0 100px rgba(220, 38, 38, 0.4),
        0 0 200px rgba(220, 38, 38, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .featured-card {
      @apply border-red-400/50;
      box-shadow: 
        0 15px 60px rgba(0, 0, 0, 0.9),
        0 0 80px rgba(220, 38, 38, 0.3);
    }

    /* Background Image with Professional Blood Filter */
    .card-background {
      @apply absolute inset-0 overflow-hidden;
    }

    .background-image {
      @apply w-full h-full object-cover object-center transition-transform duration-500;
      min-height: 100%;
      will-change: transform;
    }

    .enhanced-stat-card:hover .background-image {
      transform: scale(1.05);
    }

    .background-overlay {
      @apply absolute inset-0 bg-black/60 transition-opacity duration-300;
    }

    .enhanced-stat-card:hover .background-overlay {
      @apply bg-black/50;
    }

    .blood-filter-layer {
      @apply absolute inset-0;
      background: linear-gradient(
        135deg,
        rgba(139, 69, 19, 0.3) 0%,
        rgba(220, 38, 38, 0.4) 25%,
        rgba(127, 29, 29, 0.5) 50%,
        rgba(153, 27, 27, 0.4) 75%,
        rgba(185, 28, 28, 0.3) 100%
      );
      filter: sepia(0.8) hue-rotate(-10deg) saturate(1.5) contrast(1.2);
    }

    .gradient-overlay {
      @apply absolute inset-0 opacity-80;
    }

    /* Enhanced Card Content */
    .card-content-wrapper {
      @apply absolute inset-0 p-6 flex flex-col justify-between z-20;
    }

    .card-header {
      @apply flex justify-between items-start;
    }

    .enhanced-icon-container {
      @apply relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
    }

    .icon-glow-ring {
      @apply absolute inset-0 border-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500;
      animation: iconGlow 2s ease-in-out infinite;
    }

    .icon-inner-glow {
      @apply absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500;
    }

    .icon-content {
      @apply relative z-10;
    }

    .icon-content svg {
      @apply w-8 h-8;
    }

    @keyframes iconGlow {
      0%, 100% { box-shadow: 0 0 20px currentColor; }
      50% { box-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
    }

    /* Enhanced Number Display */
    .number-display {
      @apply relative;
    }

    .stat-number-enhanced {
      @apply text-4xl font-black relative z-10;
      font-family: 'Cairo', Arial, sans-serif;
    }

    .number-pulse {
      @apply absolute -top-2 -right-2 w-4 h-4 rounded-full animate-ping;
    }

    .number-glow {
      @apply absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500;
    }

    /* Card Information Section */
    .card-info-section {
      @apply space-y-4;
    }

    .card-title-enhanced {
      @apply text-2xl font-bold text-white leading-tight;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    }

    .card-description {
      @apply text-sm text-gray-300 leading-relaxed;
    }

    .enhanced-category-badge {
      @apply inline-block px-4 py-2 rounded-full border text-sm font-semibold relative overflow-hidden;
    }

    .badge-glow {
      @apply absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500;
    }

    /* Blood Effects */
    .card-blood-effects {
      @apply absolute inset-0 pointer-events-none;
    }

    .blood-splatter-top {
      @apply absolute top-0 right-4 w-8 h-8 opacity-0 transition-all duration-500;
      background: radial-gradient(circle, #dc2626, #991b1b);
      border-radius: 40% 60% 70% 30%;
      transform: scale(0) rotate(0deg);
    }

    .blood-splatter-top.active {
      @apply opacity-80;
      transform: scale(1) rotate(180deg);
      animation: bloodSplatter 1s ease-out;
    }

    .blood-drip-side {
      @apply absolute bottom-0 left-0 right-0 h-2 opacity-0 transition-all duration-700 rounded-b-3xl;
      transform: translateY(100%) scaleY(0);
    }

    .blood-drip-side.active {
      @apply opacity-100;
      transform: translateY(0) scaleY(1);
      animation: bloodDripFlow 1.2s ease-out;
    }

    @keyframes bloodSplatter {
      0% { 
        transform: scale(0) rotate(0deg);
        border-radius: 50%;
      }
      50% { 
        transform: scale(1.5) rotate(90deg);
        border-radius: 40% 60% 70% 30%;
      }
      100% { 
        transform: scale(1) rotate(180deg);
        border-radius: 30% 70% 60% 40%;
      }
    }

    @keyframes bloodDripFlow {
      0% { 
        transform: translateY(100%) scaleY(0);
        opacity: 0;
      }
      30% { 
        transform: translateY(-2px) scaleY(1.2);
        opacity: 1;
      }
      60% { 
        transform: translateY(1px) scaleY(0.9);
        opacity: 0.9;
      }
      100% { 
        transform: translateY(0) scaleY(1);
        opacity: 1;
      }
    }

    /* Hover Blood Splatter */
    .hover-blood-splatter {
      @apply absolute top-8 right-8 pointer-events-none opacity-0 transition-opacity duration-500;
    }

    .hover-blood-splatter.active {
      @apply opacity-100;
    }

    .splatter-particle {
      @apply absolute w-1 h-1 bg-red-500 rounded-full;
      animation: splatterParticle 1.5s ease-out infinite;
    }

    .splatter-particle:nth-child(1) { top: 0; right: 0; }
    .splatter-particle:nth-child(2) { top: -5px; right: 8px; }
    .splatter-particle:nth-child(3) { top: 3px; right: -6px; }
    .splatter-particle:nth-child(4) { top: 8px; right: 4px; }
    .splatter-particle:nth-child(5) { top: -2px; right: -8px; }
    .splatter-particle:nth-child(6) { top: 6px; right: -3px; }
    .splatter-particle:nth-child(7) { top: -8px; right: 2px; }
    .splatter-particle:nth-child(8) { top: 4px; right: 10px; }

    @keyframes splatterParticle {
      0% { transform: scale(0) translate(0, 0); opacity: 0; }
      20% { transform: scale(1) translate(0, 0); opacity: 1; }
      100% { 
        transform: scale(0.3) translate(var(--random-x, 20px), var(--random-y, 15px)); 
        opacity: 0; 
      }
    }

    /* Memorial Elements */
    .memorial-elements {
      @apply absolute top-4 left-4 pointer-events-none;
    }

    .memorial-candle {
      @apply relative w-2 h-8 bg-gradient-to-t from-yellow-900 to-yellow-600 rounded-sm mb-2;
    }

    .candle-flame {
      @apply absolute -top-2 left-1/2 w-3 h-4 bg-gradient-to-t from-red-500 to-yellow-300 rounded-full;
      transform: translateX(-50%);
      animation: candleFlicker 2s ease-in-out infinite;
    }

    @keyframes candleFlicker {
      0%, 100% { transform: translateX(-50%) scale(1); }
      25% { transform: translateX(-40%) scale(1.1); }
      75% { transform: translateX(-60%) scale(0.9); }
    }

    .memorial-stars {
      @apply flex space-x-1;
    }

    .memorial-star {
      @apply w-3 h-3 text-red-300/60 animate-pulse;
    }

    /* Enhanced Title with Blood Effect */
    .blood-title-container {
      padding: 1.5rem;
      border-radius: 1rem;
      background: radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, transparent 80%);
      box-shadow: 
        0 0 40px rgba(0,0,0,0.5),
        inset 0 0 20px rgba(220, 38, 38, 0.3);
      position: relative;
      z-index: 10;
      border: 1px solid rgba(220, 38, 38, 0.3);
      margin-bottom: 2rem;
    }

    .blood-title {
      position: relative;
      color: #dc2626;
      text-shadow: 
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000,
        2px 2px 8px rgba(0, 0, 0, 0.7),
        0 0 15px rgba(220, 38, 38, 0.6);
      padding: 0.1em 0.2em;
      margin-top: 0.5em;
      line-height: 1.1;
      letter-spacing: -1px;
      animation: bloodColorPulse 4s ease-in-out infinite;
      z-index: 20;
      font-weight: 900;
    }
    
    @keyframes bloodColorPulse {
      0%, 100% {
        color: #dc2626;
        text-shadow: 
          2px 2px 8px rgba(0, 0, 0, 0.7),
          0 0 15px rgba(220, 38, 38, 0.6);
      }
      50% {
        color: #ef4444;
        text-shadow: 
          2px 2px 8px rgba(0, 0, 0, 0.7),
          0 0 20px rgba(239, 68, 68, 0.7);
      }
    }

    .blood-drips {
      @apply absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4;
      overflow: visible;
    }

    .blood-drip {
      @apply relative opacity-80;
      will-change: transform, opacity;
    }

    .blood-drip-1 {
      @apply w-1;
      height: 0;
      background: linear-gradient(to bottom, #dc2626 0%, #991b1b 60%, #7f1d1d 100%);
      border-radius: 0 0 50% 50%;
      animation: bloodDripRealistic1 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
      animation-delay: 0s;
    }

    .blood-drip-2 {
      @apply w-2;
      height: 0;
      background: linear-gradient(to bottom, #dc2626 0%, #991b1b 70%, #7f1d1d 100%);
      border-radius: 0 0 60% 60%;
      animation: bloodDripRealistic2 5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
      animation-delay: 1.2s;
    }

    .blood-drip-3 {
      @apply w-1;
      height: 0;
      background: linear-gradient(to bottom, #dc2626 0%, #991b1b 65%, #7f1d1d 100%);
      border-radius: 0 0 45% 45%;
      animation: bloodDripRealistic3 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
      animation-delay: 2.5s;
    }

    .blood-drip-4 {
      @apply w-1;
      height: 0;
      background: linear-gradient(to bottom, #ef4444 0%, #dc2626 50%, #991b1b 100%);
      border-radius: 0 0 40% 40%;
      animation: bloodDripRealistic4 4.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
      animation-delay: 0.8s;
    }

    .blood-drip-5 {
      @apply w-1;
      height: 0;
      background: linear-gradient(to bottom, #dc2626 0%, #b91c1c 40%, #991b1b 80%, #7f1d1d 100%);
      border-radius: 0 0 55% 55%;
      animation: bloodDripRealistic5 6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
      animation-delay: 3.8s;
    }

    /* Individual keyframes for each drip to create variety */
    @keyframes bloodDripRealistic1 {
      0%, 15% { 
        height: 0; 
        transform: translateY(0) scaleY(0);
        opacity: 0;
      }
      20% {
        height: 2px;
        transform: translateY(0) scaleY(0.3);
        opacity: 0.4;
      }
      25% {
        height: 6px;
        transform: translateY(0) scaleY(0.7);
        opacity: 0.7;
      }
      35% {
        height: 12px;
        transform: translateY(2px) scaleY(1);
        opacity: 1;
      }
      45% {
        height: 18px;
        transform: translateY(4px) scaleY(1.1);
        opacity: 1;
      }
      55% {
        height: 24px;
        transform: translateY(6px) scaleY(1.2);
        opacity: 0.9;
      }
      65% {
        height: 28px;
        transform: translateY(8px) scaleY(1.15);
        opacity: 0.8;
      }
      75% {
        height: 32px;
        transform: translateY(12px) scaleY(1.1);
        opacity: 0.6;
      }
      85% {
        height: 28px;
        transform: translateY(16px) scaleY(0.9);
        opacity: 0.4;
      }
      95% {
        height: 12px;
        transform: translateY(20px) scaleY(0.5);
        opacity: 0.2;
      }
      100% {
        height: 0;
        transform: translateY(24px) scaleY(0);
        opacity: 0;
      }
    }

    @keyframes bloodDripRealistic2 {
      0%, 12% { 
        height: 0; 
        transform: translateY(0) scaleY(0);
        opacity: 0;
      }
      18% {
        height: 3px;
        transform: translateY(0) scaleY(0.4);
        opacity: 0.5;
      }
      28% {
        height: 10px;
        transform: translateY(1px) scaleY(0.8);
        opacity: 0.8;
      }
      38% {
        height: 20px;
        transform: translateY(3px) scaleY(1.1);
        opacity: 1;
      }
      48% {
        height: 32px;
        transform: translateY(6px) scaleY(1.3);
        opacity: 1;
      }
      58% {
        height: 42px;
        transform: translateY(10px) scaleY(1.4);
        opacity: 0.95;
      }
      68% {
        height: 48px;
        transform: translateY(14px) scaleY(1.35);
        opacity: 0.85;
      }
      78% {
        height: 44px;
        transform: translateY(18px) scaleY(1.2);
        opacity: 0.7;
      }
      88% {
        height: 32px;
        transform: translateY(22px) scaleY(0.9);
        opacity: 0.4;
      }
      96% {
        height: 16px;
        transform: translateY(26px) scaleY(0.6);
        opacity: 0.2;
      }
      100% {
        height: 0;
        transform: translateY(30px) scaleY(0);
        opacity: 0;
      }
    }

    @keyframes bloodDripRealistic3 {
      0%, 20% { 
        height: 0; 
        transform: translateY(0) scaleY(0);
        opacity: 0;
      }
      25% {
        height: 2px;
        transform: translateY(0) scaleY(0.3);
        opacity: 0.3;
      }
      35% {
        height: 8px;
        transform: translateY(1px) scaleY(0.9);
        opacity: 0.7;
      }
      45% {
        height: 16px;
        transform: translateY(3px) scaleY(1.2);
        opacity: 1;
      }
      55% {
        height: 22px;
        transform: translateY(5px) scaleY(1.25);
        opacity: 0.9;
      }
      65% {
        height: 26px;
        transform: translateY(8px) scaleY(1.2);
        opacity: 0.8;
      }
      75% {
        height: 24px;
        transform: translateY(12px) scaleY(1.0);
        opacity: 0.6;
      }
      85% {
        height: 18px;
        transform: translateY(16px) scaleY(0.8);
        opacity: 0.4;
      }
      95% {
        height: 8px;
        transform: translateY(18px) scaleY(0.5);
        opacity: 0.2;
      }
      100% {
        height: 0;
        transform: translateY(20px) scaleY(0);
        opacity: 0;
      }
    }

    @keyframes bloodDripRealistic4 {
      0%, 8% { 
        height: 0; 
        transform: translateY(0) scaleY(0);
        opacity: 0;
      }
      15% {
        height: 1px;
        transform: translateY(0) scaleY(0.2);
        opacity: 0.4;
      }
      25% {
        height: 5px;
        transform: translateY(0) scaleY(0.6);
        opacity: 0.6;
      }
      35% {
        height: 12px;
        transform: translateY(2px) scaleY(1.0);
        opacity: 0.9;
      }
      45% {
        height: 20px;
        transform: translateY(4px) scaleY(1.2);
        opacity: 1;
      }
      55% {
        height: 26px;
        transform: translateY(7px) scaleY(1.25);
        opacity: 0.95;
      }
      65% {
        height: 30px;
        transform: translateY(10px) scaleY(1.2);
        opacity: 0.85;
      }
      75% {
        height: 28px;
        transform: translateY(14px) scaleY(1.1);
        opacity: 0.7;
      }
      85% {
        height: 22px;
        transform: translateY(17px) scaleY(0.9);
        opacity: 0.5;
      }
      95% {
        height: 10px;
        transform: translateY(20px) scaleY(0.6);
        opacity: 0.3;
      }
      100% {
        height: 0;
        transform: translateY(22px) scaleY(0);
        opacity: 0;
      }
    }

    @keyframes bloodDripRealistic5 {
      0%, 10% { 
        height: 0; 
        transform: translateY(0) scaleY(0);
        opacity: 0;
      }
      16% {
        height: 4px;
        transform: translateY(0) scaleY(0.5);
        opacity: 0.5;
      }
      26% {
        height: 12px;
        transform: translateY(1px) scaleY(0.9);
        opacity: 0.8;
      }
      36% {
        height: 24px;
        transform: translateY(3px) scaleY(1.2);
        opacity: 1;
      }
      46% {
        height: 36px;
        transform: translateY(6px) scaleY(1.4);
        opacity: 1;
      }
      56% {
        height: 48px;
        transform: translateY(10px) scaleY(1.5);
        opacity: 0.95;
      }
      66% {
        height: 54px;
        transform: translateY(15px) scaleY(1.45);
        opacity: 0.85;
      }
      76% {
        height: 50px;
        transform: translateY(20px) scaleY(1.3);
        opacity: 0.7;
      }
      86% {
        height: 40px;
        transform: translateY(25px) scaleY(1.0);
        opacity: 0.5;
      }
      94% {
        height: 24px;
        transform: translateY(28px) scaleY(0.7);
        opacity: 0.3;
      }
      100% {
        height: 0;
        transform: translateY(32px) scaleY(0);
        opacity: 0;
      }
    }

    .blood-stain {
      @apply absolute -bottom-8 left-1/2 w-24 h-8 rounded-full blur-sm;
      transform: translateX(-50%);
      background: radial-gradient(ellipse, rgba(220, 38, 38, 0.4) 0%, rgba(153, 27, 27, 0.3) 40%, rgba(127, 29, 29, 0.2) 70%, transparent 100%);
      animation: bloodStainRealistic 8s ease-in-out infinite;
    }

    @keyframes bloodStainRealistic {
      0%, 15% { 
        transform: translateX(-50%) scale(0.8); 
        opacity: 0.2; 
      }
      20%, 30% { 
        transform: translateX(-50%) scale(1.0); 
        opacity: 0.4; 
      }
      35%, 45% { 
        transform: translateX(-50%) scale(1.1); 
        opacity: 0.5; 
      }
      50%, 60% { 
        transform: translateX(-50%) scale(1.2); 
        opacity: 0.6; 
      }
      65%, 75% { 
        transform: translateX(-50%) scale(1.15); 
        opacity: 0.5; 
      }
      80%, 90% { 
        transform: translateX(-50%) scale(1.05); 
        opacity: 0.4; 
      }
      95%, 100% { 
        transform: translateX(-50%) scale(0.9); 
        opacity: 0.3; 
      }
    }

    /* Enhanced Memorial Ribbon */
    .memorial-ribbon {
      @apply relative inline-block mt-8 px-8 py-4 rounded-full border border-red-500/30 backdrop-blur-sm overflow-hidden;
      background: linear-gradient(135deg, rgba(127, 29, 29, 0.4), rgba(153, 27, 27, 0.3), rgba(185, 28, 28, 0.4));
    }

    .ribbon-blood-effect {
      @apply absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600;
      animation: ribbonBloodFlow 3s linear infinite;
    }

    @keyframes ribbonBloodFlow {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .ribbon-content {
      @apply relative z-10 flex items-center space-x-3 rtl:space-x-reverse;
    }

    /* Background Blood Rain */
    .blood-rain {
      @apply absolute inset-0;
    }

    .blood-drop {
      @apply absolute w-0.5 h-8 bg-gradient-to-b from-red-500/80 to-red-700/40 rounded-full;
      animation: bloodRainFall linear infinite;
    }

    @keyframes bloodRainFall {
      0% {
        transform: translateY(-100vh) rotate(10deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(10deg);
        opacity: 0;
      }
    }

    /* Professional Blood Filter Overlay */
    .blood-filter-overlay {
      @apply absolute inset-0 pointer-events-none;
      background: 
        radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(153, 27, 27, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(185, 28, 28, 0.05) 0%, transparent 50%);
      animation: bloodFilterPulse 8s ease-in-out infinite;
    }

    @keyframes bloodFilterPulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.7; }
    }

    /* Enhanced Loading Animation */
    .blood-loader {
      @apply relative w-24 h-24;
    }

    .blood-circle {
      @apply absolute inset-0 border-4 border-transparent rounded-full;
    }

    .blood-circle-1 {
      border-top-color: #dc2626;
      animation: bloodSpin 2s linear infinite;
    }

    .blood-circle-2 {
      @apply w-20 h-20 top-2 left-2;
      border-top-color: #b91c1c;
      animation: bloodSpinReverse 1.5s linear infinite;
    }

    .blood-circle-3 {
      @apply w-16 h-16 top-4 left-4;
      border-top-color: #991b1b;
      animation: bloodSpin 1s linear infinite;
    }

    .loader-heart {
      @apply absolute inset-0 flex items-center justify-center;
      animation: heartBeat 1.5s ease-in-out infinite;
    }

    @keyframes bloodSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes bloodSpinReverse {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }

    @keyframes heartBeat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .loading-dots {
      @apply flex space-x-2;
    }

    .loading-dot {
      @apply w-3 h-3 bg-red-500 rounded-full;
      animation: loadingBounce 1.4s ease-in-out infinite both;
    }

    .loading-dot:nth-child(1) { animation-delay: -0.32s; }
    .loading-dot:nth-child(2) { animation-delay: -0.16s; }
    .loading-dot:nth-child(3) { animation-delay: 0s; }

    @keyframes loadingBounce {
      0%, 80%, 100% { 
        transform: scale(0);
      } 
      40% { 
        transform: scale(1);
      }
    }

    /* Enhanced Error Card */
    .error-card-enhanced {
      @apply relative bg-gradient-to-br from-red-950/60 to-black/90 backdrop-blur-xl border border-red-500/40 rounded-3xl overflow-hidden p-8;
      box-shadow: 
        0 25px 50px rgba(0, 0, 0, 0.8),
        0 0 100px rgba(220, 38, 38, 0.3);
    }

    .error-blood-stream {
      @apply absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600;
      animation: errorBloodStream 2s ease-in-out infinite;
    }

    @keyframes errorBloodStream {
      0%, 100% { opacity: 0.6; transform: scaleX(1); }
      50% { opacity: 1; transform: scaleX(1.1); }
    }

    .error-content {
      @apply text-center relative z-10;
    }

    .error-icon-wrapper {
      @apply w-24 h-24 bg-gradient-to-br from-red-500/20 to-red-800/40 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/30;
      box-shadow: 0 0 40px rgba(220, 38, 38, 0.3);
    }

    .enhanced-retry-btn {
      @apply px-10 py-4 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-2xl font-bold hover:from-red-500 hover:via-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center mx-auto text-lg;
      box-shadow: 
        0 8px 25px rgba(220, 38, 38, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .enhanced-retry-btn:hover {
      @apply transform scale-105;
      box-shadow: 
        0 12px 35px rgba(220, 38, 38, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    /* Enhanced Footer */
    .footer-section {
      @apply mt-24;
    }

    .memorial-footer {
      @apply relative max-w-4xl mx-auto;
    }

    .footer-blood-line {
      @apply absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mb-8;
      animation: footerBloodPulse 3s ease-in-out infinite;
    }

    @keyframes footerBloodPulse {
      0%, 100% { opacity: 0.5; transform: scaleY(1); }
      50% { opacity: 1; transform: scaleY(1.5); }
    }

    .footer-content {
      @apply pt-8 space-y-6;
    }

    .update-info {
      @apply flex items-center justify-center space-x-4 rtl:space-x-reverse bg-gradient-to-r from-red-900/30 via-red-800/40 to-red-900/30 px-8 py-6 rounded-2xl border border-red-500/30 backdrop-blur-sm;
    }

    .update-text {
      @apply text-center;
    }

    .memorial-message {
      @apply text-center space-y-4;
    }

    .memorial-line {
      @apply w-32 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent mx-auto;
      animation: memorialLinePulse 4s ease-in-out infinite;
    }

    @keyframes memorialLinePulse {
      0%, 100% { opacity: 0.4; width: 8rem; }
      50% { opacity: 1; width: 12rem; }
    }

    /* Typography Enhancements */
    .arabic-text {
      font-family: 'Cairo', 'Amiri', 'Tajawal', 'Noto Sans Arabic', Arial, sans-serif;
      direction: rtl;
      text-rendering: optimizeLegibility;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .enhanced-stat-card {
        @apply h-[22rem];
      }
      
      .card-content-wrapper {
        @apply p-5;
      }
      
      .stat-number-enhanced {
        @apply text-3xl;
      }
    }

    @media (max-width: 768px) {
      .enhanced-stat-card {
        @apply h-80 mx-1;
      }
      
      .card-content-wrapper {
        @apply p-4;
      }
      
      .stat-number-enhanced {
        @apply text-2xl;
      }
      
      .enhanced-icon-container {
        @apply w-12 h-12;
      }

      .icon-content svg {
        @apply w-6 h-6;
      }

      .card-title-enhanced {
        @apply text-lg leading-snug;
      }

      .card-description {
        @apply text-xs leading-relaxed;
      }

      .enhanced-category-badge {
        @apply px-3 py-1 text-xs;
      }

      .blood-title {
        @apply text-4xl md:text-5xl;
      }

      .memorial-ribbon .ribbon-content {
        @apply text-sm px-3;
      }

      /* Background image responsiveness */
      .background-image {
        @apply object-cover object-center;
        min-height: 100%;
      }

      .blood-filter-layer {
        backdrop-filter: blur(1px);
      }
    }

    @media (max-width: 640px) {
      .enhanced-stat-card {
        @apply h-72 mx-0;
      }

      .card-content-wrapper {
        @apply p-3;
      }

      .card-header {
        @apply flex-col space-y-3;
      }

      .number-display {
        @apply text-center;
      }

      .stat-number-enhanced {
        @apply text-xl;
      }

      .enhanced-icon-container {
        @apply w-10 h-10 mx-auto;
      }

      .icon-content svg {
        @apply w-5 h-5;
      }

      .card-title-enhanced {
        @apply text-base text-center;
      }

      .card-description {
        @apply text-xs text-center px-1;
      }

      .enhanced-category-badge {
        @apply px-2 py-1 text-xs mx-auto;
      }

      .blood-title {
        @apply text-3xl;
      }

      .memorial-ribbon .ribbon-content {
        @apply text-sm px-2 flex-col space-y-2 space-x-0;
      }

      /* Enhanced mobile image responsiveness */
      .card-background {
        @apply relative overflow-hidden;
      }

      .background-image {
        @apply w-full h-full object-cover object-center;
        transform: scale(1.1);
        transition: transform 0.3s ease;
      }

      .enhanced-stat-card:hover .background-image {
        transform: scale(1.05);
      }

      /* Reduce visual complexity on mobile */
      .blood-splatter-top,
      .blood-drip-side,
      .hover-blood-splatter {
        @apply hidden;
      }

      .memorial-elements {
        @apply hidden;
      }

      /* Simplify gradients for better performance */
      .gradient-overlay {
        @apply opacity-60;
      }

      .blood-filter-layer {
        @apply opacity-80;
        backdrop-filter: blur(0.5px);
      }
    }

    @media (max-width: 480px) {
      .enhanced-stat-card {
        @apply h-64 rounded-2xl;
      }

      .card-content-wrapper {
        @apply p-2;
      }

      .card-header {
        @apply space-y-2;
      }

      .stat-number-enhanced {
        @apply text-lg;
      }

      .enhanced-icon-container {
        @apply w-8 h-8;
      }

      .icon-content svg {
        @apply w-4 h-4;
      }

      .card-title-enhanced {
        @apply text-sm font-semibold;
      }

      .card-description {
        @apply text-xs px-0 leading-tight;
      }

      .enhanced-category-badge {
        @apply px-2 py-0.5 text-xs rounded-lg;
      }

      .blood-title {
        @apply text-2xl;
      }

      .memorial-ribbon {
        @apply px-4 py-2 text-sm;
      }

      /* Ultra-compact image handling */
      .background-image {
        @apply object-cover;
        object-position: center 30%;
      }

      /* Reduce animations for better performance */
      .enhanced-stat-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .enhanced-stat-card:hover {
        @apply transform scale-105;
      }
    }

    /* Extra small devices */
    @media (max-width: 360px) {
      .enhanced-stat-card {
        @apply h-56 mx-1;
      }

      .stat-number-enhanced {
        @apply text-base;
      }

      .card-title-enhanced {
        @apply text-xs;
      }

      .card-description {
        @apply hidden;
      }

      .enhanced-category-badge {
        @apply text-xs px-1 py-0.5;
      }

      .blood-title {
        @apply text-xl;
      }

      /* Minimal image processing for very small screens */
      .blood-filter-layer,
      .gradient-overlay {
        @apply opacity-50;
      }
    }

    /* Performance Optimizations */
    .enhanced-stat-card * {
      will-change: transform;
    }

    .card-background img {
      transform: translateZ(0);
    }

    /* Accessibility */
    .enhanced-stat-card:focus {
      @apply outline-none ring-4 ring-red-500/50;
    }

    .enhanced-retry-btn:focus {
      @apply outline-none ring-4 ring-red-500/50;
    }
  `],
  animations: [
    trigger('titleAnimation', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-50px) scale(0.8)' }),
        animate('1s 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      state('*', style({ 
        opacity: 1, 
        transform: 'translateY(0) scale(1)',
        visibility: 'visible'
      }))
    ]),
    trigger('subtitleAnimation', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(30px) rotateX(-10deg)' }),
        animate('1s 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
          style({ opacity: 1, transform: 'translateY(0) rotateX(0)' }))
      ])
    ]),
    trigger('ribbonAnimation', [
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0.8) translateY(20px)' }),
        animate('0.8s 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ])
    ]),
    trigger('cardAnimation', [
      transition('void => *', [
        style({ 
          opacity: 0, 
          transform: 'scale(0.7) translateY(60px) rotateX(20deg) rotateY(10deg)' 
        }),
        animate('0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ 
            opacity: 1, 
            transform: 'scale(1) translateY(0) rotateX(0) rotateY(0)' 
          }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ 
            opacity: 0, 
            transform: 'scale(0.7) translateY(60px) rotateX(20deg)' 
          }),
          stagger(150, animate('0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
            style({ 
              opacity: 1, 
              transform: 'scale(1) translateY(0) rotateX(0)' 
            })))
        ], { optional: true })
      ])
    ])
  ]
})
export class VictimStatsComponent implements OnInit, OnDestroy {
  isLoading = true;
  hasError = false;
  lastUpdated: Date | null = null;
  hoveredCard: string | null = null;
  statCards: StatCard[] = [];
  // Precomputed arrays for template helpers (even if not used directly in template)
  bloodDropsArray: number[] = Array.from({ length: 50 }, (_, index) => index);
  bloodParticlesArray: number[] = Array.from({ length: 20 }, (_, index) => index);
  splatterParticlesArray: number[] = Array.from({ length: 8 }, (_, index) => index);
  memorialStarsArray: number[] = Array.from({ length: 3 }, (_, index) => index);

  constructor(private victimStatsService: VictimStatsService) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  loadData() {
    this.isLoading = true;
    this.hasError = false;

    this.victimStatsService.getVictimStats().subscribe({
      next: (data) => {
        this.processData(data);
        this.isLoading = false;
        this.lastUpdated = new Date();
      },
      error: (error) => {
        console.error('Error loading victim stats:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  private processData(data: VictimStatsData) {
    this.statCards = [
      {
        id: 'total-killed',
        title: 'إجمالي الشهداء',
        value: data.gaza.killed.total,
        iconSvg: `<svg fill="currentColor" class="w-8 h-8 text-red-400" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
        </svg>`,
        color: '#ef4444',
        description: 'إجمالي عدد الشهداء الذين سقطوا في غزة منذ بداية العدوان',
        category: 'casualties',
        gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(185, 28, 28, 0.2))',
        backgroundImage: 'https://i0.wp.com/www.middleeastmonitor.com/wp-content/uploads/2024/10/AA-20241001-35785406-35785380-THE_DEATH_TOLL_IN_GAZA_RISES_STEADILY_FOLLOWING_ISRAELI_ATTACKS.jpg?fit=920%2C613&ssl=1'
      },
      {
        id: 'children-killed',
        title: 'الأطفال الشهداء',
        value: data.gaza.killed.children,
        iconSvg: `<svg fill="currentColor" class="w-8 h-8 text-red-400" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z"/>
          <circle cx="12" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1"/>
        </svg>`,
        color: '#ef4444',
        description: 'الأطفال الأبرياء الذين استشهدوا في العدوان الإسرائيلي',
        category: 'casualties',
        gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.2))',
        backgroundImage: 'https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2024-02/240202-hind-gaza-mb-1049-8e7f2f.jpg'
      },
      {
        id: 'women-killed',
        title: 'النساء الشهيدات',
        value: data.gaza.killed.women,
        iconSvg: `<svg fill="currentColor" class="w-8 h-8 text-red-400" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 10.1 15.9 11 17 11V20C17 21.1 16.1 22 15 22H13C11.9 22 11 21.1 11 20V14H9V20C9 21.1 8.1 22 7 22H5C3.9 22 3 21.1 3 20V11C4.1 11 5 10.1 5 9V7H21V9Z"/>
          <circle cx="12" cy="4" r="2" fill="none" stroke="currentColor" stroke-width="1"/>
        </svg>`,
        color: '#f87171',
        description: 'النساء الشهيدات اللواتي سقطن في القصف الإسرائيلي',
        category: 'casualties',
        gradient: 'linear-gradient(135deg, rgba(248, 113, 113, 0.3), rgba(239, 68, 68, 0.2))',
        backgroundImage: 'https://www.moroccoworldnews.com/wp-content/uploads/2024/11/un-agencies-over-10-000-women-killed-in-gaza-war-scaled.jpeg'
      },
      {
        id: 'injured-total',
        title: 'إجمالي الجرحى',
        value: data.gaza.injured.total,
        iconSvg: `<svg fill="currentColor" class="w-8 h-8 text-orange-400" viewBox="0 0 24 24">
          <path d="M19 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H5C3.9 8 3 8.9 3 10V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V10C21 8.9 20.1 8 19 8ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13 14 13.9 14 15 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9S15.1 4.29 15.1 6V8Z"/>
          <path d="M12 14.5L10.5 13L12 11.5L13.5 13L12 14.5Z" fill="#dc2626"/>
        </svg>`,
        color: '#fb923c',
        description: 'إجمالي عدد الجرحى والمصابين جراء القصف الإسرائيلي',
        category: 'wounded',
        gradient: 'linear-gradient(135deg, rgba(251, 146, 60, 0.3), rgba(249, 115, 22, 0.2))',
        backgroundImage: 'https://www.cairo24.com/Upload/libfiles/115/1/840.jpeg'
      },
      {
        id: 'massacres',
        title: 'المجازر',
        value: data.gaza.massacres,
        iconSvg: `<svg fill="currentColor" class="w-8 h-8 text-red-600" viewBox="0 0 24 24">
          <path d="M12 2L1 21H23L12 2ZM12 18H12.01V18.01H12V18ZM11 16V10H13V16H11Z"/>
          <path d="M12 6L4 18H20L12 6ZM12 14H12.01V14.01H12V14ZM11.5 12V8H12.5V12H11.5Z" fill="#991b1b"/>
          <circle cx="12" cy="15" r="0.5" fill="#dc2626"/>
        </svg>`,
        color: '#991b1b',
        description: 'عدد المجازر الجماعية المرتكبة ضد المدنيين الفلسطينيين',
        category: 'violence',
        gradient: 'linear-gradient(135deg, rgba(153, 27, 27, 0.4), rgba(127, 29, 29, 0.3))',
        backgroundImage: 'https://www.yemenipress.net/wp-content/uploads/2023/10/%D8%B4%D9%87%D8%AF%D8%A7%D8%A1-%D9%85%D8%AC%D8%B2%D8%B1%D8%A9-%D8%A7%D9%84%D9%85%D8%B9%D9%85%D8%AF%D8%A7%D9%86%D9%8A-%D8%BA%D8%B2%D8%A9.jpeg'
      },
      {
        id: 'press-killed',
        title: 'الصحفيون الشهداء',
        value: data.gaza.killed.press,
        iconSvg: `<svg fill="currentColor" class="w-8 h-8 text-blue-400" viewBox="0 0 24 24">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
          <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H14V17H7V15Z"/>
          <circle cx="16" cy="16" r="1.5" fill="#dc2626"/>
          <path d="M15.5 15.5L16.5 16.5" stroke="#dc2626" stroke-width="1"/>
        </svg>`,
        color: '#60a5fa',
        description: 'الصحفيون الذين استشهدوا أثناء تغطية الأحداث',
        category: 'media',
        gradient: 'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.2))',
        backgroundImage: 'https://i.pinimg.com/736x/e4/f2/fc/e4f2fc41cf5f961aaa797b95977e26fb.jpg'
      },
      {
        id: 'medical-killed',
        title: 'الكوادر الطبية الشهداء',
        value: data.gaza.killed.medical,
        iconSvg: `<svg fill="currentColor" class="w-8 h-8 text-green-400" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4S5.33 6.59 4.65 10.04C4.26 11.15 4.26 12.85 4.65 13.96C5.33 17.41 8.36 20 12 20S18.67 17.41 19.35 13.96C19.74 12.85 19.74 11.15 19.35 10.04ZM12 17C9.24 17 7 14.76 7 12S9.24 7 12 7S17 9.24 17 12S14.76 17 12 17Z"/>
          <path d="M11 8V11H8V13H11V16H13V13H16V11H13V8H11Z" fill="#dc2626"/>
        </svg>`,
        color: '#4ade80',
        description: 'الأطباء والممرضون وباقي الطاقم الطبي الذين استشهدوا',
        category: 'media',
        gradient: 'linear-gradient(135deg, rgba(74, 222, 128, 0.3), rgba(34, 197, 94, 0.2))',
        backgroundImage: 'https://felesteen.news/thumb/w920/uploads/images/2024/11/8ndrK.webp'
      }
    ];
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString('ar-EG');
  }

  getCategoryLabel(category: 'casualties' | 'wounded' | 'violence' | 'media'): string {
    const labels: Record<'casualties' | 'wounded' | 'violence' | 'media', string> = {
      'casualties': 'شهداء',
      'wounded': 'جرحى',
      'violence': 'عنف',
      'media': 'إعلام وطب'
    };
    return labels[category];
  }

  onCardHover(cardId: string) {
    this.hoveredCard = cardId;
  }

  onCardLeave(cardId: string) {
    this.hoveredCard = null;
  }

  trackByCardId(index: number, card: StatCard): string {
    return card.id;
  }

  // Helper methods for template arrays
  getBloodDrops(): number[] {
    return this.bloodDropsArray;
  }

  getBloodParticles(): number[] {
    return this.bloodParticlesArray;
  }

  getSplatterParticles(): number[] {
    return this.splatterParticlesArray;
  }

  getMemorialStars(): number[] {
    return this.memorialStarsArray;
  }

  getRandomDuration(index: number): number {
    // Generate consistent random duration based on index to avoid template expression complexity
    const seed = (index * 9301 + 49297) % 233280;
    const random = seed / 233280;
    return 3 + random * 2;
  }

  getImagePosition(category: 'casualties' | 'wounded' | 'violence' | 'media'): string {
    // Optimize image positioning for different categories on mobile
    const positions: Record<'casualties' | 'wounded' | 'violence' | 'media', string> = {
      'casualties': 'center 30%',
      'wounded': 'center 40%',
      'violence': 'center 20%',
      'media': 'center 35%'
    };
    return positions[category];
  }
}

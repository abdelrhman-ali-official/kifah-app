import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen pt-20">
      <!-- Hero Section -->
      <section class="py-20 bg-gradient-dark">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 arabic-text" [@fadeInUp]>
            من نحن
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto" [@fadeInUp]>
            A platform dedicated to remembering and honoring the victims of conflict, 
            preserving their stories for future generations.
          </p>
        </div>
      </section>

      <!-- Mission Section -->
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div [@fadeInLeft]>
              <h2 class="text-4xl font-bold text-white mb-6 arabic-text">
                مهمتنا
              </h2>
              <p class="text-lg text-gray-300 mb-6">
                Our mission is to create a comprehensive digital memorial for those who have lost their lives 
                in conflicts, ensuring their stories are never forgotten and their memory lives on.
              </p>
              <p class="text-lg text-gray-300">
                We believe that every life matters and every story deserves to be told. Through this platform, 
                we aim to provide a space for remembrance, healing, and hope.
              </p>
            </div>
            <div class="glass-effect rounded-2xl p-8" [@fadeInRight]>
              <div class="w-full h-64 bg-gradient-to-br from-red-900/30 to-red-700/20 rounded-xl flex items-center justify-center">
                <div class="text-center">
                  <div class="w-20 h-20 bg-primary-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10 text-primary-red" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <p class="text-gray-400">Memorial Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Values Section -->
      <section class="py-20 bg-gradient-dark">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-white mb-4 arabic-text" [@fadeInUp]>
              قيمنا
            </h2>
            <p class="text-xl text-gray-300 max-w-2xl mx-auto" [@fadeInUp]>
              The principles that guide our work and define our commitment
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="glass-effect rounded-2xl p-8 text-center" [@fadeInUp]>
              <div class="w-16 h-16 bg-primary-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-primary-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-4">Respect</h3>
              <p class="text-gray-300">
                We treat every victim with dignity and respect, honoring their memory and the lives they lived.
              </p>
            </div>

            <div class="glass-effect rounded-2xl p-8 text-center" [@fadeInUp] style="animation-delay: 0.2s;">
              <div class="w-16 h-16 bg-primary-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-primary-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-4">Truth</h3>
              <p class="text-gray-300">
                We are committed to presenting accurate information and preserving the true stories of victims.
              </p>
            </div>

            <div class="glass-effect rounded-2xl p-8 text-center" [@fadeInUp] style="animation-delay: 0.4s;">
              <div class="w-16 h-16 bg-primary-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-primary-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-4">Hope</h3>
              <p class="text-gray-300">
                We believe in the power of remembrance to inspire hope and work towards a better future.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-white mb-4 arabic-text" [@fadeInUp]>
              فريقنا
            </h2>
            <p class="text-xl text-gray-300 max-w-2xl mx-auto" [@fadeInUp]>
              Dedicated individuals working to preserve memories and honor victims
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="glass-effect rounded-2xl p-6 text-center" [@fadeInUp]>
              <div class="w-24 h-24 bg-gradient-to-br from-red-900/30 to-red-700/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-primary-red">A</span>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">Abdelrhman Ali</h3>
              <p class="text-gray-400 mb-4">Software Engineer</p>
              <p class="text-gray-300 text-sm">
                Leading the initiative to preserve the memory of victims and their stories.
              </p>
            </div>

            
            
          </div>
        </div>
      </section>
    </div>
  `,
  animations: [
    trigger('fadeInUp', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out')
      ])
    ]),
    trigger('fadeInLeft', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('0.6s ease-out')
      ])
    ]),
    trigger('fadeInRight', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('0.6s ease-out')
      ])
    ])
  ]
})
export class AboutComponent implements OnInit {

  ngOnInit() {
    // Add any initialization logic here
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-black/80 backdrop-blur-md border-t border-glass-border">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand Section -->
          <div class="md:col-span-2">
            <div class="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <img 
                src="assets/logo.png" 
                alt="Kifah Logo" 
                class="w-10 h-10 object-contain"
                [@logoAnimation]
              />
              <h3 class="text-2xl font-bold text-white font-english">Kifah</h3>
            </div>
            <p class="text-gray-300 mb-6 max-w-md">
              Remembering the victims and honoring their memory. A platform dedicated to preserving the stories of those who lost their lives in the struggle for freedom and justice.
            </p>
            <div class="flex space-x-4 rtl:space-x-reverse">
              
              <a 
                href="#" 
                class="w-10 h-10 bg-glass rounded-full flex items-center justify-center text-white hover:text-primary-red hover:bg-primary-red/20 transition-all duration-300 glow-hover"
                [@socialIconAnimation]
                style="animation-delay: 0.1s;"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a 
                href="#" 
                class="w-10 h-10 bg-glass rounded-full flex items-center justify-center text-white hover:text-primary-red hover:bg-primary-red/20 transition-all duration-300 glow-hover"
                [@socialIconAnimation]
                style="animation-delay: 0.2s;"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
              <a 
                href="#" 
                class="w-10 h-10 bg-glass rounded-full flex items-center justify-center text-white hover:text-primary-red hover:bg-primary-red/20 transition-all duration-300 glow-hover"
                [@socialIconAnimation]
                style="animation-delay: 0.3s;"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-red transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-red transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-red transition-colors duration-300">
                  Victims
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-red transition-colors duration-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h4 class="text-lg font-semibold text-white mb-4">Contact</h4>
            <div class="space-y-3">
              <div class="flex items-center space-x-3 rtl:space-x-reverse">
                <svg class="w-5 h-5 text-primary-red" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span class="text-gray-300">kifah1gaza&#64;gmail.com</span>
              </div>
              <div class="flex items-center space-x-3 rtl:space-x-reverse">
                <svg class="w-5 h-5 text-primary-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-gray-300">Cairo, Egypt</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-glass-border mt-8 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Kifah. All rights reserved. Remembering the victims, honoring their memory.
            </p>
            <div class="flex space-x-6 rtl:space-x-reverse text-sm">
              <a href="#" class="text-gray-400 hover:text-primary-red transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" class="text-gray-400 hover:text-primary-red transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  animations: [
    trigger('logoAnimation', [
      state('in', style({ transform: 'scale(1)', opacity: 1 })),
      transition('void => *', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('0.5s ease-in-out')
      ])
    ]),
    trigger('socialIconAnimation', [
      state('in', style({ transform: 'scale(1)', opacity: 1 })),
      transition('void => *', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class FooterComponent implements OnInit {

  ngOnInit() {
    // Add any initialization logic here
  }
}

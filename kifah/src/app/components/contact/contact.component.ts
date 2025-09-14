import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen pt-20">
      <!-- Hero Section -->
      <section class="py-20 bg-gradient-dark">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 arabic-text" [@fadeInUp]>
            اتصل بنا
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto" [@fadeInUp]>
            Get in touch with us. We're here to help and listen to your stories.
          </p>
        </div>
      </section>

      <!-- Contact Form Section -->
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <!-- Contact Form -->
              <div class="glass-effect rounded-2xl p-8" [@fadeInLeft]>
                <h2 class="text-3xl font-bold text-white mb-6">Send us a message</h2>
                <form (ngSubmit)="onSubmit()" #contactForm="ngForm" class="space-y-6">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      [(ngModel)]="contactData.name"
                      required
                      class="w-full px-4 py-3 bg-transparent border border-glass-border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      [(ngModel)]="contactData.email"
                      required
                      email
                      class="w-full px-4 py-3 bg-transparent border border-glass-border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label for="subject" class="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      [(ngModel)]="contactData.subject"
                      required
                      class="w-full px-4 py-3 bg-transparent border border-glass-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="victim-info">Victim Information</option>
                      <option value="support">Support Request</option>
                      <option value="media">Media Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label for="message" class="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      [(ngModel)]="contactData.message"
                      required
                      rows="5"
                      class="w-full px-4 py-3 bg-transparent border border-glass-border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell us your story or ask a question..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    [disabled]="!contactForm.form.valid || isSubmitting"
                    class="w-full py-3 bg-primary-red text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 glow-hover"
                  >
                    <span *ngIf="!isSubmitting">Send Message</span>
                    <span *ngIf="isSubmitting" class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  </button>
                </form>
              </div>

              <!-- Contact Information -->
              <div class="space-y-8" [@fadeInRight]>
                <div>
                  <h2 class="text-3xl font-bold text-white mb-6">Get in touch</h2>
                  <p class="text-lg text-gray-300 mb-8">
                    We're here to help you share stories, provide information, or answer any questions you may have.
                  </p>
                </div>

                <div class="space-y-6">
                  <div class="flex items-start space-x-4 rtl:space-x-reverse">
                    <div class="w-12 h-12 bg-primary-red/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-primary-red" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-white mb-1">Email</h3>
                      <p class="text-gray-300">kifah1gaza&#64;gmail.com</p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-4 rtl:space-x-reverse">
                    <div class="w-12 h-12 bg-primary-red/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-primary-red" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-white mb-1">Location</h3>
                      <p class="text-gray-300">Cairo, Egypt</p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-4 rtl:space-x-reverse">
                    <div class="w-12 h-12 bg-primary-red/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-primary-red" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-white mb-1">Response Time</h3>
                      <p class="text-gray-300">Within 24 hours</p>
                    </div>
                  </div>
                </div>

                <!-- Social Media -->
                <div class="pt-8">
                  <h3 class="text-lg font-semibold text-white mb-4">Follow us</h3>
                  <div class="flex space-x-4 rtl:space-x-reverse">
                    <a href="#" class="w-10 h-10 bg-glass rounded-full flex items-center justify-center text-white hover:text-primary-red hover:bg-primary-red/20 transition-all duration-300">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="#" class="w-10 h-10 bg-glass rounded-full flex items-center justify-center text-white hover:text-primary-red hover:bg-primary-red/20 transition-all duration-300">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="#" class="w-10 h-10 bg-glass rounded-full flex items-center justify-center text-white hover:text-primary-red hover:bg-primary-red/20 transition-all duration-300">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
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
export class ContactComponent implements OnInit {
  isSubmitting = false;
  contactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  ngOnInit() {
    // Add any initialization logic here
  }

  onSubmit() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', this.contactData);
      this.isSubmitting = false;
      
      // Reset form
      this.contactData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
      
      // Show success message (you can implement a proper notification system)
      alert('Thank you for your message. We will get back to you soon.');
    }, 2000);
  }
}

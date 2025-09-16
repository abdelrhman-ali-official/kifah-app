import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AUTH_INTERCEPTOR_PROVIDER } from './services/auth.interceptor';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-gradient-dark">
      <app-header></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'kifah';

  ngOnInit() {
    this.loadFonts();
  }

  private loadFonts() {
    // Check if FontFace API is supported
    if ('FontFace' in window) {
      // Load Arabic font
      const arabicFont = new FontFace('arabic', 'url(./fonts/arabic.otf)', {
        style: 'normal',
        weight: '400',
        display: 'swap'
      });

      // Load TheYearofHandicrafts font
      const customFont = new FontFace('TheYearofHandicrafts', 'url(./fonts/alfont_com_TheYearofHandicrafts-Black.otf)', {
        style: 'normal',
        weight: '900',
        display: 'swap'
      });

      // Load and add fonts to document
      Promise.all([
        arabicFont.load(),
        customFont.load()
      ]).then((fonts) => {
        fonts.forEach(font => {
          (document.fonts as any).add(font);
        });
        console.log('Custom fonts loaded successfully');
        
        // Add loaded class to body for CSS targeting
        document.body.classList.add('fonts-loaded');
      }).catch((error) => {
        console.warn('Font loading failed, falling back to system fonts:', error);
        // Still add the class to prevent font loading issues
        document.body.classList.add('fonts-loaded');
      });
    } else {
      // Fallback for browsers without FontFace API
      console.warn('FontFace API not supported, using CSS font loading');
      document.body.classList.add('fonts-loaded');
    }
  }
}

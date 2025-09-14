import { Component } from '@angular/core';
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
export class AppComponent {
  title = 'Kifah';
}

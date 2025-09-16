import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-8">
      <div class="absolute inset-0 bg-black/80"></div>
      <div class="absolute inset-0 backdrop-blur-md"></div>

      <div class="relative z-10 w-full max-w-md p-8 rounded-3xl border border-red-500/30 bg-gradient-to-br from-black/70 to-gray-900/70 shadow-[0_20px_60px_rgba(220,38,38,0.25)] my-8">
        <h2 class="text-center text-3xl font-extrabold text-white mb-2">Sign In</h2>
        <p class="text-center text-red-300 mb-6">Welcome back to Kifah</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm text-gray-300 mb-1">Email</label>
            <input type="email" formControlName="email"
              class="w-full px-4 py-3 rounded-xl bg-black/50 border border-red-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60" placeholder="name@example.com" />
            <div class="mt-1 text-xs text-red-400" *ngIf="submitted && form.controls['email'].errors">
              <span *ngIf="form.controls['email'].errors?.['required']">Email is required</span>
              <span *ngIf="form.controls['email'].errors?.['email']">Please enter a valid email address</span>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1">Password</label>
            <input type="password" formControlName="password"
              class="w-full px-4 py-3 rounded-xl bg-black/50 border border-red-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60" placeholder="••••••••" />
            <div class="mt-1 text-xs text-red-400" *ngIf="submitted && form.controls['password'].errors">
              <span *ngIf="form.controls['password'].errors?.['required']">Password is required</span>
              <span *ngIf="form.controls['password'].errors?.['minlength']">Password must be at least 8 characters</span>
            </div>
          </div>

          <button type="submit" [disabled]="loading" class="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white font-bold shadow-[0_10px_30px_rgba(220,38,38,0.35)] hover:from-red-600 hover:to-red-800 transition-all">
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <div class="text-center mt-6 text-sm text-gray-300">
          Don't have an account?
          <a class="text-red-400 hover:text-red-300 font-semibold" [routerLink]="['/signup']">Create Account</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Additional component-specific styles can be added here */
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  loading = false;
  submitted = false;

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.loading = false;
        this.form.setErrors({ submit: true });
      }
    });
  }
}



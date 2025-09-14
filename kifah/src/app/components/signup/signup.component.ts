import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';

function passwordRulesValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value || '');
  if (!value) return null;
  const hasMin = value.length >= 8;
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasSpecial = /[!@#$%^&*]/.test(value);
  const valid = hasMin && hasUpper && hasLower && hasDigit && hasSpecial;
  return valid ? null : { passwordRules: { hasMin, hasUpper, hasLower, hasDigit, hasSpecial } };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 bg-black/80"></div>
      <div class="absolute inset-0 backdrop-blur-md"></div>

      <div class="relative z-10 w-full max-w-2xl p-8 rounded-3xl border border-red-500/30 bg-gradient-to-br from-black/70 to-gray-900/70 shadow-[0_20px_60px_rgba(220,38,38,0.25)]">
        <h2 class="text-center text-3xl font-extrabold text-white arabic-text mb-2">إنشاء حساب</h2>
        <p class="text-center text-red-300 mb-6 arabic-text">انضم إلى كفاح وكن جزءًا من الصوت</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1 arabic-text">الاسم الأول</label>
            <input type="text" formControlName="firstName" class="w-full px-4 py-3 rounded-xl bg-black/50 border border-red-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60" placeholder="محمد" />
            <div class="mt-1 text-xs text-red-400 arabic-text" *ngIf="submitted && form.controls['firstName'].errors">
              <span *ngIf="form.controls['firstName'].errors?.['required']">الاسم الأول مطلوب</span>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1 arabic-text">اسم العائلة</label>
            <input type="text" formControlName="lastName" class="w-full px-4 py-3 rounded-xl bg-black/50 border border-red-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60" placeholder="الأنصاري" />
            <div class="mt-1 text-xs text-red-400 arabic-text" *ngIf="submitted && form.controls['lastName'].errors">
              <span *ngIf="form.controls['lastName'].errors?.['required']">اسم العائلة مطلوب</span>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1 arabic-text">اسم المستخدم</label>
            <input type="text" formControlName="userName" class="w-full px-4 py-3 rounded-xl bg-black/50 border border-red-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60" placeholder="mohammed123" />
            <div class="mt-1 text-xs text-red-400 arabic-text" *ngIf="submitted && form.controls['userName'].errors">
              <span *ngIf="form.controls['userName'].errors?.['required']">اسم المستخدم مطلوب</span>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1 arabic-text">رقم الهاتف</label>
            <input type="tel" formControlName="phoneNumber" class="w-full px-4 py-3 rounded-xl bg-black/50 border border-red-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60" placeholder="059xxxxxxx" />
            <div class="mt-1 text-xs text-red-400 arabic-text" *ngIf="submitted && form.controls['phoneNumber'].errors">
              <span *ngIf="form.controls['phoneNumber'].errors?.['required']">رقم الهاتف مطلوب</span>
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm text-gray-300 mb-1 arabic-text">البريد الإلكتروني</label>
            <input type="email" formControlName="email" class="w-full px-4 py-3 rounded-xl bg-black/50 border border-red-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60" placeholder="name@example.com" />
            <div class="mt-1 text-xs text-red-400 arabic-text" *ngIf="submitted && form.controls['email'].errors">
              <span *ngIf="form.controls['email'].errors?.['required']">البريد الإلكتروني مطلوب</span>
              <span *ngIf="form.controls['email'].errors?.['email']">صيغة البريد الإلكتروني غير صحيحة</span>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1 arabic-text">الجنس</label>
            <select formControlName="gender" class="w-full px-4 py-3 rounded-xl bg-black/50 border border-red-500/30 text-white focus:outline-none focus:ring-2 focus:ring-red-500/60">
              <option [ngValue]="1">ذكر</option>
              <option [ngValue]="2">أنثى</option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1 arabic-text">كلمة المرور</label>
            <input type="password" formControlName="password" class="w-full px-4 py-3 rounded-xl bg-black/50 border border-red-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60" placeholder="••••••••" />
            <div class="mt-1 text-xs text-red-400 arabic-text" *ngIf="submitted && form.controls['password'].errors">
              <ng-container *ngIf="form.controls['password'].errors?.['required']">كلمة المرور مطلوبة</ng-container>
              <ng-container *ngIf="form.controls['password'].errors?.['passwordRules'] as e">
                <div>يجب أن تحتوي على:
                  <span [class.text-green-400]="e.hasMin" [class.text-red-400]="!e.hasMin">٨ أحرف على الأقل</span> •
                  <span [class.text-green-400]="e.hasUpper" [class.text-red-400]="!e.hasUpper">حرف كبير</span> •
                  <span [class.text-green-400]="e.hasLower" [class.text-red-400]="!e.hasLower">حرف صغير</span> •
                  <span [class.text-green-400]="e.hasDigit" [class.text-red-400]="!e.hasDigit">رقم</span> •
                  <span [class.text-green-400]="e.hasSpecial" [class.text-red-400]="!e.hasSpecial">رمز خاص !&#64;#$%^&*</span>
                </div>
              </ng-container>
            </div>
          </div>

          <div class="md:col-span-2">
            <button type="submit" [disabled]="loading" class="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white font-bold shadow-[0_10px_30px_rgba(220,38,38,0.35)] hover:from-red-600 hover:to-red-800 transition-all">
              {{ loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب' }}
            </button>
          </div>
        </form>

        <div class="text-center mt-6 text-sm text-gray-300 arabic-text">
          لديك حساب؟
          <a class="text-red-400 hover:text-red-300 font-semibold" [routerLink]="['/login']">تسجيل الدخول</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .arabic-text { font-family: 'Cairo', 'Amiri', 'Tajawal', 'Noto Sans Arabic', Arial, sans-serif; direction: rtl; }
  `]
})
export class SignUpComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordRulesValidator]],
    userName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    gender: [1, Validators.required],
  });

  loading = false;
  submitted = false;

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true;

    const payload: RegisterRequest = {
      ...this.form.value,
      userRole: 1,
    } as RegisterRequest;

    this.auth.register(payload).subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
      error: () => {
        this.loading = false;
        this.form.setErrors({ submit: true });
      }
    });
  }
}



import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VictimService, CreateVictimRequest } from '../../services/victim.service';

@Component({
  selector: 'app-victim-submit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="py-10 max-w-3xl mx-auto px-4">
      <h2 class="text-2xl font-semibold mb-6 text-white">Submit a Victim</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 glass-effect p-6 rounded-xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1">Name</label>
            <input class="w-full px-3 py-2 rounded bg-transparent border border-glass-border text-white" formControlName="name" />
            <p class="text-red-400 text-sm mt-1" *ngIf="submitted && form.controls.name.invalid">Name is required</p>
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1">English Name</label>
            <input class="w-full px-3 py-2 rounded bg-transparent border border-glass-border text-white" formControlName="enName" />
            <p class="text-red-400 text-sm mt-1" *ngIf="submitted && form.controls.enName.invalid">English name is required</p>
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1">Age</label>
            <input type="number" class="w-full px-3 py-2 rounded bg-transparent border border-glass-border text-white" formControlName="age" />
            <p class="text-red-400 text-sm mt-1" *ngIf="submitted && form.controls.age.invalid">Age must be between 0 and 120</p>
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1">Gender</label>
            <select class="w-full px-3 py-2 rounded bg-transparent border border-glass-border text-white" formControlName="gender">
              <option value="" disabled>Select gender</option>
              <option class="text-black" value="Male">Male</option>
              <option class="text-black" value="Female">Female</option>
              <option class="text-black" value="Other">Other</option>
            </select>
            <p class="text-red-400 text-sm mt-1" *ngIf="submitted && form.controls.gender.invalid">Gender is required</p>
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1">Event Date</label>
            <input type="date" class="w-full px-3 py-2 rounded bg-transparent border border-glass-border text-white" formControlName="eventDate" />
            <p class="text-red-400 text-sm mt-1" *ngIf="submitted && form.controls.eventDate.invalid">Event date is required</p>
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1">Governorate</label>
            <input class="w-full px-3 py-2 rounded bg-transparent border border-glass-border text-white" formControlName="governorate" />
            <p class="text-red-400 text-sm mt-1" *ngIf="submitted && form.controls.governorate.invalid">Governorate is required</p>
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1">District</label>
            <input class="w-full px-3 py-2 rounded bg-transparent border border-glass-border text-white" formControlName="district" />
            <p class="text-red-400 text-sm mt-1" *ngIf="submitted && form.controls.district.invalid">District is required</p>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm text-gray-300 mb-1">Source</label>
            <input class="w-full px-3 py-2 rounded bg-transparent border border-glass-border text-white" formControlName="source" />
            <p class="text-red-400 text-sm mt-1" *ngIf="submitted && form.controls.source.invalid">Source is required</p>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button type="submit" class="px-5 py-2 rounded bg-primary-red text-white disabled:opacity-60" [disabled]="loading">
            <span *ngIf="!loading">Submit</span>
            <span *ngIf="loading">Submitting...</span>
          </button>
          <span class="text-green-400" *ngIf="successMessage">{{ successMessage }}</span>
          <span class="text-red-400" *ngIf="errorMessage">{{ errorMessage }}</span>
        </div>
      </form>
    </section>
  `
})
export class VictimSubmitComponent {
  private readonly fb = inject(FormBuilder);
  private readonly victimService = inject(VictimService);
  private readonly router = inject(Router);

  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    enName: ['', [Validators.required, Validators.maxLength(200)]],
    age: [0, [Validators.required, Validators.min(0), Validators.max(120)]],
    gender: ['', [Validators.required]],
    eventDate: ['', [Validators.required]],
    governorate: ['', [Validators.required, Validators.maxLength(200)]],
    district: ['', [Validators.required, Validators.maxLength(200)]],
    source: ['', [Validators.required, Validators.maxLength(500)]],
  });

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.getRawValue();
    const payload: CreateVictimRequest = {
      name: formValue.name!,
      enName: formValue.enName!,
      age: Number(formValue.age),
      gender: formValue.gender!,
      eventDate: new Date(formValue.eventDate as string).toISOString(),
      governorate: formValue.governorate!,
      district: formValue.district!,
      source: formValue.source!,
    };
    this.loading = true;
    this.victimService.createVictim(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Submitted successfully. Pending review (<=24h).';
        this.form.reset();
        this.submitted = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Submission failed. Please try again.';
      }
    });
  }
}




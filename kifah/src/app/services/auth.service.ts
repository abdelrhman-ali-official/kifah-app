import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  [key: string]: unknown;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userName: string;
  phoneNumber: string;
  gender: 1 | 2;
  userRole: 1; // always 1 per requirements
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  // Use relative path to work with Angular dev-server proxy in development
  private readonly baseUrl = '/api/authentication';

  private readonly storageKeys = {
    token: 'auth_token',
    displayName: 'auth_displayName',
    email: 'auth_email',
  } as const;

  private readonly loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedInSubject.asObservable();

  private readonly userSubject = new BehaviorSubject<{ displayName: string | null; email: string | null }>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  login(payload: LoginRequest): Observable<LoginResponse> {
    const url = `${this.baseUrl}/Login`;
    return this.http.post<LoginResponse>(url, payload).pipe(
      tap((res) => {
        const token = (res as any)?.token as string | undefined;
        const displayName = (res as any)?.displayName as string | undefined;
        const email = (res as any)?.email as string | undefined;
        if (token) {
          localStorage.setItem(this.storageKeys.token, token);
        }
        if (displayName) {
          localStorage.setItem(this.storageKeys.displayName, displayName);
        }
        if (email) {
          localStorage.setItem(this.storageKeys.email, email);
        }
        this.loggedInSubject.next(this.hasToken());
        this.userSubject.next(this.getStoredUser());
      })
    );
  }

  register(payload: RegisterRequest): Observable<unknown> {
    const url = `${this.baseUrl}/Register`;
    return this.http.post(url, payload);
  }

  logout(): void {
    localStorage.removeItem(this.storageKeys.token);
    localStorage.removeItem(this.storageKeys.displayName);
    localStorage.removeItem(this.storageKeys.email);
    this.loggedInSubject.next(false);
    this.userSubject.next({ displayName: null, email: null });
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKeys.token);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.storageKeys.token);
  }

  private getStoredUser(): { displayName: string | null; email: string | null } {
    return {
      displayName: localStorage.getItem(this.storageKeys.displayName),
      email: localStorage.getItem(this.storageKeys.email),
    };
  }
}



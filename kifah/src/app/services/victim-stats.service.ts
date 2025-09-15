import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface GazaStats {
  killed: {
    total: number;
    children: number;
    women: number;
    press: number;
    medical: number;
  };
  injured: {
    total: number;
  };
  massacres: number;
}

export interface VictimStatsData {
  gaza: GazaStats;
}

@Injectable({
  providedIn: 'root'
})
export class VictimStatsService {
  // Use environment configuration for API URL
  private apiUrl = `${environment.techForPalestine.baseUrl}/summary.min.json`;

  constructor(private http: HttpClient) { }

  getVictimStats(): Observable<VictimStatsData> {
    console.log('VictimStatsService - Environment:', environment.production ? 'production' : 'development');
    console.log('VictimStatsService - API URL:', this.apiUrl);
    
    return this.http.get<VictimStatsData>(this.apiUrl)
      .pipe(
        retry(2), // Retry up to 2 times on failure
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}



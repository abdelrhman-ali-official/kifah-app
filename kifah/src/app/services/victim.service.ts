import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Victim {
  id: number;
  name: string;
  enName: string;
  age: number | null;
  gender: string | null;
  eventDate: string | null;
  governorate?: string | null;
  district?: string | null;
  source?: string | null;
}

export interface VictimsResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: Victim[];
}

export interface VictimQuery {
  PageIndex: number;
  PageSize: number;
  Governorate?: string;
  Gender?: string;
  StartDate?: string; // ISO
  EndDate?: string;   // ISO
  Name?: string;
  Sort?: string;
}

export enum SubmissionStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3
}

export interface CreateVictimRequest {
  name: string;
  enName: string;
  age: number;
  gender: string;
  eventDate: string; // ISO string
  governorate: string;
  district: string;
  source: string;
}

export interface MyVictim extends Victim {
  submissionStatus: SubmissionStatus;
}

export interface MyVictimsResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: MyVictim[];
}

@Injectable({ providedIn: 'root' })
export class VictimService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/victims'; // proxied to https://kifah.runasp.net

  getVictims(params: VictimQuery): Observable<VictimsResponse> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).length > 0) {
        httpParams = httpParams.set(key, String(value));
      }
    });
    
    console.log('VictimService - Making API call with params:', params);
    console.log('VictimService - HTTP params:', httpParams.toString());
    console.log('VictimService - Full URL would be:', `${this.baseUrl}?${httpParams.toString()}`);
    
    return this.http.get<VictimsResponse>(this.baseUrl, { params: httpParams });
  }

  // Add a method to get all victims without pagination
  getAllVictimsDebug(): Observable<VictimsResponse> {
    console.log('VictimService - Making API call without any parameters...');
    return this.http.get<VictimsResponse>(this.baseUrl);
  }

  getVictimById(id: number): Observable<Victim> {
    console.log('Making API call to:', `${this.baseUrl}/${id}`);
    
    // First try the direct endpoint
    return this.http.get<Victim>(`${this.baseUrl}/${id}`).pipe(
      // If that fails, try to find the victim in the search results
      catchError((error) => {
        console.log('Direct endpoint failed, trying search approach:', error);
        
        // Search for the victim by ID in the search results
        // This is a fallback in case the direct endpoint doesn't exist
        return this.getVictims({ PageIndex: 1, PageSize: 1000 }).pipe(
          map((response) => {
            const victim = response.data.find(v => v.id === id);
            if (victim) {
              return victim;
            } else {
              throw new Error(`Victim with ID ${id} not found`);
            }
          })
        );
      })
    );
  }

  // Authenticated: create a new victim submission
  createVictim(payload: CreateVictimRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.baseUrl, payload);
  }

  // Authenticated: get current user's submitted victims (paginated)
  getMyVictims(pageIndex: number, pageSize: number): Observable<MyVictimsResponse> {
    let params = new HttpParams()
      .set('pageIndex', String(pageIndex))
      .set('pageSize', String(pageSize));
    return this.http.get<MyVictimsResponse>(`${this.baseUrl}/mine`, { params });
  }
}



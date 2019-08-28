import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from './candidates';
import { Contest } from './contests';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiURL = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  getContestants(id: number): Observable<Candidate[]> {
    return this.httpClient.get<Candidate[]>(this.apiURL + '/comments');
  }

  getContests(): Observable<Contest[]> {
    return this.httpClient.get<Contest[]>(this.apiURL + '/posts');
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from './candidates';
import { Contest } from './contests';
import { ServerResponse2 } from './serverResponse2';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiURL = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  getContestants(id: number): Observable<Candidate[]> {
    return this.httpClient.get<Candidate[]>(this.apiURL + '/Scene1/' + id);
  }

  getContests(): Observable<Contest[]> {
    return this.httpClient.get<Contest[]>(this.apiURL + '/listOfContest');
  }

  getProblems(): Observable<{ pID: number[] }> {
    return this.httpClient.get<{ pID: number[] }>(this.apiURL + '/posts');
  }

  getAllChartData(pID: number): Observable<ServerResponse2> {
    return this.httpClient.get<ServerResponse2>((this.apiURL + '/profile'));
  }

}

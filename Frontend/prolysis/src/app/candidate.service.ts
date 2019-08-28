import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponse } from './response';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private baseURL = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  getCandidateInfo(uID: number, cID: number): Observable<ServerResponse> {
    return this.httpClient.get<ServerResponse>((this.baseURL + '/Scene1/' + cID + '/' + uID));
  }
}

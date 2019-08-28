import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Contest } from '../contests';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Candidate } from '../candidates';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private dashboardService: DashboardService) { }

  refreshing = false;
  loading = false;
  myControl = new FormControl();
  filteredOptions: Observable<Contest[]>;
  contestList: Contest[] = [];
  candidatesList: Candidate[] = [];
  currentContestid: number;
  userName: string;

  private _filter(name: string): Contest[] {
    const filterValue = name.toLowerCase();
    return this.contestList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
    localStorage.setItem('userName', 'Admin');
    this.userName = localStorage.getItem('userName');
    this.currentContestid = +this.route.snapshot.paramMap.get('id');
    this.dashboardService.getContests().subscribe((contestArray) => {
      for (const contest of contestArray) {
        this.contestList.push({ name: contest.name, id: contest.id });
      }
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith<string | Contest>(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name) : this.contestList.slice())
        );
      this.myControl.enable();
      if (this.currentContestid !== 0) {
        this.myControl.setValue(
          { name: this.contestList.filter(conti => conti.id === this.currentContestid)[0].name, id: this.currentContestid }
        );
        this.mainFunction(this.currentContestid);
      }
    });
  }

  displayFn(cont: Contest): string | undefined {
    return cont ? cont.name : undefined;
  }

  fetchCandidates(id: number) {
    // fetch for particular contestID
    this.dashboardService.getContestants(id).subscribe((data) => {
      this.candidatesList = data;
      this.loading = false;
    });
  }

  mainFunction(id: number) {
    this.router.navigate(['/contest', id]);
    this.loading = true;
    this.fetchCandidates(id);
  }

}

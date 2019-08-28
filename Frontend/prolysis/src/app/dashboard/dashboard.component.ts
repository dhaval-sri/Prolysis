import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Contest } from '../contests';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Candidate } from '../candidates';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  refreshing = false;
  loading = false;
  myControl = new FormControl();
  filteredOptions: Observable<Contest[]>;
  contestList: Contest[] = [];
  candidatesList: Candidate[] = [];
  currentContestid: number;

  private _filter(name: string): Contest[] {
    const filterValue = name.toLowerCase();
    return this.contestList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
    this.currentContestid = +this.route.snapshot.paramMap.get('id');
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | Contest>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.contestList.slice())
      );
    this.contestList.push({ name: 'Contest 1', id: 1 });
    this.contestList.push({ name: 'Contest 2', id: 2 });
    // this.myControl.disable();
    // this.fetchJnc.getLocations().subscribe(data => {
    //   data.forEach((i) => this.intersectionList.push({ name: i.name, id: i.JID }));

    this.myControl.enable();
    // this.myControl.setValue({ name: 'Contest 1', id: 1 });
    //   this.myControl.setValue({ name: data.filter(inter => inter.JID === this.id)[0].name, id: this.id });
    // });
    if (this.currentContestid !== 0) {
      this.myControl.setValue(
        { name: this.contestList.filter(conti => conti.id === this.currentContestid)[0].name, id: this.currentContestid }
      );
      this.mainFunction(this.currentContestid);
    }
  }

  displayFn(cont: Contest): string | undefined {
    return cont ? cont.name : undefined;
  }

  fetchCandidates(id: number) {
    // fetch for particular contestID
    this.candidatesList = [{ name: 'Dhaval', id: 1 }, { name: 'Bharat', id: 2 }, { name: 'Inderdeep', id: 3 }];
    this.loading = false;
  }

  mainFunction(id: number) {
    this.router.navigate(['/contest', id]);
    this.loading = true;
    this.fetchCandidates(id);
  }

}

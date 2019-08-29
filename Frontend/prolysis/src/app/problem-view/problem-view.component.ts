import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { ServerResponse2 } from '../serverResponse2';
import regression from 'regression';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Problem } from '../candidate-view/candidate-view.component';

@Component({
  selector: 'app-problem-view',
  templateUrl: './problem-view.component.html',
  styleUrls: ['./problem-view.component.css']
})
export class ProblemViewComponent implements OnInit {

  constructor(private dashboardService: DashboardService, private route: ActivatedRoute, private router: Router) { }

  refreshing = false;
  loading = false;
  myControl = new FormControl();
  filteredOptions: Observable<{ name: string, value: number }[]>;
  problemList: { name: string, value: number }[] = [];
  currentProblemid: number;
  userName = 'Admin';

  serverResponse2: ServerResponse2;

  problemsArray: Problem[] = [];
  lineChartData: ChartDataSets[][] = [];
  pointsArray: number[][][] = [];
  lineChartLabels: Label[] = ['0', '50%', '100%'];
  lineChartLabelsArray: Label[][] = [];
  chartOptionsArray: ChartOptions[] = [];
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true, aspectRatio: 1,
    elements: { line: { tension: 0 } },
    scales: {
      xAxes: [{ ticks: { beginAtZero: true }, scaleLabel: { display: true, labelString: 'Time' } }],
      yAxes: [{ ticks: { beginAtZero: true }, scaleLabel: { display: true, labelString: 'Execution Time' } }]
    }
  };

  private _filter(name: string): { name: string, value: number }[] {
    const filterValue = name.toLowerCase();
    return this.problemList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
    this.dashboardService.getProblems().subscribe((data) => {
      for (const d of data.pID) {
        this.problemList.push({ name: `Problem ${d}`, value: d });
      }
      console.log(this.problemList);
      this.currentProblemid = +this.route.snapshot.paramMap.get('id');
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith<string | { name: string, value: number }>(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name) : this.problemList.slice())
        );
      this.myControl.enable();
      if (this.currentProblemid !== 0) {
        this.myControl.setValue(
          { name: this.problemList.filter(conti => conti.value === this.currentProblemid)[0].name, id: this.currentProblemid }
        );
      }
    });
  }

  getCoordinates(data: number[][]) {
    const arr: number[][] = [];
    for (let index = 0; index < data.length; index++) {
      for (const itr of data[index]) {
        if (itr !== -1) {
          arr.push([index, itr]);
        }
      }
    }
    return arr;
  }

  genArray() {
    const bArray: number[][] = [];
    for (const points of this.pointsArray) {
      const arr = [];
      for (const smallarray of points) {
        arr.push(smallarray[1]);
      }
      bArray.push(arr);
    }
    let i = 0;
    for (const arr of bArray) {
      const linechart: ChartDataSets = ({ data: arr, fill: false, label: 'Performance' });
      this.lineChartData[i].unshift(linechart);
      ++i;
    }
  }

  removeDuplicates(k: number) {
    let n1: number[] = this.pointsArray[k][0];
    for (let i = 1; i < this.pointsArray[k].length; i++) {
      if (n1[0] === this.pointsArray[k][i][0]) {
        this.pointsArray[k].splice(i, i);
        i--;
      } else {
        n1 = this.pointsArray[k][i];
      }
    }
  }


  setRegressionLines() {
    let i = 0;
    for (const data of this.serverResponse2.data) {
      const result = regression.linear(this.getCoordinates(data.data));
      this.pointsArray[i] = result.points;
      this.removeDuplicates(i);
      ++i;
    }
  }

  setLabelArray() {
    for (const problem of this.problemsArray) {
      this.lineChartLabelsArray.push(Array.from({ length: problem.attempts }, (v, i) => i).map(e => e.toString()));
    }
  }

  testCasesPassed(num: number[]): number {
    let count = 0;
    num.forEach((val) => { if (val !== -1) { count++; } });
    return count;
  }

  populateProblemArray() {
    for (const data of this.serverResponse2.data) {
      this.problemsArray.push(
        {
          pID: data.cID, passT: this.testCasesPassed(data.data[data.data.length - 1]),
          totalT: data.data[0].length, attempts: data.data.length
        }
      );
    }
  }

  setChartOptions() {
    for (const data of this.serverResponse2.data) {
      this.chartOptionsArray.push(
        {
          responsive: true,
          maintainAspectRatio: true, aspectRatio: 1,
          elements: { line: { tension: 0 } },
          scales: {
            xAxes: [{ ticks: { beginAtZero: true }, scaleLabel: { display: true, labelString: data.x } }],
            yAxes: [{ ticks: { beginAtZero: true }, scaleLabel: { display: true, labelString: data.y } }]
          },
          title: {
            text: `Problem ${data.uName}`,
            display: true,
            position: 'bottom'
          }
        }
      );
    }
  }

  setChartData() {
    // tslint:disable-next-line: prefer-for-of
    for (let k = 0; k < this.serverResponse2.data.length; k++) {
      const linechart: ChartDataSets[] = [];
      const dataT = this.serverResponse2.data[k].data[0].map((col, i) => this.serverResponse2.data[k].data.map(row => row[i]));
      let j = 1;
      dataT.forEach(element => {
        element = element.map(e => {
          if (e !== -1) {
            return e;
          } else {
            return null;
          }
        });
        linechart.push({ data: element, fill: false, label: 'Test Case ' + j++ });
      });
      this.lineChartData.push(linechart);
    }
  }

  fetchAllCharts(id: number) {
    this.dashboardService.getAllChartData(id).subscribe((data) => {
      this.serverResponse2 = data;
      console.log(this.serverResponse2);

      this.setChartData();
      console.log(this.lineChartData);

      this.setChartOptions();
      console.log(this.chartOptionsArray);

      this.populateProblemArray();
      console.log(this.problemsArray);

      this.setLabelArray();
      console.log(this.lineChartLabelsArray);

      this.setRegressionLines();
      console.log(this.pointsArray);

      this.genArray();
      console.log(this.lineChartData);

      this.loading = false;
    }
    );
  }


  mainFunction(id: number) {
    console.log(id);

    // this.router.navigate(['/problem', id]);
    this.loading = true;
    this.fetchAllCharts(id);
  }

  displayFn(cont: { name: string, value: number }): string | undefined {
    return cont ? cont.name : undefined;
  }


}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from '../candidates';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ServerResponse } from '../response';
import regression from 'regression';
import { CandidateService } from '../candidate.service';

export interface Problem {
  pID: number;
  passT: number;
  totalT: number;
  attempts: number;
}


@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.css']
})
export class CandidateViewComponent implements OnInit {

  constructor(private route: ActivatedRoute, private cService: CandidateService) { }

  candidate: Candidate = { uName: null, uID: null, uEmail: null };

  // serverResponse: ServerResponse =
  //   {
  //     uName: 'Dhaval', contestID: 1, uID: 12, uEmail: 'dhaval@teksystems.com',
  //     data: [
  //       {
  //         pID: 1, x: 'Attempts', y: 'Execution Time', data: [[5, 2, 3, -1], [2, 2, 1, 3], [1, 1, 1, 1]]
  //       },
  //       {
  //         pID: 2, x: 'Attempts', y: 'Execution Time', data: [[6, 4, 3, 2], [1, 0, 0.8, 1.6]]
  //       }, {
  //         pID: 3, x: 'Attempts', y: 'Execution Time', data: [[10, 8, 3, -1], [6, 2, 1, 3], [2, 1, 1, 3]]
  //       },
  //       {
  //         pID: 5, x: 'Attempts', y: 'Execution Time', data: [[1, 1, 1, 1], [2, 2, 1, 3], [5, 2, 3, -1]]
  //       },
  //       {
  //         pID: 6, x: 'Attempts', y: 'Execution Time', data: [[1, 0, 0.8, 1.6], [6, 4, 3, 2]]
  //       }
  //     ]
  //   };
  serverResponse: ServerResponse;
  loading = true;
  cID: number;
  problemsArray: Problem[] = [];
  lineChartData: ChartDataSets[][] = [];
  pointsArray: number[][][] = [];
  // lineChartDataOG: ChartDataSets[] = [
  //   { data: [1, 1, 0.1], fill: false, label: 'Test Case 1' },
  //   { data: [2, 2, 1.9], fill: false, label: 'Test Case 2' },
  //   { data: [1, 3, 1.1], fill: false, label: 'Test Case 3' },
  //   { data: [null, 4, 2], fill: false, label: 'Test Case 4' }
  // ];
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

  testCasesPassed(num: number[]): number {
    let count = 0;
    num.forEach((val) => { if (val !== -1) { count++; } });
    return count;
  }

  populateProblemArray() {
    for (const data of this.serverResponse.data) {
      this.problemsArray.push(
        {
          pID: data.pID, passT: this.testCasesPassed(data.data[data.data.length - 1]),
          totalT: data.data[0].length, attempts: data.data.length
        }
      );
    }
  }

  setChartOptions() {
    for (const data of this.serverResponse.data) {
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
            text: `Problem ${data.pID}`,
            display: true,
            position: 'bottom'
          }
        }
      );
    }
  }

  setLabelArray() {
    for (const problem of this.problemsArray) {
      this.lineChartLabelsArray.push(Array.from({ length: problem.attempts }, (v, i) => i).map(e => e.toString()));
    }
  }

  setChartData() {
    // tslint:disable-next-line: prefer-for-of
    for (let k = 0; k < this.serverResponse.data.length; k++) {
      const linechart: ChartDataSets[] = [];
      const dataT = this.serverResponse.data[k].data[0].map((col, i) => this.serverResponse.data[k].data.map(row => row[i]));
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

  fetchCandiDetails(id: number) {
    this.cService.getCandidateInfo(id, this.cID).subscribe((data) => {
      this.serverResponse = data;
      // this.candidate = { name: 'Dhaval', id, email: 'dhaval@tek.com' };
      this.candidate = { uName: this.serverResponse.uName, uID: id, uEmail: this.serverResponse.uEmail };
      this.setChartData();
      this.setChartOptions();
      this.populateProblemArray();
      this.setLabelArray();
      this.setRegressionLines();
      this.genArray();
      this.loading = false;
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

  setRegressionLines() {
    let i = 0;
    for (const data of this.serverResponse.data) {
      const result = regression.linear(this.getCoordinates(data.data));
      this.pointsArray[i] = result.points;
      this.removeDuplicates(i);
      ++i;
    }
  }

  ngOnInit() {
    this.candidate.uID = +this.route.snapshot.paramMap.get('uid');
    this.cID = +this.route.snapshot.paramMap.get('cid');
    this.fetchCandiDetails(this.candidate.uID);
  }
}

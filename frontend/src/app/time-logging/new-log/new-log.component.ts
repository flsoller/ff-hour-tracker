import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-log',
  templateUrl: './new-log.component.html',
  styleUrls: ['./new-log.component.scss'],
})
export class NewLogComponent implements OnInit {
  list = ['Some Name', 'Some A. Name', 'James Smith', 'Carry Grant'];

  constructor() {}

  ngOnInit(): void {}
}

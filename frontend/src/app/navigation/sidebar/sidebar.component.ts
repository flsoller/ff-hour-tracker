import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faUsers,
  faBox,
  faTools,
  faUserClock,
  faFileInvoice,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  faUsers = faUsers;
  faBox = faBox;
  faTools = faTools;
  faUserClock = faUserClock;
  faFileInvoice = faFileInvoice;

  constructor(public router: Router) {}

  ngOnInit(): void {}
}

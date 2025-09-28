import { Component, viewChild } from '@angular/core';
import { StatusBannerComponent } from './components/status-banner/status-banner';

@Component({
  selector: 'app-tasks',
  imports: [StatusBannerComponent],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  statusBanner = viewChild.required(StatusBannerComponent);

  showBanner() {
    this.statusBanner().show('操作成功！');
  }
}
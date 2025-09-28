import { Component, viewChild } from '@angular/core';
import { StatusBannerComponent } from './components/status-banner/status-banner';

@Component({
  selector: 'app-tasks',
  imports: [StatusBannerComponent],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  // TODO: Lab 4 - 1. 使用 viewChild 取得 StatusBannerComponent 的參考

  showBanner() {
    // TODO: Lab 4 - 2. 呼叫 statusBanner 的 show 方法
  }
}

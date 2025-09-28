import { Component, signal, computed } from '@angular/core';

// TODO: [Lab 2] 從 @angular/core 引入 linkedSignal

type UserLevel = 'standard' | 'gold' | 'platinum';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  readonly userLevel = signal<UserLevel>('standard');
  readonly cartTotal = signal(100);

  // TODO: [Lab 2] 改用 linkedSignal 建立 discountCode，讓我們可以自己輸入優惠碼
  readonly discountCode = computed(() => {
    const level = this.userLevel();
    if (level === 'platinum') {
      return 'PLATINUM20';
    }
    if (level === 'gold') {
      return 'GOLD10';
    }
    return 'WELCOME5';
  });

  readonly finalPrice = computed(() => {
    const total = this.cartTotal();
    const code = this.discountCode();
    if (code === 'GOLD10') {
      return total * 0.9;
    }
    if (code === 'PLATINUM20') {
      return total * 0.8;
    }
    if (code === 'WELCOME5') {
      return total - 5;
    }
    if (code === 'HELLOWORLD') {
      return total - 3;
    }
    return total;
  });

  setUserLevel(level: UserLevel) {
    this.userLevel.set(level);
  }

  onCodeInput(code: string) {
    // TODO: [Lab 2] 手動設定 discountCode 的值
    // this.discountCode.set(code);
  }
}

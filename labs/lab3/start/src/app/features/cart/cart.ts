import { Component, signal, computed, linkedSignal } from '@angular/core';

// TODO: Lab 3 - 學習目標：
// 1. 將「結帳資訊」的 HTML 移至 checkout-summary 元件，並用 <app-checkout-summary> 取代。
// 2. 使用 input() 將 finalPrice 傳入子元件。
// 3. 使用 model() 來同步 discountCode，並移除 onCodeInput()。
// 4. 使用 output() 讓子元件可以通知父元件重設折扣碼。

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

  readonly discountCode = linkedSignal<string>(() => {
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
    this.discountCode.set(code);
  }

  onDiscountReset() {
    this.userLevel.set('standard');
  }
}
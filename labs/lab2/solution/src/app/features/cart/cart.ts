import { Component, signal, computed, linkedSignal } from '@angular/core';

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
}
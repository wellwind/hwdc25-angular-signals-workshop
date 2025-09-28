import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-checkout-summary',
  imports: [],
  templateUrl: './checkout-summary.html',
  styleUrl: './checkout-summary.css',
})
export class CheckoutSummaryComponent {
  finalPrice = input.required<number>();
  discountCode = model.required<string>();
  reset = output<void>();

  onResetClick() {
    this.reset.emit();
  }
}


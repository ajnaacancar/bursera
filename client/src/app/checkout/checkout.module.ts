import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CheckoutRoutingModule } from './checkout-routing.module';
import {SharedModule} from '../shared/shared.module';
import { ChecoutPaymentComponent } from './checout-payment/checout-payment.component';
import { ChecoutSuccessComponent } from './checout-success/checout-success.component';
import { ChecoutAddressComponent } from './checout-address/checout-address.component';
import { CheckoutReviewComponent } from './checout-review/checout-review.component';


@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutReviewComponent,
    ChecoutPaymentComponent,
    ChecoutSuccessComponent,
    ChecoutAddressComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    SharedModule
  ]
})
export class CheckoutModule { }

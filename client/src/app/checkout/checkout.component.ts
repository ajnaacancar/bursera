import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { IBasket, IBasketTotals } from '../shared/models/basket';
import { CheckoutService } from './checkout.service';
declare var paypal

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  basketTotals$: Observable<IBasketTotals>;
  paymentCheck = false
  constructor(private fb: FormBuilder, private checkoutService: CheckoutService,  private accountService: AccountService, private basketService: BasketService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.loadPayPal()
    this.basketTotals$ = this.basketService.basketTotal$;
  }

  loadPayPal(){
    let  total =  this.basketService.calculatedTotals()
     paypal.Buttons({
       style:{
         layout: 'horizontal',
         color: 'blue',
         label: 'paypal'
       },
       createOrder: function (data, actions) {
         return actions.order.create({
           purchase_units: [
             {
               amount: {
                 value: total,
               },
             },
           ],
         });
       },
      onApprove: function (data, actions) {
      console.log("Transacion succeeded")
         return actions.order.capture();
       },
     
       onError: function (data, actions) {
        console.log("Transacion faild")
           return actions.order.capture();
         },
 
     }).render('#paypal')
   }
   private async createOrderS(basket: IBasket) {
    const orderToCreate = this.getOrderToCreate(basket)
   return this.checkoutService.createOrder(orderToCreate).toPromise();
 
  }
  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    })
  }

  getAddressFormValues() {
    this.accountService.getUserAddress().subscribe(address => {
      if (address) {
        this.checkoutForm.get('addressForm').patchValue(address);
      }
    }, error => {
      console.log(error);
    })
  }
  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      address: this.checkoutForm.get('addressForm').value
    }
  }

}
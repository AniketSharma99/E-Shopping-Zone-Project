import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemModel } from '../models/item-model';
import { CartService } from '../services/cart.service';
import { CatalogService } from '../services/catalog.service';
import { OrderService } from '../services/order.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public userId= -1;
  public name= '';
  public cart: any;
  public items: ItemModel[]=[];
  public cartItems=0;
  public itemsExist: any;
  constructor(private router: Router, private route: ActivatedRoute, private catalogService: CatalogService, private cartService: CartService, private orderService: OrderService) { }
  

  ngOnInit(): void {
    this.userId= parseInt(sessionStorage.getItem('userId') || '-1');
    this.name= sessionStorage.getItem('name') || '';
    console.log(this.userId);
    
    this.cartService.getCart(this.userId).subscribe(data =>{
      this.cart=data;
      console.log(this.cart);
    });

    this.cartService.getItems(this.userId).subscribe(data=>{
      this.items=data;
      console.log(this.items);
    });

    this.cartService.cartItems(this.userId).subscribe(data=>{
      this.cartItems=Number(data);
      if(this.cartItems>0)
        this.itemsExist=true;
      });
  }

  addToCart(item: ItemModel){
    this.cartService.addToCart(this.userId, item.id).subscribe();
    for(let _item of this.items){
      if(_item.id==item.id){
        _item.quantity++;
        this.catalogService.getProduct(item.id).subscribe(data=>{
          _item.price+= data.price;
          this.cart.total+= data.price;
        });
      }
    }
    console.log(this.cart.items);
    
  }

  removeFromCart(item: ItemModel){
    this.cartService.removeFromCart(this.userId, item.id).subscribe();
    for(let _item of this.items){
      if(_item.id==item.id){
        _item.quantity--;
        this.catalogService.getProduct(item.id).subscribe(data=>{
          _item.price-= data.price;
          this.cart.total-= data.price;
        });
      }
    }
    console.log(this.cart.items);
    
  }

  checkOut(){
    console.log(this.cart.items);
    let order: any;
    this.cartService.getCart(this.userId).subscribe(data =>{
      this.cart=data;
      console.log(this.cart);
      order={
        id: -1,
        customerId: this.userId,
        amount: this.cart.total,
        items: this.cart.items,
        date: null,
        status: "Payment Successfull"
      };
      this.cartService.clearCart(this.userId).subscribe(); // for clear the cart
    this.orderService.checkOut(order).subscribe(data=> this.router.navigate(['/order', '-1']));
    });
    

  }
  //G-PAY PAYMENT
  paymentRequest: google.payments.api.PaymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD']
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example',
            gatewayMerchantId: 'exampleGatewayMerchantId'
          }
        }
      }
    ],
    merchantInfo: {
      merchantId: '12345678901234567890',
      merchantName: 'Demo Merchant'
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: '48999',
      currencyCode: 'INR',
      countryCode: 'IN'
    },
    callbackIntents: ['PAYMENT_AUTHORIZATION']
  };

  onLoadPaymentData = (
    event: Event
  ): void => {
    const eventDetail = event as CustomEvent<google.payments.api.PaymentData>;
    console.log('load payment data', eventDetail.detail);
  }

  onPaymentDataAuthorized: google.payments.api.PaymentAuthorizedHandler = (
    paymentData
    ) => {
      console.log('payment authorized', paymentData);
      return {
        transactionState: 'SUCCESS'
      };
    }

  onError = (event: ErrorEvent): void => {
    console.error('error', event.error);
  }



}

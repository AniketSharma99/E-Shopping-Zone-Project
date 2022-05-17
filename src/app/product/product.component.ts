import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { CatalogService } from '../services/catalog.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public id: any;
  public product: any;
  public isLoggedIn= false;
  public name='';
  public userId=-1;
  public cartItems=0;
  cart: any;
  orderService: any;
  constructor(private router: Router, private authService: AuthService,private catalogService: CatalogService, private cartService: CartService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => this.id= parseInt(params.get('id') || '-1'));
    this.catalogService.getProduct(this.id).subscribe(product => {
      this.product=product
    });
    this.isLoggedIn= this.authService.isLoggedIn();
    this.name=sessionStorage.getItem('name') || '';
    this.userId= parseInt(sessionStorage.getItem('userId') || '-1');
    this.cartService.cartItems(this.userId).subscribe(data=> this.cartItems=Number(data));
  }

 
  addToCart(){
    if(this.isLoggedIn){
      Swal.fire({
        title: 'Product Added to Cart!',
        text: '',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
      if(this.isLoggedIn)
      this.cartService.addToCart(this.userId, this.product.id).subscribe(data=>{
          this.cartItems++
      });
      else
      this.router.navigate(['login']);
    }})
  }else{
    Swal.fire({
      title: 'Please Login to proceed!',
      text: '',
      icon: 'error',
      showCancelButton: false,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.value) {
    if(this.isLoggedIn)
    this.cartService.addToCart(this.userId, this.product.id).subscribe(data=>{
        this.cartItems++
    });
    else
    this.router.navigate(['login']);
  }})
  
  }
  
  }
  
    
  }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CatalogService } from '../services/catalog.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  userId=-1;
  name='';
  cartItems=0;
  categories=["Electronics", "Clothing", "Sports"];
//adding valodator
  productForm= this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', [Validators.required]],
    price: ['', [Validators.required]],
    imagesource: ['', [Validators.required]],
    image: [''],
    description: ['']
  });

  constructor(public cartService: CartService, public fb: FormBuilder, public catalogService: CatalogService, public router: Router) { }
//from session stroage it will fectch the name and id
  ngOnInit(): void {
    this.name= sessionStorage.getItem('name') || '';
    this.userId=parseInt(sessionStorage.getItem('userId') || '-1');
    this.cartService.cartItems(this.userId).subscribe(data=> this.cartItems=Number(data));
  }

  addNewProduct(){
    let {imagesource, ...product}= this.productForm.value;
    console.log(product);
    
    this.catalogService.addProduct(product).subscribe(()=>this.router.navigate(['']));
  }

  onFileUpload(event: any){ // this is for uploading the image for catalog
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
     
        this.productForm.patchValue({
          image: reader.result
        });
   
      };
   
    }
  }

}

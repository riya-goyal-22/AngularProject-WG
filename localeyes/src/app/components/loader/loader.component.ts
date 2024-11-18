import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  isLoading: boolean = false;
  subscription: Subscription = new Subscription();
  dataService = inject(DataService);

  ngOnInit() {
    console.log("loader initialized")
    this.subscription = this.dataService.loader$.subscribe(
      (value: boolean) => {
        this.isLoading = value
      }
    )
  }

  ngOnDestroy() {
    console.log("loader completed")
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
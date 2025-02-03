import { Component, signal } from '@angular/core';
import { TwoWayComponent } from "../two-way/two-way.component";

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [TwoWayComponent],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.css'
})
export class ParentComponent {
  parentValue : number = 0 

  increment(){
    this.parentValue = this.parentValue+1
  }
}

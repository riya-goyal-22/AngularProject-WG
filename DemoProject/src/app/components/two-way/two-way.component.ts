import { Component, model } from '@angular/core';

@Component({
  selector: 'app-two-way',
  standalone: true,
  imports: [],
  templateUrl: './two-way.component.html',
  styleUrl: './two-way.component.css'
})
export class TwoWayComponent {
  value = model<number>(0)
  
  increment(){
    let value = this.value()
    this.value.set(value+1)
  }
}

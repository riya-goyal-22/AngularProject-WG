import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  options = [
    { label: 'View Profile', value: 1 },
    { label: 'My Posts', value: 2 }
  ];
  selectedOption: Number|null = null
  iconClick() {

  }
}

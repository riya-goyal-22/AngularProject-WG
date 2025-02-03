import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {
  form:FormGroup = new FormGroup({
    name: new FormControl('',Validators.required),
    email: new FormControl('',[Validators.email,Validators.required]),
    favColor: new FormArray([
      new FormControl<boolean>(false),
      new FormControl<boolean>(false),
      new FormControl<boolean>(false)])
  })

  submit(){
    console.log(this.form)
    if(this.form.valid){
      console.log('happy way')
      console.log(this.form)
    }
  }
}

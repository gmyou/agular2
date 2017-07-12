import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  info = {
    age: '47',
    mobile: '010-2762-5806',
    email: 'gmyou71@gmail.com',
    homepage: 'https://github.com/gmyou',
    address: '경기 고양시 덕양구 성사2동',
  };
}

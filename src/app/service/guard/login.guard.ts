import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  canActivate(){
    return new Observable<boolean>((subscriptor) => {
      let user = JSON.parse(localStorage.getItem("user")!);
      if(!user){
        subscriptor.next(true);
      }else{
        this.router.navigate(['/dashboard']);
        subscriptor.next(false);
      }
    });
  }

}

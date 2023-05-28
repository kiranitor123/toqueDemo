import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  resetPasswrodForm!: FormGroup;
  loginErrorMsg = false;
  loginTextMsg = '';
  hide = true;
  modal = false;
  emailRecovery: string = '';
  msgRestartting: boolean;
  success = true;
  textMsg = '';

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private authService: AuthService
  ) {
    this.msgRestartting = false;
  }

  ngOnInit(): void {
    this.initialForm();
  }

  initialForm() {
    this.formGroup = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required]],
    });

    this.resetPasswrodForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });
  }

  async logIn() {
    if (this.formGroup.valid) {
      this.loading = true;
      let sub = this.authService
        .loginUser(this.formGroup.value.username, this.formGroup.value.password)
        .subscribe(
          (data) => {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem(
              'token',
              data.token.accessToken
            );

            this.loading = false;
            this.formGroup.reset();
            this.route.navigate(['/dashboard']);
            sub.unsubscribe();
          },
          (error) => {
            this.loading = false;
            this.loginErrorMsg = true;
            this.loginTextMsg = error.message;
            console.log('Errro-> ', error);
            sub.unsubscribe();
          }
        );
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  openModal() {
    this.modal = true;
  }

  closeModal() {
    this.modal = false;
    this.msgRestartting = false;
    this.emailRecovery = '';
    this.ngOnInit();
  }

  async sendEmail() {
    if (this.resetPasswrodForm.valid) {
      let sub = this.authService.resetPassword(this.email?.value).subscribe(
        (result) => {
          this.textMsg = result.message;
          this.msgRestartting = true;
          this.success = true;
          this.closeModal();
          sub.unsubscribe();
        },
        (error) => {
          console.error('Error resetting the email component -> ', error);
          this.textMsg = error.message;
          this.msgRestartting = true;
          this.success = false;
          sub.unsubscribe();
        }
      );
    } else {
      this.resetPasswrodForm.markAllAsTouched();
    }
  }

  get username() {
    return this.formGroup.get('username');
  }

  get password() {
    return this.formGroup.get('password');
  }

  get email() {
    return this.resetPasswrodForm.get('email');
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);
  protected creds: any = {};

  login() {
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.toast.success('Logged in successfully.')
        this.creds = {};
      },
      error: error => {
        let message = '';
        if (error.error?.errors) {
          const errorsObj = error.error.errors;
          const allErrors = Object.values(errorsObj).flat();
          message = allErrors.join('<br>');
        }
        else if (typeof error.error === 'string') {
          message = error.error;
        }
        else {
          message = "Something went wrong";
        }
        this.toast.error(message);
      }
    });
  }

  logout() {
    this.accountService.logOut();
    this.router.navigateByUrl('/');
  }
}

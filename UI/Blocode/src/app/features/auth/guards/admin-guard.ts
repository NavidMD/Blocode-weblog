import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastrService);

  //اول صبر میکنیم نتیجه این بخش مشخص شه
  await authService.checkAuth()

  const user = authService.loggedUser();

  if (!user) {
    router.navigate(['/login']);
    toastService.error(`ابتدا وارد حساب کاربری شوید`, '', {
      progressBar: true,
      timeOut: 3000,
    });
    return false;
  } else {
    const userIsWriter = user?.roles.includes("Writer");
    if (!userIsWriter) {
      toastService.error(`این بخش مخصوص نویسندگان است!`, '', {
        progressBar: true,
        timeOut: 3000,
      });
      return false;
    }
    return true;
  }
};

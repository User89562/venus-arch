import { ActivatedRouteSnapshot, CanActivateFn,  RouterStateSnapshot, createUrlTreeFromSnapshot } from '@angular/router';
import { LoginUtil } from '../utils/login-util';

export const authGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) => {
      if (!(LoginUtil.retrieveKey() == '' && LoginUtil.retrieveUrl() == '')) {
        return true;
      }
      // Redirect to the login page
      return createUrlTreeFromSnapshot(next, ['/login']);
  }
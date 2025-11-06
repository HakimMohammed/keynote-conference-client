import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {AuthGuardData, createAuthGuard} from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const {authenticated, grantedRoles} = authData;
  console.log("I am here")
  console.log(grantedRoles)

  const requiredRole = route.data['role'];
  if (!requiredRole) {
    return false;
  }

  const hasRequiredRole = (role: string): boolean =>
    grantedRoles.realmRoles.includes(role);

  if (authenticated && hasRequiredRole(requiredRole)) {
    return true;
  }

  const router = inject(Router);
  return router.parseUrl('/forbidden');
};

export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);

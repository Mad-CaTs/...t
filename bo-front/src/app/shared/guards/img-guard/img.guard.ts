import { CanActivateFn } from '@angular/router';
import { environment } from '@environments/environment';

export const imgGuard: CanActivateFn = (route, state) => {
  return environment.SHOW_IMAGES_COMPONENT;
};

// src/app/shared/guards/pending-purchase/pending-purchase.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PendingPurchaseService } from '@shared/services/pending-purchase.service';

export const PendingPurchaseGuard: CanActivateFn = () => {
  const pending = inject(PendingPurchaseService);
  const router = inject(Router);

  if (pending.has()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
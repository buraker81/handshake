import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

// Stub — full session-based implementation lives in AuthModule (Phase 1).
// AuthService will populate req.user = { walletAddress } via session lookup
// before this guard runs (e.g. via middleware or a complete AuthGuard).
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ user?: { walletAddress: string } }>()
    if (!req.user?.walletAddress) {
      throw new UnauthorizedException('Not authenticated')
    }
    return true
  }
}

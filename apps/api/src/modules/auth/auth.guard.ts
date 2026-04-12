import type {
  CanActivate,
  ExecutionContext} from "@nestjs/common";
import {
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import type { AuthService } from "./auth.service";
import { AUTH_CONSTANTS } from "../../common/constants";

type CookieRequest = Request & {
  cookies: Record<string, string>;
  user?: { walletAddress: string };
};

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<CookieRequest>();

    const sessionId = req.cookies?.[AUTH_CONSTANTS.COOKIE_NAME];
    if (!sessionId) {
      this.logger.warn(`Unauthenticated access attempt: ${req.method} ${req.path}`);
      throw new UnauthorizedException("No session cookie");
    }

    const session = await this.authService.getSession(sessionId);
    if (!session) {
      this.logger.warn(`Invalid/expired session attempt: ${req.method} ${req.path}`);
      throw new UnauthorizedException("Invalid or expired session");
    }

    req.user = { walletAddress: session.walletAddress };
    return true;
  }
}

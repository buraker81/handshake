import { Controller, Get, Post, Body, Req, Res, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { AUTH_CONSTANTS } from "../../common/constants";
import { GetNonceDocs, VerifyDocs, GetMeDocs, LogoutDocs } from "./auth.docs";

type AuthenticatedRequest = Request & {
  cookies: Record<string, string>;
  user: { walletAddress: string };
};

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("nonce")
  @HttpCode(HttpStatus.OK)
  @GetNonceDocs()
  async getNonce() {
    const nonce = await this.authService.generateNonce();
    return { nonce };
  }

  @Post("verify")
  @HttpCode(HttpStatus.OK)
  @VerifyDocs()
  async verify(
    @Body() body: { message: string; signature: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionId = await this.authService.verifyAndCreateSession(body.message, body.signature);

    res.cookie(AUTH_CONSTANTS.COOKIE_NAME, sessionId, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: AUTH_CONSTANTS.COOKIE_MAX_AGE_MS,
    });

    return { ok: true };
  }

  @Get("me")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @GetMeDocs()
  getMe(@Req() req: AuthenticatedRequest) {
    return { walletAddress: req.user.walletAddress };
  }

  @Post("logout")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @LogoutDocs()
  async logout(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    const sessionId = req.cookies[AUTH_CONSTANTS.COOKIE_NAME];

    if (sessionId) await this.authService.logout(sessionId);

    res.clearCookie(AUTH_CONSTANTS.COOKIE_NAME);

    return { ok: true };
  }
}

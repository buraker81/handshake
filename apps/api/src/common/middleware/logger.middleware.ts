import type { NestMiddleware } from "@nestjs/common";
import { Injectable, Logger } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";

type AuthenticatedRequest = Request & {
  user?: { walletAddress: string };
};

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");

  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const ip = req.headers["x-forwarded-for"] ?? req.ip ?? "unknown";
    const ua = (req.headers["user-agent"] ?? "").slice(0, 60);
    const startTime = Date.now();

    res.on("finish", () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      const wallet = req.user?.walletAddress
        ? ` wallet=${req.user.walletAddress.slice(0, 10)}...`
        : "";

      const msg = `${method} ${originalUrl} ${statusCode} ${duration}ms | ip=${ip}${wallet} | ua=${ua}`;

      if (statusCode >= 500) {
        this.logger.error(msg);
      } else if (statusCode >= 400) {
        this.logger.warn(msg);
      } else {
        this.logger.log(msg);
      }
    });

    next();
  }
}

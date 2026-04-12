import { Controller, Get, HttpCode, HttpStatus, Query, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import type { IpfsService } from "./ipfs.service";
import { AuthGuard } from "../auth/auth.guard";
import { GetSignedUrlDocs } from "./ipfs.docs";

type AuthRequest = Request & { user: { walletAddress: string } };

@ApiTags("ipfs")
@Controller("ipfs")
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Get("signed-url")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @GetSignedUrlDocs()
  async getSignedUrl(@Query("fileName") fileName: string, @Req() req: AuthRequest) {
    const signedUrl = await this.ipfsService.getSignedUploadUrl(fileName, req.user.walletAddress);
    return { signedUrl };
  }
}

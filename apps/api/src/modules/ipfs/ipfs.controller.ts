import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IpfsService } from "./ipfs.service";
import { AuthGuard } from "../auth/auth.guard";
import { GetSignedUrlDocs } from "./ipfs.docs";

@ApiTags("ipfs")
@Controller("ipfs")
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Get("signed-url")
  // @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @GetSignedUrlDocs()
  async getSignedUrl() {
    const signedUrl = await this.ipfsService.getSignedUploadUrl();
    return { signedUrl };
  }
}
import { Controller,Get,Body,Post,Res,Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Response,Request } from "express";

interface Typedata {
  name:string;
  email:string;
  password:string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("login")
  async login(@Body() data:Typedata,@Res({ passthrough: true }) res: Response) {
    const resdata = await this.userService.login(data);

    res.cookie("token",resdata.token, {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 60
    });

    return(true);
  }

  @Post("register")
  async register(@Body() data:Typedata,@Res({ passthrough: true }) res: Response) {
    const resdata = await this.userService.register(data);

    res.cookie("token",resdata.token, {
      // httpOnly: false,
      // secure: true,
      // sameSite: "lax",
      // maxAge: 60 * 60 * 24 * 60
      path: '/',
      maxAge: 24 * 60 * 60
    });

    return(true);
  }

  @Get("verifyuser")
  verifyuser(@Req() req:Request) {
    const authheader = req.headers['authorization'];
    
    if (authheader) {
      return this.userService.verifyuser(authheader);
    }
    else {
      return this.userService.verifyuser(req.cookies["token"]);
    }
  }

  @Post("googlelogin")
  async googlelogin(@Body() data:Typedata,@Res({ passthrough: true }) res: Response) {
    const resdata = await this.userService.googlelogin(data);

    res.cookie("token",resdata.token, {
      // httpOnly: true,
      // secure: false,
      // sameSite: "lax",
      // maxAge: 60 * 60 * 24 * 60
      path: '/',
      maxAge: 24 * 60 * 60
    });

    return(true);
  }

  @Get("getdatauser")
  getdatauser() {
    return this.userService.getdatauser();
  }
}

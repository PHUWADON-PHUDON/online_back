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
  async login(@Body() data:Typedata,@Res({ passthrough: true }) res: Response, @Req() req:any) {
    const resdata:any = await this.userService.login(data);

    // res.cookie("token",resdata.token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: 60 * 60 * 24 * 60
    // });

    console.log("data before login:", data);

    req.session.user = {
      id: resdata.id,
      name: resdata.name,
      email: resdata.email,
      score: resdata.score
    };

    console.log("✅ Session after login:", req.session);

    req.session.save(() => {
        return(true);
    });
  }

  @Post("register")
  async register(@Body() data:Typedata,@Res({ passthrough: true }) res: Response) {
    const resdata = await this.userService.register(data);

    res.cookie("token",resdata.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 60
    });

    return(true);
  }

  @Get("verifyuser")
  verifyuser(@Req() req:any) {
    // const authheader = req.headers['authorization']?.split("Bearer")[1].trim();
    // if (authheader) {
    //  return this.userService.verifyuser(authheader);
    // }

    console.log(req.session.user);

    if (req.session.user) {
      return req.session.user;
    }
    else {
      return req.session.user;
    }
    // else {
    //  return this.userService.verifyuser(req.cookies["token"]);
    // }
  }

  @Post("googlelogin")
  async googlelogin(@Body() data:Typedata,@Res({ passthrough: true }) res: Response) {
    const resdata = await this.userService.googlelogin(data);

    res.cookie("token",resdata.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 60
    });

    return(true);
  }

  @Get("getdatauser")
  getdatauser() {
    return this.userService.getdatauser();
  }
}

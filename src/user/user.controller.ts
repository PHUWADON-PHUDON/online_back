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
  async login(@Body() data:Typedata,@Res({ passthrough: true }) res: Response,@Req() req:any) {
    const resdata = await this.userService.login(data);

    req.session.user = {
      id:resdata.id,
      name:resdata.name,
      email:resdata.email,
      score:resdata.score
    }

    req.session.save(() => {
      return(true);
    });
  }

  @Post("register")
  async register(@Body() data:Typedata,@Res({ passthrough: true }) res: Response,@Req() req:any) {
    const resdata = await this.userService.register(data);

    req.session.user = {
      id:resdata.id,
      name:resdata.name,
      email:resdata.email,
      score:resdata.score
    }

    req.session.save(() => {
      return(true);
    });
  }

  @Get("verifyuser")
  verifyuser(@Req() req:any) {
    // const authheader = req.headers['authorization'];
    
    // if (authheader) {
    //   return this.userService.verifyuser(authheader);
    // }
    // else {
    //   return this.userService.verifyuser(req.cookies["token"]);
    // }

    if (req.session.user) {
      return({status:true,data:req.session.user});
    }
    else{
      return({status:false});
    }
  }

  @Post("googlelogin")
  async googlelogin(@Body() data:Typedata,@Res({ passthrough: true }) res: Response,@Req() req:any) {
    const resdata = await this.userService.googlelogin(data);

    req.session.user = {
      id:resdata.id,
      name:resdata.name,
      email:resdata.email,
      score:resdata.score
    }

    req.session.save(() => {
      return(true);
    });
  }

  @Get("getdatauser")
  getdatauser() {
    return this.userService.getdatauser();
  }
}

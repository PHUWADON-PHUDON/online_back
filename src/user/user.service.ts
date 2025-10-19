import { Injectable,BadRequestException,Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

interface Typeregisterdata {
    name:string;
    email:string;
    password:string;
}

interface Typelogindata {
    name:string;
    email:string;
    password:string;
}

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async login(data:Typelogindata) {
        try{
            const finduser = await this.prisma.user.findFirst({where:{email:data.email}});
            
            if (finduser) {
                const isvaliduser = await bcrypt.compare(data.password,finduser.password!);
                
                if (isvaliduser) {
                    return({id:finduser.id,name:finduser.name,email:finduser.email,score:finduser.score});
                }
                else {
                    throw new BadRequestException();
                }
            }
            else {
                throw new BadRequestException();
            }
        }
        catch(err) {
            throw new BadRequestException(err.message);
        }
    }

    async register(data:Typeregisterdata) {
        try{
            const hashpassword = await bcrypt.hash(data.password,10);
            
            const createuser = await this.prisma.user.create({
                data:{
                    name:data.name,
                    email:data.email,
                    password:hashpassword
                }
            });

            return({id:createuser.id,name:createuser.name,email:createuser.email,score:createuser.score});
        }
        catch(err) {
            throw new BadRequestException(err.message);
        }
    }

    async verifyuser(token:string) {
        try{
            if (token) {
                const jwt_secret = process.env.JWT_SECRET as string;
                const decoded = jwt.verify(token,jwt_secret);

                return(decoded);
            }
            else {
                throw new BadRequestException();
            }
        }
        catch(err) {
            throw new BadRequestException(err.message);
        }
    }

    async googlelogin(data:Typelogindata) {
        try{
            const finuser = await this.prisma.user.findFirst({where:{email:data.email}});

            if (finuser) {
                return({id:finuser.id,name:finuser.name,email:finuser.email,score:finuser.score});
            }
            else {
                const createuser = await this.prisma.user.create({
                    data:{
                        name:data.name,
                        email:data.email
                    }
                });

                return({id:createuser.id,name:createuser.name,email:createuser.email,score:createuser.score});
            }
        }
        catch(err) {
            throw new BadRequestException(err.message);
        }
    }

    async getdatauser() {
        try{
            const getdata = await this.prisma.user.findMany({
                orderBy: {
                    score: "desc",
                },
                take: 50
            });

            return(getdata);
        }
        catch(err) {
            throw new BadRequestException(err.message);
        }
    }
}

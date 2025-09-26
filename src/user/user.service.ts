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
            const jwt_secret = process.env.JWT_SECRET as string;
            const finduser = await this.prisma.user.findFirst({where:{email:data.email}});
            
            if (finduser) {
                const isvaliduser = await bcrypt.compare(data.password,finduser.password!);
                
                if (isvaliduser) {
                    //create jwt
                    const jwtpayload = {id:finduser.id,name:finduser.name,email:finduser.email};
                    const jwttoken = jwt.sign(jwtpayload,jwt_secret, { expiresIn: '1d' });

                    return({token:jwttoken});
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
            const jwt_secret = process.env.JWT_SECRET as string;
            const hashpassword = await bcrypt.hash(data.password,10);
            
            const createuser = await this.prisma.user.create({
                data:{
                    name:data.name,
                    email:data.email,
                    password:hashpassword
                }
            });

            //create jwt
            const jwtpayload = {id:createuser.id,name:createuser.name,email:createuser.email};
            const jwttoken = jwt.sign(jwtpayload,jwt_secret, { expiresIn: '1d' });

            return({token:jwttoken});
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
            const jwt_secret = process.env.JWT_SECRET as string;
            const finuser = await this.prisma.user.findFirst({where:{email:data.email}});

            if (finuser) {
                //create jwt
                const jwtpayload = {id:finuser.id,name:finuser.name,email:finuser.email};
                const jwttoken = jwt.sign(jwtpayload,jwt_secret, { expiresIn: '1d' });

                return({token:jwttoken});
            }
            else {
                const createuser = await this.prisma.user.create({
                    data:{
                        name:data.name,
                        email:data.email
                    }
                });

                //create jwt
                const jwtpayload = {id:createuser.id,name:createuser.name,email:createuser.email};
                const jwttoken = jwt.sign(jwtpayload,jwt_secret, { expiresIn: '1d' });

                return({token:jwttoken});
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

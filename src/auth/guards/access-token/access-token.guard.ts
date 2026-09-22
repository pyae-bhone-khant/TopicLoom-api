import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { auth } from 'src/auth/auth';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
       const session  = await auth.api.getSession({
        headers: request.headers,
       }); 
       if (!session) {
        throw new UnauthorizedException('Invalid or expired access token');
       }

       // Fetch full user with role from database
       const userWithRole = await this.prisma.user.findUnique({
         where: { id: session.user.id },
         select: { id: true, email: true, name: true, role: true, image: true, emailVerified: true },
       });

       if (!userWithRole) {
        throw new UnauthorizedException('User not found');
       }

       request.user = userWithRole;
       request.session = session.session;

       return true;
    } catch (error) { 
       throw new UnauthorizedException('Authentication failed');
    }
  }
}

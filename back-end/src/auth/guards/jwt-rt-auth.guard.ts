import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRTAuthGuard extends AuthGuard('jwt-refresh') {}
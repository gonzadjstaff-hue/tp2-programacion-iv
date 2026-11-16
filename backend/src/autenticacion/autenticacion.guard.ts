import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';

export interface PayloadToken {
    sub: string;
    rol: string;
}

export type SolicitudAutenticada = Request & { usuario: PayloadToken };

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const esPublico = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (esPublico) {
            return true;
        }

        const solicitud = context.switchToHttp().getRequest<SolicitudAutenticada>();
        const [tipo, token] = solicitud.headers.authorization?.split(' ') ?? [];

        if (tipo !== 'Bearer' || !token) {
            throw new UnauthorizedException('Token no enviado');
        }

        try {
            solicitud.usuario = await this.jwtService.verifyAsync<PayloadToken>(token);
        } catch {
            throw new UnauthorizedException('Token inválido o vencido');
        }

        return true;
    }
}

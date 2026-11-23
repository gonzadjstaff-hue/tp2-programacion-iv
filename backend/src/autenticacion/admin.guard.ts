import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import type { SolicitudAutenticada } from './autenticacion.guard';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const solicitud = context.switchToHttp().getRequest<SolicitudAutenticada>();

        if (solicitud.usuario?.rol !== 'administrador') {
            throw new ForbiddenException('Solo los administradores pueden realizar esta acción');
        }

        return true;
    }
}

import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

const extensiones: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
};

export const opcionesImagen = {
    storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, callback) => {
            callback(null, `${randomUUID()}${extensiones[file.mimetype]}`);
        },
    }),
    fileFilter: (
        req: unknown,
        file: Express.Multer.File,
        callback: (error: Error | null, aceptar: boolean) => void,
    ) => {
        if (!extensiones[file.mimetype]) {
            return callback(
                new BadRequestException('Solo se permiten imágenes JPG, PNG o WEBP'),
                false,
            );
        }

        callback(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
};

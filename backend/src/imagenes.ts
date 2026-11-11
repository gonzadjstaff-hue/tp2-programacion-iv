import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

const extensiones: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
};

export const opcionesImagen = {
    storage: memoryStorage(),
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

export async function subirImagen(archivo: Express.Multer.File): Promise<string> {
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_KEY ?? '',
    );
    const bucket = supabase.storage.from('imagenes');
    const nombre = `${randomUUID()}${extensiones[archivo.mimetype]}`;

    const { error } = await bucket.upload(nombre, archivo.buffer, {
        contentType: archivo.mimetype,
    });

    if (error) {
        throw new InternalServerErrorException('No se pudo guardar la imagen');
    }

    return bucket.getPublicUrl(nombre).data.publicUrl;
}

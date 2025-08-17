import { FastifyRequest } from 'fastify';
import { Multipart, MultipartFile } from '@fastify/multipart';
import { join } from 'path';
import { existsSync, mkdirSync, createWriteStream } from 'fs';

export interface ParsedMultipart {
  formData: Record<string, any>;
  fileUrl?: string;
}

export async function parseMultipartRequest(
  req: FastifyRequest,
  uploadFolder = 'src/upload'
): Promise<ParsedMultipart> {
  const mpReq = req as FastifyRequest & {
    parts: () => AsyncIterableIterator<Multipart>;
  };

  const parts = mpReq.parts();
  let fileUrl: string | undefined;
  const formData: Record<string, any> = {};

  for await (const part of parts) {
    if ((part as MultipartFile).filename) {
      // Save file
      const filePart = part as MultipartFile;
      const uploadPath = join(process.cwd(), uploadFolder);

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      const filePath = join(uploadPath, filePart.filename);
      const writeStream = createWriteStream(filePath);

      await new Promise((resolve, reject) => {
        filePart.file.pipe(writeStream);
        filePart.file.on('end', resolve);
        filePart.file.on('error', reject);
      });

      fileUrl = `/upload/${filePart.filename}`;
    } else {
      // Normal form fields
      const fieldPart = part as any;
      formData[fieldPart.fieldname] = fieldPart.value;
    }
  }

  return { formData, fileUrl };
}

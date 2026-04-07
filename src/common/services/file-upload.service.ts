import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
    private readonly uploadPath = path.join(process.cwd(), 'uploads');

    constructor() {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    async saveFile(file: Express.Multer.File, subFolder: string = ''): Promise<string> {
        try {
            const fileExtension = path.extname(file.originalname);
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;
            
            const targetDir = path.join(this.uploadPath, subFolder);
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            const filePath = path.join(targetDir, fileName);
            fs.writeFileSync(filePath, file.buffer);

            // Return relative path for static serving
            return subFolder ? `/uploads/${subFolder}/${fileName}` : `/uploads/${fileName}`;
        } catch (error) {
            console.error('[FileUploadService] Error saving file:', error);
            throw new InternalServerErrorException('Failed to upload file');
        }
    }

    async removeFile(fileUrl: string): Promise<void> {
        try {
            if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
            const relativePath = fileUrl.replace('/uploads/', '');
            const filePath = path.join(this.uploadPath, relativePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error('[FileUploadService] Error deleting file:', error);
        }
    }
}

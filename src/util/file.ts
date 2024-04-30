import { HttpException, HttpStatus } from "@nestjs/common"
import { unlinkSync } from "fs"
import { VALID_UPLOADS_MIME_TYPES } from "./storage";

export const deleteFile = (filePath) => {
    try {
        return unlinkSync(filePath);
    } catch (error) {
        throw new HttpException(error || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export function isValidFileType(mimeType: string): boolean {
    return VALID_UPLOADS_MIME_TYPES.includes(mimeType);
}
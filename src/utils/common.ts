import * as fs from 'fs';
import { Request } from 'express';
export const filterTolower = (text: string): string => text.toLowerCase().replace(/\s/g, '');

export const getRootDirectory = (): string => {
    const rootDirectory = process.cwd();
    return rootDirectory;
}

export const getBaseUrl = (request: Request) => {
    return `${request.protocol}://${request.get('host')}`;
}

export const fileExist = async (filePath: string = "nofile.png") => {
    try {
        await fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
};

export const deleteFile = async (filePath: string) => {
    try {
        await fs.accessSync(filePath, fs.constants.F_OK);
        console.log('deleted');

        await fs.unlinkSync(filePath);
    } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
    }
};
export enum ErrorCode {
	FileInvalidType = 'file-invalid-type',
	FileTooLarge = 'file-too-large',
	FileTooSmall = 'file-too-small',
	TooManyFiles = 'too-many-files'
}

export interface FileError {
	message: string;
	code: ErrorCode | string;
}

export interface FileRejection {
	file: File;
	errors: FileError[];
}

export type DropEvent = (DragEvent | Event) & {
	detail: {
		acceptedFiles: File[];
		fileRejections: FileRejection[];
		event: Event;
	};
};

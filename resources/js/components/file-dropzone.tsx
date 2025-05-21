import { useLang } from '@/hooks/use-lang';
import { cn } from '@/lib/utils';
import { FileText, FileUpIcon, Trash } from 'lucide-react'; // Lucide Icons
import React, { useCallback, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface FileDropzoneProps {
    onFilesSelected: (files: File[]) => void;
    onFilesRemoved?: (removedFiles: File[], updatedFiles: File[]) => void;
    acceptedTypes?: string[];
    maxFiles?: number;
    id?: string;
    className?: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
    onFilesSelected,
    acceptedTypes = ['*'],
    maxFiles = Infinity,
    id = 'file-dropzone-input',
    onFilesRemoved,
    className = '',
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (!files) return;
            const validFiles = Array.from(files).slice(0, maxFiles);
            const updatedFiles = [...selectedFiles, ...validFiles];
            setSelectedFiles(updatedFiles);
            onFilesSelected(updatedFiles);
        },
        [maxFiles, onFilesSelected, selectedFiles],
    );

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(event.target.files);
        event.target.value = '';
    };

    const handleDelete = (index: number) => {
        const removedFile = selectedFiles[index];
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
        onFilesSelected(updatedFiles);
        if (onFilesRemoved) {
            onFilesRemoved([removedFile], updatedFiles);
        }
    };

    const isImage = (file: File) => file.type.startsWith('image/');

    const dragAndDropText = useLang('text', 'drag_and_drop');
    const orClickToSelectText = useLang('text', 'or_click_to_select');
    const selectedFilesText = useLang('text', 'selected_file');

    return maxFiles == 1 && selectedFiles.length > 0 ? (
        selectedFiles.map((file, index) =>
            isImage(file) ? (
                <div className="relative">
                    <img className="m-auto h-52 w-fit rounded-md object-cover object-center" src={URL.createObjectURL(file)} alt={file.name} />
                    <Button className="absolute top-2 right-2 shrink-0" variant="destructive" size="icon" onClick={() => handleDelete(index)}>
                        <Trash className="icon !fill-background/30" />
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 space-x-3">
                    <div className="relative">
                        <FileText className="text-primary h-40 w-40" />
                        <Button className="absolute top-2 right-2 shrink-0" variant="destructive" size="icon" onClick={() => handleDelete(index)}>
                            <Trash className="icon !fill-background/30" />
                        </Button>
                    </div>
                    <div className="flex-1 text-center">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                </div>
            ),
        )
    ) : (
        <Card
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={cn(
                className,
                'shadow-none',
                'hover:border-ring border-input hover:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border-1 border-dashed hover:border-solid hover:ring-[3px]',
            )}
        >
            <CardContent className="p-0">
                <input type="file" accept={acceptedTypes.join(',')} multiple={maxFiles > 1} onChange={handleFileChange} className="hidden" id={id} />
                {(maxFiles > 1 || (maxFiles === 1 && selectedFiles.length === 0)) && (
                    <label htmlFor={id} className="flex cursor-pointer flex-col items-center justify-center p-4 text-center">
                        <FileUpIcon className="fill-primary/20 mb-4 h-16 w-16" />
                        <p className="text-lg font-semibold">{dragAndDropText}</p>
                        <p className="text-muted-foreground text-sm">{orClickToSelectText}</p>
                    </label>
                )}
                {maxFiles > 1 && (
                    <div className="w-full space-y-2">
                        {selectedFiles.length > 0 && <p className="px-4 text-sm font-medium">{selectedFilesText}:</p>}
                        {selectedFiles.length > 0 && (
                            <ul className="space-y-2 pb-4">
                                {selectedFiles.map((file, index) => (
                                    <li key={index} className="bg-primary/5 mx-4 flex items-center justify-between rounded-md p-2 shadow-sm">
                                        <div className="flex items-center space-x-3">
                                            {isImage(file) ? (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    className="h-8 w-8 rounded-md object-cover object-center"
                                                />
                                            ) : (
                                                <FileText className="text-primary h-8 w-8" />
                                            )}
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{file.name}</p>
                                                <p className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                        </div>
                                        <Button className="shrink-0" variant="destructive" size="icon" onClick={() => handleDelete(index)}>
                                            <Trash className="icon !fill-background/30" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default FileDropzone;

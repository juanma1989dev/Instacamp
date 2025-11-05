import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, User, X } from 'lucide-react';
import { useState } from 'react';

interface ImageUploadFieldProps {
    currentImage?: string;
    error?: string;
    name?: string;
}

export default function ImageUploadField({
    currentImage,
    error,
    name = 'avatar',
}: ImageUploadFieldProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Por favor selecciona una imagen válida');
                return;
            }

            // Validar tamaño (máximo 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('La imagen debe ser menor a 2MB');
                return;
            }

            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPreview(null);
        setSelectedFile(null);
        const input = document.getElementById(name) as HTMLInputElement;
        if (input) input.value = '';
    };

    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>Foto de perfil</Label>

            <div className="flex items-start gap-4">
                {/* Preview de la imagen */}
                <div className="relative">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-border bg-muted">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <User className="h-12 w-12 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {preview && (
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-md transition-colors hover:bg-destructive/90"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Botón de carga */}
                <div className="flex flex-col gap-2">
                    <input
                        type="file"
                        id={name}
                        name={name}
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(name)?.click()}
                        className="gap-2"
                    >
                        <Upload className="h-4 w-4" />
                        {preview ? 'Cambiar imagen' : 'Subir imagen'}
                    </Button>

                    <p className="text-xs text-muted-foreground">
                        JPG, PNG o GIF. Máximo 2MB.
                    </p>
                </div>
            </div>

            <InputError className="mt-2" message={error} />
        </div>
    );
}

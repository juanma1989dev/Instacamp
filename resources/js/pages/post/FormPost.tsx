import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public-layout';
import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface Props {
    post?: {
        id: number;
        caption: string;
        image_path?: string;
    };
}

export default function FormPost({ post: dataPost }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        caption: dataPost?.caption || '',
        image: null as File | null,
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (dataPost) {
            put(route('posts.update', dataPost.id), {
                onSuccess: () => {},
            });
        } else {
            post(route('posts.store'), {
                forceFormData: true,
                onSuccess: () => {},
            });
        }
    };

    return (
        <PublicLayout>
            <Card>
                <CardContent className="mt-10">
                    <form
                        className="relative mt-5 flex flex-col gap-2"
                        onSubmit={handleFormSubmit}
                    >
                        <Link
                            className="absolute -top-12 left-4"
                            href={route('posts.index')}
                        >
                            {'<-'}
                        </Link>

                        <Button
                            type="submit"
                            className="absolute -top-12 right-4"
                            disabled={processing}
                        >
                            Guardar
                        </Button>

                        <div className="mb-2">
                            <label>Contenido</label>
                            <Textarea
                                value={data.caption}
                                onChange={(e) =>
                                    setData('caption', e.target.value)
                                }
                            />
                            {errors.caption && (
                                <p className="text-red-500">{errors.caption}</p>
                            )}
                        </div>

                        <div className="mb-2">
                            <label>Imagen</label>
                            <input
                                type="file"
                                className="w-full"
                                accept="image/*"
                                onChange={(e) => {
                                    if (
                                        e.target.files &&
                                        e.target.files.length > 0
                                    ) {
                                        setData('image', e.target.files[0]);
                                    }
                                }}
                            />
                            {errors.image && (
                                <p className="text-red-500">{errors.image}</p>
                            )}

                            {dataPost?.image_path && !data.image && (
                                <img
                                    src={`/storage/${dataPost.image_path}`}
                                    alt="Post actual"
                                    className="mt-2 max-h-48 object-cover"
                                />
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </PublicLayout>
    );
}

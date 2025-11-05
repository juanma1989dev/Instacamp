import AvatarUser from '@/components/AvatarUser';
import { useInitials } from '@/hooks/use-initials';
import PublicLayout from '@/layouts/public-layout';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Heart, MessageCircle } from 'lucide-react';
import React from 'react';
import { route } from 'ziggy-js';

interface Props {
    posts: any[];
}

export default function Index({ posts }: Props) {
    const { auth } = usePage<PageProps>().props;

    const handleLike = (postId: number, liked: boolean) => {
        const options = {
            preserveState: true,
            preserveScroll: true,
        };

        if (liked) {
            router.delete(route('likes.destroy', postId), options);
        } else {
            router.post(route('likes.store'), { post_id: postId }, options);
        }
    };

    const deletePost = (e: React.MouseEvent, postId: number) => {
        e.preventDefault();

        if (!confirm('Estas seguro que quieres eliminar la publicación'))
            return;

        router.delete(route('posts.destroy', postId));
    };

    const getInitials = useInitials();

    return (
        <PublicLayout>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col space-y-6">
                    {posts.map((post: any) => {
                        return (
                            <div
                                key={post.id}
                                className="overflow-hidden rounded-lg bg-white shadow"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-2">
                                    <div className="flex items-center gap-4">
                                        <AvatarUser
                                            image={`/storage/${post.user.profile_image}`}
                                            textFallback={post.user.name}
                                        />
                                        <span className="font-semibold text-gray-800 hover:text-indigo-600">
                                            {post?.user?.name}
                                        </span>
                                    </div>

                                    {auth?.user.id === post.user.id && (
                                        <Link
                                            as="button"
                                            method="delete"
                                            className="cursor-pointer text-sm text-red-500 transition-colors hover:text-red-700"
                                            onClick={(e) =>
                                                deletePost(e, post.id)
                                            }
                                        >
                                            Eliminar
                                        </Link>
                                    )}
                                </div>
                                {/* Image */}
                                <Link href={route('posts.edit', post.id)}>
                                    <img
                                        src={post.image_url}
                                        alt="Post"
                                        // className="max-h-[500px] w-full object-cover"
                                        className="max-h-[420px] w-full bg-black object-contain"
                                    />
                                </Link>
                                {/* Body */}
                                <div className="px-4 py-3">
                                    <div className="mb-2 flex items-center space-x-2">
                                        <button
                                            onClick={() =>
                                                handleLike(
                                                    post.id,
                                                    post.is_liked,
                                                )
                                            }
                                            className="focus:outline-none"
                                        >
                                            {post.is_liked ? (
                                                <Heart className="h-5 w-5 cursor-pointer text-red-500" />
                                            ) : (
                                                <Heart className="h-5 w-5 cursor-pointer" />
                                            )}
                                        </button>
                                        <Link
                                            href={route('posts.show', post.id)}
                                            className="text-gray-600"
                                        >
                                            <MessageCircle className="h-5 w-5 cursor-pointer" />
                                        </Link>
                                    </div>

                                    <p className="font-semibold">
                                        {post.likes_count} likes
                                    </p>

                                    <p>
                                        {auth?.user ? (
                                            <>
                                                <span className="mr-1 font-semibold">
                                                    {auth?.user.name}
                                                </span>
                                                {post.caption}
                                            </>
                                        ) : (
                                            post.caption
                                        )}
                                    </p>

                                    <Link
                                        href={route('posts.show', post.id)}
                                        className="mt-8 flex gap-4 text-sm text-gray-500"
                                    >
                                        <span>Ver todos</span>
                                        <span>
                                            {post.comments_count} comentarios
                                        </span>
                                    </Link>

                                    <p className="mt-1 text-sm text-gray-400">
                                        {post.created_at_diff_human}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PublicLayout>
    );
}

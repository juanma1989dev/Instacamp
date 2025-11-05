import AvatarUser from '@/components/AvatarUser';
import PublicLayout from '@/layouts/public-layout';
import { PageProps, User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';

interface Comment {
    id: number;
    comment: string;
    user_id: number | null;
    user?: User;
}

interface Post {
    id: number;
    caption: string;
    image_url?: string;
    user?: User;
    likes: { user_id: number }[];
    comments: Comment[];
    created_at: string;
}

interface Props {
    post: Post;
}

export default function ShowPost({ post }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const hasLiked = post.likes.some((like) => like.user_id === auth.user?.id);
    const [commentInput, setComment] = useState('');

    const handleLike = () => {
        if (hasLiked) {
            router.delete(route('likes.destroy', post.id));
        } else {
            router.post(route('likes.store', post.id));
        }
    };

    const handleDeletePost = () => {
        if (confirm('¿Seguro que quieres eliminar este post?')) {
            router.delete(route('posts.destroy', post.id));
        }
    };

    const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.post(
            route('comments.store'),
            { comment: commentInput, post_id: post.id },
            { onSuccess: () => setComment('') },
        );
    };

    const handleDeleteComment = (id: number) => {
        router.delete(route('comments.destroy', id));
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <PublicLayout>
            <div className="mx-auto mb-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg md:flex-row">
                <div className="flex w-full items-center justify-center bg-black md:w-1/2">
                    {post.image_url ? (
                        <img
                            src={post.image_url}
                            alt={post.caption}
                            className="h-full w-full object-contain md:object-cover"
                        />
                    ) : (
                        <div className="flex h-96 w-full items-center justify-center text-gray-400">
                            No image
                        </div>
                    )}
                </div>

                <div className="flex w-full flex-col p-4 md:w-1/2">
                    {/* Header del usuario */}
                    <div className="relative mb-4 flex items-center border-b pb-3">
                        {post.user ? (
                            <>
                                <div className="flex items-center justify-center gap-3">
                                    <AvatarUser
                                        image={post.user.profile_image ?? ''}
                                        textFallback={post.user.name}
                                    />
                                    <span className="font-semibold text-gray-800">
                                        {post.user.name}
                                    </span>
                                </div>
                                {auth.user?.id === post.user.id && (
                                    <div
                                        ref={menuRef}
                                        className="relative ml-auto"
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMenuOpen((prev) => !prev);
                                            }}
                                            className="rounded-full px-2 py-1 text-gray-600 hover:bg-gray-100"
                                        >
                                            ⋮
                                        </button>
                                        {menuOpen && (
                                            <ul className="absolute right-0 mt-2 w-32 rounded-lg border border-gray-100 bg-white shadow-lg">
                                                <li>
                                                    <Link
                                                        href={route(
                                                            'posts.edit',
                                                            post.id,
                                                        )}
                                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                    >
                                                        Edit
                                                    </Link>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={
                                                            handleDeletePost
                                                        }
                                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                                    >
                                                        Delete
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center">
                                <img
                                    src="https://via.placeholder.com/40"
                                    className="mr-3 h-10 w-10 rounded-full"
                                />
                                <span className="text-gray-500">
                                    Deleted User
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Descripción */}
                    <div className="mb-3 text-sm text-gray-800">
                        {post.caption}
                    </div>

                    {/* Likes y fecha */}
                    <div className="mb-3 flex items-center justify-between border-b pb-2">
                        <button onClick={handleLike} className="mr-2 text-xl">
                            {hasLiked ? (
                                <i className="fas fa-heart text-red-500"></i>
                            ) : (
                                <i className="far fa-heart"></i>
                            )}
                        </button>
                        <p className="text-sm text-gray-500">
                            {post.likes.length} likes •{' '}
                            {new Date(post.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto pr-1 md:max-h-[400px]">
                        {post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="flex items-center gap-2"
                                >
                                    <AvatarUser
                                        image={
                                            comment.user?.profile_image ?? ''
                                        }
                                        textFallback={comment.user?.name ?? ''}
                                    />
                                    <div className="flex flex-1">
                                        <p className="text-sm">
                                            <span className="mr-2 font-semibold">
                                                {comment.user?.name ||
                                                    'Deleted User'}
                                            </span>
                                            {comment.comment}
                                        </p>
                                    </div>
                                    {auth.user?.id === comment.user_id && (
                                        <button
                                            onClick={() =>
                                                handleDeleteComment(comment.id)
                                            }
                                            className="cursor-pointer text-gray-400 hover:text-red-500"
                                        >
                                            <Trash className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400">
                                Sin comentarios.
                            </p>
                        )}
                    </div>

                    <form
                        onSubmit={handleAddComment}
                        className="mt-3 flex border-t pt-3"
                    >
                        <input
                            type="text"
                            required
                            placeholder="Agregar comentario .."
                            className="flex-1 rounded-l-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                            value={commentInput}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="rounded-r-lg bg-blue-500 px-4 text-sm font-semibold text-white hover:bg-blue-600"
                        >
                            Comentar
                        </button>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}

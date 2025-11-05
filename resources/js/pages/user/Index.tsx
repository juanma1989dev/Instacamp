import AvatarUser from '@/components/AvatarUser';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import { Check, UserPlus } from 'lucide-react'; // 👈 Importamos íconos
import { route } from 'ziggy-js';

interface Props {
    users: User[];
}

// interface User {
//     id: number;
//     name: string;
//     description: string;
//     avatarUrl: string;
//     is_following: boolean;
// }

export default function UserIndex({ users }: Props) {
    const handleClickFollow = (
        userId: number,
        isFollowing: boolean | undefined,
    ) => {
        if (isFollowing) {
            router.delete(route('follows.destroy', userId));
        } else {
            router.post(route('follows.store', { user_id: userId }));
        }
    };

    return (
        <PublicLayout>
            <div className="space-y-4 p-4">
                {users.map((user: User) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                        {/* Avatar + Info */}
                        <div className="flex items-center space-x-4">
                            {/* 'https://i.pravatar.cc/50' */}
                            <AvatarUser
                                image={user.profile_image ?? ''}
                                textFallback={user.name}
                            />
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {user.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {user.bio}
                                </p>
                            </div>
                        </div>

                        {/* Botón seguir/siguiendo */}
                        <Button
                            size="sm"
                            onClick={() =>
                                handleClickFollow(user.id, user.is_following)
                            }
                            className={`flex cursor-pointer items-center gap-2 ${
                                user.is_following
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            {user.is_following ? (
                                <>
                                    <Check className="h-4 w-4" />
                                    Siguiendo
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-4 w-4" />
                                    Seguir
                                </>
                            )}
                        </Button>
                    </div>
                ))}
            </div>
        </PublicLayout>
    );
}

import { useInitials } from '@/hooks/use-initials';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Props {
    image: string;
    textFallback: string;
}

export default function AvatarUser({ image = '', textFallback = '' }: Props) {
    const getInitials = useInitials();

    return (
        <Avatar className="h-8 w-8 overflow-hidden rounded-full">
            <AvatarImage src={image} alt={textFallback} />
            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                {getInitials(textFallback)}
            </AvatarFallback>
        </Avatar>
    );
}

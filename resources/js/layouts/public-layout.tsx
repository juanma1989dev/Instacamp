import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { auth } = usePage<PageProps>().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                href="/"
                                className="text-xl font-semibold text-gray-800 hover:text-indigo-600"
                            >
                                Instacamp
                            </Link>
                        </div>

                        {/* Botón móvil */}
                        <div className="flex items-center md:hidden">
                            <button
                                type="button"
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Navegación principal */}
                        <div className="hidden md:flex md:items-center md:space-x-6">
                            {auth.user && (
                                <Link
                                    href={route('posts.index')}
                                    className="text-gray-700 hover:text-indigo-600"
                                >
                                    Feedssss
                                </Link>
                            )}
                        </div>

                        {/* Navegación derecha */}
                        <div className="hidden md:flex md:items-center md:space-x-6">
                            {!auth.user ? (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-700 hover:text-indigo-600"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="text-gray-700 hover:text-indigo-600"
                                    >
                                        Register
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('posts.create')}
                                        className="flex items-center text-gray-700 hover:text-indigo-600"
                                    >
                                        <i className="fa fa-plus-square mr-1"></i>{' '}
                                        New Post
                                    </Link>

                                    {/* Dropdown usuario */}
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setDropdownOpen(!dropdownOpen)
                                            }
                                            className="flex items-center text-gray-700 hover:text-indigo-600 focus:outline-none"
                                        >
                                            {/* {auth.user.username} */}
                                            <svg
                                                className="ml-1 h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>

                                        {dropdownOpen && (
                                            <div className="absolute right-0 z-10 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg">
                                                {/* <Link
                                                    href={route(
                                                        'profile.show',
                                                        auth.user.id,
                                                    )}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Profile
                                                </Link> */}
                                                <Link
                                                    as="button"
                                                    method="post"
                                                    href={route('logout')}
                                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Logout
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Menú móvil */}
                {menuOpen && (
                    <div className="border-t border-gray-200 bg-white md:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {auth.user ? (
                                <>
                                    <Link
                                        href={route('posts.index')}
                                        className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Feed
                                    </Link>
                                    <Link
                                        href={route('posts.create')}
                                        className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        New Post
                                    </Link>
                                    <Link
                                        href={route(
                                            'profile.show',
                                            auth.user.id,
                                        )}
                                        className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        as="button"
                                        method="post"
                                        href={route('logout')}
                                        className="block w-full rounded-md px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Contenido principal */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}

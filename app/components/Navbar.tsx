'use client'
import Link from 'next/link';
import ModeToggle from './modeToggle';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-blue-600 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo va sahifa nomi */}
                <Link href="/" className="text-white text-2xl font-semibold">
                    Kitob Tracker
                </Link>

                {/* Navigatsiya menyusi */}
                <ul className="flex space-x-6 items-center">
                    <li>
                        <Link href="/" className="text-white hover:text-gray-300 transition duration-200">
                            Bosh sahifa
                        </Link>
                    </li>
                    <li>
                        <Link href="/books" className="text-white hover:text-gray-300 transition duration-200">
                            Kitoblar
                        </Link>
                    </li>
                    <li>
                        <Link href="/statistics" className="text-white hover:text-gray-300 transition duration-200">
                            Statistikalar
                        </Link>
                    </li>
                </ul>

                {/* Qo‘shimcha funksiya tugmalari (dark mode, login, user profile) */}
                <div className='flex items-center gap-6'>
                    <ModeToggle />
                    <SignedOut>
                        <SignInButton mode='modal'>
                            <button className="text-white px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition duration-200">
                                Kirish
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

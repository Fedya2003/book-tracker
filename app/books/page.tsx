'use client';

import { BookType } from '@/types';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const BookPage = () => {
    const { user } = useUser();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [pages, setPages] = useState<number>(0);
    const [readingDays, setReadingDays] = useState<number>(0);
    const [books, setBooks] = useState<BookType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editBookId, setEditBookId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const bookData = {
            title,
            author,
            pages,
            createdAt: new Date().toISOString(),
            readingDays,
        };

        const response = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData),
        });

        const data = await response.json();
        if (data.success) {
            alert('Kitob muvaffaqiyatli qo‘shildi');
            fetchBooks();
            resetForm();
        } else {
            alert('Xato yuz berdi');
        }
    };

    const handleEdit = (id: string) => {
        const bookToEdit = books.find((book) => book._id === id);
        if (bookToEdit) {
            setTitle(bookToEdit.title || ''); // Ensure it's always a string
            setAuthor(bookToEdit.author || ''); // Ensure it's always a string
            setPages(bookToEdit.pages || 0); // Ensure it's always a number
            setReadingDays(bookToEdit.readingDays || 0); // Ensure it's always a number
            setEditBookId(id);
            setIsModalOpen(true);
        }
    };

    const handleSaveEdit = async () => {
        if (!editBookId) return;

        const updatedBook = {
            title,
            author,
            pages,
            readingDays,
        };

        const response = await fetch(`/api/books`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: editBookId, ...updatedBook }),
        });

        const data = await response.json();
        if (data.success) {
            alert('Kitob muvaffaqiyatli yangilandi');
            fetchBooks();
            closeModal();
        } else {
            alert('Yangilashda xato yuz berdi');
        }
    };

    const handleDelete = async (id: string) => {
        const response = await fetch(`/api/books`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: id }),
        });

        const data = await response.json();
        if (data.success) {
            alert('Kitob muvaffaqiyatli o‘chirildi');
            fetchBooks();
        } else {
            alert('O‘chirishda xato yuz berdi');
        }
    };

    const fetchBooks = async () => {
        const response = await fetch('/api/books');
        const data = await response.json();
        if (data.success) {
            setBooks(data.books);
        }
    };

    const resetForm = () => {
        setTitle('');
        setAuthor('');
        setPages(0);
        setReadingDays(0);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    useEffect(() => {
        if (user) {
            fetchBooks();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-center">Iltimos, tizimga kiring yoki roʻyxatdan oʻting</p>
            </div>
        );
    }

    return (
        <div className="container max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Kitoblar</h1>

            <h2 className="text-xl font-semibold mb-2">Yangi kitob qo‘shish</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
                <div>
                    <label htmlFor="title" className="block mb-1 font-medium text-gray-700">Kitob nomi</label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Kitob nomini kiriting!"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label htmlFor="author" className="block mb-1 font-medium text-gray-700">Muallif</label>
                    <input
                        type="text"
                        id="author"
                        placeholder="Muallif nomini kiriting!"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label htmlFor="pages" className="block mb-1 font-medium text-gray-700">Betlar soni</label>
                    <input
                        type="number"
                        id="pages"
                        placeholder="Betlar soni"
                        value={pages || 0} // Ensure a number is always present
                        onChange={(e) => setPages(Number(e.target.value))}
                        required
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label htmlFor="readingDays" className="block mb-1 font-medium text-gray-700">Necha kunda o‘qishni rejalashtiryapsiz?</label>
                    <input
                        type="number"
                        id="readingDays"
                        placeholder="Necha kunda o‘qishni rejalashtiryapsiz?"
                        value={readingDays || 0} // Ensure a number is always present
                        onChange={(e) => setReadingDays(Number(e.target.value))}
                        required
                        className="border p-2 rounded w-full"
                    />
                </div>

                <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full">
                    Qo‘shish
                </button>
            </form>

            <h2 className="text-xl font-semibold mb-2">Ro‘yxatdagi kitoblar</h2>
            <ul className="space-y-4">
                {books.map((book) => {
                    const readingPlans = book.readingPlans || [];
                    const completedCount = readingPlans.filter((plan) => plan.done).length;
                    const completedPercent = readingPlans.length > 0 ? (completedCount / readingPlans.length) * 100 : 0;

                    return (
                        <li key={book._id} className="border p-4 rounded shadow">
                            <Link href={`/books/${book._id}`} className="block">
                                <div>
                                    <h3 className="font-bold">{book.title}</h3>
                                    <p><strong>Muallif:</strong> {book.author}</p>
                                    <p><strong>Betlar soni:</strong> {book.pages}</p>
                                </div>
                            </Link>

                            {/* Progress bar */}
                            <div className="mt-4 w-full bg-gray-200 h-2 rounded-full">
                                <div
                                    className="h-2 rounded-full bg-blue-500"
                                    style={{ width: `${completedPercent}%` }}
                                ></div>
                            </div>

                            {/* Percentage display */}
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-gray-500">Progress: {Math.round(completedPercent)}%</span>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button onClick={() => handleEdit(book._id)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                                    Tahrirlash
                                </button>
                                <button onClick={() => handleDelete(book._id)} className="bg-red-600 text-white px-3 py-1 rounded">
                                    O‘chirish
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Modal for editing a book */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-green-500 p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Kitobni tahrirlash</h3>
                        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                            <div>
                                <label htmlFor="editTitle" className="block mb-1 font-medium text-gray-700">Kitob nomi</label>
                                <input
                                    type="text"
                                    id="editTitle"
                                    placeholder="Kitob nomi"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="editAuthor" className="block mb-1 font-medium text-gray-700">Muallif</label>
                                <input
                                    type="text"
                                    id="editAuthor"
                                    placeholder="Muallif"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="editPages" className="block mb-1 font-medium text-gray-700">Betlar soni</label>
                                <input
                                    type="number"
                                    id="editPages"
                                    placeholder="Betlar soni"
                                    value={pages || 0} // Ensure a number is always present
                                    onChange={(e) => setPages(Number(e.target.value))}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="editReadingDays" className="block mb-1 font-medium text-gray-700">Necha kunda o‘qishni rejalashtiryapsiz?</label>
                                <input
                                    type="number"
                                    id="editReadingDays"
                                    placeholder="Necha kunda o‘qishni rejalashtiryapsiz?"
                                    value={readingDays || 0} // Ensure a number is always present
                                    onChange={(e) => setReadingDays(Number(e.target.value))}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>

                            <div className="flex justify-between gap-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 rounded w-full"
                                >
                                    Saqlash
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-red-600 text-white py-2 rounded w-full"
                                >
                                    Yopish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookPage;

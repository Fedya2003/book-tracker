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
    const [doneIds, setDoneIds] = useState<string[]>([]);
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
            setTitle(bookToEdit.title);
            setAuthor(bookToEdit.author);
            setPages(bookToEdit.pages);
            setReadingDays(bookToEdit.readingDays);
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

    const handleToggleDone = (id: string) => {
        if (doneIds.includes(id)) {
            setDoneIds(doneIds.filter((doneId) => doneId !== id));
        } else {
            setDoneIds([...doneIds, id]);
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
                <input
                    type="text"
                    placeholder="Kitob nomi"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Muallif"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Betlar soni"
                    value={pages}
                    onChange={(e) => setPages(Number(e.target.value))}
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Necha kunda o‘qishni rejalashtiryapsiz?"
                    value={readingDays}
                    onChange={(e) => setReadingDays(Number(e.target.value))}
                    required
                    className="border p-2 rounded"
                />
                <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Qo‘shish
                </button>
            </form>

            <h2 className="text-xl font-semibold mb-2">Ro‘yxatdagi kitoblar</h2>
            <ul className="space-y-4">
                {books.map((book) => {
                    const completedPercent = doneIds.includes(book._id)
                        ? 100
                        : Math.min((book.readingDays / 30) * 100, 100);

                    return (
                        <li key={book._id} className="border p-4 rounded shadow">
                            <Link href={`/books/${book._id}`} className="block">
                                <div>
                                    <h3 className="font-bold">{book.title}</h3>
                                    <p><strong>Muallif:</strong> {book.author}</p>
                                    <p><strong>Betlar soni:</strong> {book.pages}</p>
                                    <p><strong>Kunlar soni:</strong> {book.readingDays}</p>
                                </div>
                            </Link>

                            <div className="flex gap-2 mt-2">
                                <button onClick={() => handleEdit(book._id)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                                    Tahrirlash
                                </button>
                                <button onClick={() => handleDelete(book._id)} className="bg-red-600 text-white px-3 py-1 rounded">
                                    O‘chirish
                                </button>
                                <button
                                    onClick={() => handleToggleDone(book._id)}
                                    className={`px-3 py-1 rounded ${doneIds.includes(book._id) ? 'bg-green-600' : 'bg-gray-400'} text-white`}
                                >
                                    {doneIds.includes(book._id) ? 'Bajarildi' : 'Bajarilmagan'}
                                </button>
                            </div>

                            <div className="mt-2 w-full bg-gray-200 h-2 rounded-full">
                                <div
                                    className="h-2 rounded-full bg-blue-500"
                                    style={{ width: `${completedPercent}%` }}
                                ></div>
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
                            <input
                                type="text"
                                placeholder="Kitob nomi"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Muallif"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                required
                                className="border p-2 rounded"
                            />
                            <input
                                type="number"
                                placeholder="Betlar soni"
                                value={pages}
                                onChange={(e) => setPages(Number(e.target.value))}
                                required
                                className="border p-2 rounded"
                            />
                            <input
                                type="number"
                                placeholder="Necha kunda o‘qishni rejalashtiryapsiz?"
                                value={readingDays}
                                onChange={(e) => setReadingDays(Number(e.target.value))}
                                required
                                className="border p-2 rounded"
                            />
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

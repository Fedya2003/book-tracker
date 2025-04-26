'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BookType } from '@/types';
import { CalendarCheck, Loader, BookOpen, User } from 'lucide-react';

const BookDetailPage = () => {
    const params = useParams();
    const id = params.id as string;
    const [book, setBook] = useState<BookType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (id) {
            const fetchBook = async () => {
                try {
                    setIsLoading(true);
                    const response = await fetch(`/api/books/${id}`);
                    const data = await response.json();
                    setBook(data.book);
                } catch (error) {
                    console.error('Kitobni yuklashda xatolik:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchBook();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-emerald-50 text-emerald-600">
                <Loader className="animate-spin mr-2" />
                Yuklanmoqda...
            </div>
        );
    }

    if (!book) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-emerald-50 text-red-500">
                Kitob topilmadi.
            </div>
        );
    }

    const handleMarkAsDone = async (planId: string) => {
        try {
            const response = await fetch(`/api/books/${id}/plan/${planId}/done`, {
                method: 'PATCH',
            });
            const data = await response.json();
            if (data.success) {
                const updatedPlans = book.readingPlans.map((plan) =>
                    plan.id === planId ? { ...plan, done: true } : plan
                );
                setBook({ ...book, readingPlans: updatedPlans });
            } else {
                alert('Xato yuz berdi');
            }
        } catch (error) {
            console.error('Plan bajarishda xatolik:', error);
            alert('Xatolik yuz berdi');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br p-4">
            <div className="container max-w-3xl mx-auto p-6 bg-blue-300 rounded-xl shadow-lg shadow-emerald-300/50">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-emerald-700 flex items-center gap-2">
                        <BookOpen className="w-6 h-6" />
                        {book.title}
                    </h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {book.author}
                    </p>
                </div>

                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CalendarCheck className="w-5 h-5 text-emerald-600" />
                        Kunlik o‘qish rejasi
                    </h3>
                    <ul className="space-y-3">
                        {book.readingPlans && book.readingPlans.length > 0 ? (
                            book.readingPlans.map((plan) => (
                                <li
                                    key={plan.id}
                                    className="flex items-center justify-between px-4 py-3 border rounded-xl bg-emerald-50 hover:bg-emerald-100 transition"
                                >
                                    <span className={`text-sm ${plan.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                        {plan.date}:  <span className="font-bold">{plan.pages} sahifa</span>
                                    </span>
                                    {!plan.done && (
                                        <button
                                            onClick={() => handleMarkAsDone(plan.id)}
                                            className="px-3 py-1 text-sm text-white bg-emerald-600 rounded hover:bg-emerald-700 transition"
                                        >
                                            Bajarildi
                                        </button>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500 text-sm">Rejalar mavjud emas.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BookType } from '@/types';

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
        return <div>Loading...</div>;
    }

    if (!book) {
        return <div>Kitob topilmadi.</div>;
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
        <div className="container max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <h2 className="text-xl text-gray-600">{book.author}</h2>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Kunlik Rejalar</h3>
                <ul>
                    {book.readingPlans && book.readingPlans.length > 0 ? (
                        book.readingPlans.map((plan) => (
                            <li key={plan.id} className="flex items-center justify-between py-2">
                                <span className={plan.done ? 'line-through text-gray-500' : ''}>
                                    {plan.date}: {plan.pages} sahifa
                                </span>
                                {!plan.done && (
                                    <button
                                        onClick={() => handleMarkAsDone(plan.id)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Bajarildi
                                    </button>
                                )}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">Rejalar mavjud emas.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default BookDetailPage;

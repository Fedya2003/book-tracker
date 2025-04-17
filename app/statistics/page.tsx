'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { BookStats } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatisticsPage = () => {
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalPagesRead, setTotalPagesRead] = useState(0);
    const [booksByMonth, setBooksByMonth] = useState<BookStats[]>([]);

    const fetchStatistics = async () => {
        const response = await fetch('/api/statistics');
        const data = await response.json();
        if (data.success) {
            setTotalBooks(data.totalBooks);
            setTotalPagesRead(data.totalPagesRead);
            setBooksByMonth(data.booksByMonth);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    const statisticsChartData = {
        labels: booksByMonth.map((item) => item.month),
        datasets: [
            {
                label: 'O‘qilgan kitoblar soni',
                data: booksByMonth.map((item) => item.booksRead),
                fill: false,
                borderColor: '#3B82F6',
                backgroundColor: '#3B82F6',
                tension: 0.3,
            },
        ],
    };

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">📊 Statistika</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
                    <p className="text-gray-600 text-sm">Umumiy kitoblar soni</p>
                    <p className="text-2xl font-semibold text-blue-600">{totalBooks}</p>
                </div>
                <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
                    <p className="text-gray-600 text-sm">Umumiy o‘qilgan betlar soni</p>
                    <p className="text-2xl font-semibold text-green-600">{totalPagesRead}</p>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-700">📅 Oylik ko‘rsatkichlar</h2>
            <ul className="space-y-2 mb-8">
                {booksByMonth.map((monthData, index) => (
                    <li
                        key={index}
                        className="bg-blue-50 p-3 rounded-md border border-blue-100 shadow-sm"
                    >
                        <span className="font-medium">{monthData.month}:</span>{' '}
                        <span className="text-blue-800">{monthData.booksRead} kitob o‘qildi</span>
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-gray-700">📈 O‘sish grafigi</h2>
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                <Line data={statisticsChartData} />
            </div>
        </div>
    );
};

export default StatisticsPage;

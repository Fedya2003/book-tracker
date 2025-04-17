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

import { BookType, BookStats } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Page = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [pageViews, setPageViews] = useState(0);
  const [booksByMonth, setBooksByMonth] = useState<BookStats[]>([]);

  const fetchBooks = async () => {
    const response = await fetch('/api/books');
    const data = await response.json();
    if (data.success) {
      setBooks(data.books);
    }
  };

  const fetchStatistics = async () => {
    const response = await fetch('/api/statistics');
    const data = await response.json();
    if (data.success) {
      setUserCount(data.userCount); // ← haqiqiy son
      setPageViews(data.pageViews); // ← haqiqiy son (hozircha static bo‘lishi mumkin)
      setBooksByMonth(data.booksByMonth);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchStatistics();
  }, []);

  const statisticsChartData = {
    labels: booksByMonth.map((item) => item.month),
    datasets: [
      {
        label: 'O‘qilgan kitoblar soni',
        data: booksByMonth.map((item) => item.booksRead),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">📚 Book Tracker</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">🎥 Saytdan qanday foydalanish</h2>
        <video controls className="w-full rounded-lg shadow">
          <source src="/path/to/instruction-video.mp4" type="video/mp4" />
          Sizning brauzeringiz video formatini qo‘llab-quvvatlamaydi.
        </video>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow space-y-2">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">📊 Sahifa statistikasi</h3>
        <p><strong>Foydalanuvchilar soni:</strong> {userCount}</p>
        <p><strong>Kunlik o‘rtacha saytga kirish:</strong> {pageViews}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">📖 O‘qilgan Kitoblar Ro‘yxati</h2>
        <ul className="space-y-4">
          {books.map((book) => (
            <li key={book._id} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">{book.title}</h3>
              <p><span className="font-semibold">Muallif:</span> {book.author}</p>
              <p><span className="font-semibold">O‘qish boshlanishi:</span> {new Date(book.readStartDate).toLocaleDateString()}</p>
              <p><span className="font-semibold">O‘qishni tugatish:</span> {new Date(book.readEndDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">📈 O‘qilgan kitoblar soni (oylar bo‘yicha)</h3>
        <Line data={statisticsChartData} />
      </section>

      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
        &copy; 2025 Kitob Tracker. Barcha huquqlar himoyalangan.
      </footer>
    </div>
  );
};

export default Page;

import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

const CLERK_API_KEY = process.env.CLERK_SECRET_KEY!;

interface ReadingPlan {
	done: boolean;
	// kerak bo‘lsa: date?: string;
}

interface Book {
	pages: number;
	readEndDate?: string;
	readingPlans: ReadingPlan[];
}

export async function GET() {
	try {
		const { db } = await connectToDatabase();
		const booksCollection = db.collection<Book>('books');

		const books = await booksCollection.find().toArray();

		let totalBooks = 0;
		let totalPagesRead = 0;

		const monthlyStats: Record<string, number> = {};

		for (const book of books) {
			const readingPlans = book.readingPlans || [];

			const donePlans = readingPlans.filter(plan => plan.done);
			const allPlansCount = readingPlans.length;

			if (donePlans.length === allPlansCount && allPlansCount > 0) {
				totalBooks += 1;
			}

			if (allPlansCount > 0) {
				const readRatio = donePlans.length / allPlansCount;
				totalPagesRead += Math.ceil(book.pages * readRatio);
			}

			// Oylik statistikani yig‘ish
			if (book.readEndDate) {
				const date = new Date(book.readEndDate);
				const month = date.toLocaleString('uz-UZ', { month: 'long' });
				monthlyStats[month] = (monthlyStats[month] || 0) + 1;
			}
		}

		const booksByMonth = Object.entries(monthlyStats).map(
			([month, count]) => ({
				month,
				booksRead: count,
			})
		);
		// ✅ Clerk API orqali foydalanuvchilarni olish
		const response = await fetch('https://api.clerk.com/v1/users', {
			headers: {
				Authorization: `Bearer ${CLERK_API_KEY}`,
			},
		});
		const users = await response.json();

		const userCount = users.length || users.total_count || 0;

		// 🚧 Hozircha pageViews static bo‘lib turadi
		const pageViews = 789;

		return NextResponse.json({
			success: true,
			totalBooks,
			totalPagesRead,
			booksByMonth,
			userCount,
			pageViews,
		});
	} catch (error) {
		console.error('Statistika olishda xatolik:', error);
		return NextResponse.json(
			{ success: false, message: 'Xatolik yuz berdi' },
			{ status: 500 }
		);
	}
}

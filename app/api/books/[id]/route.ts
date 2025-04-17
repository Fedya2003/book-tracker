import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';

// Kitobni olish funksiyasi (GET)
export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { db } = await connectToDatabase();
		const { id } = await params;

		// Noto‘g‘ri ID tekshiruvi
		if (!ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: 'Noto‘g‘ri ID' },
				{ status: 400 }
			);
		}

		const book = await db
			.collection('books')
			.findOne({ _id: new ObjectId(id) });

		if (!book) {
			return NextResponse.json(
				{ error: 'Kitob topilmadi' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ book });
	} catch (error) {
		console.error('GET /api/books/[id] xato:', error);
		return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
	}
}

// Kitobni yaratish funksiyasi (POST)
export async function POST(req: Request) {
	try {
		const { db } = await connectToDatabase();
		const body = await req.json();

		const { title, author, pages, readStartDate, readEndDate } = body;

		// Kunlik rejalarni yaratish
		const readingPlans = createReadingPlans(
			readStartDate,
			readEndDate,
			pages
		);

		// Debug: readingPlans ni tekshirish
		console.log('Reading Plans created:', readingPlans);

		// Yangi kitobni yaratish
		const newBook = {
			title,
			author,
			pages,
			readStartDate,
			readEndDate,
			readingPlans,
			createdAt: new Date(),
		};

		// Kitobni MongoDB'ga qo'shish
		const result = await db.collection('books').insertOne(newBook);

		// Yangi kitobni qaytarish
		const insertedBook = { ...newBook, _id: result.insertedId };

		// Kitob va uning kunlik rejalarini debug qilish
		console.log('Yangi kitob saqlandi:', insertedBook);
		console.log('Reading Plans:', insertedBook.readingPlans);

		return NextResponse.json({ book: insertedBook });
	} catch (error) {
		console.error('POST /api/books xato:', error);
		return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
	}
}

// Kunlik rejalarni avtomatik yaratish funksiyasi
function createReadingPlans(
	startDate: string,
	endDate: string,
	totalPages: number
) {
	const start = dayjs(startDate);
	const end = dayjs(endDate);

	const readingDays = end.diff(start, 'days') + 1; // O'qish kunlari
	const pagesPerDay = Math.ceil(totalPages / readingDays); // Kuniga o'qish kerak bo'lgan sahifalar soni

	// Debug: readingDays va pagesPerDay qiymatlarini tekshirish
	console.log('Reading Days:', readingDays);
	console.log('Pages Per Day:', pagesPerDay);

	let currentDate = start;
	const plans = [];

	// Rejalarni yaratish
	for (let i = 0; i < readingDays; i++) {
		plans.push({
			id: new ObjectId().toString(),
			date: currentDate.format('YYYY-MM-DD'),
			pages: pagesPerDay,
			done: false, // Reja hali bajarilmagan
		});
		currentDate = currentDate.add(1, 'day');
	}

	// Debug: Yaratilgan readingPlans ni tekshirish
	console.log('Created Reading Plans:', plans);

	return plans;
}

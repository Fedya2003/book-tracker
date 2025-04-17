import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';

export async function GET() {
	const { db } = await connectToDatabase();
	const books = await db.collection('books').find({}).toArray();
	return NextResponse.json({ success: true, books });
}

type ReadingPlan = {
	id: string;
	date: string;
	pages: string;
	done: boolean;
};

export async function POST(req: Request) {
	const { db } = await connectToDatabase();
	const newBook = await req.json();

	const { title, author, pages, readingDays } = newBook;

	// pages ni songa aylantirish
	const totalPages = Number(pages);

	// Agar pages qiymati son bo'lmasa, xato xabarini yuborish
	if (isNaN(totalPages)) {
		return NextResponse.json({
			success: false,
			message: 'Pages qiymati to‘g‘ri son bo‘lishi kerak.',
		});
	}

	// Konsolga chiqarib tekshirib ko‘rish
	console.log('Total Pages:', totalPages);
	console.log('Reading Days:', readingDays);

	const readStartDate = dayjs().format('YYYY-MM-DD'); // Bugungi sana
	const readEndDate = dayjs(readStartDate)
		.add(readingDays, 'day')
		.format('YYYY-MM-DD'); // Necha kunga rejalashtirilgan bo'lsa, o'sha sanani qo'shamiz

	let readingPlans: ReadingPlan[] = [];

	// Sana bo‘sh yoki noto‘g‘ri bo‘lsa, xabar berish
	if (!readingDays || readingDays <= 0) {
		return NextResponse.json({
			success: false,
			message: 'O‘qish kunlari sonini ko‘rsating.',
		});
	}

	// Faqat start va end date bo‘lsa, reading plan yaratamiz
	if (endDateValid(readStartDate, readEndDate)) {
		readingPlans = createReadingPlans(
			readStartDate,
			readEndDate,
			totalPages
		);
	}

	const bookToInsert = {
		title,
		author,
		pages: totalPages, // Pages ni son sifatida saqlaymiz
		readStartDate,
		readEndDate,
		readingPlans,
		createdAt: new Date().toISOString(),
	};

	// Konsolga chiqarib tekshirish
	console.log('Book to Insert:', bookToInsert);

	const result = await db.collection('books').insertOne(bookToInsert);

	// Insertdan so'ng natijani tekshirish
	if (result.insertedId) {
		console.log('Kitob qo‘shildi:', result.insertedId);
	} else {
		console.log('Kitob qo‘shishda xato:', result);
	}

	return NextResponse.json({
		success: true,
		message: 'Kitob qo‘shildi',
		book: { _id: result.insertedId, ...bookToInsert },
	});
}

export async function PUT(req: Request) {
	const { db } = await connectToDatabase();
	const updatedBook = await req.json();
	const { _id, ...updatedData } = updatedBook;

	const result = await db
		.collection('books')
		.updateOne({ _id: new ObjectId(_id) }, { $set: updatedData });

	if (result.matchedCount === 0) {
		return NextResponse.json({
			success: false,
			message: 'Kitob topilmadi',
		});
	}

	return NextResponse.json({ success: true, message: 'Kitob yangilandi' });
}

export async function DELETE(req: Request) {
	const { db } = await connectToDatabase();
	const { _id } = await req.json();

	const result = await db
		.collection('books')
		.deleteOne({ _id: new ObjectId(_id) });

	if (result.deletedCount === 0) {
		return NextResponse.json({
			success: false,
			message: 'Kitob o‘chirilmadi',
		});
	}

	return NextResponse.json({ success: true, message: 'Kitob o‘chirildi' });
}

// ✅ Reading Plan generator funksiyasi
function createReadingPlans(
	startDate: string,
	endDate: string,
	totalPages: number
) {
	const start = dayjs(startDate);
	const end = dayjs(endDate);

	const readingDays = end.diff(start, 'day') + 1;
	const pagesPerDay = Math.ceil(totalPages / readingDays);

	let currentPage = 1;
	let currentDate = start;
	const plans: ReadingPlan[] = [];

	for (let i = 0; i < readingDays; i++) {
		const fromPage = currentPage;
		const toPage = Math.min(currentPage + pagesPerDay - 1, totalPages);

		plans.push({
			id: new ObjectId().toString(),
			date: currentDate.format('YYYY-MM-DD'),
			pages: `${fromPage}-${toPage}`,
			done: false,
		});

		currentPage = toPage + 1;
		currentDate = currentDate.add(1, 'day');
	}

	return plans;
}

// ✅ Sana to‘g‘riligini tekshiruvchi funksiya
function endDateValid(startDate: string, endDate: string) {
	return dayjs(endDate).isAfter(dayjs(startDate));
}

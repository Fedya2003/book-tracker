import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db('bookTracker');
const booksCollection = db.collection('books');

export async function GET() {
	try {
		await client.connect();

		// Umumiy kitoblar soni
		const totalBooks = await booksCollection.countDocuments();

		// Umumiy o‘qilgan betlar soni
		const totalPagesRead = await booksCollection
			.aggregate([
				{ $group: { _id: null, totalPages: { $sum: '$pages' } } },
			])
			.toArray();
		const totalPages = totalPagesRead[0]?.totalPages || 0;

		// Kitoblarni oylar bo‘yicha guruhlash
		const booksByMonth = await booksCollection
			.aggregate([
				{
					$project: {
						month: {
							$month: {
								$dateFromString: {
									dateString: '$readStartDate',
								},
							},
						},
						year: {
							$year: {
								$dateFromString: {
									dateString: '$readStartDate',
								},
							},
						},
					},
				},
				{
					$group: {
						_id: { year: '$year', month: '$month' },
						booksRead: { $sum: 1 },
					},
				},
				{ $sort: { '_id.year': -1, '_id.month': -1 } },
			])
			.toArray();

		return NextResponse.json({
			success: true,
			totalBooks,
			totalPagesRead: totalPages,
			booksByMonth: booksByMonth.map((item: any) => ({
				month: `${item._id.month}-${item._id.year}`,
				booksRead: item.booksRead,
			})),
		});
	} catch {
		return NextResponse.json({ success: false, message: 'Xato yuz berdi' });
	} finally {
		await client.close();
	}
}

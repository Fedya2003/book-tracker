import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
	_: Request,
	{ params }: { params: Promise<{ id: string; planId: string }> }
) {
	// paramsni kutish (await)
	const { id, planId } = await params;

	const { db } = await connectToDatabase();

	try {
		// MongoDB so'rovini bajarish
		const result = await db
			.collection('books')
			.updateOne(
				{ _id: new ObjectId(id), 'readingPlans.id': planId },
				{ $set: { 'readingPlans.$.done': true } }
			);

		// Agar o'zgartirish amalga oshmagan bo'lsa
		if (result.modifiedCount === 0) {
			return NextResponse.json(
				{ success: false, message: 'Holat yangilanmadi' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: 'Holat muvaffaqiyatli o‘zgartirildi',
		});
	} catch (err) {
		console.error('Xatolik:', err);
		return NextResponse.json(
			{ success: false, message: 'Xatolik yuz berdi' },
			{ status: 500 }
		);
	}
}

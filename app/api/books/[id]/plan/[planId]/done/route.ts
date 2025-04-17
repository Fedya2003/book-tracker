// app/api/books/[bookId]/plan/[planId]/done/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type Params = {
	params: {
		id: string;
		planId: string;
	};
};

export async function PATCH(_: Request, { params }: Params) {
	const { db } = await connectToDatabase();
	const { id, planId } = await params;

	try {
		const result = await db
			.collection('books')
			.updateOne(
				{ _id: new ObjectId(id), 'readingPlans.id': planId },
				{ $set: { 'readingPlans.$.done': true } }
			);

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
		console.error(err);
		return NextResponse.json(
			{ success: false, message: 'Xatolik yuz berdi' },
			{ status: 500 }
		);
	}
}

import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	pages: { type: Number, required: true },
	readStartDate: { type: Date, required: true },
	readEndDate: { type: Date, required: true },
	readingDays: { type: Number, required: false }, // ixtiyoriy qilsak ham bo‘ladi
	createdAt: { type: Date, default: Date.now }, // Vaqtni saqlash
	readingPlans: [
		{
			id: { type: String, required: true },
			date: { type: String, required: true },
			pages: { type: Number, required: true },
			done: { type: Boolean, required: true },
		},
	],
});

const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

export default Book;

import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string); // MongoDB URL
const dbName = 'bookDB'; // O‘zgaritirilishi mumkin bo‘lgan nom

export async function connectToDatabase() {
	const db = client.db(dbName);
	return { db, client };
}

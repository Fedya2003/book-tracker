// types.ts
export type ReadingPlan = {
	id: string;
	date: string;
	pages: number;
	done: boolean;
};

export type BookType = {
	_id: string;
	title: string;
	author: string;
	pages: number;
	readStartDate: string; // ISO date formatda
	readEndDate: string; // ISO date formatda
	readingDays: number;
	createdAt: string | null;
	readingPlans: ReadingPlan[]; // O‘qish rejalari
};

export interface BookStats {
	month: string;
	booksRead: number;
}

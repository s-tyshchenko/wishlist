import {Generated} from 'kysely';

export interface Database {
	wishes: WishesTable;
}

export interface WishesTable {
	id: Generated<number>;
	content: string | null;
	image: string | null
	createdAt: Generated<string>;
	accomplishedAt: string | null;
}

export interface Wish {
	id: number;
	content: string | null;
	image: string | null;
	createdAt: string;
	accomplishedAt: string | null;
}

export interface WishInput extends Omit<Wish, 'id' | 'createdAt'> {}

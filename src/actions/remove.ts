'use server';

import db from '@/src/lib/db';

export async function remove(_: number, id: number) {
	await db.deleteFrom('wishes')
	  .where('id', '=', id)
	  .execute();

	return id;
}

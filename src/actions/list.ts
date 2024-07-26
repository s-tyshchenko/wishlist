'use server';

import db from '@/src/lib/db';

export async function list() {
	return await db.selectFrom('wishes')
	  .selectAll('wishes')
	  .orderBy('id desc')
	  .execute();
}

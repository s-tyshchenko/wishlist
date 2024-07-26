'use server';

import {Wish, WishInput} from '../types';
import db from '@/src/lib/db';
import {put} from '@vercel/blob';

export async function upsert(
  model: Wish | undefined,
  formData: FormData
) {
	const input: WishInput = {
		content: model?.content ?? null,
		image: model?.image ?? null,
		accomplishedAt: formData.get('accomplished') === 'on'
		  ? new Date().toISOString()
		  : null
	};

	const imageFile = formData.get('image') as File;
	if (imageFile && imageFile.size > 0) {
		const {url} = await put(`images/${imageFile.name}`, imageFile, {access: 'public'});

		input.image = url;
	}

	if (formData.get('content')) {
		input.content = formData.get('content') as string;
	}

	try {
		if (!model?.id) {
			throw new Error('Wish was not created yet');
		}

		model = await db.updateTable('wishes')
		  .set(input)
		  .where('id', '=', model.id)
		  .returningAll()
		  .executeTakeFirst();
	} catch (e: any) {
		model = await db.insertInto('wishes')
		  .values(input)
		  .returningAll()
		  .executeTakeFirst();
	}

	return model;
}

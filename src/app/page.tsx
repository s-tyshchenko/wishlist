'use client';
import {useEffect, useState} from 'react';
import {useFormState} from 'react-dom';
import {list} from '@/src/actions/list';
import {Wish} from '@/src/types';
import WishList from '@/src/components/WishList';
import {WishListContext} from '@/src/lib/context';
import clsx from 'clsx';

export default function Home() {
	const [items, fetch] = useFormState(list, []);

	const [wishes, setWishes] = useState<Array<Wish>>(items);

	const handleAddWish = () => {
		setWishes((wishes) => [
			{
				id: Math.random() * (0 - Number.MIN_SAFE_INTEGER) + Number.MIN_SAFE_INTEGER,
				image: null,
				content: null,
				createdAt: new Date().toISOString(),
				accomplishedAt: null
			},
			...wishes
		]);
	};

	const handleRemoveWish = (id: number) => {
		setWishes((wishes) => wishes.filter((wish) => wish?.id !== id));
	};

	const handleSaveWish = (id: number, data: Wish) => {
		setWishes((wishes) => {
			const wishIndex = wishes.findIndex((wish) => wish.id === id);
			if (wishIndex !== -1) {
				const updatedWishes = [...wishes];
				updatedWishes[wishIndex] = data;
				return updatedWishes;
			}
			return wishes;
		});
	};

	useEffect(() => {
		fetch();
	}, []);

	useEffect(() => {
		setWishes(items);
	}, [items]);

	const totalAccomplished = wishes.reduce((total, item) => {
		if (item.accomplishedAt) {
			total += 1;
		}
		return total;
	}, 0);

	const totalCount = wishes.length;
	const calculatedPercentage = Math.round(totalCount > 0 ? (totalAccomplished / totalCount) * 100 : 0);

	return (
	  <WishListContext.Provider
		value={{
			items: wishes,
			addWish: handleAddWish,
			removeWish: handleRemoveWish,
			saveWish: handleSaveWish
		}}
	  >
		  <header
			className="w-full max-w-5xl m-auto rounded-b-3xl text-white bg-gradient-to-r from-purple-500 to-pink-500 text-sm px-6 py-6 text-center">
			  <div className="max-w-2xl m-auto p-6 rounded-lg">
				  <h1 className={clsx('text-5xl mb-5')}>
					  мечтай ✨
				  </h1>
				  <p className="text-base mb-3">
					  оставь свои хотелки здесь, а я сделаю все возможное, чтобы исполнить их
				  </p>
			  </div>

			  <button
				onClick={handleAddWish}
				className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
				  <span
				    className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
					  Тыкни, чтобы оставить хотелку
				  </span>
			  </button>
		  </header>

		  <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 lg:px-24 z-10">
			  <WishList/>
		  </main>

		  <footer className="w-full sticky bottom-0 z-10">
			  <div className="w-full bg-slate-300">
				  <div
					className="bg-gradient-to-r from-pink-500 to-orange-400 text-xs font-medium text-blue-100 text-center p-3 leading-none"
					style={{
						width: `${calculatedPercentage.toFixed(2)}%`,
						transition: 'width 1s'
					}}
				  >{calculatedPercentage.toFixed(2)}%
				  </div>
			  </div>
		  </footer>

	  </WishListContext.Provider>
	);
}



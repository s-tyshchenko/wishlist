'use client';
import {useEffect, useState} from 'react';
import {useFormState} from 'react-dom';
import {list} from '@/src/actions/list';
import {Wish} from '@/src/types';
import WishList from '@/src/components/WishList';
import {WishListContext} from '@/src/lib/context';
import clsx from 'clsx';
import {useInstallPrompt, usePullToRefresh} from '@/src/lib/hooks';

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

	const [isInstallable, promptInstall] = useInstallPrompt();

	usePullToRefresh();

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
		    className="w-full max-w-5xl m-auto rounded-b-3xl text-white bg-gradient-to-b from-purple-500 to-pink-500 text-sm px-6 py-6 text-center">
			  <div className="max-w-2xl m-auto p-6 rounded-lg">
				  <h1 className={clsx('text-5xl mb-5')}>
					  мечтай ✨
				  </h1>
				  <p className="text-base mb-3">
					  оставь свои хотелки здесь, а я сделаю все возможное, чтобы исполнить их
				  </p>
			  </div>

			  <div className="flex flex-col gap-1.5 items-center justify-center">
				  <button
				    onClick={handleAddWish}
				    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
					  <span
					    className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
						  оставить хотелку
					  </span>
				  </button>

				  {isInstallable && (
				    <button
					  onClick={promptInstall}
					  className="text-black focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-white/40 dark:focus:ring-gray-600 me-2 mb-2">
					    <svg className="w-5 h-5 me-2 -ms-1" aria-hidden="true" focusable="false" data-prefix="fab"
					         data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
						    <path fill="currentColor"
						          d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
					    </svg>
					    установить
				    </button>
				  )}
			  </div>
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



'use client';

import {FC, useContext, useEffect, useRef} from 'react';
import {useFormState, useFormStatus} from 'react-dom';
import {upsert} from '@/src/actions/upsert';
import {remove as removeAction} from '@/src/actions/remove';
import {Wish, WishInput} from '../types';
import {BackspaceIcon, CheckBadgeIcon, PhotoIcon} from '@heroicons/react/20/solid';
import TextareaAutosize from 'react-textarea-autosize';
import 'react-loading-skeleton/dist/skeleton.css';
import {WishListContext} from '@/src/lib/context';
import clsx from 'clsx';

interface Props {
	wish: Wish;
}

const WishItem: FC<Props> = ({wish}) => {
	const {saveWish, removeWish} = useContext(WishListContext);

	const [model, dispatch] = useFormState(upsert, wish);
	const [_, remove] = useFormState(removeAction, wish.id);

	const formRef = useRef<HTMLFormElement>(null);

	const isAccomplished = !!model?.accomplishedAt

	const handleSubmit = () => {
		if (!formRef.current) return;

		formRef.current.requestSubmit();
	}

	const handleRemove = async () => {
		if (!model) return;

		removeWish(model.id);
		await remove(model.id);
	};

	useEffect(() => {
		if (model) {
			saveWish(wish.id, model)
		}
	}, [model, wish]);

	return (
	  <form ref={formRef} className="min-w-0 h-auto relative" action={dispatch}>
		  <div className="relative">
			  <div
				className="rounded-xl shadow-sm bg-slate-100 ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
				  <label htmlFor={`content-${wish.id}`} className="sr-only">
					  What do you wish?
				  </label>
				  <TextareaAutosize
					id={`content-${wish.id}`}
					name="content"
					rows={1}
					placeholder="What do you wish today?"
					className={clsx(
					  'block w-full border-0 resize-none bg-transparent py-1.5 px-3 focus:outline-none placeholder:text-gray-400 focus:ring-0 text-base',
					  isAccomplished ? 'line-through text-gray-400' : 'text-gray-900'
					)}
					defaultValue={model?.content ?? undefined}
					onBlur={handleSubmit}
				  />
				  {model?.image && (
					<div className="px-3 pt-1 cursor-pointer">
						<img src={model.image} alt="image" className={clsx(
						  'w-full rounded-md',
						  isAccomplished && 'grayscale opacity-50'
						)}/>
					</div>
				  )}
				  <div aria-hidden="true" className="py-2">
					  <div className="py-px">
						  <div className="h-7"/>
					  </div>
				  </div>
			  </div>
			  <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
				  <div className="flex items-center space-x-3">
					  <label
						htmlFor={`file-${wish.id}`}
						className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-500 cursor-pointer"
					  >
						  <PhotoIcon aria-hidden="true" className="h-5 w-5"/>
						  <span className="sr-only">Attach a file</span>
						  <input
							id={`file-${wish.id}`}
							accept="image/*"
							name="image"
							type="file"
							className="sr-only"
							onChange={handleSubmit}
						  />
					  </label>

					  <button
						type="button"
						onClick={handleRemove}
						className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-500 cursor-pointer"
					  >
						  <BackspaceIcon aria-hidden="true" className="h-5 w-5"/>
						  <span className="sr-only">Remove</span>
					  </button>
				  </div>
				  <AccomplishedToggle wish={wish} model={model} handleSubmit={handleSubmit}/>
			  </div>
		  </div>
	  </form>
	);
};

const AccomplishedToggle: FC<{ wish: Wish, model?: Wish, handleSubmit(): void }> = ({wish, model, handleSubmit}) => {
	const {pending} = useFormStatus();

	const isAccomplished = !!model?.accomplishedAt

	return (
	  <label
		htmlFor={`accomplished-${wish.id}`}
		className={`flex h-8 w-8 items-center justify-center rounded-full hover:text-gray-500 cursor-pointer ${isAccomplished ? 'text-indigo-500' : 'text-gray-400 '} ${pending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
	  >
		  {pending ? (
			<div role="status">
				<svg aria-hidden="true" className="inline h-5 w-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
					  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
					  fill="currentColor"/>
					<path
					  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
					  fill="currentFill"/>
				</svg>
				<span className="sr-only">Loading...</span>
			</div>
		  ) : (
			<CheckBadgeIcon aria-hidden="true" className="h-6 w-6"/>
		  )}
		  <input
			id={`accomplished-${wish.id}`}
			name="accomplished"
			type="checkbox"
			defaultChecked={isAccomplished}
			className="hidden"
			onChange={handleSubmit}
		  />
	  </label>
	);
};


export default WishItem;

import {createContext} from 'react';
import {Wish} from '@/src/types';

interface WishListContextType {
	items: Wish[]
	addWish(): void
	removeWish(id: number): void
	saveWish(id: number, data: Wish): void
}

export const WishListContext = createContext<WishListContextType>({
	items: [],
	addWish() {
	},
	removeWish() {
	},
	saveWish() {
	}
});

import {FC, useContext} from 'react';
import WishItem from '@/src/components/WishItem';
import {WishListContext} from '@/src/lib/context';
import {Wish} from '@/src/types';

const WishList: FC = () => {

	const {items} = useContext(WishListContext);

	const getColumns = (items: Wish[], columns: number) => {
		const cols: Array<Array<Wish>> = Array.from({length: columns}, () => []);
		items.forEach((item, index) => {
			cols[index % columns].push(item);
		});
		return cols;
	};

	const columns = getColumns(items, 3);

	return (
	  <div className="z-10 w-full max-w-5xl font-mono text-sm">
		  <div className="lg:flex lg:space-x-4">
			  {columns.map((col, colIndex) => (
				<div key={colIndex} className="flex flex-col space-y-4 mb-4 lg:w-1/3">
					{col.map((item) => (
					  <WishItem wish={item} key={item.id}/>
					))}
				</div>
			  ))}
		  </div>
	  </div>
	);
};

export default WishList;

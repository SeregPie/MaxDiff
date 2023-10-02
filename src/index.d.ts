export interface MaxDiff<T> {
	items: Array<T>;
	progress: number;
	complete: boolean;
	result?: Array<T>;
	getCandidates(limit?: number): Array<T>;
	getOrderedPairs(): Array<[T, T]>;
	getUnorderedPairs(): Array<[T, T]>;
	getOrderedGroups(): Array<Array<T>>;
	getUnorderedGroups(): Array<Array<T>>;
	getItemsBefore(item: T): Array<T>;
	getItemsAfter(item: T): Array<T>;
	order(...items: Array<T>): void;
	orderBefore(item: T, otherItems: Iterable<T>): void;
	orderAfter(item: T, otherItems: Iterable<T>): void;
	orderFirst(item: T): void;
	orderLast(item: T): void;
	clone(): MaxDiff<T>;
}

export default function MaxDiff<T>(items: Iterable<T>): MaxDiff<T>;

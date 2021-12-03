export interface MaxDiffInstance<T> {
	items: Array<T>;
	progress: number;
	complete: boolean;
	result?: Array<T>;
	getCandidates(limit?: number): Array<T>;
	getOrderedPairs(): Array<[T, T]>;
	getUnorderedPairs(): Array<[T, T]>;
	getOrderedGroups(): Array<Array<T>>;
	getUnorderedGroups(): Array<Array<T>>;
	getItemsBefore(item: T, otherItems: Iterable<T>): Array<T>;
	getItemsAfter(item: T, otherItems: Iterable<T>): Array<T>;
	order(...items: Array<T>): void;
	orderBefore(item: T): void;
	orderAfter(item: T): void;
	orderFirst(item: T): void;
	orderLast(item: T): void;
	clone(): MaxDiffInstance<T>;
}

export interface MaxDiff<T> {
	(items: Iterable<T>): MaxDiffInstance<T>;
}

export default MaxDiff;

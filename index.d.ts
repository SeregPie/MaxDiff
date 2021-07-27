export interface MaxDiff<T> {
	items: T[]
	progress: number
	complete: boolean
	result: T[] | null
	getCandidates(limit?: number): T[]
	getOrderedPairs(): [T, T][]
	getUnorderedPairs(): [T, T][]
	getOrderedGroups(): T[][]
	getUnorderedGroups(): T[][]
	getItemsBefore(item: T, otherItems: Iterable<T>): T[]
	getItemsAfter(item: T, otherItems: Iterable<T>): T[]
	order(...items: T[]): void
	orderBefore(item: T): void
	orderAfter(item: T): void
	orderFirst(item: T): void
	orderLast(item: T): void
	clone(): MaxDiff<T>
}

export default function<T>(items: Iterable<T>): MaxDiff<T>

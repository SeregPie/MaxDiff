import BronKerbosch from '@seregpie/bron-kerbosch';
import cybele from 'cybele';

export default (items) => {
	items = [...new Set(items)];
	let getItems = () => [...items];
	let result;
	let getResult = () => {
		if (result) {
			return [...result];
		}
	};
	if (items.length < 2) {
		result = items;
	}
	let comparisons = items.map(() => items.map(() => {}));
	items.forEach((_, i) => {
		comparisons[i][i] = 0;
	});
	let getComparison = (item, otherItem) => {
		let index = items.indexOf(item);
		let otherIndex = items.indexOf(otherItem);
		return comparisons[index][otherIndex];
	};
	let setComparison = (item, otherItem) => {
		let index = items.indexOf(item);
		let otherIndex = items.indexOf(otherItem);
		comparisons[index][otherIndex] = -1;
		comparisons[otherIndex][index] = +1;
	};
	let compareItemsByOrder = getComparison;
	let compareItemsByIndex = (item, otherItem) => {
		return items.indexOf(item) - items.indexOf(otherItem);
	};
	let compareGroupsByIndex = (items, otherItems) => {
		for (
			let i = 0, ii = Math.min(items.length, otherItems.length);
			i < ii;
			i++
		) {
			let c = compareItemsByIndex(items[i], otherItems[i]);
			if (c) {
				return c;
			}
		}
		return items.length - otherItems.length;
	};
	let compareGroupsByLengthAndIndex = (items, otherItems) => {
		let c = otherItems.length - items.length;
		if (c) {
			return c;
		}
		return compareGroupsByIndex(items, otherItems);
	};
	let hasItem = (item) => {
		return items.includes(item);
	};
	let getUnorderedPairs = () => {
		let pairs = cybele.Array.proto.pairs(items).filter(([item, otherItem]) => {
			return getComparison(item, otherItem) == null;
		});
		pairs.forEach((items) => {
			items.sort(compareItemsByIndex);
		});
		pairs.sort(compareGroupsByIndex);
		return pairs;
	};
	let getOrderedPairs = () => {
		let pairs = cybele.Array.proto.pairs(items).filter(([item, otherItem]) => {
			return getComparison(item, otherItem) != null;
		});
		pairs.forEach((items) => {
			items.sort(compareItemsByOrder);
		});
		pairs.sort(compareGroupsByIndex);
		return pairs;
	};
	let getUnorderedGroups = () => {
		let groups = BronKerbosch(getUnorderedPairs());
		groups.forEach((items) => {
			items.sort(compareItemsByIndex);
		});
		groups.sort(compareGroupsByLengthAndIndex);
		return groups;
	};
	let getOrderedGroups = () => {
		let groups = BronKerbosch(getOrderedPairs());
		groups.forEach((items) => {
			items.sort(compareItemsByOrder);
		});
		groups.sort(compareGroupsByLengthAndIndex);
		return groups;
	};
	let getItemsBefore = (item) => {
		return items
			.filter((otherItem) => {
				return getComparison(otherItem, item) < 0;
			})
			.sort(compareItemsByIndex);
	};
	let getItemsAfter = (item) => {
		return items
			.filter((otherItem) => {
				return getComparison(otherItem, item) > 0;
			})
			.sort(compareItemsByIndex);
	};
	let order = (...items) => {
		items = items.filter((item) => {
			return hasItem(item);
		});
		cybele.Array.proto.pairs(items).forEach(([itemBefore, itemAfter]) => {
			if (getComparison(itemBefore, itemAfter) == null) {
				setComparison(itemBefore, itemAfter);
				let itemsBefore = getItemsBefore(itemBefore);
				let itemsAfter = getItemsAfter(itemAfter);
				itemsBefore.forEach((itemBefore) => {
					setComparison(itemBefore, itemAfter);
				});
				itemsAfter.forEach((itemAfter) => {
					setComparison(itemBefore, itemAfter);
				});
				itemsBefore.forEach((itemBefore) => {
					itemsAfter.forEach((itemAfter) => {
						setComparison(itemBefore, itemAfter);
					});
				});
			}
		});
		if (!getUnorderedPairs().length) {
			result = getItems().sort(compareItemsByOrder);
		}
	};
	let orderBefore = (item, otherItems) => {
		new Set(otherItems).forEach((otherItem) => {
			order(item, otherItem);
		});
	};
	let orderAfter = (item, otherItems) => {
		new Set(otherItems).forEach((otherItem) => {
			order(otherItem, item);
		});
	};
	let orderFirst = (item) => {
		orderBefore(item, items);
	};
	let orderLast = (item) => {
		orderAfter(item, items);
	};
	return {
		get items() {
			return getItems();
		},
		get progress() {
			let partial = getOrderedPairs().length;
			let total = partial + getUnorderedPairs().length;
			return total ? partial / total : 1;
		},
		get complete() {
			return result !== undefined;
		},
		get result() {
			return result;
		},
		getCandidates(limit = 4) {
			let groups = getUnorderedGroups();
			if (groups.length) {
				let items = cybele.Array.proto.min(groups, (items) =>
					Math.abs(items.length - limit),
				);
				items.splice(limit);
				return items;
			}
			return [];
		},
		getOrderedPairs,
		getUnorderedPairs,
		getOrderedGroups,
		getUnorderedGroups,
		getItemsBefore,
		getItemsAfter,
		order,
		orderBefore,
		orderAfter,
		orderFirst,
		orderLast,
		clone() {
			let instance = MaxDiff(items);
			let groups = getOrderedGroups();
			groups.forEach((items) => {
				instance.order(...items);
			});
			return instance;
		},
	};
};

const assert = require('assert/strict');

const MaxDiff = require('.');

{
	let instance = MaxDiff(['a']);
	assert.deepEqual(instance.items, ['a']);
	assert.equal(instance.complete, true);
	assert.equal(instance.progress, 1);
	assert.deepEqual(instance.result, ['a']);
	assert.deepEqual(instance.getUnorderedPairs(), []);
	assert.deepEqual(instance.getUnorderedGroups(), []);
	assert.deepEqual(instance.getOrderedPairs(), []);
	assert.deepEqual(instance.getOrderedGroups(), []);
	assert.deepEqual(instance.getItemsBefore('a'), []);
	assert.deepEqual(instance.getItemsAfter('a'), []);
}
{
	let instance = MaxDiff(['a', 'b']);
	assert.deepEqual(instance.items, ['a', 'b']);
	assert.equal(instance.complete, false);
	assert.equal(instance.progress, 0);
	assert.deepEqual(instance.result, undefined);
	assert.deepEqual(instance.getUnorderedPairs(), [['a', 'b']]);
	assert.deepEqual(instance.getUnorderedGroups(), [['a', 'b']]);
	assert.deepEqual(instance.getOrderedPairs(), []);
	assert.deepEqual(instance.getOrderedGroups(), []);
	assert.deepEqual(instance.getItemsBefore('a'), []);
	assert.deepEqual(instance.getItemsBefore('b'), []);
	assert.deepEqual(instance.getItemsAfter('a'), []);
	assert.deepEqual(instance.getItemsAfter('b'), []);
	instance.order('b', 'a');
	assert.equal(instance.complete, true);
	assert.equal(instance.progress, 1);
	assert.deepEqual(instance.result, ['b', 'a']);
	assert.deepEqual(instance.getUnorderedPairs(), []);
	assert.deepEqual(instance.getUnorderedGroups(), []);
	assert.deepEqual(instance.getOrderedPairs(), [['b', 'a']]);
	assert.deepEqual(instance.getOrderedGroups(), [['b', 'a']]);
	assert.deepEqual(instance.getItemsBefore('a'), ['b']);
	assert.deepEqual(instance.getItemsBefore('b'), []);
	assert.deepEqual(instance.getItemsAfter('a'), []);
	assert.deepEqual(instance.getItemsAfter('b'), ['a']);
}
{
	let instance = MaxDiff(['a', 'b', 'c']);
	assert.deepEqual(instance.items, ['a', 'b', 'c']);
	assert.equal(instance.complete, false);
	assert.equal(instance.progress, 0);
	assert.deepEqual(instance.result, undefined);
	assert.deepEqual(instance.getUnorderedPairs(), [
		['a', 'b'],
		['a', 'c'],
		['b', 'c'],
	]);
	assert.deepEqual(instance.getUnorderedGroups(), [['a', 'b', 'c']]);
	assert.deepEqual(instance.getOrderedPairs(), []);
	assert.deepEqual(instance.getOrderedGroups(), []);
	assert.deepEqual(instance.getItemsBefore('a'), []);
	assert.deepEqual(instance.getItemsBefore('b'), []);
	assert.deepEqual(instance.getItemsBefore('c'), []);
	assert.deepEqual(instance.getItemsAfter('a'), []);
	assert.deepEqual(instance.getItemsAfter('b'), []);
	assert.deepEqual(instance.getItemsAfter('c'), []);
	// finished
	let f0 = (instance) => {
		assert.equal(instance.complete, true);
		assert.equal(instance.progress, 1);
		assert.deepEqual(instance.result, ['c', 'b', 'a']);
		assert.deepEqual(instance.getUnorderedPairs(), []);
		assert.deepEqual(instance.getUnorderedGroups(), []);
		assert.deepEqual(instance.getOrderedPairs(), [
			['b', 'a'],
			['c', 'a'],
			['c', 'b'],
		]);
		assert.deepEqual(instance.getOrderedGroups(), [['c', 'b', 'a']]);
		assert.deepEqual(instance.getItemsBefore('a'), ['b', 'c']);
		assert.deepEqual(instance.getItemsBefore('b'), ['c']);
		assert.deepEqual(instance.getItemsBefore('c'), []);
		assert.deepEqual(instance.getItemsAfter('a'), []);
		assert.deepEqual(instance.getItemsAfter('b'), ['a']);
		assert.deepEqual(instance.getItemsAfter('c'), ['a', 'b']);
	};
	// b < a, c < a
	let f1 = (instance) => {
		assert.equal(instance.complete, false);
		assert.equal(instance.progress, 2 / 3);
		assert.deepEqual(instance.result, undefined);
		assert.deepEqual(instance.getUnorderedPairs(), [['b', 'c']]);
		assert.deepEqual(instance.getUnorderedGroups(), [['b', 'c']]);
		assert.deepEqual(instance.getOrderedPairs(), [
			['b', 'a'],
			['c', 'a'],
		]);
		assert.deepEqual(instance.getOrderedGroups(), [
			['b', 'a'],
			['c', 'a'],
		]);
		assert.deepEqual(instance.getItemsBefore('a'), ['b', 'c']);
		assert.deepEqual(instance.getItemsBefore('b'), []);
		assert.deepEqual(instance.getItemsBefore('c'), []);
		assert.deepEqual(instance.getItemsAfter('a'), []);
		assert.deepEqual(instance.getItemsAfter('b'), ['a']);
		assert.deepEqual(instance.getItemsAfter('c'), ['a']);
	};
	// c < a, c < b
	let f2 = (instance) => {
		assert.equal(instance.complete, false);
		assert.equal(instance.progress, 2 / 3);
		assert.deepEqual(instance.result, undefined);
		assert.deepEqual(instance.getUnorderedPairs(), [['a', 'b']]);
		assert.deepEqual(instance.getUnorderedGroups(), [['a', 'b']]);
		assert.deepEqual(instance.getOrderedPairs(), [
			['c', 'a'],
			['c', 'b'],
		]);
		assert.deepEqual(instance.getOrderedGroups(), [
			['c', 'a'],
			['c', 'b'],
		]);
		assert.deepEqual(instance.getItemsBefore('a'), ['c']);
		assert.deepEqual(instance.getItemsBefore('b'), ['c']);
		assert.deepEqual(instance.getItemsBefore('c'), []);
		assert.deepEqual(instance.getItemsAfter('a'), []);
		assert.deepEqual(instance.getItemsAfter('b'), []);
		assert.deepEqual(instance.getItemsAfter('c'), ['a', 'b']);
	};
	((instance) => {
		instance.order('b', 'a');
		assert.equal(instance.complete, false);
		assert.equal(instance.progress, 1 / 3);
		assert.deepEqual(instance.result, undefined);
		assert.deepEqual(instance.getUnorderedPairs(), [
			['a', 'c'],
			['b', 'c'],
		]);
		assert.deepEqual(instance.getUnorderedGroups(), [
			['a', 'c'],
			['b', 'c'],
		]);
		assert.deepEqual(instance.getOrderedPairs(), [['b', 'a']]);
		assert.deepEqual(instance.getOrderedGroups(), [['b', 'a']]);
		assert.deepEqual(instance.getItemsBefore('a'), ['b']);
		assert.deepEqual(instance.getItemsBefore('b'), []);
		assert.deepEqual(instance.getItemsBefore('c'), []);
		assert.deepEqual(instance.getItemsAfter('a'), []);
		assert.deepEqual(instance.getItemsAfter('b'), ['a']);
		assert.deepEqual(instance.getItemsAfter('c'), []);
		((instance) => {
			instance.order('c', 'a');
			f1(instance);
			instance.order('c', 'b');
			f0(instance);
		})(instance.clone());
		((instance) => {
			instance.order('c', 'b');
			f0(instance);
		})(instance.clone());
	})(instance.clone());
	((instance) => {
		instance.order('c', 'a');
		assert.equal(instance.complete, false);
		assert.equal(instance.progress, 1 / 3);
		assert.deepEqual(instance.result, undefined);
		assert.deepEqual(instance.getUnorderedPairs(), [
			['a', 'b'],
			['b', 'c'],
		]);
		assert.deepEqual(instance.getUnorderedGroups(), [
			['a', 'b'],
			['b', 'c'],
		]);
		assert.deepEqual(instance.getOrderedPairs(), [['c', 'a']]);
		assert.deepEqual(instance.getOrderedGroups(), [['c', 'a']]);
		assert.deepEqual(instance.getItemsBefore('a'), ['c']);
		assert.deepEqual(instance.getItemsBefore('b'), []);
		assert.deepEqual(instance.getItemsBefore('c'), []);
		assert.deepEqual(instance.getItemsAfter('a'), []);
		assert.deepEqual(instance.getItemsAfter('b'), []);
		assert.deepEqual(instance.getItemsAfter('c'), ['a']);
		((instance) => {
			instance.order('b', 'a');
			f1(instance);
			instance.order('c', 'b');
			f0(instance);
		})(instance.clone());
		((instance) => {
			instance.order('c', 'b');
			f2(instance);
			instance.order('b', 'a');
			f0(instance);
		})(instance.clone());
	})(instance.clone());
	((instance) => {
		instance.order('c', 'b');
		assert.equal(instance.complete, false);
		assert.equal(instance.progress, 1 / 3);
		assert.deepEqual(instance.result, undefined);
		assert.deepEqual(instance.getUnorderedPairs(), [
			['a', 'b'],
			['a', 'c'],
		]);
		assert.deepEqual(instance.getUnorderedGroups(), [
			['a', 'b'],
			['a', 'c'],
		]);
		assert.deepEqual(instance.getOrderedPairs(), [['c', 'b']]);
		assert.deepEqual(instance.getOrderedGroups(), [['c', 'b']]);
		assert.deepEqual(instance.getItemsBefore('a'), []);
		assert.deepEqual(instance.getItemsBefore('b'), ['c']);
		assert.deepEqual(instance.getItemsBefore('c'), []);
		assert.deepEqual(instance.getItemsAfter('a'), []);
		assert.deepEqual(instance.getItemsAfter('b'), []);
		assert.deepEqual(instance.getItemsAfter('c'), ['b']);
		((instance) => {
			instance.order('b', 'a');
			f0(instance);
		})(instance.clone());
		((instance) => {
			instance.order('c', 'a');
			f2(instance);
			instance.order('b', 'a');
			f0(instance);
		})(instance.clone());
	})(instance.clone());
}
{
	let instance = MaxDiff(['a', 'b', 'c']);
	let f = (instance) => {
		assert.equal(instance.complete, false);
		assert.equal(instance.progress, 1 / 3);
		assert.deepEqual(instance.result, undefined);
		assert.deepEqual(instance.getUnorderedPairs(), [
			['a', 'b'],
			['b', 'c'],
		]);
		assert.deepEqual(instance.getUnorderedGroups(), [
			['a', 'b'],
			['b', 'c'],
		]);
		assert.deepEqual(instance.getOrderedPairs(), [['c', 'a']]);
		assert.deepEqual(instance.getOrderedGroups(), [['c', 'a']]);
		assert.deepEqual(instance.getItemsBefore('a'), ['c']);
		assert.deepEqual(instance.getItemsBefore('b'), []);
		assert.deepEqual(instance.getItemsBefore('c'), []);
		assert.deepEqual(instance.getItemsAfter('a'), []);
		assert.deepEqual(instance.getItemsAfter('b'), []);
		assert.deepEqual(instance.getItemsAfter('c'), ['a']);
	};
	instance.order('c', 'c', 'a', 'a', 'c', 'c');
	f(instance);
	instance.order('a', 'a', 'c', 'c', 'a', 'a');
	f(instance);
	instance.order('x', 'x', 'b', 'x', 'b', 'x', 'x');
	f(instance);
}

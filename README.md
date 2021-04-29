# MaxDiff

`MaxDiff(items)`

An implementation of the [MaxDiff technique](https://en.wikipedia.org/wiki/MaxDiff) to support the discrete ordering model.

| argument | description |
| ---: | :--- |
| `items` | An iterable of the items to order. |

Returns an instance to control the process.

## demo

[Try it out!](https://seregpie.github.io/MaxDiff/)

## dependencies

- [BronKerbosch](https://github.com/SeregPie/BronKerbosch)

## setup

### npm

```shell
npm i @seregpie/max-diff
```

---

Import inside an ES module.

```javascript
import MaxDiff from '@seregpie/max-diff';
```

*or*

Import inside a CommonJS module.

```javascript
let MaxDiff = require('@seregpie/max-diff');
```

### browser

```html
<script src="https://unpkg.com/@seregpie/bron-kerbosch"></script>
<script src="https://unpkg.com/@seregpie/max-diff"></script>
```

The module is globally available as `MaxDiff`.

## usage

```javascript
let instance = MaxDiff(items);
while (!instance.complete) {
  let orderableItems = instance.getCandidates();
  let [bestItem, worstItem] = pickTwo(orderableItems);
  instance.orderBefore(bestItem, orderableItems);
  instance.orderAfter(worstItem, orderableItems);
}
console.log(instance.result);
```

## members

`.items`

*read-only*

An array as the items to order.

---

`.complete`

*read-only*

A boolean indicating whether the process is complete.

---

`.progress`

*read-only*

A number indicating the progress of the process. The range is between 0 to 1.

---

`.result`

*read-only*

An array of the items in the resulted order. The property is only valid if the process is complete.

---

`.order(...items)`

Orders the items in the given order of the arguments.

Already established comparisons between the items are immutable.

| argument | description |
| ---: | :--- |
| `...items` | Each argument is an item to order. |

```javascript
let instance = MaxDiff(['a', 'b', 'c', 'd', 'e']);
instance.order('e', 'd', 'c');
instance.order('c', 'b', 'a');
console.log(instance.result); // => ['e', 'd', 'c', 'b', 'a']
```

---

`.getCandidates(limit = 4)`

Gets the items that are the most significant candidates to be ordered as next.

| argument | description |
| ---: | :--- |
| `limit` | A number as the limit of the candidates to get. |

Returns an array.

---

`.orderBefore(item, otherItems)`

Orders an item before the other items.

Already established comparisons between the items are immutable.

| argument | description |
| ---: | :--- |
| `item` | The item to order before the other items. |
| `otherItems` | An iterable of the other items to order after the item. |

```javascript
let instance = MaxDiff(['a', 'b', 'c']);
instance.orderBefore('c', ['a', 'b']);
console.log(instance.getOrderedPairs()); // => [['c', 'a'], ['c', 'b']]
```

---

`.orderAfter(item, otherItems)`

Orders an item after the other items.

Already established comparisons between the items are immutable.

| argument | description |
| ---: | :--- |
| `item` | The item to order after the other items. |
| `otherItems` | An iterable of the other items to order before the item. |

```javascript
let instance = MaxDiff(['a', 'b', 'c']);
instance.orderAfter('a', ['b', 'c']);
console.log(instance.getOrderedPairs()); // => [['b', 'a'], ['c', 'a']]
```

---

`.orderFirst(item)`

Orders an item before all other items.

Already established comparisons between the items are immutable.

| argument | description |
| ---: | :--- |
| `item` | The item to order first. |

```javascript
let instance = MaxDiff(['a', 'b', 'c']);
instance.orderFirst('c');
console.log(instance.getOrderedPairs()); // => [['c', 'a'], ['c', 'b']]
instance.orderFirst('b');
console.log(instance.result); // => ['c', 'b', 'a']
```

---

`.orderLast(item)`

Orders an item after all other items.

Already established comparisons between the items are immutable.

| argument | description |
| ---: | :--- |
| `item` | The item to order last. |

```javascript
let instance = MaxDiff(['a', 'b', 'c']);
instance.orderLast('a');
console.log(instance.getOrderedPairs()); // => [['b', 'a'], ['c', 'a']]
instance.orderLast('b');
console.log(instance.result); // => ['c', 'b', 'a']
```

---

`.getItemsBefore(item)`

Gets all items that are ordered before an item.

The items are ordered by their initial order.

| argument | description |
| ---: | :--- |
| `item` | The item ordered after the items to get. |

Returns an array.

```javascript
let instance = MaxDiff(['a', 'b', 'c', 'd', 'e']);
instance.order('e', 'd', 'a');
instance.order('c', 'a');
console.log(instance.getItemsBefore('a')); // => ['c', 'd', 'e']
```

---

`.getItemsAfter(item)`

Gets all items that are ordered after an item.

The items are ordered by their initial order.

| argument | description |
| ---: | :--- |
| `item` | The item ordered before the items to get. |

Returns an array.

```javascript
let instance = MaxDiff(['a', 'b', 'c', 'd', 'e']);
instance.order('e', 'b', 'a');
instance.order('e', 'c');
console.log(instance.getItemsAfter('e')); // => ['a', 'b', 'c']
```

---

`.getUnorderedPairs()`

Gets the pairs of the items where the order between the items is unknown.

The items are ordered by their initial order.

Returns an array of arrays.

```javascript
let instance = MaxDiff(['a', 'b', 'c']);
console.log(instance.getUnorderedPairs()); // => [['a', 'b'], ['a', 'c'], ['b', 'c']]
instance.order('c', 'b');
console.log(instance.getUnorderedPairs()); // => [['a', 'b'], ['a', 'c']]
instance.order('b', 'a');
console.log(instance.getUnorderedPairs()); // => []
```

---

`.getOrderedPairs()`

Gets the pairs of the items where the order between the items is known.

The items are ordered by their resulted order.

Returns an array of arrays.

```javascript
let instance = MaxDiff(['a', 'b', 'c']);
console.log(instance.getOrderedPairs()); // => []
instance.order('c', 'b');
console.log(instance.getOrderedPairs()); // => [['c', 'b']]
instance.order('b', 'a');
console.log(instance.getOrderedPairs()); // => [['b', 'a'], ['c', 'a'], ['c', 'b']]
```

---

`.getUnorderedGroups()`

Gets the groups of the items where the order between the items is unknown.

The groups are ordered by their decreasing length. The items are ordered by their initial order.

Returns an array of arrays.

```javascript
let instance = MaxDiff(['a', 'b', 'c', 'd']);
console.log(instance.getUnorderedGroups()); // => [['a', 'b', 'c', 'd']]
instance.order('d', 'a');
instance.order('b', 'a');
console.log(instance.getUnorderedPairs()); // => [['a', 'c'], ['b', 'c'], ['b', 'd'], ['c', 'd']]
console.log(instance.getUnorderedGroups()); // => [['b', 'c', 'd'], ['a', 'c']]
instance.order('d', 'c', 'b');
console.log(instance.getUnorderedGroups()); // => []
```

---

`.getOrderedGroups()`

Gets the groups of the items where the order between the items is known.

The groups are ordered by their decreasing length. The items are ordered by their resulted order.

Returns an array of arrays.

```javascript
let instance = MaxDiff(['a', 'b', 'c', 'd']);
console.log(instance.getOrderedGroups()); // => []
instance.order('d', 'c', 'b');
instance.order('d', 'a');
console.log(instance.getOrderedPairs()); // => [['c', 'b'], ['d', 'a'], ['d', 'b'], ['d', 'c']]
console.log(instance.getOrderedGroups()); // => [['d', 'c', 'b'], ['d', 'a']]
instance.order('b', 'a');
console.log(instance.getOrderedGroups()); // => [['d', 'c', 'b', a']]
```

---

`.clone()`

Clones this instance.

Returns a new instance.

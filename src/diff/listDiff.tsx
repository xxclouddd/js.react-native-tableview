const Notfound = Number.MAX_VALUE;

const identity = <T extends {}>(t: T): T => t;
const refEqual = <T extends {}>(o: T, n: T): boolean => o === n;

export type IndexPath = { section: number; item: number };
export type ListMoveIndex = { from: number; to: number };
export type ListMoveIndexPath = { from: IndexPath; to: IndexPath };
export type Op = {
  deletes: number[];
  inserts: number[];
  updates: number[];
  moves: ListMoveIndex[];
};

enum Counter {
  ZERO,
  ONE,
  TWO,
  MANY,
}

class SymbolEntry {
  oc: Counter;
  nc: Counter;
  olno: number[];
  constructor() {
    this.oc = Counter.ZERO;
    this.nc = Counter.ZERO;
    this.olno = [];
  }

  get occursInBoth(): boolean {
    return this.oc !== Counter.ZERO && this.nc !== Counter.ZERO;
  }
}

class Index {
  constructor(public index: number) {}
}

const incrementCounter = (counter: Counter): Counter => {
  switch (counter) {
    case Counter.ZERO:
      return Counter.ONE;
    case Counter.ONE:
      return Counter.MANY;
    case Counter.MANY:
      return Counter.MANY;
  }
};

type Entry = SymbolEntry | Index;

// https://github.com/mcudich/HeckelDiff/blob/master/Source/Diff.swift
// https://gist.github.com/ndarville/3166060
// http://documents.scribd.com/docs/10ro9oowpo1h81pgh1as.pdf

export const diff = <T extends {}>(
  oldItems: T[],
  newItems: T[],
  key: (item: T) => any = identity,
  equal: (oldItem: T, newItem: T) => boolean = refEqual
): Op => {
  const newCount = newItems ? newItems.length : 0;
  const oldCount = oldItems ? oldItems.length : 0;

  if (newCount === 0) {
    return {
      deletes: [...Array(oldCount).keys()],
      inserts: [],
      moves: [],
      updates: [],
    };
  }
  if (oldCount === 0) {
    return {
      inserts: [...Array(newCount).keys()],
      deletes: [],
      moves: [],
      updates: [],
    };
  }

  const table = new Map<any, SymbolEntry>();
  const oa: Entry[] = [];
  const na: Entry[] = [];

  // pass 1
  newItems.forEach((item) => {
    const itemKey = key(item);
    const entry = table.get(itemKey) || new SymbolEntry();
    table.set(itemKey, entry);
    entry.nc = incrementCounter(entry.nc);
    na.push(entry);
  });

  // pass 2
  oldItems.forEach((item, index) => {
    const itemKey = key(item);
    const entry = table.get(itemKey) || new SymbolEntry();
    table.set(itemKey, entry);
    entry.oc = incrementCounter(entry.oc);
    entry.olno.push(index);
    oa.push(entry);
  });

  // pass 3
  na.forEach((entry, index) => {
    if (
      entry instanceof SymbolEntry &&
      entry.occursInBoth &&
      entry.olno.length > 0
    ) {
      const oldIndex = entry.olno.shift();
      na[index] = new Index(oldIndex);
      oa[oldIndex] = new Index(index);
    }
  });

  // pass 4
  for (let i = 1; i < na.length - 1; i += 1) {
    const entry = na[i];
    if (!(entry instanceof Index)) {
      continue;
    }
    const j = entry.index;
    if (j + 1 >= oa.length) {
      continue;
    }
    const newEntry = na[i + 1];
    const oldEntry = oa[j + 1];
    if (
      !(newEntry instanceof SymbolEntry) ||
      !(oldEntry instanceof SymbolEntry)
    ) {
      continue;
    }
    if (newEntry !== oldEntry) {
      continue;
    }
    na[i + 1] = new Index(j + 1);
    oa[j + 1] = new Index(i + 1);
  }

  // pass 5
  for (let i = na.length - 1; i > 0; i -= 1) {
    const entry = na[i];
    if (!(entry instanceof Index)) {
      continue;
    }
    const j = entry.index;
    if (j - 1 < 0) {
      continue;
    }
    const newEntry = na[i - 1];
    const oldEntry = oa[j - 1];
    if (
      !(newEntry instanceof SymbolEntry) ||
      !(oldEntry instanceof SymbolEntry)
    ) {
      continue;
    }
    if (newEntry !== oldEntry) {
      continue;
    }
    na[i - 1] = new Index(j - 1);
    oa[j - 1] = new Index(i - 1);
  }

  const moves: ListMoveIndex[] = [];
  const inserts = new Set<number>();
  const updates = new Set<number>();
  const deletes = new Set<number>();
  const deleteOffsets = new Map<number, number>();
  const insertOffsets = new Map<number, number>();

  let runningOffset = 0;

  oa.forEach((item, index) => {
    deleteOffsets.set(index, runningOffset);
    if (!(item instanceof SymbolEntry)) {
      return;
    }
    deletes.add(index);
    runningOffset += 1;
  });

  runningOffset = 0;

  na.forEach((item, index) => {
    if (item instanceof SymbolEntry) {
      inserts.add(index);
      runningOffset += 1;
    } else {
      const oldIndex = item.index;
      if (!equal(oldItems[oldIndex], newItems[index])) {
        updates.add(index);
      }
      const deleteOffset = deleteOffsets.get(oldIndex) || 0;
      if (oldIndex - deleteOffset + runningOffset !== index) {
        moves.push({ from: oldIndex, to: index });
      }
    }
  });

  return {
    deletes: Array.from(deletes),
    inserts: Array.from(inserts),
    updates: Array.from(updates),
    moves,
  };
};

export default {};

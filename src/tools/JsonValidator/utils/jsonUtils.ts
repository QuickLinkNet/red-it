interface JsonStats {
  objects: number;
  arrays: number;
  strings: number;
  numbers: number;
  booleans: number;
  nulls: number;
  totalKeys: number;
  maxDepth: number;
  size: number;
}

export function calculateJsonStats(obj: any, depth = 0): Omit<JsonStats, 'size'> {
  const stats = {
    objects: 0,
    arrays: 0,
    strings: 0,
    numbers: 0,
    booleans: 0,
    nulls: 0,
    totalKeys: 0,
    maxDepth: depth
  };

  if (obj === null) {
    stats.nulls++;
  } else if (Array.isArray(obj)) {
    stats.arrays++;
    obj.forEach(item => {
      const childStats = calculateJsonStats(item, depth + 1);
      stats.objects += childStats.objects;
      stats.arrays += childStats.arrays;
      stats.strings += childStats.strings;
      stats.numbers += childStats.numbers;
      stats.booleans += childStats.booleans;
      stats.nulls += childStats.nulls;
      stats.totalKeys += childStats.totalKeys;
      stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth);
    });
  } else if (typeof obj === 'object') {
    stats.objects++;
    const keys = Object.keys(obj);
    stats.totalKeys += keys.length;
    keys.forEach(key => {
      const childStats = calculateJsonStats(obj[key], depth + 1);
      stats.objects += childStats.objects;
      stats.arrays += childStats.arrays;
      stats.strings += childStats.strings;
      stats.numbers += childStats.numbers;
      stats.booleans += childStats.booleans;
      stats.nulls += childStats.nulls;
      stats.totalKeys += childStats.totalKeys;
      stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth);
    });
  } else if (typeof obj === 'string') {
    stats.strings++;
  } else if (typeof obj === 'number') {
    stats.numbers++;
  } else if (typeof obj === 'boolean') {
    stats.booleans++;
  }

  return stats;
}
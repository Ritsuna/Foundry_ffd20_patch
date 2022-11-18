console.log('FFD20 PATCH 🩹 | Applying Item Range migration fix');

function fixItemUpdate(wrapped, update, ...args) {
	const prefix = game.release.generation >= 10 ? 'system' : 'data';
	const mi = update[prefix]?.range?.maxIncrements;
	if (mi !== undefined) {
		update[`${prefix}.range.maxIncrements`] = mi;
		delete update[prefix].range.maxIncrements;
		if (isObjectEmpty(update[prefix].range)) delete update[prefix].range;
		if (isObjectEmpty(update[prefix])) delete update[prefix];
	}
	return wrapped(update, ...args);
}

libWrapper.register('ffd20-patch', 'CONFIG.Item.documentClass.prototype.update', fixItemUpdate);
// TODO: Convert to preUpdate hook usage?

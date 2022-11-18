Hooks.once('ffd20.postReady', () => {
	console.log('FFD20 PATCH 🩹 | Applying CompendiumBrowser overrides');
	const cb = game.ffd20.applications.CompendiumBrowser

	const origMapB = cb.prototype._mapBestiary;
	cb.prototype._mapBestiary = function (result, item) {
		try {
			return origMapB.call(this, result, item);
		}
		catch (err) {
			console.error('FFD20 PATCH 🩹 | Error:', err, item);
			throw err;
		}
	};

	const origMapE = cb.prototype._mapEntry;
	cb.prototype._mapEntry = function (pack, item) {
		// mimic .itemTypes
		if (!('itemTypes' in item)) {
			Object.defineProperty(item, 'itemTypes', {
				get() {
					const types = Object.fromEntries(game.system.entityTypes.Item.map(t => [t, []]));
					for (const i of this.items.values()) {
						types[i.data.type].push(i);
					}
					return types;
				}
			});
		}
		return origMapE.call(this, pack, item);
	};
});

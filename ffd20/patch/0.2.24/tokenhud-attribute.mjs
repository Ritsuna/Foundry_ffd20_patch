console.log('FFD20 PATCH 🩹 | Applying Token HUD attribute adjustment mitigation');

Hooks.on('modifyTokenAttribute', ({ attribute, _value, _isDelta, isBar } = {}, updates) => {
	if (/^resources/.test(attribute)) return; // Ignore item updates
	if (/^attributes.hp/.test(attribute)) return; // ignore HP changes
	if (isBar) {
		const newUpdates = {};
		for (const [k, v] of Object.entries(updates)) {
			if (!/\.value$/.test(k)) {
				delete updates[k];
				newUpdates[`${k}.value`] = v;
			}
		}
		mergeObject(updates, newUpdates);
	}
});

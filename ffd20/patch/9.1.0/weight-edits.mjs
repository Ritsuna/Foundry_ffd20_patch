console.log('FFD20 PATCH 🩹 | Fix Item Weight editing...');

Hooks.on('preUpdateItem', function fixItemWeight(item, update, options, userId) {
	const newWeight = getProperty(update, 'data.baseWeight');
	if (newWeight !== undefined) {
		item.data.update({ 'data.weight': newWeight });
	}
});

function fixRollFFD20(wrapped, data, ...args) {
	if (data.class === 'RollFFD$20') data.class = 'RollFFD20';
	return wrapped(data, ...args);
}

Hooks.once('init', () => {
	const version = game.system.version ?? game.system.data.version;
	if (version !== '10.1.1') return;

	console.log('FFD20 PATCH 🩹 | Overloading Roll.fromData to mitigate RollFFD$20 errors')
	libWrapper.register('ffd20-patch', 'Roll.fromData', fixRollFFD20, libWrapper.WRAPPER);
});

console.log('FFD20 PATCH 🩹 | Blindsense/Blindsight ignores walls')

Hooks.once('ffd20PostInit', () => {
	if ((game.release?.generation ?? 8) < 10) return;
	if (isNewerVersion('10.1.2', game.system.version)) return;

	CONFIG.Canvas.detectionModes.blindSense.walls = true;
	CONFIG.Canvas.detectionModes.blindSight.walls = true;
});

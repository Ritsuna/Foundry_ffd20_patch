// Fix missing FCB data in roll data

function restoreFCB(actor, result) {
	Object.entries(result.classes ?? {})
		.forEach(([key, cls]) => {
			cls.fc = duplicate(actor.classes?.[key]?.fc ?? cls.fc ?? {});
		});
}

Hooks.once('init', () => {
	if (game.release.generation >= 10) {
		if (isNewerVersion(game.system.version, '10.1.2')) return;

		console.log('FFD20 PATCH 🩹 | Re-filling FCB info in roll data: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1751')

		Hooks.on('ffd20GetRollData', restoreFCB);
	}
});

const altsheetId = 'ffd20-alt-sheet';
const altsheet = game.modules.get(altsheetId);

console.log('FFD20 PATCH 🩹 | FFD20 Alt Sheet 0.7.6 damages incompatible new senses data.');

function disableAltSheet() {
	const config = game.settings.get('core', 'moduleConfiguration');
	config[altsheetId] = false;
	game.settings.set('core', 'moduleConfiguration', config);
}

if (altsheet !== undefined) {
	if (!isNewerVersion(altsheet.version ?? altsheet.data?.version, '0.7.6')) {
		if (altsheet.active) {
			const msg = 'FFD20 Alt Sheet 0.7.6 is incompatible with FFD20 0.80.22 and newer.';
			ui.notifications.warn(msg, { permanent: true });
			console.log(msg);

			if (game.user.isGM) setTimeout(disableAltSheet, 1_000);
		}
		else {
			const msg = 'FFD20 Alt Sheet 0.7.6 is incompatible with FFD20 0.80.22 and newer. It was disabled forcibly if it was enabled.';
			console.log(msg);
			ui.notifications.warn(msg);
		}
	}
}

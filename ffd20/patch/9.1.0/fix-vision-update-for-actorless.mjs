// Can not be dynamically imported

// Library module means this is loaded before game system, so init hook runs before FFD20
Hooks.once('init', () => {
	if (game.release?.generation >= 10) return;
	if (game.system.data?.version !== '9.0.0') return;

	Hooks.once('ffd20.postInit', () => {
		console.log('FFD20 PATCH 🩹 | Token vision update breaks with actorless tokens: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1429');

		const orig = CONFIG.Token.objectClass.prototype.updateVisionSource;
		CONFIG.Token.objectClass.prototype.updateVisionSource = function (...args) {
			if (!this.actor) return CONFIG.Token.objectClass.__proto__.prototype.updateVisionSource.call(this, ...args);
			return orig.call(this, ...args);
		}
	});
});

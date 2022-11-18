function getRadiusLLVFix(wrapped) {
	if (this.object?.document?.getFlag('ffd20', 'disableLowLight')) return { dim: this.data.dim, bright: this.data.bright };
	return wrapped.call(this);
}

const fixDisableLowLight = () => {
	if (game.release.generation >= 10) {
		if (isNewerVersion(game.system.version, '10.1.2')) return;
		console.log('FFD20 PATCH 🩹 | Fxing light source disable low-light toggle: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1736')
		libWrapper.register('ffd20-patch', 'LightSource.prototype.getRadius', getRadiusLLVFix, libWrapper.MIXED);
	}
}

Hooks.once('init', fixDisableLowLight);

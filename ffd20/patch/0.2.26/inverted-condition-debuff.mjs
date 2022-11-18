{
	console.log('FFD20 PATCH 🩹 | Applying inverted condition debuff mitigation');

	const orig_getAbilityModifier = CONFIG.Actor.documentClass.getAbilityModifier;
	CONFIG.Actor.documentClass.getAbilityModifier = function (score = null, options = {}) {
		if (score != null) {
			options.penalty = Math.abs(options.penalty ?? 0);
			options.damage = Math.abs(options.damage ?? 0);
		}
		return orig_getAbilityModifier.call(this, score, options);
	}
}

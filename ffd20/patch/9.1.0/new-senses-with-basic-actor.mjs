// https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1435

// Library module means this is loaded before game system, so init hook runs before FFD20
Hooks.once('init', () => {
	if (game.release?.generation >= 10) return;
	if (!['9.0.0'].includes(game.system.data?.version)) return;

	Hooks.once('ffd20.postInit', () => {
		console.log('FFD20 PATCH 🩹 | Basic actors behave badly with LLV: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1435');

		// const origlowLightMultiplier = CONFIG.Canvas.layers.sight.layerClass.prototype.lowLightMultiplier;
		CONFIG.Canvas.layers.sight.layerClass.prototype.lowLightMultiplier = function () {
			const result = { dim: 1, bright: 1 };

			const relevantTokens = canvas.tokens.placeables.filter((o) => o.actor && o.actor.testUserPermission(game.user, 'OBSERVER'));
			const lowLightTokens = relevantTokens.filter((o) => !!o.actor && o.actor.type !== 'basic' && o.actor.data.data.traits.senses.ll.enabled);

			if (game.user.isGM || game.settings.get('ffd20', 'lowLightVisionMode')) {
				for (const t of lowLightTokens.filter((o) => o._controlled)) {
					const multiplier = t.actor?.data.data.traits.senses.ll.multiplier.dim || 2;
					const multiplierBright = t.actor?.data.data.traits.senses.ll.multiplier.bright || 2;
					result.dim = Math.max(result.dim, multiplier);
					result.bright = Math.max(result.bright, multiplierBright);
				}
			}
			else {
				const hasControlledTokens = relevantTokens.filter((o) => o._controlled).length > 0,
					hasControlledLowLightTokens = lowLightTokens.filter((o) => o._controlled).length > 0,
					hasLowLightTokens = lowLightTokens.length > 0;
				if (!hasControlledTokens && hasLowLightTokens || hasControlledLowLightTokens) {
					for (const t of lowLightTokens) {
						const mult = t.actor?.data.data.traits.senses.ll.multiplier.dim || 2;
						const multBright = t.actor?.data.data.traits.senses.ll.multiplier.bright || 2;
						result.dim = Math.max(result.dim, mult);
						result.bright = Math.max(result.bright, multBright);
					}
				}
			}

			return result;
		}
	});
});

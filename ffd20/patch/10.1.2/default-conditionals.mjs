console.log('FFD20 PATCH 🩹 | Set default ON conditionals in attack dialog: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1674')

/**
 * @param {Application} app
 * @param {JQuery} jq
 * @param {Object} options
 */
function fixDefaultOnConditonals(app, [html], options) {
	if (!options.item.conditionals.some(c => c.default)) return; // No default on

	const conds = html.querySelector('.conditionals');

	options.item?.conditionals?.forEach((cond, index) => {
		const name = `conditional.${index}`;
		if (app.conditionals[name] !== undefined) return;
		app.conditionals[name] = cond.default;
		if (cond.default) {
			const toggle = conds.querySelector(`[name='${name}']`);
			if (toggle) toggle.checked = true;
		}
	});
}

Hooks.on('renderAttackDialog', fixDefaultOnConditonals);

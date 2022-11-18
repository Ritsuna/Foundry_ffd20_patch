console.log('FFD20 PATCH 🩹 | Mitigating conditional duplication bug');

/**
 * @param {Item} item
 * @param {Object} update
 * @param {Object} options
 * @param {String} userId
 */
function fixConditionalDuplication(item, update) {
	const actions = update.data?.actions;
	if (!(actions?.length > 0)) return;

	let conflict = false;
	actions.forEach(act => {
		const conditionalIds = new Set();
		act.conditionals.forEach(cond => {
			let id = cond._id;
			if (conditionalIds.has(id)) {
				console.log(`FFD20 PATCH 🩹 | Conditional ID conflict detected: %c${id}%c for item:`,
					'color:goldenrod', 'color:unset', item);
				id = cond._id = foundry.utils.randomID();
				conflict = true;
			}
			conditionalIds.add(id);
		});
	});

	if (conflict) console.log('FFD20 PATCH 🩹 | Conditional ID conflict fixed');
}

Hooks.on('preUpdateItem', fixConditionalDuplication);

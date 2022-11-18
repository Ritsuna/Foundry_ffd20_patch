// https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1420

// Library module means this is loaded before game system, so init hook runs before FFD20
Hooks.once('init', () => {
	if (game.release.generation >= 10) return;
	if (game.system.data?.version !== '9.0.0') return;

	Hooks.once('ffd20.postInit', () => {
		console.log('FFD20 PATCH 🩹 | Misparsed shield data in getRollData: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1420');

		game.ffd20.documents.ActorFFD20.prototype.getRollData = function getRollData(options = { refresh: false }) {
			let result;

			// Return cached data, if applicable
			const skipRefresh = !options.refresh && this._rollData;
			if (skipRefresh) {
				result = this._rollData;

				// Clear certain fields
				const clearFields = CONFIG.FFD20.temporaryRollDataFields.actor;
				for (const k of clearFields) {
					const arr = k.split('.');
					const k2 = arr.slice(0, -1).join('.');
					const k3 = arr.slice(-1)[0];
					if (k2 === '') delete result[k];
					else {
						const obj = getProperty(result, k2);
						if (typeof obj === 'object') delete obj[k3];
					}
				}
			}
			else {
				result = deepClone(this.data.data);
			}

			/* ----------------------------- */
			/* Always add the following data
				/* ----------------------------- */
			// Add combat round, if in combat
			if (game.combats?.viewed) {
				result.combat = {
					round: game.combat.round || 0,
				};
			}

			// Add denied Dex to AC
			setProperty(result, 'conditions.loseDexToAC', this.flags.loseDexToAC);

			// Return cached data, if applicable
			if (skipRefresh) return result;

			/* ----------------------------- */
			/* Set the following data on a refresh
				/* ----------------------------- */
			// Set size index
			{
				const sizeChart = Object.keys(CONFIG.FFD20.sizeChart);
				result.size = sizeChart.indexOf(result.traits.size);
			}

			// Add more info for formulas
			result.armor = { type: 0 };
			result.shield = { type: 0 };

			// Determine equipped armor type
			const armorId = result.equipment.armor.id,
				shieldId = result.equipment.shield.id;
			const eqArmor = { total: Number.NEGATIVE_INFINITY, ac: 0, enh: 0 };
			const armor = armorId ? this.items.get(armorId) : null;
			if (armor) {
				result.armor.type = result.equipment.armor.type;
				const armorData = armor.data.data;
				const enhAC = armorData.armor.enh ?? 0,
					baseAC = armorData.armor.value ?? 0,
					fullAC = baseAC + enhAC;
				if (eqArmor.total < fullAC) {
					eqArmor.ac = baseAC;
					eqArmor.total = fullAC;
					eqArmor.enh = enhAC;
				}
			}
			if (!Number.isFinite(eqArmor.total)) eqArmor.total = 0;
			mergeObject(result.armor, eqArmor);

			// Determine equipped shield type
			const shield = shieldId ? this.items.get(shieldId) : null;
			const eqShield = { total: Number.NEGATIVE_INFINITY, ac: 0, enh: 0 };
			if (shield) {
				result.shield.type = result.equipment.shield.type;
				const shieldData = shield.data.data;
				const enhAC = shieldData.armor.enh ?? 0,
					baseAC = shieldData.armor.value ?? 0,
					fullAC = baseAC + enhAC;
				if (eqShield.total < fullAC) {
					eqShield.ac = baseAC;
					eqShield.total = fullAC;
					eqShield.enh = enhAC;
				}
			}
			mergeObject(result.shield, eqShield);

			// Add spellbook info
			result.spells = result.attributes.spells.spellbooks;
			for (const [k, book] of Object.entries(result.spells)) {
				book.abilityMod = result.abilities[book.ability]?.mod ?? 0;
				// Add alias
				if (book.class && book.class !== '_hd') result.spells[book.class] ??= book;
			}

			// Add item dictionary flags
			if (this.itemFlags) result.dFlags = this.itemFlags.dictionary;

			// Add range info
			result.range = this.constructor.getReach(this.data.data.traits.size, this.data.data.traits.stature);

			this._rollData = result;

			// Call hook
			Hooks.callAll('ffd20.getRollData', this, result, true);

			return result;
		}
	});
});

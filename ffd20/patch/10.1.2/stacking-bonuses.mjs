Hooks.once('ffd20PostInit', () => {
	if ((game.release?.generation ?? 8) < 10) return;
	if (isNewerVersion('10.1.2', game.system.version)) return;

	console.log('FFD20 PATCH 🩹 | Stacking bonuses fix: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1749')

	function fixedApplyChange(actor, targets = null, { applySourceInfo = true } = {}) {
		// Prepare change targets
		if (!targets) {
			targets = ffd20.documents.actor.changes.getChangeFlat.call(actor, this.subTarget, this.modifier);
			if (!(targets instanceof Array)) targets = [targets];
		}

		const rollData = this.parent ? this.parent.getRollData({ refresh: true }) : actor.getRollData({ refresh: true });

		const overrides = actor.changeOverrides;
		for (const t of targets) {
			const override = overrides[t];
			if (!overrides || override) {
				let operator = this.operator;
				if (operator === '+') operator = 'add';
				if (operator === '=') operator = 'set';

				const modifierChanger =
					t != null ? t.match(/^system\.abilities\.([a-zA-Z\d]+)\.(?:total|penalty|base)$/) : null;
				const isModifierChanger = modifierChanger != null;
				const abilityTarget = modifierChanger?.[1];
				const ability = isModifierChanger ? deepClone(actor.system.abilities[abilityTarget]) : null;

				let value = 0;
				if (this.formula) {
					if (operator === 'script') {
						if (!game.settings.get('ffd20', 'allowScriptChanges')) {
							ui.notifications?.warn(game.i18n.localize('SETTINGS.ffd20AllowScriptChangesE'), { console: false });
							console.warn(game.i18n.localize('SETTINGS.ffd20AllowScriptChangesE'), this.parent);
							value = 0;
							operator = 'add';
						}
						else {
							const fn = this.createFunction(this.formula, ['d', 'item']);
							const result = fn(rollData, this.parent);
							value = result.value;
							operator = result.operator;
						}
					}
					else if (operator === 'function') {
						value = this.formula(rollData, this.parent);
						operator = 'add';
					}
					else if (!isNaN(this.formula)) {
						value = parseFloat(this.formula);
					}
					else if (this.isDeferred) {
						value = RollFFD20.replaceFormulaData(this.formula, rollData, { missing: 0 });
					}
					else {
						value = RollFFD20.safeRoll(this.formula, rollData, [t, this, rollData], {
							suppressError: this.parent && !this.parent.testUserPermission(game.user, 'OWNER'),
						}).total;
					}
				}

				this.data.value = value;

				if (!t) continue;
				const prior = override[operator][this.modifier] ?? 0;

				switch (operator) {
					case 'add':
						{
							let base = getProperty(actor, t);

							// Don't change non-existing ability scores
							if (base == null) {
								if (t.match(/^system\.abilities/)) continue;
								base = 0;
							}

							if (typeof base === 'number') {
								if (CONFIG.FFD20.stackingBonusModifiers.indexOf(this.modifier) !== -1) {
									setProperty(actor, t, base + value);
									override[operator][this.modifier] = prior + value;
								}
								else {
									const diff = !prior ? value : Math.max(0, value - prior);
									setProperty(actor, t, base + diff);
									override[operator][this.modifier] = Math.max(prior, value);
								}
							}
						}
						break;

					case 'set':
						setProperty(actor, t, value);
						override[operator][this.modifier] = value;
						break;
				}

				if (applySourceInfo) this.applySourceInfo(actor, value);

				// Adjust ability modifier
				if (isModifierChanger) {
					const prevMod = ffd20.utils.getAbilityModifier(ability.total, {
						damage: ability.damage,
						penalty: ability.penalty,
					});
					const newAbility = actor.system.abilities[abilityTarget];
					const mod = ffd20.utils.getAbilityModifier(newAbility.total, {
						damage: newAbility.damage,
						penalty: newAbility.penalty,
					});
					setProperty(
						actor,
						`system.abilities.${abilityTarget}.mod`,
						getProperty(actor, `system.abilities.${abilityTarget}.mod`) - (prevMod - mod)
					);
				}
			}
		}
	}

	ffd20.components.ItemChange.prototype.applyChange = fixedApplyChange;
});

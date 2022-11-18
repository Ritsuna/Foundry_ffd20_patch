// https://gitlab.com/Furyspark/foundryvtt-pathfinder1/-/issues/1348

console.log('FFD20 PATCH 🩹 | NaN Power Attack with skipped dialog: https://gitlab.com/Furyspark/foundryvtt-pathfinder1/-/issues/1350');

// This is copy of the entire addAttacks function with the fix
const addAttacksWithPowerAttackNaNFix = async function (shared) {
	for (let a = 0; a < shared.attacks.length; a++) {
		const atk = shared.attacks[a];

		// Combine conditional modifiers for attack and damage
		const conditionalParts = {
			'attack.normal': [
				...shared.conditionalPartsCommon[`attack.attack.${a}.normal`] ?? [],
				...shared.conditionalPartsCommon['attack.allAttack.normal'] ?? [],
			], // `
			'attack.crit': [
				...shared.conditionalPartsCommon[`attack.attack.${a}.crit`] ?? [],
				...shared.conditionalPartsCommon['attack.allAttack.crit'] ?? [],
			], // `
			'damage.normal': [
				...shared.conditionalPartsCommon[`damage.attack.${a}.normal`] ?? [],
				...shared.conditionalPartsCommon['damage.allDamage.normal'] ?? [],
			], // `
			'damage.crit': [
				...shared.conditionalPartsCommon[`damage.attack.${a}.crit`] ?? [],
				...shared.conditionalPartsCommon['damage.allDamage.crit'] ?? [],
			], // `
			'damage.nonCrit': [
				...shared.conditionalPartsCommon[`damage.attack.${a}.nonCrit`] ?? [],
				...shared.conditionalPartsCommon['damage.allDamage.nonCrit'] ?? [],
			], // `
		};

		shared.rollData.attackCount = a;

		// Create attack object
		const attack = new game.ffd20.chat.ChatAttack(this, {
			label: atk.label,
			primaryAttack: shared.rollData.item?.primaryAttack !== false,
			rollData: shared.rollData,
			targets: game.user.targets,
		});

		if (atk.id !== 'manyshot') {
			// Add attack roll
			await attack.addAttack({
				extraParts: duplicate(shared.attackBonus).concat([atk.attackBonus]),
				conditionalParts,
			});

			// Add damage
			if (this.hasDamage) {
				const extraParts = duplicate(shared.damageBonus);
				const nonCritParts = [];
				const critParts = [];

				// Add power attack bonus
				if (shared.rollData.powerAttackBonus >= 0) {
					// Get label
					const label = ['rwak', 'rsak'].includes(this.data.data.actionType)
						? game.i18n.localize('FFD20.DeadlyAim')
						: game.i18n.localize('FFD20.PowerAttack');

					const powerAttackBonus = shared.rollData.powerAttackBonus;
					const powerAttackCritBonus = powerAttackBonus * (shared.rollData.item?.powerAttack?.critMultiplier ?? 1);
					nonCritParts.push(`${powerAttackBonus}[${label}]`);
					critParts.push(`${powerAttackCritBonus}[${label}]`);
				}

				// Add manyshot damage
				// @TODO: could be cleaner in regards to chat output
				if (shared.manyShot && a === 0) {
					await attack.addDamage({ extraParts: [...extraParts, ...nonCritParts], critical: false, conditionalParts });
				}

				// Add damage
				await attack.addDamage({ extraParts: [...extraParts, ...nonCritParts], critical: false, conditionalParts });

				// Add critical hit damage
				if (attack.hasCritConfirm) {
					await attack.addDamage({ extraParts: [...extraParts, ...critParts], critical: true, conditionalParts });
				}
			}

			// Add attack notes
			if (a === 0) attack.addAttackNotes();
		}

		// Add effect notes
		if (atk.id !== 'manyshot') {
			attack.addEffectNotes();
		}

		// Add to list
		shared.chatAttacks.push(attack);

		// Add a reference to the attack that created this chat attack
		atk.chatAttack = attack;
	}

	// Cleanup rollData
	delete shared.rollData.attackCount;
};

game.ffd20.ItemAttack.addAttacks = addAttacksWithPowerAttackNaNFix;

/**
 * Fixes various vision problems
 *
 * ✔ Settings are disabled: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1681
 * ✔ Advanced configuration is thrown away: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1692
 * ✘ Basic vision is replaced with darkvision: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1693
 * ☐ See invisiiblity is limited to darkvision: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1694
 * ✔ Vision is force enabled on all: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1695
 */

/* global ffd20 */

Hooks.once('init', () => {
	if ((game.release?.generation ?? 8) < 10) return;
	if (isNewerVersion('10.1.2', game.system.version)) return;

	console.log('FFD20 PATCH 🩹 | Re-enabling vision settings: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1681')
	const reEnableElement = (el) => el.disabled = false;

	/**
	 * @param {Element} html
	 */
	const reEnableVision = (html) => {
		setTimeout(() => {
			const tab = html.querySelector('.tab[data-tab="vision"]');
			tab.querySelectorAll('input,select').forEach(el => {
				if (el.name == 'sight.visionMode') return;
				// console.log(el.name);
				if (el.disabled == false) setTimeout(() => reEnableElement(el), 500); // hacky method to attempt to ensure async functions happen after FFD20
				else el.disabled = false;
			});
		},
		200);
	}

	/**
	 * @param {JQuery} html
	 */
	Hooks.on('renderTokenConfig', async (_, [html]) => reEnableVision(html));
});

Hooks.once('init', () => {
	if ((game.release?.generation ?? 8) < 10) return;
	if (isNewerVersion('10.1.2', game.system.version)) return;

	console.log('FFD20 PATCH 🩹 | Keep advanced config: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1692')
	console.log('FFD20 PATCH 🩹 | Keep basic vision range: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1693')
	console.log('FFD20 PATCH 🩹 | Allow disabling vision: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1695')

	function refreshDetectionModes() {
		if (!['character', 'npc'].includes(this.actor?.type)) return;
		if (this.getFlag('ffd20', 'customVisionRules')) return;
		if (!this.sight.enabled) return;

		// Reset sight properties
		this.sight.visionMode = 'basic';
		const baseRange = this.sight.range;

		// Prepare sight
		const darkvisionRange = this.actor?.system?.traits?.senses?.dv ?? 0;
		if (darkvisionRange > 0) {
			this.sight.range = Math.max(baseRange, ffd20.utils.convertDistance(darkvisionRange)[0]);
			this.sight.visionMode = 'darkvision';
			this.sight.saturation = -1;
		}

		// Set basic detection mode
		const basicId = DetectionMode.BASIC_MODE_ID;
		const basicMode = this.detectionModes.find((m) => m.id === basicId);
		if (!basicMode) this.detectionModes.push({ id: basicId, enabled: true, range: baseRange });
		else basicMode.range = baseRange;

		// Set see invisibility detection mode
		const seeInvId = 'seeInvisibility';
		const seeInvMode = this.detectionModes.find((m) => m.id === seeInvId);
		if (!seeInvMode && (this.actor?.system?.traits?.senses?.si || this.actor?.system?.traits?.senses?.tr)) {
			this.detectionModes.push({ id: seeInvId, enabled: true, range: this.sight.range });
		}
		else if (seeInvMode != null) {
			if (!(this.actor?.system?.traits?.senses?.si || this.actor?.system?.traits?.senses?.tr)) {
				this.detectionModes.splice(this.detectionModes.indexOf(seeInvMode, 1));
			}
			else {
				seeInvMode.range = this.sight.range;
			}
		}

		// Set blind sense detection mode
		const blindSenseId = 'blindSense';
		const blindSenseMode = this.detectionModes.find((m) => m.id === blindSenseId);
		if (!blindSenseMode && this.actor?.system?.traits?.senses?.bse) {
			this.detectionModes.push({ id: blindSenseId, enabled: true, range: this.actor.system.traits.senses.bse });
		}
		else if (blindSenseMode != null) {
			if (!this.actor?.system?.traits?.senses?.bse) {
				this.detectionModes.splice(this.detectionModes.indexOf(blindSenseMode, 1));
			}
			else {
				blindSenseMode.range = this.actor.system.traits.senses.bse;
			}
		}

		// Set blind sight detection mode
		const blindSightId = 'blindSight';
		const blindSightMode = this.detectionModes.find((m) => m.id === blindSightId);
		if (!blindSightMode && this.actor?.system?.traits?.senses?.bs) {
			this.detectionModes.push({ id: blindSightId, enabled: true, range: this.actor.system.traits.senses.bs });
		}
		else if (blindSightMode != null) {
			if (!this.actor?.system?.traits?.senses?.bs) {
				this.detectionModes.splice(this.detectionModes.indexOf(blindSightMode, 1));
			}
			else {
				blindSightMode.range = this.actor.system.traits.senses.bs;
			}
		}

		// Set tremor sense detection mode
		const tremorSenseId = 'feelTremor';
		const tremorSenseMode = this.detectionModes.find((m) => m.id === tremorSenseId);
		if (!blindSightMode && this.actor?.system?.traits?.senses?.ts) {
			this.detectionModes.push({ id: tremorSenseId, enabled: true, range: this.actor.system.traits.senses.ts });
		}
		else if (tremorSenseMode != null) {
			if (!this.actor?.system?.traits?.senses?.ts) {
				this.detectionModes.splice(this.detectionModes.indexOf(tremorSenseMode, 1));
			}
			else {
				tremorSenseMode.range = this.actor.system.traits.senses.ts;
			}
		}

		// Sort detection modes
		this.detectionModes.sort(this._sortDetectionModes.bind(this));
	}

	const old = ffd20.documents.TokenDocumentFFD20.prototype.refreshDetectionModes;
	ffd20.documents.TokenDocumentFFD20.prototype.refreshDetectionModes = refreshDetectionModes;
});

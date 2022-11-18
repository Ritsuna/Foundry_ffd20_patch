// https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1399

{
	console.log('FFD20 PATCH 🩹 | Proficiency & languages errors: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1399');

	const orig = game.ffd20.documents.ActorFFD20.prototype.prepareProficiencies;
	game.ffd20.documents.ActorFFD20.prototype.prepareProficiencies = function (...args) {
		orig.call(this, ...args);
		['armorProf', 'weaponProf', 'languages'].forEach(p => {
			this.data.data.traits[p].custom ??= '';
			this.data.data.traits[p].value ?? [];
		})
	}
}

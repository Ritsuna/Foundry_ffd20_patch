console.log('FFD20 PATCH 🩹 | cost of undefined in getDefaultChargeFormula() with spellpoints enabled');

function fixGetDefaultChargeFormula(wrapped) {
	if (this.useSpellPoints()) {
		return this.system.spellPoints?.cost || '0';
	}
	else {
		return ffd20.documents.item.ItemFFD20.prototype.getDefaultChargeFormula.call(this);
	}
}

libWrapper.register('ffd20-patch', 'ffd20.documents.item.ItemSpellFFD20.prototype.getDefaultChargeFormula', fixGetDefaultChargeFormula, libWrapper.OVERRIDE);

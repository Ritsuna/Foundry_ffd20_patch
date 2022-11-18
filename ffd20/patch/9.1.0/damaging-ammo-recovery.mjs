// https://gitlab.com/Furyspark/foundryvtt-pathfinder1/-/issues/1348

console.log('FFD20 PATCH 🩹 | Disabling ammo recovery buttons: https://gitlab.com/Furyspark/foundryvtt-pathfinder1/-/issues/1348');

function disableAmmoRecovery(cm, jq) {
	const hasDamage = cm.data.flags?.ffd20?.metadata?.rolls?.attacks?.[0]?.damage?.[0] !== undefined;

	if (!(hasDamage || cm.itemSource?.hasAttack)) return;

	const html = jq[0];

	html.querySelectorAll('.chat-attack .ammo[data-ammo-id] .inline-action')
		.forEach(button => button.remove());
}

Hooks.on('renderChatMessage', disableAmmoRecovery);

{
	const orig = game.ffd20.documents.ItemFFD20._onChatCardAction;
	game.ffd20.documents.ItemFFD20._onChatCardAction = function _onChatCardActionFix(action, options) {
		if (['recoverAmmo', 'forceRecoverAmmo'].includes(action)) {
			const msg = 'Ammo recovery has been disabled to protect chat message integrity.';
			console.error('FFD20 PATCH 🩹 |', msg);
			return ui.notifications.error(msg);
		}

		return orig.call(this, action, options);
	}
}

console.log('FFD20 PATCH 🩹 | Applying token size fix: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1679')

/**
 * @param {TokenDocument} token
 * @param {Object} createData
 * @param {Object} options
 * @param {String} userId
 */
function fixTokenSize(token, createData, options, userId) {
	const actor = token.actor;
	if (!actor) return;

	// if (!token.actorLink) return; // linked tokens are also broken
	if (token.getFlag('ffd20', 'staticSize')) return;

	const size = actor.system.traits?.size;
	if (!size) return;

	const sd = CONFIG.FFD20.tokenSizes[size];
	if (!sd) return;
	createData.width = sd.w;
	createData.height = sd.h;
	createData.texture.scaleY = sd.scale;
	createData.texture.scaleX = sd.scale;
}

Hooks.on('preCreateToken', fixTokenSize);

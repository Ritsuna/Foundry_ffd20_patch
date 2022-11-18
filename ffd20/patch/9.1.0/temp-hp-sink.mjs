// https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1406
// https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1407

console.log('FFD20 PATCH 🩹 | Temp HP bug: https://gitlab.com/Furyspark/foundryvtt-pathfinder1/-/issues/1407');

console.log('FFD20 PATCH 🩹 | Health tracking module incompatibility: https://gitlab.com/Furyspark/foundryvtt-pathfinder1/-/issues/1406');

// const orig = game.ffd20.documents.ActorFFD20.prototype.updateDocuments;
game.ffd20.documents.ActorFFD20.updateDocuments = function (...args) {
	return CONFIG.Actor.documentClass.updateDocuments.call(this, ...args);
}

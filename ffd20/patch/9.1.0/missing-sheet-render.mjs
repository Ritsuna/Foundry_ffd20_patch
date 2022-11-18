// https://gitlab.com/Furyspark/foundryvtt-pathfinder1/-/issues/1308

{
	console.log('FFD20 PATCH 🩹 | Fixing sheet render bug: https://gitlab.com/Furyspark/foundryvtt-pathfinder1/-/issues/1308');

	const orig = game.ffd20.documents.ActorFFD20.prototype._onUpdateEmbeddedDocuments;
	game.ffd20.documents.ActorFFD20.prototype._onUpdateEmbeddedDocuments = function (type, docs, r, opts, uid) {
		Actor.prototype._onUpdateEmbeddedDocuments.call(this, type, docs, r, opts, uid);

		if (uid === game.user.id && type === 'Item') {
			this.toggleConditionStatusIcons({ render: false });
		}
	}
}

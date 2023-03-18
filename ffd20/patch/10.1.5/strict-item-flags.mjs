async function setDict(key, value, context) {
	key = String(key).replace(/[^\w_-]/g, '-').replace(/^-+/, '_');
	const flags = this.system.flags?.dictionary ?? {};

	if (flags[key] !== value) {
		await this.update({ [`system.flags.dictionary.${key}`]: value }, context);
		return true;
	}

	return false;
}

async function setBool(key, context) {
	// eslint-disable-next-line optimize-regex/optimize-regex
	key = String(key).replace(/[^\w_-]/g, '-').replace(/^-+/, '_');
	const flags = this.system.flags?.boolean ?? {};

	if (flags[key] === undefined) {
		await this.update({ [`system.flags.boolean.${key}`]: true }, context);
		return true;
	}

	return false;
}

const overrideFlags = () => {
	console.log('FFD20 PATCH 🩹 | setItemDictionaryFlag() and setItemDictionaryFlag() are overtly strict: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1989');
	libWrapper.register('ffd20-patch', 'ffd20.documents.item.ItemFFD20.prototype.setItemDictionaryFlag', setDict, libWrapper.OVERRIDE);
	libWrapper.register('ffd20-patch', 'ffd20.documents.item.ItemFFD20.prototype.addItemBooleanFlag', setBool, libWrapper.OVERRIDE);
}

if (!game.ready) Hooks.once('ready', overrideFlags);
else overrideFlags();

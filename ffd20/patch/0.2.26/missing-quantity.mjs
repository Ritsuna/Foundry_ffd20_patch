console.log('FFD20 PATCH 🩹 | Restoring missing item sheet quantity field...');

function injectMissingQuantity(sheet, jq) {
	const html = jq[0];
	const editable = sheet.isEditable;

	const item = sheet.document;

	const quantity = item.data.data.quantity;
	if (item.data.data.quantity === undefined) return;

	const props = html.querySelector('.item-properties');
	if (!props) return;

	const fg = document.createElement('div');
	fg.classList.add('form-group');
	fg.style.gap = '3px';
	const qLabel = document.createElement('label');
	qLabel.textContent = game.i18n.localize('FFD20.Quantity');
	const qInput = document.createElement('input');
	qInput.name = 'data.quantity';
	qInput.type = 'number';
	qInput.dataset.dtype = 'Number';
	qInput.min = '0';
	qInput.step = '1';
	qInput.value = quantity;
	qInput.style.width = '3em';

	fg.append(qLabel, qInput);

	props.prepend(fg);
}

Hooks.on('renderItemSheetFFD20', injectMissingQuantity);

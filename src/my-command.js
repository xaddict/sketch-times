const sketch = require('sketch')
const { DataSupplier } = sketch
const util = require('util')
const UI = require('sketch/ui')

const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));

export function onStartup () {
	// To register the plugin, uncomment the relevant type:
	DataSupplier.registerDataSupplier('public.text', 'Times', 'SupplyData')
	// DataSupplier.registerDataSupplier('public.image', 'thetimes', 'SupplyData')
}

export function onShutdown () {
	// Deregister the plugin
	DataSupplier.deregisterDataSuppliers()
}

export function secondsToText(seconds) {
	var sec_num = parseInt(seconds, 10); // don't forget the second param
	var hours   = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (minutes < 10 && hours > 0) {minutes = "0" + minutes;}
	if (seconds < 10) {seconds = "0" + seconds;}
	return `${hours > 0 ? hours + ':' : ''}${minutes}:${seconds}`;
}

export function onSupplyData (context) {
	let dataKey = context.data.key

	const min = 0; //minimum of 0 minutes
	var max = 100; // max of 100 minutes

	UI.getInputFromUser(
		"Max in minutes",
		{
			initialValue: '100',
		},
		(err, value) => {
			if (err) {
				// most likely the user canceled the input
				return
			}
			max = value

			UI.message("🕐 Just stop your crying, it's a sign of the times")

			const items = util.toArray(context.data.items).map(sketch.fromNative)
			items.forEach((item, index) => {
				let random = Math.random().toString()
				let minutes = range(0, 1, min, max, random);
				let timeAsText = secondsToText(minutes * 60)
				// let data = Math.random().toString()
				DataSupplier.supplyDataAtIndex(dataKey, timeAsText, index)
			})
		}
	);
}

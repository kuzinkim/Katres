// settings tables - инициализация таблиц
function initCompareTable(items, spcifications) {
	let $items = $(items);
	if (!$items[0]) return false;

	let responsive = [
		{
			breakpoint: 0,
			settings: {
				columns: 1,
				duplicate: 'in'
			}
		},
		{
			breakpoint: 480,
			settings: {
				columns: 2,
				duplicate: 'in'
			}
		},
		{
			breakpoint: 600,
			settings: {
				columns: 3,
				duplicate: 'in'
			}
		},
		{
			breakpoint: 768,
			settings: {
				columns: 4,
				duplicate: 'in'
			}
		},
		{
			breakpoint: 992,
			settings: {
				columns: 4,
				duplicate: 'out'
			}
		},
		{
			breakpoint: 1280,
			settings: {
				columns: 5,
				duplicate: 'out'
			}
		},
	];

	if (spcifications) {
		responsive = [
			{
				breakpoint: 0,
				settings: {
					columns: 1,
				}
			},
			{
				breakpoint: 600,
				settings: {
					columns: 2,
				}
			},
			{
				breakpoint: 768,
				settings: {
					columns: 3,
				}
			},
			{
				breakpoint: 992,
				settings: {
					columns: 5,
				}
			},
			{
				breakpoint: 1280,
				settings: {
					columns: 7,
				}
			},
		];
	}

	for (let i = 0; i < $items.length; i++) {
		const item = $($items[i]);

		item.compareTable({
			sort: true,
			sortIcon: '<svg width="12" height="12"><use xlink:href="/upload/images/sprite.svg#arrow-long"></use></svg>',
			prev: '<svg width="30" height="30"><use xlink:href="/upload/images/sprite.svg#arrow"></use></svg>',
			next: '<svg width="30" height="30"><use xlink:href="/upload/images/sprite.svg#arrow"></use></svg>',
			folding: true,
			lines: 10,
			responsive: responsive,
		});
	}
}

$(document).ready(function() {
	// init tables
	initCompareTable('.js-table-props');
	initCompareTable('.js-table-specifications', true);
});
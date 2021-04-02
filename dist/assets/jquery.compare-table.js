//! JQuery plugin "Compare Table"

;(function ($) {
	"use strict";

	// Options
	function CompareTable(options) {
		this.inited = options.inited || false;                      // �������������
		this.columns = options.columns || 1;                        // ����������� ������� ������� �������
		this.lines = options.lines || 10;                           // ����������� ������� �����
		this.folding = options.folding || false;                    // ������������ ��������
		this.pagination = options.pagination || false;              // ����������� ���������
		this.showArrows = options.showArrows || true;               // ����������� �������
		this.prev = options.prev || '<';                            // ������� �����
		this.next = options.next || '>';                            // ������� ������
		this.sort = options.sort || false;                          // ���������� �������
		this.sortIcon = options.sortIcon || '<';                    // �������� ����������
		this.duplicate = options.duplicate || false;                // ����������� ������������� �������
		this.headerFixed = options.headerFixed || false;            // ������������� ����� �������
		this.responsive = options.responsive || false;              // ������������
	}

	// Initialization
	CompareTable.prototype.init = function(table) {
		if (this.inited) return false;
		this.inited = true;
		this.table = table;

		this.currentColumn = 0;
		this.currentPage = 1;

		this.folded = false;
		this.qtyLines = this.lines;

		this.widthPage = window.innerWidth;
		this.scrollPage = $(window).scrollTop();
		this.changeWidthPage = false;
		this.changedScrollPage = false;
		this.currentBreakpoint = false;

		// Add controls
		let htmlBtnPrev = '<a href="#" class="tbtn tbtn_prev tbtn_inactive">' + this.prev + '</a>';
		let htmlBtnNext = '<a href="#" class="tbtn tbtn_next">' + this.next + '</a>';
		this.showArrows && this.table.find('.tctrl').prepend(htmlBtnPrev).append(htmlBtnNext);

		// Add fixing header
		this.headerFixed && table.addClass('compareTable_headFix');

		// Add pagination
		this.pagination && this.addPagination();

		// Add folding
		this.folding && this.addFolding();

		// Add icons sort
		let htmlIconSort = '<div class="tIconSort">' + this.sortIcon + '</div>';
		this.sort && this.table.find('.sortCol, .sortRow').append(htmlIconSort);

		this.update()
				.checkSortColumn()
				.checkSortRow()
				.events();
	}



	// Updating
	CompareTable.prototype.update = function() {
		return this.updateBreakpoint()
							 .updateColumns()
							 .updateSizeColumns()
							 .updatePositionColumns()
							 .updateVisibleArrows()
	}



	// Updating breakpoints
	CompareTable.prototype.updateBreakpoint = function() {
		let currentBreakpoint = false;
		let newSettings = {};

		if (this.responsive) {
			for (let i = 0; i < this.responsive.length; i++) {
				let element = this.responsive[i];

				if (window.innerWidth >= element.breakpoint) {
					currentBreakpoint = element.breakpoint;
					newSettings = element.settings;
				}
			}
		}

		if (currentBreakpoint !== this.currentBreakpoint) {
			$.extend(this, newSettings);
		}

		return this;
	}



	// Updating columns
	CompareTable.prototype.updateColumns = function() {
		let child = (this.duplicate === 'out') ? '*:not(.dupIn)' : '';

		if (this.duplicate === 'in') {
			this.table.find('.dupIn').removeClass('hide');
			this.table.find('.dupOut').addClass('hide');
		} else if (this.duplicate === 'out') {
			this.table.find('.dupOut').removeClass('hide');
			this.table.find('.dupIn').addClass('hide');
		}

		this.allColumns = this.table.find('.tr').eq(0).children(child).length;
		this.workColumns = (this.allColumns < this.columns) ? this.allColumns : this.columns;

		this.table.find('.tw').css({'-webkit-box-flex': this.workColumns * 2, 'flex': (this.workColumns * 2) + ' 0 0'});

		return this;
	}

	CompareTable.prototype.updateSizeColumns = function() {
		if (this.workColumns < this.allColumns) {
			this.table.find('.tr').children().css('width', (100 / this.workColumns) + '%');
			this.table.find('.tr').css('width', this.allColumns * (100 / this.workColumns) + '%');
		} else {
			this.table.find('.tr').children().css('width', (100 / this.allColumns) + '%');
			this.table.find('.tr').css('width', 100 + '%');
		}

		return this;
	}

	CompareTable.prototype.updatePositionColumns = function(way) {
		let left;

		if (way === 'prev' && this.currentColumn > 0) {
			this.currentColumn--;
		} else if (way === 'next' && this.currentColumn < (this.allColumns - this.workColumns)) {
			this.currentColumn++;
		}

		if (this.currentColumn > (this.allColumns - this.workColumns)) {
			this.currentColumn = (this.allColumns - this.workColumns);
		}

		if (this.workColumns < this.allColumns) {
			left = -(100 / this.workColumns) * this.currentColumn;
		} else {
			this.currentColumn = 0;
			left = 0;
		}

		this.table.find('.tr').css('left', left + '%');
		this.table.find('.tbtn_prev').removeClass('tbtn_inactive');
		this.table.find('.tbtn_next').removeClass('tbtn_inactive');

		if (this.currentColumn === 0) {
			this.table.find('.tbtn_prev').addClass('tbtn_inactive');
		} else if (this.currentColumn === (this.allColumns - this.workColumns)) {
			this.table.find('.tbtn_next').addClass('tbtn_inactive');
		}

		return this;
	}



	// Updating arrows
	CompareTable.prototype.updateVisibleArrows = function() {
		if (this.workColumns >= this.allColumns || !this.showArrows) {
			this.table.find('.tbtn_prev').fadeOut(200);
			this.table.find('.tbtn_next').fadeOut(200);
		} else if (this.showArrows) {
			this.table.find('.tbtn_prev').fadeIn(200);
			this.table.find('.tbtn_next').fadeIn(200);
		}

		return this;
	}



	// Updating header
	CompareTable.prototype.updatePositionHeader = function() {
		let heightHeader = window.innerWidth < 992 ? $('.header_bottom').innerHeight() : 0;
		let scrollPage = $(window).scrollTop() + heightHeader;
		let heightPage = window.innerHeight;
		let heightTable = this.table.innerHeight();
		let topTable = this.table.offset().top;
		let heightHead = this.table.find('.thead').innerHeight();
		let topHead = scrollPage - topTable - 10;
		let maxTopHead = heightTable - heightHead - heightPage * 0.3;

		if (topHead > maxTopHead && maxTopHead > 0) {
			this.table.find('.thead').css('top', maxTopHead);
		} else if (topHead > 0) {
			this.table.find('.thead').css('top', topHead);
		} else if (topHead <= 0) {
			this.table.find('.thead').css('top', 0);
		}

		return this;
	}



	// Paginaton
	CompareTable.prototype.addPagination = function() {
		let qtyPages = Math.ceil(this.table.find('.tline').length / this.lines);
		let pagination = this.table.find('.tpaging');
		let htmlPagination = '';
		let htmlPages = '';

		if (qtyPages < 2) {
			pagination.remove();
			this.currentPage = 1;
			this.qtyLines = this.lines;
		} else {
			for (let i = 1; i <= qtyPages; i++) {
				htmlPages += '<button class="tpaging__page button button_page" data-value="'+i+'"><span>'+i+'</span></button>';

				if (qtyPages > 6 && (i === 1 || i === (qtyPages - 1))) {
					htmlPages += '<span class="tpaging__dots">...</span>';
				}
			}

			if (pagination[0]) {
				this.table.find('.tpaging__pages').html(htmlPages);
			} else {
				htmlPagination += '<div class="tpaging"><button class="tpaging__more button button_more" data-value="more"><span>�������� ���</span><svg width="20" height="20"><use xlink:href="/upload/images/sprite.svg#arrow"></use></svg></button><div class="tpaging__pages">' + htmlPages + '</div></div>';
				this.table.append(htmlPagination);
			}
		}

		this.applyPagination()
				.updatePagination();

		return this;
	}

	CompareTable.prototype.changePagination = function(link) {
		let $link = $(link);
		let linkValue = $link.attr('data-value');

		if ($link.hasClass('active')) return this;

		if (linkValue === 'more') {
			this.qtyLines = this.qtyLines + this.lines;
			this.currentPage++;
		} else if (linkValue === 'next') {
			this.qtyLines = this.lines;
			this.currentPage++;
		} else if (linkValue === 'prev') {
			this.qtyLines = this.lines;
			this.currentPage--;
		} else {
			this.qtyLines = this.lines;
			this.currentPage = +linkValue;
		}

		this.applyPagination()
				.updatePagination();

		return this;
	}

	CompareTable.prototype.applyPagination = function() {
		let lines = this.table.find('.tline');
		let lastLine = this.currentPage * this.lines;
		let firstLine = lastLine - this.lines;

		if (this.qtyLines !== this.lines) {
			firstLine = lastLine - this.qtyLines;
		}

		for (let i = 0; i < lines.length; i++) {
			const line = $(lines[i]);

			if (i >= firstLine && i < lastLine) {
				line.removeClass('hide');
			} else {
				line.addClass('hide');
			}
		}

		return this;
	}

	CompareTable.prototype.updatePagination = function() {
		let qtyPages = Math.ceil(this.table.find('.tline').length / this.lines);
		let wrapPages = this.table.find('.tpaging__pages');
		let btnMore = this.table.find('.tpaging__more');
		let pages = this.table.find('.tpaging__page');
		let dots = this.table.find('.tpaging__dots');
		let page = this.currentPage;

		wrapPages.find('button.active').removeClass('active');
		wrapPages.find('button[data-value="'+page+'"]').addClass('active');

		if (qtyPages === page) {
			btnMore.addClass('hide');
		} else {
			btnMore.removeClass('hide');
		}

		if (page > 3) {
			dots.eq(0).removeClass('hide');
		} else {
			dots.eq(0).addClass('hide');
		}

		if (page < qtyPages - 2) {
			dots.eq(1).removeClass('hide');
		} else {
			dots.eq(1).addClass('hide');
		}

		if (qtyPages > 6) {
			for (let i = 1; i < qtyPages-1; i++) {
				if (i > page || i < (page - 2)) {
					pages.eq(i).addClass('hide');
				} else {
					pages.eq(i).removeClass('hide');
				}
			}
		}

		return this;
	}



	// Folding
	CompareTable.prototype.addFolding = function() {
		let allLines = this.table.find('.thead, .tline').length;
		let pagination = this.table.find('.tpaging');
		let htmlControlFolding = '<div class="tpaging tpaging_fold"><button class="tpaging__fold folded" data-value="more"><span>����������</span><span>��������</span><svg width="20" height="20"><use xlink:href="/upload/images/sprite.svg#arrow"></use></svg></button></div>';

		if (allLines <= this.lines) {
			pagination.remove();
			this.folded = false;
			this.table.removeClass('foldable folded');
		} else if (!pagination[0]) {
			this.folded = true;
			this.table.addClass('foldable folded').append(htmlControlFolding);
		}

		this.updateFolding();

		return this;
	}

	CompareTable.prototype.changeFold = function(btn) {
		if (this.folded) {
			this.folded = false;
			this.table.removeClass('folded');
			$(btn).removeClass('folded');
		} else {
			this.folded = true;
			this.table.addClass('folded');
			$(btn).addClass('folded');
		}

		this.updateFolding(true);

		return this;
	}

	CompareTable.prototype.updateFolding = function(animate) {
		let lines = this.table.find('.thead, .tline');
		let time = animate ? 200 : 0;

		for (let i = 0; i < lines.length; i++) {
			const line = lines.eq(i);

			if (i >= this.lines && this.folded) {
				line.addClass('folded').slideUp(time);
			} else {
				line.removeClass('folded').slideDown(time);
			}
		}

		return this;
	}



	// Sorting
	CompareTable.prototype.sortColumn = function(selector, increased, check, noSort) {
		let $selector = $(selector);
		let increase = check ? !!increased : !$selector.hasClass('increase');
		let index = $selector.index();
		let parent = $selector.parent();
		let inSlide = parent.hasClass('tr');
		let tlines = this.table.find('.tline');
		let container = inSlide ? tlines.find('.tr') : tlines;
		let columnCells = container.map(function(i, item) { return $(item).children().eq(index)[0]; });

		if (!noSort) {
			let indexes = columnCells.map(function(i) { return i; });
			let resultSorting = this.sorting(columnCells, indexes, increase, 'col');

			for (let y = 0; y < resultSorting.length; y++) {
				const indexLine = resultSorting[y];

				if (this.table.find('.tpaging')[0]) {
					this.table.find('.tpaging').before($(tlines[indexLine]));
					this.pagination && this.applyPagination();
					this.folding && this.updateFolding();
				} else {
					this.table.append($(tlines[indexLine]));
				}
			}
		}

		this.table.find('.th.sorted, .td.sorted').removeClass('sorted');
		columnCells.addClass('sorted');
		$selector.addClass('sorted');

		this.table.find('.sortCol.increase, .sortCol.decrease').removeClass('increase decrease');

		if (increase) {
			$selector.addClass('increase').removeClass('decrease');
		} else {
			$selector.addClass('decrease').removeClass('increase');
		}

		return this;
	}

	CompareTable.prototype.sortRow = function(selector, increased, check) {
		let $selector = $(selector);
		let increase = check ? !!increased : !$selector.hasClass('increase');
		let currLine = $selector.parents('.tline');
		let rowCells = $selector.siblings('.tw').find('.td');
		let rows = this.table.find('.tr');

		let indexes = rowCells.map(function(i) { return i; });
		let resultSorting = this.sorting(rowCells, indexes, increase, 'row');

		for (let i = 0; i < rows.length; i++) {
			const row = $(rows[i]);
			const cells = row.find('.td, .th');
			for (let y = 0; y < resultSorting.length; y++) {
				const indexLine = resultSorting[y];
				row.append($(cells[indexLine]));
			}
		}

		this.table.find('.tline.sorted').removeClass('sorted');
		currLine.addClass('sorted');

		this.table.find('.sortRow.increase, .sortRow.decrease').removeClass('increase decrease');

		if (increase) {
			$selector.addClass('increase').removeClass('decrease');
		} else {
			$selector.addClass('decrease').removeClass('increase');
		}

		return this;
	}

	CompareTable.prototype.checkSortColumn = function() {
		let cellSorting = this.table.find('.th.increase, .th.decrease');
		let noSort = !cellSorting.hasClass('sortCol');
		let increase = cellSorting.hasClass('increase');

		if (cellSorting[0]) this.sortColumn(cellSorting[0], increase, true, noSort);

		return this;
	}

	CompareTable.prototype.checkSortRow = function() {
		let cellSorting = this.table.find('.sortRow.increase, .sortRow.decrease');
		let increase = cellSorting.hasClass('increase');

		if (cellSorting[0]) this.sortRow(cellSorting[0], increase, true);

		return this;
	}

	// Sorting calculation
	CompareTable.prototype.sorting = function(cells, indexes, increase, direction) {
		let self = this;

		return indexes.sort(function(a, b) {
			let $a = $(cells[a]);
			let $b = $(cells[b]);

			let currVal = self.getValue($a.text()) || $a.find('.tcell').children().length;
			let prevVal = self.getValue($b.text()) || $b.find('.tcell').children().length;

			if (direction === 'row') {
				return self.compareValuesRow(currVal, prevVal, $a, $b, increase);
			} else if (direction === 'col') {
				return self.compareValuesColumn(currVal, prevVal, $a, $b, increase);
			} else {
				return 0;
			}
		});
	}

	CompareTable.prototype.compareValuesColumn = function(currVal, prevVal, a, b, increase) {
		if (!(currVal == prevVal) && !(currVal > prevVal) && !(currVal < prevVal)) {
			currVal = a.text();
			prevVal = b.text();
		}

		if (currVal == prevVal) {
			let $a = a.next();
			let $b = b.next();
			let childA = $a.find('.td').eq(0);
			let childB = $b.find('.td').eq(0);
			let parentA = a.parents('.tw');
			let parentB = b.parents('.tw');

			if ((!$a[0] || !$b[0]) && parentA[0] && parentB[0]) {
				$a = parentA.next();
				$b = parentB.next();
			} else if (childA[0] && childB[0]) {
				$a = childA;
				$b = childB;
			}

			if ($a[0] && $b[0]) {
				if ($a.hasClass('td') && $b.hasClass('td')) {
					currVal = this.getValue($a.text()) || $a.find('.tcell').children().length;
					prevVal = this.getValue($b.text()) || $b.find('.tcell').children().length;
				}

				return this.compareValuesColumn(currVal, prevVal, $a, $b, increase);
			} else {
				return 0;
			}
		} else {
			if (increase && currVal > prevVal || !increase && currVal < prevVal) return 1;
			if (increase && currVal < prevVal || !increase && currVal > prevVal) return -1;
		}
	}

	CompareTable.prototype.compareValuesRow = function(currVal, prevVal, a, b, increase) {
		if (!(currVal == prevVal) && !(currVal > prevVal) && !(currVal < prevVal)) {
			currVal = a.text();
			prevVal = b.text();
		}

		if (currVal == prevVal) {
			let line = a.parents('.tline').next();
			let aIndex = a.index();
			let bIndex = b.index();
			let $a = line.find('.tr').find('.td').eq(aIndex);
			let $b = line.find('.tr').find('.td').eq(bIndex);

			if ($a[0] && $b[0]) {
				if ($a.hasClass('td') && $b.hasClass('td')) {
					currVal = this.getValue($a.text()) || $a.find('.tcell').children().length;
					prevVal = this.getValue($b.text()) || $b.find('.tcell').children().length;
				}

				return this.compareValuesRow(currVal, prevVal, $a, $b, increase);
			} else {
				return 0;
			}
		} else {
			if (increase && currVal > prevVal || !increase && currVal < prevVal) return 1;
			if (increase && currVal < prevVal || !increase && currVal > prevVal) return -1;
		}
	}

	CompareTable.prototype.getValue = function(value) {
		let textValue = value.trim().replace(/\s+(?!euro)/g,"").toLowerCase(); // ������� ������� � �������� � ������� ��������

		if (textValue.length < 1) {
			return ' ';
		}

		let numValue = textValue.replace(/[,]/g,".") // "," �� "."
														.replace(/[^.-\d]+/g,""); // �������� ������ �����, ����� � ����� ������

		let reg_exp_1 = textValue.match(/^[0-9\-]|^(��)/); // � ������ �����, ���� '-' ��� '��'
		let reg_exp_2 = textValue.match(/;|\!|\(|\)/); // ����� ';', '!', '(', ')'
		let reg_exp_3 = numValue.match(/\./g); // �����

		if (
			 reg_exp_1 !== null &&
			 reg_exp_2 === null &&
			 (
				 reg_exp_3 === null ||
				 reg_exp_3.length < 2
			 )
		) {
			return +numValue;
		} else {
			return textValue;
		}
	}



	// Adding lines
	CompareTable.prototype.addLine = function(element) {
		if (this.pagination && this.table.find('.tpaging')[0]) {
			this.table.find('.tpaging').before($(element));
		} else {
			this.table.append($(element));
		}

		this.pagination && this.addPagination();
		this.folding && this.addFolding();

		this.update()
				.checkSortColumn()
				.checkSortRow();

		return this;
	}



	// Updating page
	CompareTable.prototype.checkWidthPage = function() {
		if (!this.changeWidthPage) {
			this.changeWidthPage = true;
			let self = this;

			setTimeout(function run() {
				if (window.innerWidth === self.widthPage) {
					self.changeWidthPage = false;
					self.update();
				} else {
					setTimeout(run);
				}
				self.widthPage = window.innerWidth;
			});
		}
	}



	// Events
	CompareTable.prototype.events = function() {
		let self = this;

		self.showArrows && self.table.on('click', '.tbtn_prev', function(e) {
			e.preventDefault();
			self.updatePositionColumns('prev');
		});

		self.showArrows && self.table.on('click', '.tbtn_next', function(e) {
			e.preventDefault();
			self.updatePositionColumns('next');
		});

		self.sort && self.table.on('click', '.sortCol', function(e) {
			e.preventDefault();
			self.sortColumn(this);
		});

		self.sort && self.table.on('click', '.sortRow', function(e) {
			e.preventDefault();
			self.sortRow(this);
		});

		self.pagination && self.table.on('click', '.tpaging button', function(e) {
			e.preventDefault();
			self.changePagination(this);
		});

		self.folding && self.table.on('click', '.tpaging button', function(e) {
			e.preventDefault();
			self.changeFold(this);
		});

		self.responsive && $(window).on('resize', function() {
			self.checkWidthPage();
		});

		self.headerFixed && $(window).on('scroll', function() {
			self.updatePositionHeader();
		});
	}



	$.fn.compareTable = function(options) {
		if (!$(this)[0]) {
			console.warn('No elements for create "Compare Table"');
			return this;
		} else if ($(this).length > 1) {
			console.warn('Use one element for create "Compare Table"');
		}

		const compareTable = new CompareTable(options);
		compareTable.init($(this).eq(0));
		return compareTable;
	}

}(jQuery));
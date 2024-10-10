function addPage(page, book) {
    var id, pages = book.turn('pages');
    
    // Tạo một phần tử mới cho trang
    var element = $('<div />', {});

    // Thêm trang vào flipbook
    if (book.turn('addPage', element, page)) {
        // Thêm HTML ban đầu
        // Sẽ chứa chỉ báo tải và gradient
        element.html('<div class="gradient"></div><div class="loader"></div>');

        // Tải trang
        loadPage(page, element);
    }
}
function addRegion(region, pageElement) {
    var reg = $('<div />', {'class': 'region ' + region['class']}),
        options = $('.magazine').turn('options'),
        pageWidth = options.width / 2,
        pageHeight = options.height;

    reg.css({
        top: Math.round(region.y / pageHeight * 100) + '%',
        left: Math.round(region.x / pageWidth * 100) + '%',
        width: Math.round(region.width / pageWidth * 100) + '%',
        height: Math.round(region.height / pageHeight * 100) + '%'
    }).attr('region-data', $.param(region.data || ''));

    reg.appendTo(pageElement);
}
function loadPage(page, pageElement) {
    // Tạo phần tử hình ảnh
    var img = $('<img />');

    img.mousedown(function(e) {
        e.preventDefault();
    });

    img.load(function() {
        // Đặt kích thước
        $(this).css({ width: '100%', height: '100%' });

        // Thêm hình ảnh vào trang sau khi tải
        $(this).appendTo(pageElement);

        // Xóa biểu tượng loader
        pageElement.find('.loader').remove();
    });

    // Tải trang
    img.attr('src', '/' + page + '.jpg');

    loadRegions(page, pageElement);
}
function loadRegions(page, element) {
    $.getJSON('pages/' + page + '-regions.json')
        .done(function(data) {
            $.each(data, function(key, region) {
                addRegion(region, element);
            });
        });
}
function zoomTo(event) {
    setTimeout(function() {
        if ($('.magazine-viewport').data().regionClicked) {
            $('.magazine-viewport').data().regionClicked = false;
            $('.magazine-viewport').zoom('zoomIn', event);
        } else if ($('.magazine-viewport').zoom('value') == 1) {
            $('.magazine-viewport').zoom('zoomIn', event);
        } else {
            $('.magazine-viewport').zoom('zoomOut');
        }
    }, 1);
}

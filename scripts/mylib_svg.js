var url = 'pdf.pdf';
PDFJS.workerSrc = 'pdf.worker.js';

var pdfDoc = null,
    pageRendering = false,
    pageNumPending = null,
    pageNum = 1,
    scale = 1.5
canvas = document.getElementById('content');
// ctx = canvas.getContext('2d');
function renderPage(num) {
    pageRendering = true;
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function (page) {
        var viewport = page.getViewport(scale);
        canvas.style.height = viewport.height+'px';
        canvas.style.width = viewport.width+'px';

        // SVG rendering by PDF.js
        page.getOperatorList()
        .then(function (opList) {
            var svgGfx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
            return svgGfx.getSVG(opList, viewport);
        })
        .then(function (svg) {
            canvas.innerHTML = '';
            canvas.appendChild(svg);
        });
    });

    // Update page counters
    document.getElementById('page_num').textContent = pageNum;
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function onPrevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

document.getElementById('prev').addEventListener('click', onPrevPage);

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

document.getElementById('next').addEventListener('click', onNextPage);

/**
 * Asynchronously downloads PDF.
 */
PDFJS.getDocument(url).then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
});

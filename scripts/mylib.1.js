var url = 'pdf.pdf';
PDFJS.workerSrc = 'pdf.worker.js';

// Asynchronous download of PDF
var loadingTask = PDFJS.getDocument(url);
loadingTask.promise.then(function (pdf) {
    var pageNumber = 1;
    pdf.getPage(pageNumber).then(function (page) {

        var scale = 1.5;
        var viewport = page.getViewport(scale);
        var canvas = document.getElementById('content');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.then(function () {
            console.log('Page rendered');
        });
    });
}, function (reason) {
    console.error(reason);
});
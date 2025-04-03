<template>
  <button @click="printReceipt()">Print</button>
<!-- 
  <iframe ref="iframeRefs" style="display: none">
    <html>
        <head></head>
        <body>
            Sample PDF Content Appear here.
        </body>
    </html>
  </iframe> -->

  <div id="invoiceWrapper">
    Hello
  </div>

</template>

<script setup>
import { jsPDF } from "jspdf";
const iframeRefs = ref(null);

// const pdfPath = ref(
//   "http://avpos-backend.test/storage/invoice/invoice-receipt-1721841303-6.pdf"
// );

onMounted(() => {
    // if (iframeRefs.value) {
    // iframeRefs.value.onload = () => {
    //     setTimeout(() => {
    //     iframeRefs.value.contentWindow.print();
    //     }, 500); // Adjust delay if needed
    // };
    // }
    // iframeRefs.value.src = 'http://avpos-backend.test/storage/invoice/invoice-receipt-1721841303-6.pdf';
    // setTimeout(() => {
    //     iframeRefs.value.contentWindow.print();
    // }, 1000); // Adjust delay if needed
});

function printReceipt() {

    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><title>' + document.title + '</title>');
    mywindow.document.write('<link rel="preconnect" href="https://fonts.googleapis.com">');
    mywindow.document.write('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
    mywindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">');
    mywindow.document.write('<style>');
    mywindow.document.write('* { box-sizing: border-box;}body{ margin: 0;}.main {width: 960px;max-width: 100%;padding: 40px 40px 20px;margin: 0 auto;font-size: 13px;font-weight: 400;font-family: "Roboto";}th {font-weight: 500;}');
    mywindow.document.write('</style>');
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.getElementById('invoiceWrapper').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}

</script>

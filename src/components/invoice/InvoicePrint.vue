<template>
  <div id="print-container" ref=printC
  ontainer style="display: none">
    <div class="main">
      <div class="invoice-wrap" id="invoiceWrapper">
        <div class="invoice-header" style="margin-bottom: 30px">
        <div class="table-wpr">
          <table
            style="border-collapse: collapse; border-spacing: 0"
            width="100%"
          >
            <tbody>
              <tr>
                <td>
                  <table style="border-collapse: collapse; border-spacing: 0">
                    <tbody>
                      <tr>
                        <td colspan="2">
                          <img
                            alt="Wosul logo"
                            width="100px"
                            style="
                              max-width: 100%;
                              height: auto;
                              width: 120px;
                              margin-bottom: 10px;
                            "
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style="width: 135px">
                          <div
                            class="qr_code"
                            style="
                              margin-right: 15px;
                              width: 120px;
                              background: #fff;
                              padding: 7px;
                              border-radius: 8px;
                              border: 4px solid #efefef;
                              box-sizing: border-box;
                            "
                          >
                            <img
                              src=""
                              alt="QR Code"
                              width="100px"
                              style="
                                max-width: 100%;
                                height: auto;
                                width: 100px;
                                display: block;
                              "
                            />
                          </div>
                        </td>
                        <td>
                          <h2
                            style="
                              margin: 0 0 3px;
                              text-align: left;
                              font-size: 22px;
                            "
                          >
                            Tax Invoice
                          </h2>
                          <h5
                            style="
                              font-size: 16px;
                              font-weight: normal;
                              margin: 0;
                            "
                          >
                            فاتورة ضريبية
                          </h5>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td align="right">
                  <table style="border-collapse: collapse; border-spacing: 0">
                    <tbody>
                      <tr>
                        <td>
                          <h3 style="margin: 0 0 5px; font-size: 26px">
                            Wosul store
                          </h3>
                          <p
                            style="
                              margin: 0 0 8px;
                              max-width: 280px;
                              line-height: 160%;
                            "
                            class="seller-address"
                          >
                            المنار, معارض سيارات النسيم, الرياض, 12468 3
                          </p>

                          <table
                            style="
                              width: 100%;
                              padding: 0;
                              border: 0;
                              border-collapse: collapse;
                              border-spacing: 0;
                            "
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    padding: 0;
                                    width: 100px;
                                    font-size: 12px;
                                    font-weight: 600;
                                    color: #000;
                                    line-height: 140%;
                                    padding-bottom: 8px;
                                  "
                                >
                                  Email
                                </td>
                                <td
                                  style="
                                    padding: 0;
                                    text-align: center;
                                    font-size: 12px;
                                    padding-bottom: 8px;
                                  "
                                >
                                  <a
                                    style="color: #111; text-decoration: none"
                                    href="mailto:MOHAMMAD@WOSUL.SA"
                                    >MOHAMMAD@WOSUL.SA</a
                                  >
                                </td>
                                <td
                                  style="
                                    padding: 0;
                                    width: 100px;
                                    text-align: right;
                                    font-size: 12px;
                                    font-weight: 600;
                                    color: #000;
                                    line-height: 140%;
                                    padding-bottom: 6px;
                                  "
                                >
                                  ترونالإل البريد
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="
                                    padding: 0;
                                    width: 100px;
                                    font-size: 12px;
                                    font-weight: 600;
                                    color: #000;
                                    line-height: 140%;
                                    padding-bottom: 8px;
                                  "
                                >
                                  Contact Number
                                </td>
                                <td
                                  style="
                                    padding: 0;
                                    text-align: center;
                                    font-size: 12px;
                                    padding-bottom: 8px;
                                  "
                                >
                                  0111218183
                                </td>
                                <td
                                  style="
                                    padding: 0;
                                    width: 100px;
                                    text-align: right;
                                    font-size: 12px;
                                    font-weight: 600;
                                    color: #000;
                                    line-height: 140%;
                                    padding-bottom: 6px;
                                  "
                                >
                                  رقم التواصل
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="
                                    padding: 0;
                                    width: 100px;
                                    font-size: 12px;
                                    font-weight: 600;
                                    color: #000;
                                    line-height: 140%;
                                  "
                                >
                                  VAT Number
                                </td>
                                <td
                                  style="
                                    padding: 0;
                                    text-align: center;
                                    font-size: 12px;
                                  "
                                >
                                  300188493300003
                                </td>
                                <td
                                  style="
                                    padding: 0;
                                    width: 100px;
                                    text-align: right;
                                    font-size: 12px;
                                    font-weight: 600;
                                    color: #000;
                                    line-height: 140%;
                                  "
                                >
                                  الضريب الرقم
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div
                            style="
                              height: 4px;
                              background: linear-gradient(
                                240.13deg,
                                #be0683 -3.35%,
                                #3e63ca 103.16%
                              );
                              margin-top: 25px;
                            "
                            class="border-line"
                          >
                            <span></span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="invoice-body">
        <div
          style="overflow: auto; margin: 0 -20px 20px"
          class="table-responsive"
        >
          <table style="border-spacing: 20px 0" width="100%">
            <tbody>
              <tr>
                <td
                  style="
                    width: 45%;
                    background: #f5f5f5;
                    padding: 13px;
                    border-radius: 6px;
                  "
                >
                  <table
                    style="
                      width: 100%;
                      border: 0;
                      border-collapse: collapse;
                      border-spacing: 0;
                    "
                    class="invoice-text-table"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="
                            padding: 4px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                            font-size: 13px;
                          "
                        >
                          Company شركة
                        </td>
                        <td style="padding: 4px 0; border: 0; font-size: 13px">
                          moeeee
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            padding: 4px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                            font-size: 13px;
                          "
                        >
                          Email ترونالإل البريد
                        </td>
                        <td style="padding: 4px 0; border: 0; font-size: 13px">
                          <a
                            href="mailto:test@test.sa"
                            style="text-decoration: none; color: #000"
                            >test@test.sa</a
                          >
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            padding: 4px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                            font-size: 13px;
                          "
                        >
                          Contact Number رقم التواصل
                        </td>
                        <td style="padding: 4px 0; border: 0; font-size: 13px">
                          1234567892
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            padding: 4px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                            font-size: 13px;
                          "
                        >
                          VAT Number الضريب الرقم
                        </td>
                        <td style="padding: 4px 0; border: 0; font-size: 13px">
                          11111111111111
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>

                <td
                  style="
                    width: 55%;
                    vertical-align: top;
                    background: #f5f5f5;
                    padding: 14px;
                    border-radius: 6px;
                  "
                >
                  <table
                    style="
                      width: 100%;
                      border-collapse: collapse;
                      border-spacing: 0;
                    "
                    class="invoice-text-table"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="
                            padding: 4px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                            font-size: 13px;
                          "
                        >
                          Invoice No
                        </td>
                        <td style="text-align: center; font-size: 13px">107</td>
                        <td
                          style="
                            padding: 4px 0;
                            border: 0;
                            text-align: right;
                            font-size: 13px;
                          "
                        >
                          فاتورة رقم
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            padding: 4px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                            font-size: 13px;
                          "
                        >
                          Invoice Issue Date
                        </td>
                        <td style="text-align: center; font-size: 13px">
                          24/07/2024
                        </td>
                        <td
                          style="
                            padding: 4px 0;
                            border: 0;
                            text-align: right;
                            font-size: 13px;
                          "
                        >
                          الفاتورة إصدار تاريخ
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            padding: 4px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                            font-size: 13px;
                          "
                        >
                          Invoice Due Date
                        </td>
                        <td style="text-align: center; font-size: 13px">
                          24/07/2024
                        </td>
                        <td
                          style="
                            padding: 4px 0;
                            border: 0;
                            text-align: right;
                            font-size: 13px;
                          "
                        >
                          تاريخ استحقاق الفاتورة
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            padding: 4px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                            font-size: 13px;
                          "
                        >
                          Invoice Reference
                        </td>
                        <td style="text-align: center; font-size: 13px">
                          9926
                        </td>
                        <td
                          style="
                            padding: 4px 0;
                            border: 0;
                            text-align: right;
                            font-size: 13px;
                          "
                        >
                          الرقم المرجع للفاتورة
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style="overflow: auto; margin-bottom: 20px"
          class="table-responsive"
        >
          <table
            style="
              width: 100%;
              border: 1px solid #ddd;
              border-collapse: collapse;
              border-spacing: 1px;
            "
            class="invoice-table"
          >
            <thead>
              <tr style="border: 1px solid #ddd">
                <th
                  style="
                    border: 1px solid #b133cf;
                    border-bottom: 0;
                    padding: 6px 5px;
                    background-color: #b133cf;
                    color: #fff;
                    font-weight: 500;
                    border-right-color: #ddd;
                  "
                >
                  Item Name <span style="display: block">اسم الصنف</span>
                </th>
                <th
                  style="
                    border: 1px solid #b133cf;
                    border-bottom: 0;
                    padding: 6px 5px;
                    background-color: #b133cf;
                    color: #fff;
                    font-weight: 500;
                    border-right-color: #ddd;
                  "
                >
                  Unit Price <span style="display: block">سعر الوحدة</span>
                </th>
                <th
                  style="
                    border: 1px solid #b133cf;
                    border-bottom: 0;
                    padding: 6px 5px;
                    background-color: #b133cf;
                    color: #fff;
                    font-weight: 500;
                    border-right-color: #ddd;
                  "
                >
                  Quantity <span style="display: block">المية</span>
                </th>
                <th
                  style="
                    border: 1px solid #b133cf;
                    border-bottom: 0;
                    padding: 6px 5px;
                    background-color: #b133cf;
                    color: #fff;
                    font-weight: 500;
                    border-right-color: #ddd;
                  "
                >
                  Taxable Amount
                  <span style="display: block">المبلغ الخاضع للضريبة</span>
                </th>
                <th
                  style="
                    border: 1px solid #b133cf;
                    border-bottom: 0;
                    padding: 6px 5px;
                    background-color: #b133cf;
                    color: #fff;
                    font-weight: 500;
                    border-right-color: #ddd;
                  "
                >
                  Tax Rate <span style="display: block">نسبة الضريبة</span>
                </th>
                <th
                  style="
                    border: 1px solid #b133cf;
                    border-bottom: 0;
                    padding: 6px 5px;
                    background-color: #b133cf;
                    color: #fff;
                    font-weight: 500;
                    border-right-color: #ddd;
                  "
                >
                  Tax Amount <span style="display: block">مبلغ الضريبة</span>
                </th>
                <th
                  style="
                    border: 1px solid #b133cf;
                    border-bottom: 0;
                    padding: 6px 5px;
                    background-color: #b133cf;
                    color: #fff;
                    font-weight: 500;
                  "
                >
                  Items Subtotal
                  <span style="display: block">المجموع الفرع</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style="border: 1px solid #ddd">
                <td
                  style="
                    border: 1px solid #ddd;
                    padding: 8px 5px;
                    text-align: center;
                  "
                >
                  Orange juice Small
                </td>
                <td
                  style="
                    border: 1px solid #ddd;
                    padding: 8px 5px;
                    text-align: center;
                  "
                >
                  6.96
                </td>
                <td
                  style="
                    border: 1px solid #ddd;
                    padding: 8px 5px;
                    text-align: center;
                  "
                >
                  15.000000
                </td>
                <td
                  style="
                    border: 1px solid #ddd;
                    padding: 8px 5px;
                    text-align: center;
                  "
                >
                  104.4
                </td>
                <td
                  style="
                    border: 1px solid #ddd;
                    padding: 8px 5px;
                    text-align: center;
                  "
                >
                  15.00
                </td>
                <td
                  style="
                    border: 1px solid #ddd;
                    padding: 8px 5px;
                    text-align: center;
                  "
                >
                  15.65
                </td>
                <td
                  style="
                    border: 1px solid #ddd;
                    padding: 8px 5px;
                    text-align: center;
                  "
                >
                  120.00
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style="overflow: auto; margin-bottom: 20px"
          class="table-responsive"
        >
          <table
            style="border-collapse: collapse; border-spacing: 0"
            width="100%"
          >
            <tbody>
              <tr>
                <td style="width: 40%; vertical-align: top">
                  <table
                    style="border-collapse: collapse; border-spacing: 0"
                    class="invoice-text-table"
                  >
                    <tbody>
                      <tr>
                        <th
                          style="
                            width: 180px;
                            padding: 6px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                          "
                        >
                          Bank Name اسم البنك
                        </th>
                        <td style="padding: 6px 0; border: 0">الراجح</td>
                      </tr>
                      <tr>
                        <th
                          style="
                            width: 180px;
                            padding: 6px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                          "
                          class="white-space"
                          valign="top"
                        >
                          IBAN Number رقم الآيبان
                        </th>
                        <td style="padding: 6px 0; border: 0">
                          23456789098765434
                        </td>
                      </tr>
                      <tr>
                        <th
                          style="
                            width: 180px;
                            padding: 6px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                          "
                          class="white-space"
                          valign="top"
                        >
                          Name الاسم
                        </th>
                        <td style="padding: 6px 0; border: 0">23456789</td>
                      </tr>
                      <tr>
                        <th
                          style="
                            width: 180px;
                            padding: 6px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                          "
                          class="white-space"
                          valign="top"
                        >
                          Notes الملاحظات
                        </th>
                        <td style="padding: 6px 0; border: 0">
                          <p style="margin: 0">
                            ياا مرحبا بسياسة الفاتورة سارة
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td style="width: 10%"></td>
                <td style="width: 50%">
                  <table
                    style="
                      width: 100%;
                      border-collapse: collapse;
                      border-spacing: 0;
                    "
                    class="invoice-text-table"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="
                            padding: 6px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                          "
                        >
                          Total (Excluding VAT)
                          <span style="display: block">المجموع الفرع</span>
                        </td>
                        <td style="padding: 6px 0; border: 0" align="right">
                          104.4
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            padding: 6px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                          "
                        >
                          Total Taxable Amount (Excl. VAT)
                          <span style="display: block"
                            >الإجمال غير شامل الضريبة</span
                          >
                        </td>
                        <td style="padding: 6px 0; border: 0" align="right">
                          104.35
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            padding: 6px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                          "
                        >
                          Total VAT
                          <span style="display: block"
                            >مجموع ضريبة القيمة المضافة</span
                          >
                        </td>
                        <td style="padding: 6px 0; border: 0" align="right">
                          15.65
                        </td>
                      </tr>
                      <tr>
                        <th
                          style="
                            padding: 6px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                          "
                        >
                          Total Amount Due
                          <span style="display: block"
                            >إجمال المبلغ المستحق</span
                          >
                        </th>
                        <td style="padding: 6px 0; border: 0" align="right">
                          120.00 NAD
                        </td>
                      </tr>
                      <tr>
                        <th
                          style="
                            padding: 6px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                          "
                        >
                          Total Paid Amount
                          <span style="display: block"
                            >إجمال المبلغ المدفوع</span
                          >
                        </th>
                        <td style="padding: 6px 0; border: 0" align="right">
                          0 NAD
                        </td>
                      </tr>
                      <tr>
                        <th
                          style="
                            padding: 6px 0;
                            border: 0;
                            text-align: left;
                            padding-right: 20px;
                          "
                        >
                          Total Balance Amount
                          <span style="display: block"
                            >مبلغ الرصيد الإجمال</span
                          >
                        </th>
                        <td style="padding: 6px 0; border: 0" align="right">
                          120 NAD
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="invoice-footer"
        style="
          text-align: center;
          border-top: 1px solid #ddd;
          font-size: 13px;
          padding-top: 10px;
          margin-top: 12px;
        "
      >
        <p style="margin: 0">POWERED BY WOSUL | مطو ر من ق ب ل وصول</p>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const iframeRef = ref(null);
const printContainer = ref(null);

onMounted(() => {
  // Create the iframe
  const iframe = document.createElement("iframe");
  iframe.style.display = "none"; 
  iframeRef.value = iframe;
  printContainer.value.appendChild(iframe); 
});

const printInvoice = () => {
  if (iframeRef.value) {
    const iframeDocument = iframeRef.value.contentDocument || iframeRef.value.contentWindow.document;
    iframeDocument.body.innerHTML = document.getElementById('invoiceWrapper').innerHTML;
    iframeRef.value.contentWindow.print(); 
  }
};

defineExpose({
  printInvoice,
})

</script>
/**
 * Created by lilin01 on 2015/11/9.
 */
/* jshint -W117 */
argo.hermesTestPrint = (function () {
    'use strict';

    var nymph = require('nymph');
    var printer = new nymph.dev.printer.Printer('PRINTER');
    var actual = '';

    function printReceipt(datayangmaudiprint,dataheader,kembalian,yangdibayarkan)
    {
        console.log(JSON.stringify(dataheader));
        actual  = '<h1 align="center">'+ dataheader.STORE_NM +'</h1>';
        actual += '<h3 align="center" style="margin-top:-15px;">+6281260014478</h3>';
        actual += '<div>';
        actual += '<div style="float:left;width:35vw;">No.Trans</div>';
        actual += '<div>: '+ dataheader.SPLIT_OFLINE_ID + '</div>';
        actual += '</div>';
        actual += '<div>';
        actual += '<div style="float:left;width:35vw;">Kasir</div>';
        actual += '<div>: '+ dataheader.username +'</div>';
        actual += '</div>';

        actual += '<div>';
        actual += '<div style="float:left;width:35vw;">Waktu Beli</div>';
        actual += '<div>: '+ dataheader.TRANS_DATE + '</div>';
        actual += '</div>';

        actual += '<div>';
        actual += '<div style="float:left;width:35vw;">Lokasi</div>';
        actual += '<div>: De-Mansion C-12,Alam Sutera</div>';
        actual += '</div>';

        actual += '<div>';
        actual += '<div style="float:left;width:35vw;">Pembayaran</div>';
        actual += '<div>: '+ dataheader.TYPE_PAY_NM +'</div>';
        actual += '</div></br>';
        angular.forEach(datayangmaudiprint,function(value,index)
        {
             if(index == 0)
             {
                actual += '<div style="padding-top:5px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';
             }
             else
             {
                actual += '<div style="padding-top:5px;padding-bottom:5px;border-top: 1px solid rgba(1, 1, 1,1);">';
             }
             actual += '<div style="float:left;width:40vw;">' + (index + 1);

             if(index < 9)
             {
                actual += '.&nbsp;&nbsp;&nbsp;' + value.PRODUCT_NM + '</div>';
             }
             else
             {
               actual += '.' + value.PRODUCT_NM + '</div>';
             }

             actual += '<div style="float:right;">'+ value.HARGA_JUAL + ' X ' + value.QTY_INCART;
             if((value.HARGA_JUAL * value.QTY_INCART) < 100000)
             {
                actual += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (value.HARGA_JUAL * value.QTY_INCART) + '</div>';
             }
             else
             {
                actual += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (value.HARGA_JUAL * value.QTY_INCART) + '</div>';
             }
             actual += '</div></br>';
        });

        actual += '<div style="padding-top:5px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';
        actual += '<div style="float:left;width:35vw;">Sub Total</div>';
        actual += '<div style="float:right;">'+ dataheader.SUB_TOTAL_HARGA +'</div>';
        actual += '</div></br>';

        actual += '<div style="padding-top:5px;padding-bottom:5px;">';
        actual += '<div style="float:left;width:35vw;">PPN (10%)</div>';
        actual += '<div style="float:right;">'+ dataheader.PPN +'</div>';
        actual += '</div></br>';

        actual += '<div style="padding-top:5px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';
        actual += '<div style="float:left;width:35vw;">Grand Total</div>';
        actual += '<div style="float:right;">'+ dataheader.TOTAL_HARGA +'</div>';
        actual += '</div></br>';

        actual += '<div style="padding-top:5px;padding-bottom:5px;">';
        actual += '<div style="float:left;width:35vw;">Dibayarkan</div>';
        actual += '<div style="float:right;">'+ yangdibayarkan +'</div>';
        actual += '</div></br>';

        actual += '<div style="padding-top:5px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';
        actual += '<div style="float:left;width:35vw;">Kembalian</div>';
        actual += '<div style="float:right;">'+ kembalian +'</div>';
        actual += '</div></br>';

        actual += '</br><h2 align="center">Anda Puas Kami Bahagia</h2></br></br>';
        console.log(actual);
        //printStart();
    }

    function printStart(callback)
    {
        var printInfo = {};
        if (argo.os() === 'android')
        {
            try
            {
                printer.open();
            }
            catch (err)
            {
                argo.addLog('Failed to open printer:' + JSON.stringify(err));
                return;
            }
            printInfo =
            {
                htmlString: actual
            };
            printer.printHtml(printInfo, function (err)
            {
                if (err)
                {
                    argo.addLog('Printing error:' + JSON.stringify(err));
                }
                else
                {
                    argo.addLog('Printing completed.');
                }
                try
                {
                    printer.close();
                }
                catch (e)
                {
                    // Close the printer failed.
                    argo.addLog('Failed to close printer:' + JSON.stringify(err));
                }

                if(callback)
                {
                    callback(err);
                }
            });
        }
        else
        {
            argo.addLog('Invalid operation platform');
        }
    }

    /**
     * Printer Status
     */
    function printerStatus() {
        try {
            printer.open();
            argo.addLog('Printer Status:' + printer.getInfo().status);
            printer.close();
        } catch (err) {
            argo.addLog('Failed to get printer status:' + JSON.stringify(err));
            return;
        }
    }

    /**
     * feed paper
     */
    function feedPaper() {
        try {
            printer.open();
        } catch (err) {
            argo.addLog('Failed to open printer: ' + JSON.stringify(err));
        }

        var options = {
            value: 2
        };
        printer.feedPaper(options, function (err) {
            if (err) {
                argo.addLog('Failed to feed paper:' + JSON.stringify(err));
            } else {
                argo.addLog('Paper feeding completed. ');
            }
        });

        try {
            printer.close();
        } catch (err) {
            argo.addLog('Failed to close printer:' + JSON.stringify(err));
        }
    }

    /**
     * Reset Printer
     */
    function resetPrinter() {
        try {
            printer.open();
            printer.reset();
            printer.close();
            argo.addLog('Printer reset completed.');
        } catch (err) {
            argo.addLog('Failed to reset the printer:' + JSON.stringify(err));
        }
    }

    return {
        printReceipt: printReceipt,
        printStart: printStart,
        printerStatus: printerStatus,
        feedPaper: feedPaper,
        resetPrinter: resetPrinter
    };
})();

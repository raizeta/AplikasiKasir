angular.module('starter')
.service('NymphPrinterService',['ToastService',function(ToastService)
{
    var nymph   = require('nymph');
    var printer = new nymph.dev.printer.Printer('PRINTER');
    var actual  = '';

    function printReceipt(templateyangmaudiprint)
    {
        actual = templateyangmaudiprint;
        printStart();
    }

    function printStart(callback)
    {
        var printInfo = {htmlString: actual};
        try
        {
            printer.open();
        }
        catch (err)
        {
            ToastService.ShowToast('Failed to open printer:' + JSON.stringify(err),'error');
            return;
        }

        printer.printHtml(printInfo, function (err)
        {
            if (err)
            {
                ToastService.ShowToast('Printing error:' + JSON.stringify(err),'error');
            }
            else
            {
                ToastService.ShowToast('Printing completed.','success');
            }

            try
            {
                printer.close();
            }
            catch (e)
            {
                ToastService.ShowToast('Failed to close printer:' + JSON.stringify(err),'success');
            }

            if(callback)
            {
                callback(err);
            }
        });
    }


    function printerStatus()
    {
        try
        {
            printer.open();
            ToastService.ShowToast('Printer Status:' + printer.getInfo().status,'success');
            printer.close();
        }
        catch (err)
        {
            ToastService.ShowToast('Failed to get printer status:' + JSON.stringify(err),'error');
            return;
        }
    }


    function feedPaper()
    {
        try
        {
            printer.open();
        }
        catch (err)
        {
            ToastService.ShowToast('Failed to open printer: ' + JSON.stringify(err),'error');
        }

        var options = {value: 2};
        printer.feedPaper(options, function (err)
        {
            if (err)
            {
                ToastService.ShowToast('Failed to feed paper:' + JSON.stringify(err),'error');
            }
            else
            {
                ToastService.ShowToast('Paper feeding completed. ','success');
            }
        });

        try
        {
            printer.close();
        }
        catch (err)
        {
            ToastService.ShowToast('Failed to close printer:' + JSON.stringify(err),'error');
        }
    }


    function resetPrinter()
    {
        try
        {
            printer.open();
            printer.reset();
            printer.close();
            ToastService.ShowToast('Printer reset completed.','success');
        }
        catch (err)
        {
            ToastService.ShowToast('Failed to reset the printer:' + JSON.stringify(err),'error');
        }
    }

    return {
        printReceipt: printReceipt,
        printStart: printStart,
        printerStatus: printerStatus,
        feedPaper: feedPaper,
        resetPrinter: resetPrinter
    };
}])
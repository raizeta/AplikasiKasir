angular.module('starter')
.service('ConstructorService', function($q,$http,$filter,StorageService,UtilService) 
{
    var StoreConstructor  = function()
    {
        var parameters          = UtilService.GetParameters();
        parameters.START        = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        parameters.END          = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        return parameters;
    }

	var ProductConstructor = function(listproducts)
	{
		var lastproduct         = listproducts[listproducts.length - 1];
        var parameters          = UtilService.GetParameters();
        parameters.PRODUCT_ID   = parameters.STORE_ID+'.'+UtilService.StringPad(Number(lastproduct.id) + 1,'0000');
        return parameters;
	}

	var CustomerConstructor = function(listcustomers)
	{
		var lastcustomer        = listcustomers[listcustomers.length - 1];
        var parameters          = UtilService.GetParameters();
        parameters.CUSTOMER_ID  = Number(lastcustomer.CUSTOMER_ID) + 1;
        return parameters;
	}

    var MerchantConstructor = function(listmerchants)
    {
        var lastmerchant        = listmerchants[listmerchants.length - 1];
        var parameters          = UtilService.GetParameters();
        if(angular.isDefined(lastmerchant.id))
        {
            parameters.MERCHANT_ID  = parameters.STORE_ID+'.'+UtilService.StringPad(Number(lastmerchant.id) + 1,'0000');    
        }
        else
        {
           parameters.MERCHANT_ID  = parameters.STORE_ID+'.'+UtilService.StringPad(Number(lastmerchant.MERCHANT_ID.split('.')[2]) + 1,'0000'); 
        }
        
        return parameters;
    }

    var MerchantBankConstructor = function(listmerchantbanks)
    {
        var lastmerchantbanks   = listmerchantbanks[listmerchantbanks.length - 1];
        var parameters          = UtilService.GetParameters();
        if(angular.isDefined(lastmerchantbanks.id))
        {
            parameters.BANK_ID  = Number(lastmerchantbanks.id) + 1;    
        }
        else
        {
           parameters.BANK_ID   = Number(lastmerchantbanks.BANK_ID) + 1; 
        }
        
        return parameters;
    }
    
    var MerchantTypeConstructor = function(listmerchanttypes)
    {
        var lastmerchanttypes   = listmerchanttypes[listmerchanttypes.length - 1];
        var parameters          = UtilService.GetParameters();
        if(angular.isDefined(lastmerchanttypes.id))
        {
            parameters.TYPE_PAY_ID  = Number(lastmerchanttypes.id) + 1;    
        }
        else
        {
           parameters.TYPE_PAY_ID   = Number(lastmerchanttypes.BANK_ID) + 1; 
        }
        
        return parameters;
    }

    var TransaksiHeaderConstructor = function()
    {
        var profilecashier          = StorageService.get('advanced-profile').PROFILE;

        var namacashier             = profilecashier.NM_DEPAN;
        if(profilecashier.NM_TENGAH && profilecashier.NM_TENGAH != null && profilecashier.NM_TENGAH != 'null')
        {
            namacashier             = namacashier+' ' + profilecashier.NM_TENGAH;
        }
        if(profilecashier.NM_BELAKANG && profilecashier.NM_BELAKANG != null && profilecashier.NM_BELAKANG!= 'null')
        {
            namacashier             = namacashier+' ' + profilecashier.NM_BELAKANG;
        }

        var parameters              = UtilService.GetParameters();
        parameters.CASHIER_NAME     = namacashier;

        

        parameters.TRANS_DATE       = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        parameters.TOTAL_PRODUCT    = 0;

        parameters.SUB_TOTAL_HARGA  = 0;
        parameters.PPN              = 0;
        parameters.TOTAL_HARGA      = 0;
        parameters.DO_KEM_TYPE      = 0;
        parameters.DO_KEM           = 0;

        parameters.TYPE_PAY_ID      = 1;
        parameters.TYPE_PAY_NM      = 'TUNAI';

        parameters.BANK_ID          = null;
        parameters.BANK_NM          = null;

        parameters.MERCHANT_ID      = null;
        parameters.MERCHANT_NM      = null;
        parameters.MERCHANT_NO      = null;

        parameters.CONSUMER_ID      = null;
        parameters.CONSUMER_NM      = '--';
        parameters.CONSUMER_EMAIL   = '--';
        parameters.CONSUMER_PHONE   = '--';

        parameters.STATUS           = 0;
        parameters.DCRP_DETIL       = 'KASIR';

        return parameters;
    }

    var ProductAddToShopCart = function(itemproduct)
    {
        var dataitemshopcarttosave                  = {};
        dataitemshopcarttosave.TGL_SAVE             = $filter('date')(new Date(),'yyyy-MM-dd');
        dataitemshopcarttosave.TRANS_DATE           = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        dataitemshopcarttosave.ACCESS_GROUP         = itemproduct.ACCESS_GROUP;
        dataitemshopcarttosave.STORE_ID             = itemproduct.STORE_ID;
        dataitemshopcarttosave.GOLONGAN             = itemproduct.GOLONGAN;
        dataitemshopcarttosave.PRODUCT_ID           = itemproduct.PRODUCT_ID;
        dataitemshopcarttosave.PRODUCT_NM           = itemproduct.PRODUCT_NM;
        dataitemshopcarttosave.PRODUCT_PROVIDER     = itemproduct.PRODUCT_PROVIDER;
        dataitemshopcarttosave.PRODUCT_PROVIDER_NO  = itemproduct.PRODUCT_PROVIDER_NO;
        dataitemshopcarttosave.PRODUCT_PROVIDER_NM  = itemproduct.PRODUCT_PROVIDER_NM;
        dataitemshopcarttosave.UNIT_ID              = itemproduct.UNIT_ID;
        dataitemshopcarttosave.UNIT_NM              = itemproduct.UNIT_NM;
        dataitemshopcarttosave.TRANS_TYPE           = 0;

        dataitemshopcarttosave.HARGA_JUAL           = Number(itemproduct.HARGA_JUAL);
        dataitemshopcarttosave.HPP                  = Number(itemproduct.CURRENT_HPP);
        dataitemshopcarttosave.PPN                  = Number(itemproduct.CURRENT_PPN);
        dataitemshopcarttosave.DISCOUNT             = Number(itemproduct.CURRENT_DISCOUNT);
        dataitemshopcarttosave.QTY_INCART           = Number(itemproduct.QTY_INCART);
        dataitemshopcarttosave.PROMO                = itemproduct.CURRENT_PROMO;
        dataitemshopcarttosave.STATUS               = 0;

        return dataitemshopcarttosave;
    }

    var OpenCloseBookConstructor = function()
    {
        var parameters              = UtilService.GetParameters();
        
        parameters.OPENCLOSE_ID     = null;
        parameters.TGL_OPEN         = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        parameters.TGL_CLOSE        = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');

        parameters.CASHINDRAWER     = 0;
        parameters.ADDCASH          = 0;
        parameters.SELLCASH         = 0;
        parameters.TOTALCASH        = 0;
        parameters.TOTALDONASI      = 0;
        parameters.TOTALREFUND      = 0;
        parameters.TOTALCASH_ACTUAL = 0; 
        parameters.STATUS           = 2;
        parameters.WITHDRAW         = 0;
        parameters.IS_OPEN          = 1;
        parameters.IS_CLOSE         = 0;
        parameters.statusapakahsama = 'true';

        return parameters;
    }

    var SetoranConstructor = function(dataclosebook)
    {
        var parameters              = UtilService.GetParameters();
        
        parameters.OPENCLOSE_ID         = dataclosebook.OPENCLOSE_ID;
        parameters.SPLIT_OPENCLOSE_ID   = dataclosebook.OPENCLOSE_ID.split('.')[2];
        parameters.TGL_STORAN           = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        parameters.TOTALCASH            = dataclosebook.TOTALCASH;
        parameters.NOMINAL_STORAN       = dataclosebook.TOTALCASH_ACTUAL;
        parameters.SISA_STORAN          = 0;
        parameters.BANK_NM              = null;
        parameters.BANK_NO              = null;
        parameters.CREATE_AT            = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        parameters.STATUS               = 2;
        parameters.DCRP_DETIL           = 'SETORAN UNTUK CLOSING ID ' + dataclosebook.OPENCLOSE_ID;
        parameters.STORAN_IMAGE         = 'img/save-image.png';

        return parameters;
    }

    var AbsensiContructor   = function(datakaryawan)
    {
        var parameters              = UtilService.GetParameters();
        parameters.OFLINE_ID        = $filter('date')(new Date(),'yyyyMMddHHmmss');;
        parameters.KARYAWAN_ID      = datakaryawan.KARYAWAN_ID;
        parameters.TGL              = $filter('date')(new Date(),'yyyy-MM-dd');
        parameters.WAKTU            = $filter('date')(new Date(),'HH:mm:ss');
        parameters.STATUS           = 0;
        parameters.DCRP_DETIL       = null;
        parameters.ABSEN_IMAGE      = null;
        parameters.LATITUDE         = null;
        parameters.LONGITUDE        = null;

        return parameters;
    }

    var ProductStockConstructor = function()
    {
        var parameters              = UtilService.GetParameters();
        var datatosave              = {};
        datatosave.ID               = 5;
        datatosave.TGL_SAVE         = $filter('date')(new Date(),'yyyy-MM-dd');

        datatosave.ACCESS_GROUP     = parameters.ACCESS_GROUP;
        datatosave.STORE_ID         = parameters.STORE_ID;
        datatosave.PRODUCT_ID       = null;

        datatosave.INPUT_STOCK      = 15;
        datatosave.LAST_STOCK       = 12;
        datatosave.CURRENT_STOCK    = 15; 
        datatosave.SISA_STOCK       = 16;

        datatosave.INPUT_DATE       = $filter('date')(new Date(),'yyyy-MM-dd');
        datatosave.INPUT_TIME       = $filter('date')(new Date(),'HH:mm:ss');
        datatosave.CURRENT_DATE     = $filter('date')(new Date(),'yyyy-MM-dd');
        datatosave.CURRENT_TIME     = $filter('date')(new Date(),'HH:mm:ss');


        datatosave.STATUS           = 1;
        datatosave.DCRP_DETIL       = 'Penambahan Produk Stok';

        return datatosave
    }

    var ProductGroupConstructor = function(datastore,LAST_ID)
    {
        var datatosave              = {};
        datatosave.ACCESS_GROUP     = datastore.ACCESS_GROUP;
        datatosave.STORE_ID         = datastore.STORE_ID;
        if(LAST_ID)
        {
            var nomorurut           = UtilService.StringPad(Number(LAST_ID.split('.')[2]) + 1,'00000');
            datatosave.GROUP_ID     = datastore.STORE_ID + '.' + nomorurut;
        }
        else
        {   
            datatosave.GROUP_ID     = datastore.STORE_ID + '.00001';
        }
        datatosave.GROUP_NM         = null;
        datatosave.STATUS           = 1;
        datatosave.NOTE             = 'Catatan Untuk Product Group';

        return datatosave
    }

	return{
			StoreConstructor:StoreConstructor,
            ProductConstructor:ProductConstructor,
			CustomerConstructor:CustomerConstructor,
            MerchantConstructor:MerchantConstructor,
            MerchantBankConstructor:MerchantBankConstructor,
            MerchantTypeConstructor:MerchantTypeConstructor,
            TransaksiHeaderConstructor:TransaksiHeaderConstructor,
            ProductAddToShopCart:ProductAddToShopCart,
            OpenCloseBookConstructor:OpenCloseBookConstructor,
            SetoranConstructor:SetoranConstructor,
            AbsensiContructor:AbsensiContructor,
            ProductStockConstructor:ProductStockConstructor,
            ProductGroupConstructor:ProductGroupConstructor
		  }
});
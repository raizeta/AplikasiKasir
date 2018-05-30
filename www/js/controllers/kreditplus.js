angular.module('starter')
.controller('KreditPlusCtrl',['OfflineLiteFac','$filter','$scope','$ionicLoading','$state', 
function(OfflineLiteFac,$filter,$scope,$ionicLoading,$state) 
{   
	 $scope.timeline = 
	 [{
	    date: new Date(),
	    title: "Data Pribadi",
	    type: "picture",
	    url:"datapribadi"
	  }, 
	  {
	    date: new Date(),
	    title: "Data Domisil",
	    type: "picture",
	    url:"datadomisili"
	  },
	   {
	    date: new Date(),
	    title: "Data Pekerjan",
	    type: "location",
	    url:"datapekerjaan"

	  },
	  {
	    date: new Date(),
	    title: "Data Kontak",
	    type: "video",
	    url:"datakontak"

	  }, 
	  {
	    date: new Date(),
	    title: "Dokumen",
	    type: "text",
	    url:"datadokumen"

	  }
  	]

  	$scope.gotodetailform = function(dataurl)
  	{
  		$state.go('tab.kreditplus-'+ dataurl, {}, {reload: false});
  	}

}])

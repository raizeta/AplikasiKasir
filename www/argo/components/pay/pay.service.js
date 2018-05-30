/**
 * Created by lilin01 on 2015/11/19.
 */
/* jshint -W117 */
argo.payService = (function () {
    'use strict';

    function inputChange(event) {
        var elem = event.target,
            val = elem.value;

        argo.id('submitForm').removeAttribute('disabled');
    }

    function postForm() {
        argo.router.go('card-holder-info-collector');
    }

    return {
        inputChange: inputChange,
        postForm: postForm
    };

})();
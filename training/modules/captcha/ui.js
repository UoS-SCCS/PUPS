/*******************************************************************************
*                                                                              *
* (C) Copyright 2021-2022 University of Surrey                                 *
*                                                                              *
* Redistribution and use in source and binary forms, with or without           *
* modification, are permitted provided that the following conditions are met:  *
*                                                                              *
* 1. Redistributions of source code must retain the above copyright notice,    *
* this list of conditions and the following disclaimer.                        *
*                                                                              *
* 2. Redistributions in binary form must reproduce the above copyright notice, *
* this list of conditions and the following disclaimer in the documentation    *
* and/or other materials provided with the distribution.                       *
*                                                                              *
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"  *
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE    *
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE   *
* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE    *
* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR          *
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF         *
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS     *
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN      *
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)      *
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE   *
* POSSIBILITY OF SUCH DAMAGE.                                                  *
*                                                                              *
*******************************************************************************/
function selectCaptcha(elem) {
    if (elem.classList.contains("selected-cell")) {
        elem.classList.remove("selected-cell");
    } else {
        elem.classList.add("selected-cell");
    }


}
var captchaPopover;
function prepareCaptchaPopover() {
    if (pupConfig.getField('useCaptcha', false)) {
        const captchacontainer = document.getElementById("signInCAPTCHAContainer");


        captchaPopover = new bootstrap.Popover(document.getElementById("captcha-pop"), {
            container: 'body',
            template: '<div class="popover custom-popover-container" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body custom-popover"></div></div>',
            html: true,
            delay: { "show": 500, "hide": 100 },
            content: captchacontainer,
        });

        document.getElementById("captcha-pop").addEventListener('shown.bs.popover', function () {
            const firstCell = document.querySelector("[data-sccs-captcha-idx='0']");
            firstCell.focus();

        });


        const hiddenCheck = document.createElement("input");
        hiddenCheck.type = "checkbox";
        hiddenCheck.className = "form-element";
        hiddenCheck.style.position = "relative";
        hiddenCheck.style.left = "-10px";
        hiddenCheck.style.zIndex = "-1000";
        hiddenCheck.style.width = "1px";
        hiddenCheck.required = true;
        hiddenCheck.id = "captchaCheck";
        hiddenCheck.name = "captchaCheck";
        hiddenCheck.title = "Hidden checkbox element, do not interact with";
        hiddenCheck.tabIndex = -1;
        hiddenCheck.setAttribute("aria-hidden", "true");
        document.getElementById("captcha-pop").appendChild(hiddenCheck);
        document.getElementById("captchaContainer").classList.remove("d-none");
    } else {
        document.getElementById("captchaContainer").classList.add("d-none");
    }
}

function verifyCaptcha() {
    if (currentCaptcha !== null) {
        if (currentCaptcha.verify()) {
            captchaPopover.hide();

            showValid(document.getElementById("captcha-pop"));
            document.getElementById("captchaCheck").checked = true;
            document.getElementById("signInCaptchaBtn").focus();
        } else {
            captchaPopover.hide();
            document.getElementById("captchaCheck").checked = false;
            showError();
            document.getElementById("captcha-pop").focus();
        }
        currentCaptcha.refresh();
    }
}
function showCaptcha(elem) {
    hideError();

    showSpinner(elem);
    window.setTimeout(function () { hideSpinner(elem); }, 500);
}
function selectCaptchaKey(event, elem) {

    switch (event.which) {
        case 13:
        case 32: {
            event.stopPropagation;
            return elem.click();
            break;
        }
    }
    return true;
}
function handleCaptchaKeypress(event, elem) {
    console.log(event);
    switch (event.which) {
        case 13:
        case 32: {
            event.stopPropagation;
            document.getElementById("captchaCheck").focus();
            return elem.click();
            break;
        }
    }
    return true;
}
function showSpinner(elem) {
    document.getElementById("captchaCheck").classList.add("d-none");
    elem.classList.add("fas");
    elem.classList.add("fa-spinner");
    elem.classList.add("fa-spin");
    elem.classList.remove("fa-square");
    elem.classList.remove("far");


}
function showValid(elem) {
    elem.classList.add("far");
    elem.classList.add("fa-check-square");
    elem.classList.remove("fa-square");
    elem.setAttribute("aria-checked", "true");

}
function showError() {
    document.getElementById("captchaerror").innerText = "Security check failed. Try again."



}
function hideError() {
    document.getElementById("captchaerror").innerText = ""



}
function hideSpinner(elem) {
    elem.classList.add("fa-square");
    elem.classList.add("far");
    elem.classList.remove("fas");
    elem.classList.remove("fa-spinner");
    elem.classList.remove("fa-spin")
    document.getElementById("captchaCheck").classList.remove("d-none");


}
var currentCaptcha = null;
function renderCaptcha() {
    if (pupConfig.getField('useCaptcha', false)) {
        currentCaptcha = new CAPTCHA();
        currentCaptcha.render();
    }
}

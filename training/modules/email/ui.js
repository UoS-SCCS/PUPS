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
/**
 * Contains a number of UI functions used by the email client
 */

/**
 * Generates a new toast alert to the user
 */
var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl)
})

/**
 * variable to hold current toast
 */
var currentToast = null;

/**
 * Hide the new email toast
 */
function hideNewEmailToast() {
    if (currentToast !== null) {
        currentToast.hide();
    }
}

/**
 * Show the new email toast pointing to the tag that received the new email
 * @param string tag    that received new email and will be linked to in the toast
 */
function showNewEmailToast(tag) {

    var myToastEl = document.getElementById('newEmailToast');
    var myToast = bootstrap.Toast.getOrCreateInstance(myToastEl);
    document.getElementById("toast-message").innerHTML = "New email received in <a class=\"text-light\" onclick=\"loadTag('" + tag + "')\" href=\"#\">" + tag + "<a/>";
    currentToast = myToast;
    if(currentToast !== null){
        currentToast.show();
    }
}

/**
 * Show and email
 * @param string tag    Unused
 * @param int index     Unused
 */
function showEmail(tag, index) {
    document.getElementById("email-list").classList.remove("d-block");
    document.getElementById("email-list").classList.add("d-none");
    document.getElementById("email-viewer").classList.add("d-block");
    document.getElementById("email-viewer").classList.remove("d-none");
}

/**
 * Prepare the help icon popover that provides access to training
 * information. If the email module is to be used outside the
 * training hub remove this part.
 */
function prepPopover() {
    window.name="SCCSEmailWindow";
    const popContents = document.createElement("div");
    popContents.id = "popcontents";
    popContents.className = "help-popover";
    const divMb = document.createElement("div");
    divMb.className = "mb-3";
    const label = document.createElement("div");
    label.innerText = "Email Address:";
    divMb.appendChild(label);
    const addressHolder = document.createElement("div");
    addressHolder.id = "accountEmailAddress";
    addressHolder.className = "form-control form-control-sm";
    addressHolder.innerText = currentEmailAccount;
    addressHolder.setAttribute("data-bs-toggle", "tooltip");
    addressHolder.setAttribute("data-bs-placement", "bottom");
    addressHolder.setAttribute("data-bs-trigger", "manual");
    addressHolder.title = "Email address copied";


    divMb.appendChild(addressHolder);
    popContents.appendChild(divMb);
    const emailButton = document.createElement("a");
    emailButton.className = "btn btn-info";
    emailButton.href = "#";
    emailButton.role = "button";
    emailButton.innerText = "Return to Training Site";
    emailButton.id = "openEmailBtnPop"
    popContents.appendChild(emailButton);

    var popover = new bootstrap.Popover(document.getElementById("popoverHelp"), {
        container: 'body',
        content: popContents,
    });
    document.getElementById("popoverHelp").addEventListener('shown.bs.popover', function () {

        document.getElementById("accountEmailAddress").addEventListener("click", function () {
            return selectEmailAddress();
        });
        document.getElementById("openEmailBtnPop").addEventListener("click", function () {
            popover.hide()
            return openTraining();
        });
    });
}

/**
 * Changes focus back to the training tab if possible
 * @returns false
 */
function openTraining() {
    if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
        window.open("", "SCCSPasswordTraining");
   }
   
    window.opener.focus()
    window.open("", "SCCSPasswordTraining");
    if('GestureEvent' in window && !showniOSWarning){
        alert("Safari on iOS currently blocks tab switching from within the page. Please manually switch tabs.");
        showniOSWarning=true
    }
    return false;

}

/**
 * Shows an modal alert to warn the user they cannot compose within 
 * the virtual email server
 */
function compose() {
    showModal("Compose new email", "The compose feature is disabled within the training site. The training email address is solely used to receive emails as part of training scenarios.", "OK");
}

/**
 * Refresh the current account
 */
function refreshCurrent() {
    hideNewEmailToast();
    renderEmail();
}

/**
 * Load a particular tag by simulating a click on that tags nav component
 * @param string tag    to show
 */
function loadTag(tag) {
    document.getElementById(tag.toLowerCase() + "Nav").click();
    if (currentToast != null) {
        currentToast.hide();
    }
}
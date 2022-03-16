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
 * Selects email address and puts into the system clipboard
 */
function selectEmailAddress() {
    window.getSelection().selectAllChildren(document.getElementById("accountEmailAddress"));
    document.execCommand("copy");

    var tooltip = new bootstrap.Tooltip(document.getElementById("accountEmailAddress"));
    tooltip.show();
    window.setTimeout(function () { tooltip.hide() }, 1500);
}

/**
 * Create the generic help popover shown on lesson pages
 */
function prepHelpPopover() {
    const currentEmailAccount = window.localStorage.getItem("sccs_current");
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

    const divBtn = document.createElement("div");
    divBtn.className = "mb-3 d-flex justify-content-center";
    const emailButton = document.createElement("a");
    emailButton.className = "btn btn-info text-black";
    emailButton.href = "#";
    emailButton.role = "button";
    emailButton.innerText = "Open Training Email Account";
    emailButton.id = "openEmailBtnPop"
    divBtn.appendChild(emailButton);
    popContents.appendChild(divBtn);



    const divRtn = document.createElement("div");
    divRtn.className = "mb-3 d-flex justify-content-center";
    const returnButton = document.createElement("a");
    returnButton.className = "btn btn-info";
    returnButton.href = "#";
    returnButton.role = "button";
    returnButton.innerText = "Return to Training Site";
    returnButton.id = "returnBtnPop"
    divRtn.appendChild(returnButton);
    popContents.appendChild(divRtn);

    var popover = new bootstrap.Popover(document.getElementById("popoverHelp"), {
        container: 'body',
        content: popContents,
    });
    document.getElementById("popoverHelp").addEventListener('shown.bs.popover', function () {

        document.getElementById("accountEmailAddress").addEventListener("click", function () {
            return selectEmailAddress();
        });
        document.getElementById("returnBtnPop").addEventListener("click", function () {
            popover.hide()
            return returnToTraining();
        });
        document.getElementById("openEmailBtnPop").addEventListener("click", function () {
            popover.hide()
            return openEmailAccount();
        });
    });
}
/**
 * Keep track of current window to allow changing focus without reloading
 */
var currentWindow = null;
var showniOSWarning=false;
/**
 * Open the email account or switch focus if it is already open
 * @returns false
 */
function openEmailAccount() {
    
    if (currentWindow !== null && !currentWindow.closed) {
        currentWindow.focus();
        if('GestureEvent' in window && !showniOSWarning){
            alert("Safari on iOS currently blocks tab switching from within the page. Please manually switch tabs.");
            showniOSWarning=true
        }
    } else {
        window.name = "SCCSPasswordTraining";
        currentWindow = window.open("./modules/email/email.html", "SCCSEmailWindow");
    }
    return false;

}

/**
 * Close the email window
 */
function closeEmailWindow() {
    if (currentWindow !== null) {
        try {
            currentWindow.close();
            currentWindow = null;
        } catch (err) {
            console.log("Cannot close email window");
        }
    }
}
/**
 * Return to the training site and navigate to training list
 */
function returnToTraining() {
    window.location = "./index.html#traininglist";
}

/**
 * signing button takes the user back to the training site
 * @returns false
 */
function signInButton() {
    window.location = "./index.html#traininglist";
    return false;
}

/**
 * Check the validity of the entered email, including that it ends
 * in example.com.
 */
function checkEmailValidity() {
    if (!document.getElementById("username").checkValidity()) {
        document.getElementById("username").classList.add("is-invalid");
        document.getElementById("username").classList.remove("is-valid");

    } else if (!document.getElementById("username").value.endsWith("example.com")) {
        document.getElementById("username").classList.add("is-invalid");
        document.getElementById("username").classList.remove("is-valid");
    } else {
        document.getElementById("username").classList.add("is-valid");
        document.getElementById("username").classList.remove("is-invalid");
    }
}
/**
 * Validates the two passwords are the same. This is legacy code
 * left in in case the password comparison is re-established. Currently
 * only a single password box is provided, but a second one is 
 * in the HTML but commented out.
 */
 function validatePasswords() {
    const pwd1 = document.getElementById("password");
    const pwd2 = document.getElementById("password2");
    if (pwd1.value !== pwd2.value) {
        pwd1.classList.add("is-invalid");
        pwd2.classList.add("is-invalid");
        pwd1.classList.remove("is-valid");
        pwd1.classList.remove("is-valid");
    } else {
        pwd1.classList.remove("is-invalid");
        pwd2.classList.remove("is-invalid");
        pwd1.classList.add("is-valid");
        pwd2.classList.add("is-valid");
    }
}
/**
 * Configures password validation
 */
function setupPasswordValidation(){
    //Prepare password validation
    var passwordRestrictions = pupConfig.getField("passwordRestrictions",null);
    var pwdPattern = "";
    var additionalTitle=""
    if(passwordRestrictions!==null){
        if("atLeastOneUpperCase" in passwordRestrictions && passwordRestrictions["atLeastOneUpperCase"]){
            pwdPattern += "(?=.*[A-Z])";
            additionalTitle+= "At least one uppercase letter| ";
        }
        if("atLeastOneLowerCase" in passwordRestrictions && passwordRestrictions["atLeastOneLowerCase"]){
            pwdPattern += "(?=.*[a-z])";
            additionalTitle+= "At least one lowercase letter| ";
        }
        if("atLeastOneNumber" in passwordRestrictions && passwordRestrictions["atLeastOneNumber"]){
            pwdPattern += "(?=.*\\d)";
            additionalTitle+= "At least one number| ";
        }
        if("atLeastOneSpecial" in passwordRestrictions && passwordRestrictions["atLeastOneSpecial"]){
            pwdPattern += "(?=.*?[#?!@$%^&*-\\]\\[])";
            additionalTitle+= "At least one special character (?=#@%&*^)| ";
        }
        if("atLeastLength" in passwordRestrictions && passwordRestrictions["atLeastLength"]>0){
            pwdPattern += ".{" + passwordRestrictions["atLeastLength"] + ",}"
            additionalTitle+= "At least " + passwordRestrictions["atLeastLength"] + " characters long";
        }else{
            pwdPattern += ".{1,}"
        }
        
    }
    var newTitle = "Please enter your chosen password here"
    if(additionalTitle!==""){
        newTitle+= "\nIt should be:\n" + additionalTitle;
        document.getElementById("password").setAttribute("title",newTitle);
    }
    document.getElementById("password").setAttribute("pattern",pwdPattern);
}
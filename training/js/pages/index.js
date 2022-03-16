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
 * Start the registration lesson
 * @returns false
 */
function startReg() {
    const majorSteps = pupConfig.getField("steps", null);
    var steps = majorSteps[0];
    pupConfig.setField("currentStep", 0);
    pupConfig.setField("currentStepMajor", 0);

    window.location = steps[pupConfig.getField("currentStep")];
    return false;
}
/**
 * start the second registration task - now redundant
 * @returns false
 */
function startReg2() {
    const majorSteps = pupConfig.getField("steps", null);
    var steps = majorSteps[0];
    pupConfig.setField("currentStep", 2);
    pupConfig.setField("currentStepMajor", 0);
    window.location = steps[pupConfig.getField("currentStep")];
    return false;
}
/**
 * Start the first login lesson
 * @returns false
 */
function startLogin() {
    const majorSteps = pupConfig.getField("steps", null);
    var steps = majorSteps[1];
    pupConfig.setField("currentStep", 0);
    pupConfig.setField("currentStepMajor", 1);
    pupConfig.setField("useOtp", false);
    pupConfig.setField("useCaptcha", false);
    window.location = steps[pupConfig.getField("currentStep")];
    return false;
}

/**
 * Start the login with OTP lesson
 * @returns false
 */
function startLoginOtp() {
    const majorSteps = pupConfig.getField("steps", null);
    var steps = majorSteps[1];
    pupConfig.setField("currentStep", 0);
    pupConfig.setField("currentStepMajor", 2);
    pupConfig.setField("useOtp", true);
    pupConfig.setField("useCaptcha", false);
    window.location = steps[pupConfig.getField("currentStep")];
    return false;
}

/**
 * Start the login with CAPTCHA lesson
 * @returns false
 */
function startLoginCaptcha() {
    const majorSteps = pupConfig.getField("steps", null);
    var steps = majorSteps[1];
    pupConfig.setField("currentStep", 0);
    pupConfig.setField("currentStepMajor", 3);
    pupConfig.setField("useOtp", false);
    pupConfig.setField("useCaptcha", true);
    window.location = steps[pupConfig.getField("currentStep")];

    return false;
}

/**
 * Confirm with the user they wish reset their current training.
 * 
 * This does not clear the training site config, i.e. their email account, 
 * only their training progress.
 * 
 * @returns false
 */
function resetTraining() {
    const result = window.confirm("Are you sure you want to reset your training progress?\n\nThis will clear your current training progress and allow you to try all the training again.");
    if (result) {
        window.localStorage.removeItem("stepdata");
        pupConfig.setField("currentStep", 0);
        pupConfig.setField("currentStepMajor", 0);

        window.location = "index.html";


    }
    return false;
}

/**
 * Finish the training and delete all locally stored data.
 * 
 * Confirm the user wish to proceed then delete data from
 * localStorage
 * @returns false
 */
function finish() {
    const result = window.confirm("Are you sure you want to end your training?\n\nThis will delete your training account and training email address. You will be able to try the training again, but will need to repeat the setup and registration steps.");
    if (result) {
        virtualEmailServer.delete(window.localStorage.getItem("sccs_current"));
        server.delete(window.localStorage.getItem("sccs_current"));
        window.localStorage.removeItem("stepdata");
        window.localStorage.removeItem("sccs_current");
        document.getElementById("accountName").value = "";
        closeEmailWindow();
        pupConfig.setField("currentStep", 0);
        pupConfig.setField("currentStepMajor", 0);
        pupConfig.setField("useOtp", false);
        pupConfig.setField("useCaptcha", false);

        window.location = "index.html#introduction";
        window.location.reload();

    }
    return false;
}

/**
 * Create a new training account having checked the account name is valid
 * @param Event evt 
 * @returns true if created, false if name is invalid
 */
function configureAccount(evt) {
    if (document.getElementById("accountName").reportValidity()) {
        const accountName = document.getElementById("accountName").value.toLowerCase();
        if (accountName === null || accountName === "") {
            alert("You need to enter a name for your account");
            return false;
        } else {
            virtualEmailServer.createAccount(accountName + "@example.com");
            updateTrainingList();
            document.getElementById("newAccount").innerText = accountName + "@example.com";
            return true;
        }
    } else {
        evt.preventDefault();
        evt.stopPropagation()
        document.getElementById("accountName").classList.add("invalid");
    }
}

/**
 * Render the training landing page, including the help popover.
 * 
 * Note this is a slightly different popover to the standard because
 * it is only shown after the email account setup and doesn't contain
 * a link to the training site, since we are already on the training
 * site
 */
function showTrainingLanding() {


    const popContents = document.createElement("div");
    popContents.id = "popcontents";
    popContents.className = "help-popover text-black";
    const divMb = document.createElement("div");
    divMb.className = "mb-3 text-black";
    const label = document.createElement("div");
    label.innerText = "Email Address:";
    divMb.appendChild(label);
    const addressHolder = document.createElement("div");
    addressHolder.id = "accountEmailAddress";
    addressHolder.className = "form-control form-control-sm text-black";
    addressHolder.innerText = "Email Address";
    addressHolder.setAttribute("data-bs-toggle", "tooltip");
    addressHolder.setAttribute("data-bs-placement", "bottom");
    addressHolder.setAttribute("data-bs-trigger", "manual");
    addressHolder.title = "Email address copied";


    divMb.appendChild(addressHolder);
    popContents.appendChild(divMb);
    const emailButton = document.createElement("a");
    emailButton.className = "btn btn-info text-black";
    emailButton.href = "#";
    emailButton.role = "button";
    emailButton.innerText = "Open Training Email Account";
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
        document.getElementById("openEmailBtnPop").addEventListener("click", function (evt) {
            evt.preventDefault();
            popover.hide();
            return openEmailAccount();
        });
    });

    const currentUser = window.localStorage.getItem("sccs_current");
    if (currentUser !== null) {
        addressHolder.innerText = currentUser;
        accountName.value = currentUser.substr(0, currentUser.indexOf("@"));
        document.getElementById("newAccount").innerText = currentUser;

    }
    document.getElementById("traininglist").classList.add("show");
    if (currentUser !== null) {
        window.location = "#traininglist";
    }
    updateTrainingList();
}

/**
 * Update the rendering of the training list based on what has been 
 * completed. Disables those lessons (Registration) that cannot
 * be repeated without a reset. Those that are completed and can
 * be redone are left enabled but with a green tick overlay
 * 
 * Lessons that are inaccessible until the previous lesson is
 * completed are disabled and faded.
 */
function updateTrainingList() {
    const currentUser = window.localStorage.getItem("sccs_current");
    const majorStep = pupConfig.getField("currentStepMajor", null);
    const step = pupConfig.getField("currentStep", null);
    const cardArray = [["regCard"], ["loginCard"], ["loginAdv1Card"], ["loginAdv2Card"]];

    for (var mStepCount = 0; mStepCount < cardArray.length; mStepCount++) {
        for (var stepCount = 0; stepCount < cardArray[mStepCount].length; stepCount++) {
            if (currentUser === null) {
                const obj = document.getElementById(cardArray[mStepCount][stepCount]);
                obj.classList.add("card-disabled");
                obj.classList.add("bg-light");
                obj.setAttribute("aria-hidden", "true");
                const objBtn = document.getElementById(cardArray[mStepCount][stepCount] + "Btn");
                objBtn.classList.add("disabled");
                objBtn.tabIndex = -1;
            } else if (mStepCount < majorStep) {
                if (cardArray[mStepCount][stepCount] !== "") {
                    const obj = document.getElementById(cardArray[mStepCount][stepCount]);
                    obj.classList.add("bg-success");
                    if (mStepCount < 1) {
                        const objBtn = document.getElementById(cardArray[mStepCount][stepCount] + "Btn");
                        objBtn.classList.add("disabled");
                        objBtn.classList.add("btn-success");
                        objBtn.classList.remove("btn-primary");

                        objBtn.tabIndex = -1;
                    }
                    const objSuccess = document.getElementById(cardArray[mStepCount][stepCount] + "Success");
                    objSuccess.classList.remove("d-none");
                }

            } else if (mStepCount === majorStep && stepCount < step) {
                if (cardArray[mStepCount][stepCount] !== "") {
                    const obj = document.getElementById(cardArray[mStepCount][stepCount]);
                    obj.classList.add("bg-success");
                    const objBtn = document.getElementById(cardArray[mStepCount][stepCount] + "Btn");
                    objBtn.classList.add("disabled");
                    objBtn.classList.add("btn-success");
                    objBtn.classList.remove("btn-primary");
                    objBtn.tabIndex = -1;
                }
            } else if (mStepCount === majorStep && stepCount === step) {

            } else {
                if (cardArray[mStepCount][stepCount] !== "") {
                    const obj = document.getElementById(cardArray[mStepCount][stepCount]);
                    obj.classList.add("card-disabled");
                    obj.classList.add("bg-light");
                    const objBtn = document.getElementById(cardArray[mStepCount][stepCount] + "Btn");
                    objBtn.classList.add("disabled");
                    objBtn.classList.add("btn-success");
                    objBtn.classList.remove("btn-primary");
                    objBtn.tabIndex = -1;

                }
            }


        }
    }
    if (majorStep < cardArray.length && step < cardArray[majorStep].length && cardArray[majorStep][step] !== "" && currentUser !== null) {
        const obj = document.getElementById(cardArray[majorStep][step]);
        obj.classList.remove("card-disabled");
        obj.removeAttribute("aria-hidden");
        const objBtn = document.getElementById(cardArray[majorStep][step] + "Btn");
        objBtn.classList.remove("disabled");
        objBtn.classList.remove("btn-success");
        objBtn.classList.add("btn-primary");
        objBtn.removeAttribute("tabIndex");
    }
}
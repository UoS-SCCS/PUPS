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
 * Basic validation of an email address
 * @param string email email address to validate
 * @returns 
 */
function validateEmail(email) {
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
}
var skipNext = false;

/**
 * Show password functionality only active if the plaintext password is stored
 */
function showPassword() {
    if (document.getElementById("enteredPassword").type === "text") {
        document.getElementById("enteredPassword").type = "password";
        document.getElementById("show-button").innerText = "Show";
    } else {
        document.getElementById("enteredPassword").type = "text";
        document.getElementById("show-button").innerText = "Hide";
    }
}

/**
 * Render the summary screen and attempt to provide advice on the
 * password entered based on the analysis that was previous performed
 */
function showSummary() {
    const currentUser = window.localStorage.getItem("sccs_current");

    var stepdata = new StepData()
    var nextTryUser = "";
    var nextTryPassword = "";
    if (currentUser !== null) {

        if (pupConfig.getField("savePlaintextPwd", false)) {
            document.getElementById("enteredPassword").value = stepdata.password;
            document.getElementById("plaintextpwd").classList.remove("d-none");
        }
        document.getElementById("enteredUser").innerText = stepdata.username;
        if (validateEmail(stepdata.username) && stepdata.username === currentUser) {
            document.getElementById("emailSummary").innerText = "This is a valid email address and matches the training email address you set up earlier."
            document.getElementById("userIcon").classList.add("fa-check");
            document.getElementById("userIcon").classList.add("pass");
            nextTryUser = "Don't worry, you can use the same username as it will overwrite your previous try.";
        } else if (validateEmail(stepdata.username) && stepdata.username !== currentUser) {
            document.getElementById("emailSummary").innerHTML = "This is a valid email address, however, you have not entered the training email address you set up earlier. It is important to use the training address you created so that you will be able to receive security codes in later lessons. Your training email address is: <strong>" + currentUser + "</strong>";
            document.getElementById("userIcon").classList.add("fa-times");
            document.getElementById("userIcon").classList.add("fail");
            nextTryUser = "This time try to use the training email address you created";
        } else if (!validateEmail(stepdata.username) && stepdata.username === currentUser) {
            throw new Error("A consistent username has been entered but it is not a valid email address. This is should not have been accepted");
        } else {
            document.getElementById("emailSummary").innerText = "The username you have provided is not a valid email address, nor is it the training email address you created. When registering for websites it is important to use a valid email address so you can receive security alerts and codes. During this training it is also important to use the training email address you set up so that you will be able to receive security codes in later lessons. Your training email address is: " + currentUser;
            document.getElementById("userIcon").classList.add("fa-times");
            document.getElementById("userIcon").classList.add("fail");
            nextTryUser = "This time try to use the training email address you created";
        }

        if (stepdata.pwdDictionaryCount >= 3 && stepdata.pwdDictionaryUniqueCount>=3) {

            document.getElementById("passwordIcon").classList.add("fa-check");
            document.getElementById("passwordIcon").classList.add("pass");
            document.getElementById("passwordSummary").innerText = "Our automated analysis of your password has found at least three different dictionary words. Well done!";
        }else if (stepdata.pwdDictionaryCount >= 3 && stepdata.pwdDictionaryUniqueCount<3) {

            document.getElementById("passwordIcon").classList.add("fa-times");
            document.getElementById("passwordIcon").classList.add("fail");
            document.getElementById("passwordSummary").innerText = "Our automated analysis of your password has found at least three dictionary words, but some of them appear to be the same. This might be due two words appearing as one, for example, \"house\" and \"work\" being detected as \"housework\". If you are sure you used three random words you should continue to the next lesson. If not, press Try Again to try another password.";
        }
         else if (stepdata.pwdDictionaryCount < 3 && stepdata.pwdDictionaryCount >= 1) {
            document.getElementById("passwordIcon").classList.add("fa-times");
            document.getElementById("passwordIcon").classList.add("fail");
            document.getElementById("passwordSummary").innerText = "Our automated analysis founds some dictionary words in your password, but was not able to find at least three. This might be due two words appearing as one, for example, \"house\" and \"work\" being detected as \"housework\". If you are sure you used three random words you should continue to the next lesson. If not, press Try Again to try another password.";
        } else {
            document.getElementById("passwordIcon").classList.add("fa-times");
            document.getElementById("passwordIcon").classList.add("fail");
            document.getElementById("passwordSummary").innerText = "Our automated analysis could not find any dictionary words in your password. Did you generate your password using three random words? If you are sure you used three random words you should continue to the next lesson. If not, press Try Again to try another password.";
        }

        document.getElementById("nextTry").innerText = "Press Return to Training Site to move to the first sign in lesson. Alternatively, if you would like to try the registration lesson again press Try Again.";

        document.getElementById("tryAgainBtn").classList.remove("d-none");
        document.getElementById("summaryContainer").classList.add("show");
    } else {
        throw new Error("No current user found");
    }


}

/**
 * Try the registration step again
 */
function tryAgain() {
    const previousStep = pupConfig.getPreviousStep();
    if (previousStep !== null) {
        window.location = previousStep;
    }

}
/**
 * Move to the next lesson - back to Training Site in this case
 */
function moveNext() {
    var params = "";
    if (skipNext) {
        const nextStep = pupConfig.getNextMajorStep();
        if (nextStep !== null) {
            window.location = nextStep;
        }
    } else {
        const nextStep = pupConfig.getNextStep();
        if (nextStep !== null) {
            window.location = nextStep;
        }

    }

}
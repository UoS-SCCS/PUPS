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
 * Show an alert to remind the user they should already of registered since
 * this lesson shouldn't be available until registration and registration
 * cannot be repeated without a reset.
 * 
 * @returns false
 */
function registerAlert() {
    showModal("Register", "You should have already registered as part of Lesson 2. If you have not, return to the Training Hub and complete Lesson&nbsp;2&nbsp;-&nbsp;Registration.<br><br><button class=\"btn btn-info\" onclick=\"returnToTraining();return false;\">Return to Training Site</button>", "OK");
    return false;
}

/**
 * Load the forgot password screen
 */
function loadForgot() {
    window.location = "./forgotpassword.html";
}

/**
 * Render the signin page
 */
function showSignIn() {
    const currentEmailAccount = window.localStorage.getItem("sccs_current");

    const opt = document.createElement("option");
    opt.value = currentEmailAccount;
    document.getElementById("datalistOptions").appendChild(opt);
    document.getElementById("signInContainer").classList.add("show");
}

/**
 * Move to the next step in the lesson
 */
function moveNext() {
    var params = "";
    const nextStep = pupConfig.getNextMajorStep();
    if (nextStep !== null) {
        window.location = nextStep;
    }



}
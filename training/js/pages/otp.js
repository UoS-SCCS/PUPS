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
 * Verify the provided One Time Passcode stored in the this users account by
 * constructing a single value and checking it with the virtual server
 */
function verifyOTP() {
    var combined = "";
    for (var i = 1; i < 7; i++) {
        var nextElem = document.getElementById("sccs-otp-" + (i));
        combined = combined + nextElem.value;
    }
    const otpValue = parseInt(combined);
    server.checkOTP(otpValue);
}

/**
 * Catches a paste event into the first element and then
 * distributes the values across all the boxes
 * 
 * @param HTMLElement elem element to check (the first one)
 */
function checkOTPEntry(elem) {
    var idx = parseInt(elem.dataset.sccsOtpIdx);
    if (idx === 1 && elem.value.length === 6) {
        const val = Array.from(elem.value);

        for (var i = 1; i < 7; i++) {
            var nextElem = document.getElementById("sccs-otp-" + (i));
            nextElem.value = val[i - 1];
            if (i === 6) {
                nextElem.focus();
            }
        }
        document.getElementById("verifyOTPBtn").focus();

    } else if (elem.value.length === 6) {
        if (idx < 6) {
            var nextElem = document.getElementById("sccs-otp-" + (idx + 1));
            nextElem.focus();
        } else if (idx === 6) {
            document.getElementById("verifyOTPBtn").focus();
        }
    }

}
/**
 * Retry the OTP by creating a new one and resetting the form
 */
function retryOtp() {
    server.createOTP();
    for (var i = 1; i < 7; i++) {
        var nextElem = document.getElementById("sccs-otp-" + (i));
        nextElem.value = "";
        if (i === 1) {
            nextElem.focus();
        }
    }
    document.getElementById("signInOTPErrorContainer").classList.add("d-none");
    document.getElementById("signInOTPErrorContainer").classList.remove("show");
    document.getElementById("signInOTPContainer").classList.remove("d-none");
    document.getElementById("signInOTPContainer").classList.add("show");

}
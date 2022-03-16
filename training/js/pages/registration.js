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
 * Configure the custom zxcvbnts to perform some basic password analysis
 * to try and detect the number of words in the password. This is performed
 * on this page and then stored for the summary page to access so that the
 * plaintext password does not need to be stored or exchanged.
 */
const options = {
    translations: zxcvbnts['language-en'].translations,
    dictionary: {
        ...zxcvbnts['language-en'].dictionary,
    },
}
zxcvbnts.core.ZxcvbnOptions.setOptions(options);

/**
 * User warning that registration has to be completed before trying to signin
 * @returns 
 */
function signInAlert() {
    showModal("Sign In", "You can only sign in once you have completed registration as part of this lesson. If you have already completed this lesson before, return to the Training Hub and select Lesson&nbsp;3&nbsp;-&nbsp;Sign In<br><br><button class=\"btn btn-info\" onclick=\"returnToTraining();return false;\">Return to Training Site</button>", "OK");
    return false;
}

/**
 * Shows the register div and sets up password validation options
 */
function showRegister() {
    setupPasswordValidation()
    document.getElementById("registerContainer").classList.add("show");
}

/**
 * Perform the password analysis and save the data into the
 * stepdata object
 */
function analysePassword(){
    const pwdAnalysis = zxcvbnts.core.zxcvbn(document.getElementById("password").value);    
    var seq;
    var dictionaryCount = 0;
    var testset = new Set();
    for (seq of pwdAnalysis.sequence) {
        if (seq.pattern === "dictionary") {
            dictionaryCount++;
            testset.add(seq.matchedWord);
        }
    }
    
    var stepdata = new StepData()
    stepdata.pwdDictionaryCount = dictionaryCount;
    stepdata.pwdDictionaryUniqueCount = testset.size;
    stepdata.save();        
    
}
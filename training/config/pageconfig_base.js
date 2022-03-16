/**
 * Training config that will be used unless overridden. This determines the order
 * of lessons as well as settings for the training environment.
 * 
 * To override this either update this file, or embedded a config JSONObject as
 * a url parameter "?config="
 * 
 * - savePlaintextPwd:  if true the plaintext password will be saved
 *                      and available for the user to view on the summary
 *                      screen.
 * 
 * - overwrite:         if true allows account overwriting, i.e. you can 
 *                      create a new account over an existing one. This is
 *                      always set to true during a registration retry.
 * 
 * - currentStepMajor   index of the outermost steps array, in effect, which
 *                      lesson is being shown.
 * 
 * - currentStep        determines which step is being shown within a particular
 *                      lesson, mostly this is only 1.
 * 
 * - steps              Array of arrays of pages to navigate to through the
 *                      lesson. Will return to the training index when each
 *                      lesson is completed
 * - passwordRestrictions  
 *                      By default none of these options are applied
 * 
 *                      JSONObject of additional restrictions to apply to 
 *                      passwords:
 *      - atLeastOneUpperCase - if true password must have an upper case letter                 
 *      - atLeastOneLowerCase - if true password must have a lower case letter
 *      - atLeastOneNumber - contains at least one number
 *      - atLeastOneSpecial - contains at least one special character
 *      - atLeastLength - minimum length, zero for no restriction
 *                          
 */
const base_page_config = {
    "savePlaintextPwd": false,
    "overwrite": true,
    "passwordRestrictions":{
        "atLeastOneUpperCase":false,
        "atLeastOneLowerCase":false,
        "atLeastOneNumber":false,
        "atLeastOneSpecial":false,
        "atLeastLength":0
    },
    "currentStepMajor": 0,
    "currentStep": 0,
    "steps": [
        [
            "register.html",
            "registration_summary.html"
        ],
        [
            "login.html"
        ],
        [
            "login.html"
        ],
        [
            "login.html"
        ]
    ]
}


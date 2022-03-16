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
 * Contains an abstract server implementation, this should be extended
 * to provide either a local or remote server implementation. The 
 * current implementation is LocalVirtualServer but should a remote
 * variant be needed just extend Server and instantiate the variant
 * that uses HTTP instead.
 * 
 * Due to limitations in overriding async functions each method has a
 * public method and an internal method, signified by being
 * prefixed by _. Note these are intended to be semi-private methods but 
 * the private designation is not enforced, otherwise the overriding 
 * would not work. When extending the class it is the internal
 * underscored methods that should be overridden.
 */
class Server {
    constructor() {
        if (this.constructor == Server) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
    /**
     * Register the user defined in userData, which should be either an
     * HTMLFormElement or a JSON Object. If the former it will be 
     * converted to a JSON Object automatically.
     * @param HTMLFormElement or Object userData
     */
    register(userData) {
        const result = this._register(userData);
    }
    /**
     * Register the user defined in userData, which should be either an
     * HTMLFormElement or a JSON Object. If the former it will be 
     * converted to a JSON Object automatically.
     * @param HTMLFormElement or Object userData
     */
    _register(userData) {
        throw new Error("Method '_register()' must be implemented.");
    }

    /**
     * Logs a user in, if an OTP (One Time Passcode) is expected then
     * set otp to True. 
     * 
     * userData should be either an HTMLFormElement or a JSON Object. 
     * If the former it will be converted to a JSON Object automatically.
     * @param HTMLFormElement or Object userData 
     * @param boolean otp 
     */
    login(userData, otp = false) {
        const result = this._login(userData, otp);
    }
    /**
     * Logs a user in, if an OTP (One Time Passcode) is expected then
     * set otp to True. 
     * 
     * userData should be either an HTMLFormElement or a JSON Object. 
     * If the former it will be converted to a JSON Object automatically.
     * @param HTMLFormElement or Object userData 
     * @param boolean otp 
     */
    _login(userData, otp) {
        throw new Error("Method '_login()' must be implemented.");
    }


    /**
     * Checks whether the otpValue is correct by comparing it to the
     * last generated OTP in the user account. Note, only a single
     * OTP is stored per account, therefore previous OTPs will be 
     * lost if a new code is requested.
     * 
     * @param int otpValue 
     */
    checkOTP(otpValue) {
        const result = this._checkOTP(otpValue);
    }
    /**
     * Checks whether the otpValue is correct by comparing it to the
     * last generated OTP in the user account. Note, only a single
     * OTP is stored per account, therefore previous OTPs will be 
     * lost if a new code is requested.
     * 
     * @param int otpValue 
     */
    _checkOTP(otpValue) {
        throw new Error("Method '_checkOTP()' must be implemented.");
    }

    /**
     * Creates a new random OTP value and stores it in the current
     * user object that is performing the login.
     * 
     * The userData is not currently used locally, but could contain
     * the user information necessary if processing remotely.
     *  
     * @param Object userData 
     */
    createOTP(userData = null) {
        const result = this._createOTP(userData);
    }
    /**
     * Creates a new random OTP value and stores it in the current
     * user object that is performing the login.
     * 
     * The userData is not currently used locally, but could contain
     * the user information necessary if processing remotely.
     *  
     * @param Object userData 
     */
    _createOTP(userData) {
        throw new Error("Method 'createOTP()' must be implemented.");
    }

    /**
     * Requests a password reset which will generate a unique code and email
     * a link to the user. 
     * @param Object userData 
     */
    requestResetPassword(userData) {
        const result = this._requestResetPassword(userData);
    }
    /**
     * Requests a password reset which will generate a unique code and email
     * a link to the user. 
     * @param Object userData 
     */
    _requestResetPassword(userData) {
        throw new Error("Method 'requestResetPassword' must be implemented.");
    }

    /**
     * Resets the password to the new password
     * @param Object userData 
     */
    resetPassword(userData) {
        const result = this._resetPassword(userData);
    }
    /**
     * Resets the password to the new password
     * @param Object userData 
     */
    _resetPassword(userData) {
        throw new Error("Method 'resetPassword' must be implemented.");
    }

    /**
     * Deletes the specified user account
     * @param String username 
     */
    delete(username) {
        const result = this._delete(username);
    }

    /**
     * Deletes the specified user account
     * @param String username 
     */
    _delete(username) {
        throw new Error("Method 'createOTP()' must be implemented.");
    }
}

/**
 * An implemented of the abstract Server class that performs all
 * processing locally simulating a real server.
 */
class LocalVirtualServer extends Server {
    constructor() {
        super();
        this.session = null;
    }

    /**
     * Checks if the userData is an HTMLFormElement and if it is
     * converts it to a JSON Object
     * @param HTMLFormElement or Object userData 
     * @returns JSON Object containing the form data
     */
    #checkFormData(userData) {
        if (userData instanceof HTMLFormElement) {
            var inputs = userData.elements;

            // Iterate over the form controls
            for (var i = 0; i < inputs.length; i++) {
                // Disable all form controls
                inputs[i].removeAttribute("disabled");
            }

            let formData = new FormData(userData)
            var tempObject = {};
            formData.forEach((value, key) => tempObject[key] = value)
            return tempObject;
        }
        return userData;

    }

    /**
     * Deletes a user from the virtual server
     * @param string username   user to delete
     */
    _delete(username) {
        database.deleteUser(username);
    }

    /**
     * Checks the supplied data and then performs the registration
     * @param HTMLFormElement or Object userData - user data to register
     */
    async _register(userData) {


        //Convert HTML Form Data and set username to lower case
        userData = this.#checkFormData(userData)
        userData["username"] = userData["username"].toLowerCase();



        //Create a new user, set the data and then add it to the database
        let newUser = new User(userData);
        await newUser.setPassword(userData.password);
        const resp = database.addUser(newUser, pupConfig.getField("overwrite", false));

        if (resp === true) {
            //Registration has worked, not move to the next step
            const nextStep = pupConfig.getNextStep();
            if (nextStep != null) {
                //TODO refactor this into a class or general method rather than implementing at each step change
                var stepdata = new StepData();
                
                //Check if we are saving the plaintext password. If yes it will
                //also be shown on the registration summary screen.
                if (!pupConfig.getField("savePlaintextPwd", false)) {
                    delete userData["password"];
                }
                
                stepdata.assign(userData);
                stepdata.save();
                
                window.location = nextStep;
            } else {
                //This should not fire since we should have stepdata, but is left in to handle where stepdata has not
                //been set and the registration is being used standalone.
                document.getElementById("registerContainer").classList.remove("show");
                document.getElementById("registerContainer").classList.add("d-none");
                document.getElementById("registerCompleteContainer").classList.add("show");
                document.getElementById("registerCompleteContainer").classList.remove("d-none");
            }
        } else {
            //Show the registration error
            showModal("Error registering", resp.error, "OK");
        }
    }

    /**
     * Checks the supplied otpValue against the one stored in the user account and shows an
     * appropriate response.
     * @param int otpValue 
     */
    async _checkOTP(otpValue) {
        if (this.session.verifyOTP(otpValue)) {
            document.getElementById("signInOTPContainer").classList.remove("show");
            document.getElementById("signInOTPContainer").classList.add("d-none");
            document.getElementById("signInCompleteContainer").classList.add("show");
            document.getElementById("signInCompleteContainer").classList.remove("d-none");
        } else {
            document.getElementById("signInOTPContainer").classList.remove("show");
            document.getElementById("signInOTPContainer").classList.add("d-none");
            document.getElementById("signInOTPErrorContainer").classList.add("show");
            document.getElementById("signInOTPErrorContainer").classList.remove("d-none");

        }

    }
    /**
     * Perform a login with the provided userData
     * @param HTMLFormElement or Object userData    user data to use for login
     * @param boolean otp   true if a One Time Pass challenge should be issued
     */
    async _login(userData, otp = false) {
        userData = this.#checkFormData(userData)
        userData["username"] = userData["username"].toLowerCase();
        const user = database.getUser(userData.username);
        if (user === null) {
            showModal("Error signing in", "username or password incorrect", "OK");

        } else {
            const result = await user.checkPassword(userData.password);
            if (result === true && otp === true) {
                this.session = user;
                this._createOTP();

                document.getElementById("signInContainer").classList.remove("show");
                document.getElementById("signInContainer").classList.add("d-none");
                document.getElementById("signInOTPContainer").classList.add("show");
                document.getElementById("signInOTPContainer").classList.remove("d-none");

            } else if (result === true && otp === false) {
                document.getElementById("signInContainer").classList.remove("show");
                document.getElementById("signInContainer").classList.add("d-none");
                document.getElementById("signInCompleteContainer").classList.add("show");
                document.getElementById("signInCompleteContainer").classList.remove("d-none");

            }
            else {
                showModal("Error signing in", "username or password incorrect", "OK");
            }
        }
    }
    /**
     * Create a One Time Passcode, send it an email to user and store the OTP in the
     * user account
     * 
     */
    _createOTP() {
        if (this.session !== null) {
            this.session.generateOTP();
            const otpEmail = new Email();
            otpEmail.init("Training Sign In Service", this.session.username, "Sign In Security Code", otp_email_top + this.session.otp + otp_email_bottom, true);
            virtualEmailServer.receiveEmail(otpEmail);
        }
    }

    /**
     * Requests a reset of the specified user account.
     * 
     * This will send a reset email to the user having generated a one-time link
     * to perform the reset with.
     * 
     * @param HTMLFormElement or Object userData - user data related to the reset request
     */
    _requestResetPassword(userData) {
        userData = this.#checkFormData(userData)
        userData["username"] = userData["username"].toLowerCase();
        const user = database.getUser(userData.username);
        if (user !== null) {
            user.generateResetCode();
            const otpEmail = new Email();
            var url = "../../reset.html?email=" + user.username + "&uid=" + user.pwdResetCode;
            var buttons = "<a class=\"btn btn-primary mb-2 \" target=\"SCCSPasswordTraining\" href=\"" + url + "\">Reset Password</a><br>";
            buttons = buttons + "<a class=\"fs-6\"  target=\"SCCSPasswordTraining\" href=\"" + url + "\">" + url + "</a>";
            otpEmail.init("Training Sign In Service", user.username, "Password Reset Request", reset_email_top + buttons + reset_email_bottom, true);
            virtualEmailServer.receiveEmail(otpEmail);
            document.getElementById("resetContainer").classList.remove("show");
            document.getElementById("resetContainer").classList.add("d-none");
            document.getElementById("resetCompleteContainer").classList.add("show");
            document.getElementById("resetCompleteContainer").classList.remove("d-none");

        } else {
            showModal("Reset Error", "Email address not found. Please check you have entered a valid and registered email address.", "OK");
        }

    }

    /**
     * Sets a new password for the account having checked the one-time code
     * was valid.
     * 
     * @param HTMLFormElement or object userData  - user data containing new password
     */
    async _resetPassword(userData) {
        userData = this.#checkFormData(userData)
        userData["username"] = userData["username"].toLowerCase();
        const user = database.getUser(userData.username);

        if (user !== null) {
            if (user.checkPwdResetCode(userData["uid"])) {
                await user.setPassword(userData["password"]);
                database.updateUser(user);
                document.getElementById("resetContainer").classList.remove("show");
                document.getElementById("resetContainer").classList.add("d-none");
                document.getElementById("resetCompleteContainer").classList.add("show");
                document.getElementById("resetCompleteContainer").classList.remove("d-none");
            } else {
                showModal("Reset Error", "Invalid or out of date reset code.", "OK");
            }



        } else {
            showModal("Reset Error", "User not found", "OK");
        }

    }
}

/**
 * Base config class that loads the baseConfig followed by the custom
 * config over the top. As such, only fields that differ from the
 * base need to specified in the custom config
 */
class Config {
    /**
     * Creates a new Config class
     * @param {object} config custom config to override base config
     */
    constructor(config = {}) {
        Object.assign(this, baseConfig);
        Object.assign(this, config);   
    }
    /**
    * Load page config from localStorage or query parameter, with query parameter
    * taking precedence.
    */
    refresh() {
        var jsonConfig = null;
        const pageConfigLocal = window.localStorage.getItem("__sccs_config");
        if (pageConfigLocal !== null) {
            jsonConfig = JSON.parse(pageConfigLocal);
        }
        const urlParams = new URLSearchParams(window.location.search);
        const config = urlParams.get("config");
        if (config !== null) {
            jsonConfig = JSON.parse(decodeURIComponent(config));
        }
        if (jsonConfig !== null) {
            Object.assign(this, jsonConfig);
        }else{
            this.#store();
        }
        
    }
    #store() {
        window.localStorage.setItem("__sccs_config", JSON.stringify(this));
    }
    setField(field, value) {
        this[field] = value;
        this.#store();
    }
    /**
     * Gets the value from the config if it exists or returns the
     * value specified in def
     * 
     * @param {string} field name
     * @param {*} def default value to return if not present
     * @returns field value or def of not found
     */
    getField(field, def) {
        if (field in this) {
            return this[field];
        }
        return def;
    }
    /**
     * Determines what the next major step is, i.e. a lesson change. In the current
     * configuration at the end of each lesson there is a major step. However, the
     * registration lesson was originally a two step, hence why we have implemented
     * a step handler that can move between sub-lessons as well.
     * @returns string or null
     */
    getNextMajorStep() {
        const majorSteps = this.getField("steps", null);
        const currentStep = this.getField("currentStep", null);
        const currentStepMajor = this.getField("currentStepMajor", null);
        if (majorSteps != null && currentStep !== null && currentStepMajor !== null && steps !== null) {
            var steps = majorSteps[currentStepMajor];
            if (majorSteps.length > currentStepMajor + 1) {
                this.setField("currentStepMajor",this.getField("currentStepMajor", 0)+1);
                this.setField("currentStep",0);
                //TODO check this, these two are identical
            } else {
                this.setField("currentStepMajor",this.getField("currentStepMajor", 0)+1);
                this.setField("currentStep",0);
                return "./index.html";
                //return null;
            }
            
            return "./index.html" ;
        }
        return null;
    }
    /**
     * Gets the next step by determining whether there is a minor step to make within
     * a single lesson or if it needs to make a major step to the next lesson
     * @returns string url of the next step or null
     */
    getNextStep() {
        const majorSteps = this.getField("steps", null);
        const currentStep = this.getField("currentStep", null);
        const currentStepMajor = this.getField("currentStepMajor", null);
        if (majorSteps != null && currentStep !== null && currentStepMajor !== null && steps !== null) {
            var steps = majorSteps[currentStepMajor];
            if (steps.length > currentStep + 1) {
                this.setField("currentStep",this.getField("currentStep", 0)+1);
                
            } else if (majorSteps.length > currentStepMajor + 1) {
                return pupConfig.getNextMajorStep();
            } else {
                return null;
            }
            return steps[this["currentStep"]];
        }
        return null;
    }

    /**
     * Gets the previous step whether that be a minor or major step
     * @returns string containing url for previous step or null
     */
    getPreviousStep() {
        const majorSteps = this.getField("steps", null);
        const currentStep = this.getField("currentStep", null);
        const currentStepMajor = this.getField("currentStepMajor", null);
        if (majorSteps != null && currentStep !== null && currentStepMajor !== null && steps !== null) {
            var steps = majorSteps[currentStepMajor];
            if (currentStep - 1 >= 0) {
                this.setField("currentStep",this.getField("currentStep", 0)-1);
            } else if (currentStepMajor - 1 >= 0) {
                this.setField("currentStepMajor",this.getField("currentStepMajor", 0)-1);
                steps = majorSteps[currentStepMajor - 1];
                this.setField("currentStep",steps.length - 1);
            } else {
                return null;
            }
            return steps[this["currentStep"]];
        }
        return null;
    }

}
/**
 * StepData to keep track of current steps and moves between steps
 */
class StepData {

    constructor() {
        this.reload();
    }
    /**
     * Load the stepdata from localStorage
     */
    reload(){
        var stepdata = window.localStorage.getItem("stepdata");
        if (stepdata !== null) {
            stepdata = JSON.parse(stepdata);
            this.clear();
            Object.assign(this, stepdata);   
        }
    }
    /**
     * Clear the stepdata
     */
    clear(){
        Object.keys(this).forEach(key => delete this[key]);
    }
    /**
     * Assign the data to this object
     * @param Object obj 
     */
    assign(obj){
        Object.assign(this,obj);
    }

    /**
     * Save updated stepdata to localStorage
     */
    save(){
        window.localStorage.setItem("stepdata",JSON.stringify(this));
    }
}
/**
 * ============================================================================
 * 
 * Generic system wide functions
 * 
 * TODO Most of these could be refactored into a PageConfig class that extends
 * config. 
 * 
 * ============================================================================
 * 
 */

/**
 * Shows a modal dialog
 * @param {string} title title of the dialog
 * @param {string} body HTML content to show in the body of modal dialog
 * @param {string} type type of dialog to show, currently only OK is implemented
 */
function showModal(title, body, type) {
    document.getElementById("modalHeading").innerText = title;
    document.getElementById("modalBody").innerHTML = body;
    if (type === "OK") {
        document.getElementById("modalCloseButton").innerText = "Ok";
        document.getElementById("modalCloseButton").classList.remove("btn-danger");
        document.getElementById("modalCloseButton").classList.add("btn-info");
    }
    //document.getElementById("messageModal").modal("show");
    const myModal = new bootstrap.Modal(document.getElementById('messageModal'));
    myModal.show();
}

/**
 * Generic function to show the password text of a password control
 * 
 * TODO Refactor to be generic and move to general UI script outside
 * of the server
 */
function showPasswordTxt(){
    if(document.getElementById("password").type==="text"){
        document.getElementById("password").type="password";
        document.getElementById("show-button").classList.add("fa-eye");
        document.getElementById("show-button").classList.remove("fa-eye-slash");
        const pwdCtrl = document.getElementById("password");
        pwdCtrl.selectionStart = pwdCtrl.selectionEnd = pwdCtrl.value.length;
        pwdCtrl.focus();
    }else{
        document.getElementById("password").type="text";
        const pwdCtrl = document.getElementById("password");
        pwdCtrl.selectionStart = pwdCtrl.selectionEnd = pwdCtrl.value.length;
        pwdCtrl.focus();
        document.getElementById("show-button").classList.add("fa-eye-slash");
        document.getElementById("show-button").classList.remove("fa-eye");
    }
}
/**
 * ============================================================================
 * Initialise system wide objects
 * ============================================================================
 */
pupConfig = new Config(base_page_config);
pupConfig.refresh();
server = new LocalVirtualServer();


/**
 * Constants used to format the OTP email message
 */
const otp_email_top = "<div class=\"container\"><div class=\"row justify-content-center\"><div class=\"col-md-6\"><div class=\"card-group mb-0\"><div class=\"card p-4\"><div class=\"card-body text-center\"><h1>Sign In Security Code</h1><p>&nbsp;</p><p>We have a received a sign in request for your account. Enter the security code below on the sign in page. Do not share you security code with anyone else.</p><p class=\"display-2\">"
const otp_email_bottom = "</p></div></div></div></div></div></div>";

/**
 * Constants used to format the password reset email message
 */
const reset_email_top = "<div class=\"container\"><div class=\"row justify-content-center\"><div class=\"col-md-6\"><div class=\"card-group mb-0\"><div class=\"card p-4\"><div class=\"card-body text-center\"><h1>Password Reset Request</h1><p>&nbsp;</p><p>We have a received a password reset request for your account. If you did not request this please ignore this email.</p><p>If you did request a password reset please click the button below or copy the link:</p><p>";
const reset_email_bottom = "</p></div></div></div></div></div></div>";

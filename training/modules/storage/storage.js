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
 * Abstract Database class to represent data storage. The exact method of data
 * storage is left up to the implementer, since it could vary depending on
 * whether the server is a local simulated server or real remote server.
 * 
 * Implementations should extend this class and handle any necessary HTTP
 * communications where the database resides remotely.
 * 
 */
class Database {

    constructor() {
        if (this.constructor == Database) {
            throw new Error("Abstract classes can't be instantiated.");
        }

    }

    /**
     * Initialise the database ready for it to be searched or amended
     */
    init() {
        throw new Error("Method 'init()' must be implemented.");
    }

    /**
     * Store the database to the underlying storage medium
     */
    _store() {
        throw new Error("Method 'store()' must be implemented.");
    }

    /**
     * Reload the database - particularly important for local implementations
     * where the underlying storage might change outside of the this class
     */
    reload() {
        throw new Error("Method 'reload()' must be implemented.");
    }

    /**
     * Add a user to the database
     * @param {object} user to add
     * @param {boolean} overwrite True to overwrite the existing user, False 
     *      otherwise. Defaults to False.
     * @returns boolean True if successful, otherwise error object
     */
    addUser(user, overwrite = false) {
        throw new Error("Method 'addUser()' must be implemented.");
    }

    /**
     * Searches the database for the user and returns the user object if found
     * or null if no user is found.
     * @param {string} user to retrieve
     * @returns user object or null
     */
    getUser(user) {
        throw new Error("Method 'getUser()' must be implemented.");
    }

    /**
     * Updates a user object in the database
     * @param {obj} user object to update
     * @returns True if succeeds, false otherwise
     */
    updateUser(userobj) {
        throw new Error("Method 'getUser()' must be implemented.");
    }

    /**
     * Deletes a user from the database
     * @param {string} username to delete
     */
    deleteUser(username) {
        throw new Error("Method 'deleteUser()' must be implemented.");
    }
}


/**
 * Concrete implementation of abstract Database class that uses the
 * LocalStorage object in the browser as a storage medium
 */
class LocalStorageDB extends Database {

    /**
     * Name of the database in localStorage
     */
    static DB_NAME = "sccs_db";
    //Cached user store 
    _users = {};
    constructor() {
        super();
    }

    /**
     * Initialise the storage class, if the DB_NAME exists load the contents
     * into this object
     */
    init() {

        if (localStorage.getItem(LocalStorageDB.DB_NAME) != null) {
            Object.assign(this, JSON.parse(localStorage.getItem(LocalStorageDB.DB_NAME)));
        }
    }
    /**
     * Removes unwanted keys from the JSON output to avoid saving
     * internal structures. Will remove DB_NAME and the internal
     * _users object
     * 
     * @param {*} key 
     * @param {*} value 
     * @returns 
     */
    #jsonReplacer(key, value) {
        if (key == "DB_NAME" || key == " _users") return undefined;
        else return value;
    }

    /**
     * Stores the internal storage to the browser localStorage
     */
    _store() {
        localStorage.setItem(LocalStorageDB.DB_NAME, JSON.stringify(this, this.#jsonReplacer));
    }

    /**
     * Reload the internal store from localStorage. This should be called prior to
     * reading contents if there is a chance another tab has altered the underlying
     * data. Note, we currently do not monitor localStorage for these change events, if
     * we did we could call this only after a change in another tab is detected.
     * 
     * TODO implement storage monitoring to reduce unnecessary reloads.
     */
    reload() {
        Object.assign(this, JSON.parse(localStorage.getItem(LocalStorageDB.DB_NAME)));
    }

    /**
     * Adds the user to the internal storage and saves it out. Set overwrite to True
     * to overwrite an existing user. Default behaviour is False, causing a JSON error
     * to be returned with User already exists. Overwrite to True should be used when 
     * a user retries initial password generation.
     * 
     * @param User user 
     * @param boolean overwrite 
     * @returns True if written, JSON object with error otherwise
     */
    addUser(user, overwrite = false) {
        if (!overwrite && user.username in this._users) {
            return { "error": "User already exists" };
        }
        this._users[user.username] = user;
        this._store();
        return true;
    }

    /**
     * Updates an existing User in the database with the supplied
     * User object. This overwrites the existing user entry with the
     * supplied object. If the user does not exist it will return a 
     * JSON error object with User not found, otherwise it returns True.
     * @param User userobj 
     * @returns True if updated, JSON object with error otherwise
     */
    updateUser(userobj) {
        if (!userobj.username in this._users) {
            return { "error": "User not found" };
        }
        this._users[userobj.username] = userobj;
        this._store();
        return true;
    }

    /**
     * Gets the specified user if it exists, otherwise returns null
     * @param string username Username to retrieve
     * @returns User object containing user data or null
     */

    getUser(username) {
        this.reload();
        if (username in this._users) {
            return new User(this._users[username]);
        }
        return null;
    }

    /**
     * Deletes teh specified user if it exists
     * @param string username username to delete
     */
    deleteUser(username) {
        if (username in this._users) {
            delete this._users[username];
            this._store();
        }
    }
}


/**
 * User object that represents a user both in terms of
 * storage and in common functions like generating a OTP
 */
class User {
    /**
     * Constructs a new user object using the supplied data
     * 
     * If this is a new user the caller must explicitly call setPassword after
     * constructing the user object. Otherwise the password will be stored as a 
     * plaintext value. This cannot be performed in the constructor because the
     * encoding requires async functions which cannot be waited for in a
     * constructor and calling it could create a race condition.
     * 
     * @param {object} userData user data to load, defaults to empty
     * 
     */
    constructor(userData = {}, isNew = false) {
        this.username = null;
        this.password = null;
        this.otp = null;
        this.salt = null;
        Object.assign(this, userData);
        
    }
    /**
     * Sets the username field
     * @param {string} username to set
     */
    setUsername(username) {
        this.username = username;
    }

    /**
     * Generates a random salt and runs a PBKDF to calculate the secure
     * password storage value. 
     * 
     * @param {string} password plaintext password
     */
    async setPassword(password) {
        this.salt = Utils.uintToBase64(window.crypto.getRandomValues(new Uint8Array(16)));

        await this.#encodePassword(password).then(function (encPwd) {

            this.password = Utils.uintToBase64(encPwd);
            if (pupConfig.getField("savePlaintextPwd",false)) {
                this.plainPassword = password;
            }
        }.bind(this))

    }

    /**
     * This converts the string password to a key that can be
     * submitted to the PBKDF
     * @param {string} password to convert
     * @returns SubtleCrypto Key
     */
    #convertPwdToKey(password) {
        const enc = new TextEncoder();
        return window.crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );
    }

    /**
     * Encodes the plaintext password using a PBKDF
     * 
     * The PBKDF is PBKDF2 with SHA256 and 100,000 iterations
     * @param {string} password to encode
     * @returns Uint8Array containing the derived key
     */
    async #encodePassword(password) {
        const keyMaterial = await this.#convertPwdToKey(password);
        const derivedBits = await window.crypto.subtle.deriveBits(
            {
                "name": "PBKDF2",
                salt: Utils.base64ToUint(this.salt),
                "iterations": 100000,
                "hash": "SHA-256"
            },
            keyMaterial,
            256
        );

        const buffer = new Uint8Array(derivedBits);

        return buffer;
    }

    /**
     * Generates a random 6 digit one time passcode. The passcode
     * will always be exactly 6 digits, since it is generated between
     * 100,000 and 999,999. This is to ensure the UI can enforce the
     * entry of 6 digit codes.
     * 
     * Note: We use Math.random() for this since this is only a simulation. As
     * such we do not need to use a cryptographically strong random number
     * generator. (The OTP is stored in localStorage in the clear so it has
     * no inherent security value). Obviously if generating a real OTP
     * one must use a cryptographically strong random number generator.
     * 
     * @returns int value between 100,000 and 999,999
     */
    generateOTP() {
        this.otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        database.updateUser(this);
        return this.otp;
    }

    /**
     * Generates a one time reset code using a random UUIDv4 and saves it
     * in the user account
     */
    generateResetCode() {
        this.pwdResetCode = Utils.uuidv4();
        database.updateUser(this);
    }

    /**
     * 
     * @param string resetCode  
     * @returns 
     */
    checkPwdResetCode(resetCode){
        return (this.pwdResetCode === resetCode);
    }
    /**
     * Verifies the OTP value is the same as in the user object
     * @param {int} otpValue 
     * @returns True if the same, False otherwise
     */
    verifyOTP(otpValue) {
        if (this.otp === otpValue) {
            return true;
        }
        return false;
    }

    /**
     * Encodes the supplied password using the same PBKDF and salt and compares
     * the generated value with the stored value to see if the passwords are
     * the same.
     * 
     * @param {string} passwordToCheck 
     * @returns True if the same, False if not
     */
    async checkPassword(passwordToCheck) {
        var check = false;
        await this.#encodePassword(passwordToCheck).then(function (encPwd) {

            const pwdToCheck = Utils.uintToBase64(encPwd);
            if (pwdToCheck === this.password) {
                check = true;
            } else {
                check = false;
            }
        }.bind(this))
        return check;
    }
}

/**
 * Utils class to provide encoding function to and from base64
 */
class Utils {
    /**
     * Converts a byte array to base64 string
     * @param {Uint8Array} uintArray array to convert
     * @returns base64 encoded string
     */
    static uintToBase64(uintArray) {
        return btoa(String.fromCharCode.apply(null, uintArray));
    }

    /**
     * Decodes a base64 encoded string to a Uint8Array of bytes
     * @param {string} base64String string to convert to bytes
     * @returns Uint8Array of the contents
     */
    static base64ToUint(base64String) {
        return new Uint8Array(atob(base64String).split('').map(function (c) { return c.charCodeAt(0); }));
    }


    static uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
}

/**
 * ============================================================================
 * Object initialisation
 * ============================================================================
 */
var database = new LocalStorageDB();
database.init();


/**
 * ============================================================================
 * Test functions, move to separate test class
 * ============================================================================
 */
function test() {
    new_user = new User();
    new_user.setUsername("joe@example.com");
    new_user.setPassword("password");
    database.addUser(new_user);
}
function testget() {
    console.log(database.getUser("joe@example.com"));
}




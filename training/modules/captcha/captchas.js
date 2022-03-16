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
 * Define the CAPTCHA images. This consists of a JSON array containing JSON 
 * object. Each JSON object represents a type of CAPTCHA, i.e. hydrants or 
 * buses. Within each CAPTCHA there should be an id, text, an array of 
 * invalid images and an array of valid images. The text will be shown on
 * the popup CAPTCHA screen. There should be a minimum of 4 images for
 * the valid array and 7 for the invalid array.
 * 
 */
const captchas = [
    {
        "id": "hydrants",
        "text": "hydrants",
        "invalid": [
            "./imgs/captcha/hydrants/blank1.jpg",
            "./imgs/captcha/hydrants/blank2.jpg",
            "./imgs/captcha/hydrants/blank3.jpg",
            "./imgs/captcha/hydrants/blank4.jpg",
            "./imgs/captcha/hydrants/blank5.jpg",
            "./imgs/captcha/hydrants/blank6.jpg",
            "./imgs/captcha/hydrants/blank7.jpg",
            "./imgs/captcha/hydrants/blank8.jpg"
        ],
        "valid": [
            "./imgs/captcha/hydrants/valid1.jpg",
            "./imgs/captcha/hydrants/valid2.jpg",
            "./imgs/captcha/hydrants/valid3.jpg",
            "./imgs/captcha/hydrants/valid4.jpg"
        ]
    },
    {
        "id": "taxis",
        "text": "taxis",
        "invalid": [
            "./imgs/captcha/roads/blank1.jpg",
            "./imgs/captcha/roads/blank2.jpg",
            "./imgs/captcha/roads/blank3.jpg",
            "./imgs/captcha/roads/blank4.jpg",
            "./imgs/captcha/roads/blank5.jpg",
            "./imgs/captcha/roads/blank6.jpg",
            "./imgs/captcha/roads/blank7.jpg",
            "./imgs/captcha/roads/blank8.jpg",
            "./imgs/captcha/roads/blank9.jpg",
            "./imgs/captcha/roads/blank10.jpg",
            "./imgs/captcha/roads/blank11.jpg",
            "./imgs/captcha/roads/blank12.jpg",
            "./imgs/captcha/roads/blank13.jpg",
            "./imgs/captcha/roads/blank14.jpg"

        ],
        "valid": [
            "./imgs/captcha/taxis/valid1.jpg",
            "./imgs/captcha/taxis/valid2.jpg",
            "./imgs/captcha/taxis/valid3.jpg",
            "./imgs/captcha/taxis/valid4.jpg",
            "./imgs/captcha/taxis/valid5.jpg"
        ]
    },
    {
        "id": "buses",
        "text": "buses",
        "invalid": [
            "./imgs/captcha/roads/blank1.jpg",
            "./imgs/captcha/roads/blank2.jpg",
            "./imgs/captcha/roads/blank3.jpg",
            "./imgs/captcha/roads/blank4.jpg",
            "./imgs/captcha/roads/blank5.jpg",
            "./imgs/captcha/roads/blank6.jpg",
            "./imgs/captcha/roads/blank7.jpg",
            "./imgs/captcha/roads/blank8.jpg",
            "./imgs/captcha/roads/blank9.jpg",
            "./imgs/captcha/roads/blank10.jpg",
            "./imgs/captcha/roads/blank11.jpg",
            "./imgs/captcha/roads/blank12.jpg",
            "./imgs/captcha/roads/blank13.jpg",
            "./imgs/captcha/roads/blank14.jpg"

        ],
        "valid": [
            "./imgs/captcha/buses/valid1.jpg",
            "./imgs/captcha/buses/valid2.jpg",
            "./imgs/captcha/buses/valid3.jpg",
            "./imgs/captcha/buses/valid4.jpg",
            "./imgs/captcha/buses/valid5.jpg",
            "./imgs/captcha/buses/valid6.jpg",
            "./imgs/captcha/buses/valid7.jpg",
            "./imgs/captcha/buses/valid8.jpg"
        ]
    }

];

/**
 * CAPTCHA class that creates, renders and verifies local CAPTCHAs.
 * 
 * This is designed to simulate a real-world CAPTCHA, however, it
 * should not be used for actual CAPTCHAs since it is run entirely
 * in the client and therefore is not secure.
 */
class CAPTCHA {
    constructor(id = null) {
        this.captcha = null;
        this.#init(id);
    }

    /**
     * Re-initialises the CAPTCHA, for example, after the user gets it wrong.
     * 
     * This will result in a new random CAPTCHA being created.
     */
    refresh() {
        //reset captcha
        this.captcha = null;
        this.#init();

        //Remove any current selections
        for (var i = 0; i < 9; i++) {
            const elem = document.getElementById("captcha-img-" + i.toString()).parentNode;
            elem.classList.remove("selected-cell");
        }
        this.render();

    }
    /**
     * Loads a CAPTCHA from the captchas config. if an id is provided it
     * must match one of the ids in the config. If no id is provided one
     * will be selected at random.
     * 
     * @param string id CAPTCHA to load
     */
    #init(id = null) {
        //If captcha id try to find it
        if (id !== null) {
            for (var i = 0; i < captchas.length; i++) {
                if (captchas[i].id === id) {
                    this.captcha = captchas[i];
                }
            }

        }
        //if no id is provided or it is not found randomly select one
        if (this.captcha === null) {
            this.captcha = captchas[Math.floor((Math.random() * captchas.length))];
        }

        //load the valid images and shuffle them
        this.validImgList = [];
        this.invalidImgList = [];
        for (var i = 0; i < this.captcha.valid.length; i++) {
            this.validImgList[i] = this.captcha.valid[i];
        }
        this.#shuffleArray(this.validImgList);

        //load the invalid images and shuffle them
        for (var i = 0; i < this.captcha.invalid.length; i++) {
            this.invalidImgList[i] = this.captcha.invalid[i];
        }
        this.#shuffleArray(this.invalidImgList);
    }

    /**
     * Checks whether the selection of images made by the user is correct.
     * 
     * This does not require absolutely correctness, much like ReCAPTCHA 
     * allows a certain amount of error. The algorithm is as follows:
     * 
     * Calculate:
     *      truePositive = image selected and is a valid image
     *      falseNegative = image is unselected and is valid image
     *      falsePositive = image is selected and is an invalid image
     *      trueNegative = image is unselected and is an invalid image
     * 
     * To pass the test two ratios must be satisfied:
     * 
     * (truePositive + trueNegative) / 9 > 0.8 : the user must get 80%
     * of the images correct, i.e. select the ones they are supposed to
     * select and not select the ones they are not supposed to select.
     * In a 9x9 grid this equates to getting 8 out of 9.
     * 
     * truePositive / validCount > 0.666 : the user must select two 
     * thirds of the correct images. 
     * 
     * TODO when using a fixed 9x9 grid this could be simplified
     * 
     * @returns boolean True if valid, False if not
     */
    verify() {
        var truePositive = 0;
        var falsePositive = 0;
        var trueNegative = 0;
        var falseNegative = 0;
        for (var i = 0; i < 9; i++) {
            const elem = document.getElementById("captcha-img-" + i.toString()).parentNode;

            if (this.validCheck[i] && elem.classList.contains("selected-cell")) {
                truePositive++;
            } else if (this.validCheck[i] && !elem.classList.contains("selected-cell")) {
                falseNegative++;
            } else if (!this.validCheck[i] && elem.classList.contains("selected-cell")) {
                falsePositive++;
            } else if (!this.validCheck[i] && !elem.classList.contains("selected-cell")) {
                trueNegative++;
            }

        }
        if ((truePositive + trueNegative) / 9 > 0.8 && (truePositive / this.validCount) > 0.666) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Randomly shuffles the provided array. Note this does not
     * use a cryptographically secure random number generator
     * so it should not be used for security related operations.
     */
    #shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    /**
     * Renders the CAPTCHA by randomly selecting the number of valid images
     * to display and randomly distributing them in the grid. It also
     * prepares a validCheck array to use when verifying the user selected
     * images.
     * 
     */
    render() {
        //Select how many valid images (between 2 and 4) to show
        this.validCount = Math.max(Math.floor((Math.random() * Math.min(this.captcha.valid.length, 4)) + 1), 2); //between 2 and 4
        this.invalidCount = 9 - this.validCount;

        //Create an array containing validCount True values and invalidCount False values
        this.validCheck = []
        var imgList = [];
        for (var i = 0; i < this.validCount; i++) {
            this.validCheck[this.validCheck.length] = true;
        }
        for (var i = 0; i < this.invalidCount; i++) {
            this.validCheck[this.validCheck.length] = false;
        }
        //Shuffled the validCheck array to distribute the valid images throughout the grid
        this.#shuffleArray(this.validCheck);
        
        //Build a list of img sources from the validCheck array
        var validIdx = 0;
        var invalidIdx = 0;
        for (var i = 0; i < 9; i++) {
            if (this.validCheck[i]) {
                imgList[i] = this.validImgList[validIdx];
                validIdx++;
            } else {
                imgList[i] = this.invalidImgList[invalidIdx];
                invalidIdx++;
            }

        }

        //Set the actual src elements
        for (var i = 0; i < 9; i++) {
            const elem = document.getElementById("captcha-img-" + i.toString());
            elem.src = imgList[i];
        }

        //Show the user what the target of the CAPTCHA is, i.e. Hydrants, cars, buses.
        document.getElementById("captchaGoal").innerText = this.captcha.text;
    }
}
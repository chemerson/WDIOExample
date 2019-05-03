let ModalPage = require('./modalPage');

class SignUpPage extends ModalPage {

    constructor() {
        super();
        this.signupText = 'Join NYT Cooking';
    }

    /**
     * page elements
    */
    get email() { return browser.element('input[type=email][name=email_address]'); }
    get password() { return browser.element('input[type=password][name=password1]'); }
    get confirmPassword() { return browser.element('input[type=password][name=password2]'); }
    get createAccountButton() { return browser.element('div.nytc---regimodal---buttonContainer span[role=button]'); }

    /**
     * page methods
    */
    /**
     * Method to validate if sign up page is loaded
     * @param none
     * @return boolean
    */
    isLoaded() {
        return this.createAccountButton.isExisting();
    }

    /**
     * Method to input email address
     * @param string - emailAddress
     * @return none
    */
    enterEmailAddress(emailAddress) {
        this.email.setValue(emailAddress);
    }

    /**
     * Method to input password
     * @param string - password
     * @return none
    */
    enterPassword(passwordValue) {
        this.password.setValue(passwordValue);
    }

    /**
     * Method to input confirm password
     * @param string - password
     * @return none
    */
    enterConfirmPassword(passwordValue) {
        this.confirmPassword.setValue(passwordValue);
    }

    /**
     * Method to create account
     * @param none
     * @return none
    */
    createAccount() {
        if (this.createAccountButton.waitForExist())
            this.createAccountButton.click();
    }
}

module.exports = new SignUpPage();

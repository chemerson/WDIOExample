// Base class for Login and Sign-up pages
class ModalPage extends Page {

    constructor() {
        super();
        this.modalText = 'Unlock New York Times recipes and your personal recipe box with a free trial.';
    }

    /**
     * page elements
    */
    get largeModalTitle() { return browser.element('.nytc---regimodal---imageBlurb'); }
    get sideModalTitle() { return browser.element('.nytc---regimodal---modalTitle'); }
    get socialLogoFacebook()  { return browser.element('.nytc---buttonstyles---fb'); }
    get socialLogoGoogle() { return browser.element('.nytc---buttonstyles---google'); }
    get close() { return browser.element('div.nytc---largepicturemodal---contentBody span[aria-label=close]'); }

    /**
     * page methods
    */
    /**
     * Method to get large pop-up modal title
     * @param none
     * @return string - modal title
    */
    getLargeModalTitle() {
        return this.largeModalTitle.getText();
    }

    /**
     * Method to get side modal title
     * @param none
     * @return string - modal title
    */
    getSideModalTitle() {
        return this.sideModalTitle.getText();
    }

    /**
     * Method to validate if pop-up modal is loaded
     * @param none
     * @return boolean
    */
    isLoaded() {
        return this.getLargeModalTitle().includes(this.modalText);
    }

    /**
     * Method to close the modal
     * @param none
     * @return none
    */
    closeModal() {
        this.close.click();
    }
}

module.exports = ModalPage;

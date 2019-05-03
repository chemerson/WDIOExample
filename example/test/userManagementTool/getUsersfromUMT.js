describe('Integration of UMT with test automation to get users from the tool', function() {
    it('Fetch and book a digital user', function() {
    	let response = browser.getDigitalUser({book_user: true}); // passed as data for API POST
    	console.log(response.data);
    });

    it('Fetch a digital user without booking', function() {
    	let response = browser.getDigitalUser(); // by default empty options are sent
    	console.log(response.data);
    });
});

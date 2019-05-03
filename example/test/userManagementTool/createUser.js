describe('Integration of UMT with test automation to create new users using the tool', function() {
    it('Create a digital user', function() {
    	const options = {
            'users_count': 1,
            'offer_chains': [20000118020]
        };
        //offer_chains is a required parameter to create a new user
        //if users_count is not provided 256 users will be generated.
    	let response = browser.createDigitalUser(options);
    	console.log(response.data);
    });
});

describe('Running specific tests using mocha\'s grep option', function() {
    it('smoke-feature summary tc1', function() {
        browser.url('');
    });
    it('regression-feature summary tc2', function() {
        browser.url('');
        let answer = 'Yes';
        expect(answer).to.equal('Yes');
    });
});

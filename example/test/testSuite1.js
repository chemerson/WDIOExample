describe('Suite 1', function() {
    it('Suite 1 tc 1', function() {
        browser.url('');
    });
    it('Suite 1 tc 2', function() {
        browser.url('');
        let answer = 'Yes';
        expect(answer).to.equal('Yes');
    });
    it('Suite 1 tc 3', function() {
        browser.url('');
        assert.ok(1, 'Verify ok');
    });
});

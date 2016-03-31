'use strict';

var MarkdownMarkerHelper = require('../../../src/js/extensions/mark/markdownMarkerHelper');

var CodeMirror = window.CodeMirror;

describe('MarkdownMarkerHelper', function() {
    var cm, mmh;

    beforeEach(function() {
        var cmTextarea = $('<textarea />');

        cmTextarea.appendTo('body');

        cm = CodeMirror.fromTextArea(cmTextarea[0], {
            lineWrapping: true,
            theme: 'default'
        });

        mmh = new MarkdownMarkerHelper(cm);

        cm.setValue('# TEXT1\n## TEXT2');
    });

    afterEach(function() {
        $('body').empty();
        cm = null;
    });

    it('get current text content', function() {
        expect(mmh.getTextContent()).toEqual('# TEXT1## TEXT2');
    });

    it('update marker with additional info', function() {
        var marker = mmh.updateMarkerWithExtraInfo({
            start: 2,
            end: 8
        });

        expect(marker.start).toEqual(2);
        expect(marker.end).toEqual(8);
        expect(marker.top).toBeDefined();
        expect(marker.left).toBeDefined();
        expect(marker.text).toEqual('TEXT1 #');
    });

    it('update collapsed marker with additional info', function() {
        var marker = mmh.updateMarkerWithExtraInfo({
            start: 2,
            end: 2
        });

        expect(marker.start).toEqual(2);
        expect(marker.end).toEqual(2);
        expect(marker.top).toBeDefined();
        expect(marker.left).toBeDefined();
        expect(marker.text).toEqual('');
    });

    it('get marker info of current selection', function() {
        var marker;

        cm.setSelection({
            line: 0,
            ch: 2
        }, {
            line: 1,
            ch: 1
        });

        marker = mmh.getMarkerInfoOfCurrentSelection();

        expect(marker.start).toEqual(2);
        expect(marker.end).toEqual(8);
        expect(marker.top).toBeDefined();
        expect(marker.left).toBeDefined();
        expect(marker.text).toEqual('TEXT1 #');
    });

    it('if current selection range have empty line then ignore emplty line', function() {
        var marker;

        cm.setValue('# TEXT1\n\n## TEXT2');

        cm.setSelection({
            line: 0,
            ch: 2
        }, {
            line: 1,
            ch: 0
        });

        marker = mmh.getMarkerInfoOfCurrentSelection();

        expect(marker.start).toEqual(2);
        expect(marker.end).toEqual(7);
        expect(marker.top).toBeDefined();
        expect(marker.left).toBeDefined();
        expect(marker.text).toEqual('TEXT1');
    });

    it('if current selection is backward then make it forward', function() {
        var marker;

        cm.setValue('# TEXT1\n\n## TEXT2');

        cm.setSelection({
            line: 1,
            ch: 0
        }, {
            line: 0,
            ch: 2
        });

        marker = mmh.getMarkerInfoOfCurrentSelection();

        expect(marker.start).toEqual(2);
        expect(marker.end).toEqual(7);
        expect(marker.top).toBeDefined();
        expect(marker.left).toBeDefined();
        expect(marker.text).toEqual('TEXT1');
    });

    it('get zero top and left when there is no text content', function() {
        var marker;

        cm.setValue('');

        marker = mmh.updateMarkerWithExtraInfo({
            start: 2,
            end: 8
        });

        expect(marker.start).toEqual(2);
        expect(marker.end).toEqual(8);
        expect(marker.top).toEqual(0);
        expect(marker.left).toEqual(0);
        expect(marker.text).toEqual('');
    });
});

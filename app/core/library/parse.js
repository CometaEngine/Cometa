'use strict';


const url = require('url');
const path = require('path');

module.exports = req => {

    const supportedInput = ['webp', 'png', 'tiff', 'jpeg', 'jpg'];
    const supportedOutput = ['webp', 'png', 'tiff', 'jpeg'];
    const outputQuality = parseInt(req.query.q || req.query.quality);
    let inputURL = '';
    let provider = null;

    if (req.query.url) {
        inputURL = req.query.url;
        provider = 'http';
    } else {
        inputURL = req.params[0];
        provider = 'S3';
    }

    const imagePath = url.parse(inputURL);
    const fileName = path.basename(imagePath.pathname).split('.');
    let output = fileName.pop();
    let input = fileName.pop();

    if (supportedInput.indexOf(input) >= 0) {
        let removedExtension = output;
        output = (supportedOutput.indexOf(output) < 0) ? 'jpeg' : output;
        inputURL = inputURL.replace('.' + removedExtension, '');
    } else if (supportedInput.indexOf(output) >= 0) {
        output = 'jpeg';
    } else {
        throw { status: 400, code: 10 };
    }

    return {
        output: {
            width: parseInt(req.query.w || req.query.width) || null,
            height: parseInt(req.query.h || req.query.height) || null,
            filters: req.query.f || req.query.filters || null,
            quality: outputQuality > 0 && outputQuality <= 100 ? outputQuality : 80,
            format: output
        },
        inputURL: inputURL || null,
        provider: provider
    };
};
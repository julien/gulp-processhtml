var through       = require('through2'),
    gutil         = require('gulp-util'),
    HTMLProcessor = require('htmlprocessor'),
    PluginError   = gutil.PluginError;

module.exports = function(options) {

    //if (!options) {
    //    options = {};
    //}
    //
    //if (!options.customBlockTypes) {
    //    options.customBlockTypes = [];
    //}

    // Add some custom block types.
    //options.customBlockTypes.push('./custom/replace.js');

    var processor = new HTMLProcessor(options),
        content   = '';

    function processContent(file, enc, cb) {

        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-processhtml', 'Streams aren\'t supported'));
            return cb();
        }

        if (file.isBuffer()) {

            content = processor.processContent(file.contents.toString(enc), file.path);

            if (options && options.process) {
                content = processor.template(content, processor.data, options.templateSettings);
            }

            file.contents = new Buffer(content, enc);

        }

        this.push(file);
        cb();

    }

    return through.obj(processContent);

};

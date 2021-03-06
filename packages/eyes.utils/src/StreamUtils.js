(function () {
    'use strict';

    var util = require('util'),
        stream = require('stream');

    /**
     * ReadableBufferStream constructor.
     * @param {Buffer} buffer The buffer to be used as the stream's source.
     * @param {object} [options] An "options" object to be passed to the stream constructor.
     * @constructor
     */
    var ReadableBufferStream = function (buffer, options) {
        // If the call was made without the 'new' operator
        if (!this instanceof ReadableBufferStream) {
            return new ReadableBufferStream(buffer, options);
        }
        stream.Readable.call(this, options);
        this._source = buffer;
    };

    util.inherits(ReadableBufferStream, stream.Readable);

    //noinspection JSUnusedGlobalSymbols
    /**
     * Override of the _read function, as required when implementing a stream.
     * @private
     */
    ReadableBufferStream.prototype._read = function () {
        this.push(this._source);
        this.push(null);
    };

    /**
     * WritableBufferStream constructor.
     * @param {object} [options] An "options" object to be passed to the stream constructor.
     * @constructor
     */
    var WritableBufferStream = function (options) {
        if (!this instanceof WritableBufferStream) {
            return new WritableBufferStream(options);
        }
        stream.Writable.call(this, options);
        this._buffer = Buffer.alloc(0);
    };

    util.inherits(WritableBufferStream, stream.Writable);

    //noinspection JSUnusedGlobalSymbols
    /**
     * Override of the _write function, as require when implementing a Writable stream.
     * @param {Buffer|string} chunk The chunk to write to the stream.
     * @param {string} enc If {@code chunk} is a string, this is the encoding of {@code chunk}.
     * @param {function} next The callback to call when finished handling {@code chunk}.
     * @private
     */
    WritableBufferStream.prototype._write = function (chunk, enc, next) {
        // Since chunk could be either a Buffer or a string.
        var chunkAsBuffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, enc);
        this._buffer = Buffer.concat([this._buffer, chunkAsBuffer]);
        next();
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {Buffer} The buffer which contains the chunks written up to this point.
     */
    WritableBufferStream.prototype.writeInt = function (value) {
        var buf = Buffer.alloc(4);
        buf.writeInt32BE(value, 0);
        return this.write(buf);
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {Buffer} The buffer which contains the chunks written up to this point.
     */
    WritableBufferStream.prototype.writeShort = function (value) {
        var buf = Buffer.alloc(2);
        buf.writeInt16BE(value, 0);
        return this.write(buf);
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {Buffer} The buffer which contains the chunks written up to this point.
     */
    WritableBufferStream.prototype.writeByte = function (value) {
        var buf = Buffer.alloc(1);
        buf.writeInt8(value, 0);
        return this.write(buf);
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {Buffer} The buffer which contains the chunks written up to this point.
     */
    WritableBufferStream.prototype.getBuffer = function () {
        return this._buffer;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Resets the buffer which contains the chunks written so far.
     * @return {Buffer} The buffer which contains the chunks written up to the reset.
     */
    WritableBufferStream.prototype.resetBuffer = function () {
        var buffer = this._buffer;
        this._buffer = Buffer.alloc(0);
        return buffer;
    };

    exports.ReadableBufferStream = ReadableBufferStream;
    exports.WritableBufferStream = WritableBufferStream;
}());

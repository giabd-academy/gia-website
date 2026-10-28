//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

var qrcode = function() {

  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 40
   * @param errorCorrectionLevel 'L','M','Q','H'
   */
  var qrcode = function(typeNumber, errorCorrectionLevel) {

    var PAD0 = 0xEC;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = [];

    var _this = {};

    var makeImpl = function(test, maskPattern) {

      _moduleCount = _typeNumber * 4 + 17;
      _modules = function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      }(_moduleCount);

      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);

      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }

      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      }

      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {

      for (var r = -1; r <= 7; r += 1) {

        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {

          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {

      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {

        makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(_this);

        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    };

    var setupTimingPattern = function() {

      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = (r % 2 == 0);
      }

      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = (c % 2 == 0);
      }
    };

    var setupPositionAdjustPattern = function() {

      var pos = QRUtil.getPatternPosition(_typeNumber);

      for (var i = 0; i < pos.length; i += 1) {

        for (var j = 0; j < pos.length; j += 1) {

          var row = pos[i];
          var col = pos[j];

          if (_modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {

            for (var c = -2; c <= 2; c += 1) {

              if (r == -2 || r == 2 || c == -2 || c == 2
                  || (r == 0 && c == 0) ) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {

      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {

      var data = (_errorCorrectionLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 6) {
          _modules[i][8] = mod;
        } else if (i < 8) {
          _modules[i + 1][8] = mod;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod;
        } else {
          _modules[8][15 - i - 1] = mod;
        }
      }

      // fixed module
      _modules[_moduleCount - 8][8] = (!test);
    };

    var mapData = function(data, maskPattern) {

      var inc = -1;
      var row = _moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);

      for (var col = _moduleCount - 1; col > 0; col -= 2) {

        if (col == 6) col -= 1;

        while (true) {

          for (var c = 0; c < 2; c += 1) {

            if (_modules[row][col - c] == null) {

              var dark = false;

              if (byteIndex < data.length) {
                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              _modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {

      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);

      for (var r = 0; r < rsBlocks.length; r += 1) {

        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = new Array(dcCount);

        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }

      var data = new Array(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }

      return data;
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {

      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. ('
          + buffer.getLengthInBits()
          + '>'
          + totalDataCount * 8
          + ')';
      }

      // end code
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }

      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data, mode) {

      mode = mode || 'Byte';

      var newData = null;

      switch(mode) {
      case 'Numeric' :
        newData = qrNumber(data);
        break;
      case 'Alphanumeric' :
        newData = qrAlphaNum(data);
        break;
      case 'Byte' :
        newData = qr8BitByte(data);
        break;
      case 'Kanji' :
        newData = qrKanji(data);
        break;
      default :
        throw 'mode:' + mode;
      }

      _dataList.push(newData);
      _dataCache = null;
    };

    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + ',' + col;
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function() {
      return _moduleCount;
    };

    _this.make = function() {
      if (_typeNumber < 1) {
        var typeNumber = 1;

        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
          var buffer = qrBitBuffer();

          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
            data.write(buffer);
          }

          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
          }

          if (buffer.getLengthInBits() <= totalDataCount * 8) {
            break;
          }
        }

        _typeNumber = typeNumber;
      }

      makeImpl(false, getBestMaskPattern() );
    };

    _this.createTableTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var qrHtml = '';

      qrHtml += '<table style="';
      qrHtml += ' border-width: 0px; border-style: none;';
      qrHtml += ' border-collapse: collapse;';
      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
      qrHtml += '">';
      qrHtml += '<tbody>';

      for (var r = 0; r < _this.getModuleCount(); r += 1) {

        qrHtml += '<tr>';

        for (var c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += ' border-width: 0px; border-style: none;';
          qrHtml += ' border-collapse: collapse;';
          qrHtml += ' padding: 0px; margin: 0px;';
          qrHtml += ' width: ' + cellSize + 'px;';
          qrHtml += ' height: ' + cellSize + 'px;';
          qrHtml += ' background-color: ';
          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
          qrHtml += ';';
          qrHtml += '"/>';
        }

        qrHtml += '</tr>';
      }

      qrHtml += '</tbody>';
      qrHtml += '</table>';

      return qrHtml;
    };

    _this.createSvgTag = function(cellSize, margin, alt, title) {

      var opts = {};
      if (typeof arguments[0] == 'object') {
        // Called by options.
        opts = arguments[0];
        // overwrite cellSize and margin.
        cellSize = opts.cellSize;
        margin = opts.margin;
        alt = opts.alt;
        title = opts.title;
      }

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      // Compose alt property surrogate
      alt = (typeof alt === 'string') ? {text: alt} : alt || {};
      alt.text = alt.text || null;
      alt.id = (alt.text) ? alt.id || 'qrcode-description' : null;

      // Compose title property surrogate
      title = (typeof title === 'string') ? {text: title} : title || {};
      title.text = title.text || null;
      title.id = (title.text) ? title.id || 'qrcode-title' : null;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var c, mc, r, mr, qrSvg='', rect;

      rect = 'l' + cellSize + ',0 0,' + cellSize +
        ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
      qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
      qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
      qrSvg += ' preserveAspectRatio="xMinYMin meet"';
      qrSvg += (title.text || alt.text) ? ' role="img" aria-labelledby="' +
          escapeXml([title.id, alt.id].join(' ').trim() ) + '"' : '';
      qrSvg += '>';
      qrSvg += (title.text) ? '<title id="' + escapeXml(title.id) + '">' +
          escapeXml(title.text) + '</title>' : '';
      qrSvg += (alt.text) ? '<description id="' + escapeXml(alt.id) + '">' +
          escapeXml(alt.text) + '</description>' : '';
      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
      qrSvg += '<path d="';

      for (r = 0; r < _this.getModuleCount(); r += 1) {
        mr = r * cellSize + margin;
        for (c = 0; c < _this.getModuleCount(); c += 1) {
          if (_this.isDark(r, c) ) {
            mc = c*cellSize+margin;
            qrSvg += 'M' + mc + ',' + mr + rect;
          }
        }
      }

      qrSvg += '" stroke="transparent" fill="black"/>';
      qrSvg += '</svg>';

      return qrSvg;
    };

    _this.createDataURL = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      return createDataURL(size, size, function(x, y) {
        if (min <= x && x < max && min <= y && y < max) {
          var c = Math.floor( (x - min) / cellSize);
          var r = Math.floor( (y - min) / cellSize);
          return _this.isDark(r, c)? 0 : 1;
        } else {
          return 1;
        }
      } );
    };

    _this.createImgTag = function(cellSize, margin, alt) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;

      var img = '';
      img += '<img';
      img += '\u0020src="';
      img += _this.createDataURL(cellSize, margin);
      img += '"';
      img += '\u0020width="';
      img += size;
      img += '"';
      img += '\u0020height="';
      img += size;
      img += '"';
      if (alt) {
        img += '\u0020alt="';
        img += escapeXml(alt);
        img += '"';
      }
      img += '/>';

      return img;
    };

    var escapeXml = function(s) {
      var escaped = '';
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charAt(i);
        switch(c) {
        case '<': escaped += '&lt;'; break;
        case '>': escaped += '&gt;'; break;
        case '&': escaped += '&amp;'; break;
        case '"': escaped += '&quot;'; break;
        default : escaped += c; break;
        }
      }
      return escaped;
    };

    var _createHalfASCII = function(margin) {
      var cellSize = 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r1, r2, p;

      var blocks = {
        '██': '█',
        '█ ': '▀',
        ' █': '▄',
        '  ': ' '
      };

      var blocksLastLineNoMargin = {
        '██': '▀',
        '█ ': '▀',
        ' █': ' ',
        '  ': ' '
      };

      var ascii = '';
      for (y = 0; y < size; y += 2) {
        r1 = Math.floor((y - min) / cellSize);
        r2 = Math.floor((y + 1 - min) / cellSize);
        for (x = 0; x < size; x += 1) {
          p = '█';

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
            p = ' ';
          }

          if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
            p += ' ';
          }
          else {
            p += '█';
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
        }

        ascii += '\n';
      }

      if (size % 2 && margin > 0) {
        return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.createASCII = function(cellSize, margin) {
      cellSize = cellSize || 1;

      if (cellSize < 2) {
        return _createHalfASCII(margin);
      }

      cellSize -= 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r, p;

      var white = Array(cellSize+1).join('██');
      var black = Array(cellSize+1).join('  ');

      var ascii = '';
      var line = '';
      for (y = 0; y < size; y += 1) {
        r = Math.floor( (y - min) / cellSize);
        line = '';
        for (x = 0; x < size; x += 1) {
          p = 1;

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
            p = 0;
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          line += p ? white : black;
        }

        for (r = 0; r < cellSize; r += 1) {
          ascii += line + '\n';
        }
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.renderTo2dContext = function(context, cellSize) {
      cellSize = cellSize || 2;
      var length = _this.getModuleCount();
      for (var row = 0; row < length; row++) {
        for (var col = 0; col < length; col++) {
          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
          context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
      }
    }

    return _this;
  };

  //---------------------------------------------------------------------
  // qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytesFuncs = {
    'default' : function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    }
  };

  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

  //---------------------------------------------------------------------
  // qrcode.createStringToBytes
  //---------------------------------------------------------------------

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  qrcode.createStringToBytes = function(unicodeData, numChars) {

    // create conversion map.

    var unicodeMap = function() {

      var bin = base64DecodeInputStream(unicodeData);
      var read = function() {
        var b = bin.read();
        if (b == -1) throw 'eof';
        return b;
      };

      var count = 0;
      var unicodeMap = {};
      while (true) {
        var b0 = bin.read();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode( (b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + ' != ' + numChars;
      }

      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ( (b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };

  //---------------------------------------------------------------------
  // QRMode
  //---------------------------------------------------------------------

  var QRMode = {
    MODE_NUMBER :    1 << 0,
    MODE_ALPHA_NUM : 1 << 1,
    MODE_8BIT_BYTE : 1 << 2,
    MODE_KANJI :     1 << 3
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectionLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectionLevel = {
    L : 1,
    M : 0,
    Q : 3,
    H : 2
  };

  //---------------------------------------------------------------------
  // QRMaskPattern
  //---------------------------------------------------------------------

  var QRMaskPattern = {
    PATTERN000 : 0,
    PATTERN001 : 1,
    PATTERN010 : 2,
    PATTERN011 : 3,
    PATTERN100 : 4,
    PATTERN101 : 5,
    PATTERN110 : 6,
    PATTERN111 : 7
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = function() {

    var PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ];
    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

    var _this = {};

    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
      }
      return ( (data << 10) | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
      }
      return (data << 12) | d;
    };

    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function(maskPattern) {

      switch (maskPattern) {

      case QRMaskPattern.PATTERN000 :
        return function(i, j) { return (i + j) % 2 == 0; };
      case QRMaskPattern.PATTERN001 :
        return function(i, j) { return i % 2 == 0; };
      case QRMaskPattern.PATTERN010 :
        return function(i, j) { return j % 3 == 0; };
      case QRMaskPattern.PATTERN011 :
        return function(i, j) { return (i + j) % 3 == 0; };
      case QRMaskPattern.PATTERN100 :
        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
      case QRMaskPattern.PATTERN101 :
        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
      case QRMaskPattern.PATTERN110 :
        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
      case QRMaskPattern.PATTERN111 :
        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

      default :
        throw 'bad maskPattern:' + maskPattern;
      }
    };

    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
      }
      return a;
    };

    _this.getLengthInBits = function(mode, type) {

      if (1 <= type && type < 10) {

        // 1 - 9

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 10;
        case QRMode.MODE_ALPHA_NUM : return 9;
        case QRMode.MODE_8BIT_BYTE : return 8;
        case QRMode.MODE_KANJI     : return 8;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 27) {

        // 10 - 26

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 12;
        case QRMode.MODE_ALPHA_NUM : return 11;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 10;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 41) {

        // 27 - 40

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 14;
        case QRMode.MODE_ALPHA_NUM : return 13;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 12;
        default :
          throw 'mode:' + mode;
        }

      } else {
        throw 'type:' + type;
      }
    };

    _this.getLostPoint = function(qrcode) {

      var moduleCount = qrcode.getModuleCount();

      var lostPoint = 0;

      // LEVEL1

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {

          var sameCount = 0;
          var dark = qrcode.isDark(row, col);

          for (var r = -1; r <= 1; r += 1) {

            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }

            for (var c = -1; c <= 1; c += 1) {

              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }

              if (r == 0 && c == 0) {
                continue;
              }

              if (dark == qrcode.isDark(row + r, col + c) ) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      };

      // LEVEL2

      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrcode.isDark(row, col) ) count += 1;
          if (qrcode.isDark(row + 1, col) ) count += 1;
          if (qrcode.isDark(row, col + 1) ) count += 1;
          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }

      // LEVEL3

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row, col + 1)
              &&  qrcode.isDark(row, col + 2)
              &&  qrcode.isDark(row, col + 3)
              &&  qrcode.isDark(row, col + 4)
              && !qrcode.isDark(row, col + 5)
              &&  qrcode.isDark(row, col + 6) ) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row + 1, col)
              &&  qrcode.isDark(row + 2, col)
              &&  qrcode.isDark(row + 3, col)
              &&  qrcode.isDark(row + 4, col)
              && !qrcode.isDark(row + 5, col)
              &&  qrcode.isDark(row + 6, col) ) {
            lostPoint += 40;
          }
        }
      }

      // LEVEL4

      var darkCount = 0;

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount; row += 1) {
          if (qrcode.isDark(row, col) ) {
            darkCount += 1;
          }
        }
      }

      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = function() {

    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] = EXP_TABLE[i - 4]
        ^ EXP_TABLE[i - 5]
        ^ EXP_TABLE[i - 6]
        ^ EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i] ] = i;
    }

    var _this = {};

    _this.glog = function(n) {

      if (n < 1) {
        throw 'glog(' + n + ')';
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function(n) {

      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {

    if (typeof num.length == 'undefined') {
      throw num.length + '/' + shift;
    }

    var _num = function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    }();

    var _this = {};

    _this.getAt = function(index) {
      return _num[index];
    };

    _this.getLength = function() {
      return _num.length;
    };

    _this.multiply = function(e) {

      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function(e) {

      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }

      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

      var num = new Array(_this.getLength() );
      for (var i = 0; i < _this.getLength(); i += 1) {
        num[i] = _this.getAt(i);
      }

      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
      }

      // recursive call
      return qrPolynomial(num, 0).mod(e);
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // QRRSBlock
  //---------------------------------------------------------------------

  var QRRSBlock = function() {

    var RS_BLOCK_TABLE = [

      // L
      // M
      // Q
      // H

      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      // 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      // 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      // 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],

      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],

      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],

      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],

      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],

      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],

      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],

      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],

      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],

      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],

      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],

      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],

      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],

      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],

      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],

      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],

      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],

      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],

      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],

      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],

      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],

      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],

      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],

      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],

      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],

      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],

      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],

      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],

      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],

      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],

      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];

    var qrRSBlock = function(totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

      switch(errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default :
        return undefined;
      }
    };

    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (typeof rsBlock == 'undefined') {
        throw 'bad rs block @ typeNumber:' + typeNumber +
            '/errorCorrectionLevel:' + errorCorrectionLevel;
      }

      var length = rsBlock.length / 3;

      var list = [];

      for (var i = 0; i < length; i += 1) {

        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];

        for (var j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount) );
        }
      }

      return list;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function() {

    var _buffer = [];
    var _length = 0;

    var _this = {};

    _this.getBuffer = function() {
      return _buffer;
    };

    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    };

    _this.put = function(num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
      }
    };

    _this.getLengthInBits = function() {
      return _length;
    };

    _this.putBit = function(bit) {

      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrNumber
  //---------------------------------------------------------------------

  var qrNumber = function(data) {

    var _mode = QRMode.MODE_NUMBER;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var data = _data;

      var i = 0;

      while (i + 2 < data.length) {
        buffer.put(strToNum(data.substring(i, i + 3) ), 10);
        i += 3;
      }

      if (i < data.length) {
        if (data.length - i == 1) {
          buffer.put(strToNum(data.substring(i, i + 1) ), 4);
        } else if (data.length - i == 2) {
          buffer.put(strToNum(data.substring(i, i + 2) ), 7);
        }
      }
    };

    var strToNum = function(s) {
      var num = 0;
      for (var i = 0; i < s.length; i += 1) {
        num = num * 10 + chatToNum(s.charAt(i) );
      }
      return num;
    };

    var chatToNum = function(c) {
      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      }
      throw 'illegal char :' + c;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrAlphaNum
  //---------------------------------------------------------------------

  var qrAlphaNum = function(data) {

    var _mode = QRMode.MODE_ALPHA_NUM;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var s = _data;

      var i = 0;

      while (i + 1 < s.length) {
        buffer.put(
          getCode(s.charAt(i) ) * 45 +
          getCode(s.charAt(i + 1) ), 11);
        i += 2;
      }

      if (i < s.length) {
        buffer.put(getCode(s.charAt(i) ), 6);
      }
    };

    var getCode = function(c) {

      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      } else if ('A' <= c && c <= 'Z') {
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else {
        switch (c) {
        case ' ' : return 36;
        case '$' : return 37;
        case '%' : return 38;
        case '*' : return 39;
        case '+' : return 40;
        case '-' : return 41;
        case '.' : return 42;
        case '/' : return 43;
        case ':' : return 44;
        default :
          throw 'illegal char :' + c;
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qr8BitByte
  //---------------------------------------------------------------------

  var qr8BitByte = function(data) {

    var _mode = QRMode.MODE_8BIT_BYTE;
    var _data = data;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _bytes.length;
    };

    _this.write = function(buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrKanji
  //---------------------------------------------------------------------

  var qrKanji = function(data) {

    var _mode = QRMode.MODE_KANJI;
    var _data = data;

    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
    if (!stringToBytes) {
      throw 'sjis not supported.';
    }
    !function(c, code) {
      // self test for sjis support.
      var test = stringToBytes(c);
      if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
        throw 'sjis not supported.';
      }
    }('\u53cb', 0x9746);

    var _bytes = stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return ~~(_bytes.length / 2);
    };

    _this.write = function(buffer) {

      var data = _bytes;

      var i = 0;

      while (i + 1 < data.length) {

        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

        if (0x8140 <= c && c <= 0x9FFC) {
          c -= 0x8140;
        } else if (0xE040 <= c && c <= 0xEBBF) {
          c -= 0xC140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

        buffer.put(c, 13);

        i += 2;
      }

      if (i < data.length) {
        throw 'illegal char at ' + (i + 1);
      }
    };

    return _this;
  };

  //=====================================================================
  // GIF Support etc.
  //

  //---------------------------------------------------------------------
  // byteArrayOutputStream
  //---------------------------------------------------------------------

  var byteArrayOutputStream = function() {

    var _bytes = [];

    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i) );
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    _this.toString = function() {
      var s = '';
      s += '[';
      for (var i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ',';
        }
        s += _bytes[i];
      }
      s += ']';
      return s;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64EncodeOutputStream
  //---------------------------------------------------------------------

  var base64EncodeOutputStream = function() {

    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f) );
    };

    var encode = function(n) {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw 'n:' + n;
    };

    _this.writeByte = function(n) {

      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6) );
        _buflen -= 6;
      }
    };

    _this.flush = function() {

      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen) );
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        // padding
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function(str) {

    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function() {

      while (_buflen < 8) {

        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw 'unexpected end of file./' + _buflen;
        }

        var c = _str.charAt(_pos);
        _pos += 1;

        if (c == '=') {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/) ) {
          // ignore if whitespace.
          continue;
        }

        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
        _buflen += 6;
      }

      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function(c) {
      if (0x41 <= c && c <= 0x5a) {
        return c - 0x41;
      } else if (0x61 <= c && c <= 0x7a) {
        return c - 0x61 + 26;
      } else if (0x30 <= c && c <= 0x39) {
        return c - 0x30 + 52;
      } else if (c == 0x2b) {
        return 62;
      } else if (c == 0x2f) {
        return 63;
      } else {
        throw 'c:' + c;
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // gifImage (B/W)
  //---------------------------------------------------------------------

  var gifImage = function(width, height) {

    var _width = width;
    var _height = height;
    var _data = new Array(width * height);

    var _this = {};

    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };

    _this.write = function(out) {

      //---------------------------------
      // GIF Signature

      out.writeString('GIF87a');

      //---------------------------------
      // Screen Descriptor

      out.writeShort(_width);
      out.writeShort(_height);

      out.writeByte(0x80); // 2bit
      out.writeByte(0);
      out.writeByte(0);

      //---------------------------------
      // Global Color Map

      // black
      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0x00);

      // white
      out.writeByte(0xff);
      out.writeByte(0xff);
      out.writeByte(0xff);

      //---------------------------------
      // Image Descriptor

      out.writeString(',');
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);

      //---------------------------------
      // Local Color Map

      //---------------------------------
      // Raster Data

      var lzwMinCodeSize = 2;
      var raster = getLZWRaster(lzwMinCodeSize);

      out.writeByte(lzwMinCodeSize);

      var offset = 0;

      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);

      //---------------------------------
      // GIF Terminator
      out.writeString(';');
    };

    var bitOutputStream = function(out) {

      var _out = out;
      var _bitLength = 0;
      var _bitBuffer = 0;

      var _this = {};

      _this.write = function(data, length) {

        if ( (data >>> length) != 0) {
          throw 'length over';
        }

        while (_bitLength + length >= 8) {
          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      };

      _this.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };

      return _this;
    };

    var getLZWRaster = function(lzwMinCodeSize) {

      var clearCode = 1 << lzwMinCodeSize;
      var endCode = (1 << lzwMinCodeSize) + 1;
      var bitLength = lzwMinCodeSize + 1;

      // Setup LZWTable
      var table = lzwTable();

      for (var i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i) );
      }
      table.add(String.fromCharCode(clearCode) );
      table.add(String.fromCharCode(endCode) );

      var byteOut = byteArrayOutputStream();
      var bitOut = bitOutputStream(byteOut);

      // clear code
      bitOut.write(clearCode, bitLength);

      var dataIndex = 0;

      var s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      while (dataIndex < _data.length) {

        var c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;

        if (table.contains(s + c) ) {

          s = s + c;

        } else {

          bitOut.write(table.indexOf(s), bitLength);

          if (table.size() < 0xfff) {

            if (table.size() == (1 << bitLength) ) {
              bitLength += 1;
            }

            table.add(s + c);
          }

          s = c;
        }
      }

      bitOut.write(table.indexOf(s), bitLength);

      // end code
      bitOut.write(endCode, bitLength);

      bitOut.flush();

      return byteOut.toByteArray();
    };

    var lzwTable = function() {

      var _map = {};
      var _size = 0;

      var _this = {};

      _this.add = function(key) {
        if (_this.contains(key) ) {
          throw 'dup key:' + key;
        }
        _map[key] = _size;
        _size += 1;
      };

      _this.size = function() {
        return _size;
      };

      _this.indexOf = function(key) {
        return _map[key];
      };

      _this.contains = function(key) {
        return typeof _map[key] != 'undefined';
      };

      return _this;
    };

    return _this;
  };

  var createDataURL = function(width, height, getPixel) {
    var gif = gifImage(width, height);
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y) );
      }
    }

    var b = byteArrayOutputStream();
    gif.write(b);

    var base64 = base64EncodeOutputStream();
    var bytes = b.toByteArray();
    for (var i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();

    return 'data:image/gif;base64,' + base64;
  };

  //---------------------------------------------------------------------
  // returns qrcode function.

  return qrcode;
}();

// multibyte support
!function() {

  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
              0x80 | ((charcode>>12) & 0x3f),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };

}();

(function (factory) {
  if (typeof define === 'function' && define.amd) {
      define([], factory);
  } else if (typeof exports === 'object') {
      module.exports = factory();
  }
}(function () {
    return qrcode;
}));
var sha256=function a(b){function c(a,b){return a>>>b|a<<32-b}for(var d,e,f=Math.pow,g=f(2,32),h="length",i="",j=[],k=8*b[h],l=a.h=a.h||[],m=a.k=a.k||[],n=m[h],o={},p=2;n<64;p++)if(!o[p]){for(d=0;d<313;d+=p)o[d]=p;l[n]=f(p,.5)*g|0,m[n++]=f(p,1/3)*g|0}for(b+="\x80";b[h]%64-56;)b+="\x00";for(d=0;d<b[h];d++){if(e=b.charCodeAt(d),e>>8)return;j[d>>2]|=e<<(3-d)%4*8}for(j[j[h]]=k/g|0,j[j[h]]=k,e=0;e<j[h];){var q=j.slice(e,e+=16),r=l;for(l=l.slice(0,8),d=0;d<64;d++){var s=q[d-15],t=q[d-2],u=l[0],v=l[4],w=l[7]+(c(v,6)^c(v,11)^c(v,25))+(v&l[5]^~v&l[6])+m[d]+(q[d]=d<16?q[d]:q[d-16]+(c(s,7)^c(s,18)^s>>>3)+q[d-7]+(c(t,17)^c(t,19)^t>>>10)|0),x=(c(u,2)^c(u,13)^c(u,22))+(u&l[1]^u&l[2]^l[1]&l[2]);l=[w+x|0].concat(l),l[4]=l[4]+w|0}for(d=0;d<8;d++)l[d]=l[d]+r[d]|0}for(d=0;d<8;d++)for(e=3;e+1;e--){var y=l[d]>>e*8&255;i+=(y<16?0:"")+y.toString(16)}return i};
function _utf8(t){try{return unescape(encodeURIComponent(t));}catch(e){return String(t);}}
/* ===== GIA Student app v2 ===== */
(function(){
"use strict";
var CFG={apiKey:"AIzaSyAQRyQkxjAWEwgh5nn11Bmo72ke9-bYciQ",authDomain:"gia-erp.firebaseapp.com",projectId:"gia-erp",storageBucket:"gia-erp.firebasestorage.app",messagingSenderId:"951435359568",appId:"1:951435359568:web:347edd9a6364611e83e855"};
var PHONE="+8801830150171", WA="8801830150171", SITE="../";
var LS={key:"gia_stu_key",cache:"gia_stu_cache",notices:"gia_stu_notices",lang:"gia_stu_lang",seen:"gia_stu_seen",cfg:"gia_stu_cfg",selfie:"gia_stu_selfie",dark:"gia_stu_dark",quiz:"gia_stu_quiz",posts:"gia_stu_posts",chg:"gia_stu_chg",theme:"gia_stu_theme",faq:"gia_stu_faq",leaves:"gia_stu_leaves",ci:"gia_stu_ci"};
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch(e){}}
var T={
 en:{sid:"Student ID",phone:"Phone number (given at admission)",login:"Log in",loginSub:"Galaxy International Academy",loginHint:"Only you can see your own information. Problem? Call the office.",offline:"Offline — showing last saved data",install:"Install app",
  home:"Home",fees:"Fees",att:"Attendance",notices:"Notices",more:"Me",
  hello:"Hello",totalFee:"Total fee",paid:"Paid",due:"Due",paidPct:"of fee paid",attendance:"Attendance",nextInst:"Next installment",none:"Nothing yet",
  inst:"Installments",payHist:"Payment history",receipt:"Receipt",cls:"My class",teacher:"Teacher",shift:"Shift / time",start:"Start date",course:"Course",batch:"Batch",enroll:"Admission date",
  present:"Present",late:"Late",absent:"Absent",total:"Total classes",recent:"Recent classes",
  myTests:"My exams",progress:"My progress",jlpt:"JLPT / exam",visa:"Visa",app:"School application",docs:"Documents",stage:"Stage",
  noNotice:"No notices right now",tools:"Study tools",mock:"JLPT N5 mock test",check:"Document checklist",elig:"Eligibility check",web:"Website",
  contact:"Contact office",call:"Call",wa:"WhatsApp",logout:"Log out",updated:"Updated",errNF:"Student ID or phone number did not match. Use the phone number you gave at admission.",errNet:"Could not connect. Check internet and try again.",errFill:"Enter Student ID and phone number",
  overdue:"Overdue",pending:"Pending",paidS:"Paid",waitMsg:"Loading…",allStu:"All students",
  todayAtt:"Today's attendance",checkIn:"Check in with selfie",checkOut:"Check out with selfie",ciPending:"Waiting for teacher approval",ciApproved:"Approved by teacher",ciRejected:"Rejected",ciDone:"Done for today — see you next class!",ciOff:"Selfie check-in is turned off by the office",
  inT:"In",outT:"Out",camTitleIn:"Check-in selfie",camTitleOut:"Check-out selfie",camHint:"Keep your face inside the circle, good light, no mask",shoot:"Take photo",retake:"Retake",submit:"Submit",locating:"Finding your location…",locOk:"Location found",locFar:"You are far from the academy",locNo:"Location not available",camErr:"Camera could not open. Allow camera permission in browser settings and try again.",sending:"Sending…",sent:"Submitted! Waiting for teacher approval.",farBlock:"You must be at the academy to check in.",already:"Today's attendance is already marked by your teacher.",
  myCheckins:"My check-ins (last 7 days)",myRoutine:"My class routine",fullCal:"Calendar",classToday:"Class today",startsIn:"Starts in",classDone:"Today's class is over",extra:"Extra class",changed:"Time changed",holidayToday:"Holiday today",offToday:"Class off today",noClassToday:"No class today",nextClassOn:"Next class:",lgClass:"Class",lgExtra:"Extra / changed",lgHol:"Holiday / off",lgNo:"No class",weekly:"Weekly routine",upcomingChg:"Upcoming changes",ct_off:"Class off",ct_holiday:"Holiday",ct_extra:"Extra class",ct_time:"Time change",theme:"App theme",edited:"edited",validTill:"Valid till",scanVerify:"Scan to verify",tapFlip2:"Tap card to flip",idRules:"Card rules",r1:"Always carry this ID at the academy and exams.",r2:"The QR shows your live status from GIA.",r3:"Lost phone? Inform the office immediately.",asst:"GIA Assistant",asstHi:"Hello {n}! I am GIA Assistant. Ask me about fees, classes, attendance, JLPT, leave or office info.",asstPh:"Type your question…",asstNote:"Automatic answers from GIA info — for anything else, contact the office.",leave:"Leave",leaveReq:"Apply for leave",leaveDate:"Date",leaveWhy:"Reason",leaveSend:"Send request",leaveSent:"Leave request sent to your teacher",leaveMine:"My leave requests",cancel:"Cancel",cancelled:"Cancelled",leaveErr:"Pick a date and write a reason",leaveDup:"You already sent a request for this date",payOnline:"Pay online",payTitle:"Online payment",paySoon:"Coming soon",payMaint:"Under maintenance",payOffice:"Pay at office",nextClass:"Class starts in",inProgress:"Class in progress",badges:"Achievements",bStreak:"5-day streak",bStar:"Star attendee",bKana:"Kana champ",bFee:"Fees clear",bFirst:"First check-in",streak:"day streak",jlptCd:"days to JLPT",wod:"Word of the day",kana:"Kana quiz",kanaQ:"Which romaji is this?",score:"Score",next:"Next",idCard:"Digital student ID",showOffice:"Show this card at the office",dark:"Dark mode",notif:"Approval alerts",notifOn:"On",enable:"Enable",tapFlip:"tap to see meaning",correct:"Correct!",wrong:"Oops — it was",approvedMsg:"Your attendance was approved ✅",rejectedMsg:"Your check-in was rejected"},
 bn:{sid:"স্টুডেন্ট আইডি",phone:"ফোন নম্বর (ভর্তির সময় দেওয়া)",login:"লগইন",loginSub:"গ্যালাক্সি ইন্টারন্যাশনাল একাডেমি",loginHint:"শুধু আপনি আপনার তথ্য দেখতে পারবেন। সমস্যা হলে অফিসে কল করুন।",offline:"অফলাইন — শেষ সেভ করা তথ্য দেখানো হচ্ছে",install:"অ্যাপ ইনস্টল",
  home:"হোম",fees:"ফি",att:"উপস্থিতি",notices:"নোটিশ",more:"আমি",
  hello:"স্বাগতম",totalFee:"মোট ফি",paid:"পরিশোধ",due:"বকেয়া",paidPct:"ফি পরিশোধ হয়েছে",attendance:"উপস্থিতি",nextInst:"পরের কিস্তি",none:"এখনো কিছু নেই",
  inst:"কিস্তি",payHist:"পেমেন্টের ইতিহাস",receipt:"রসিদ",cls:"আমার ক্লাস",teacher:"শিক্ষক",shift:"শিফট / সময়",start:"শুরুর তারিখ",course:"কোর্স",batch:"ব্যাচ",enroll:"ভর্তির তারিখ",
  present:"উপস্থিত",late:"দেরি",absent:"অনুপস্থিত",total:"মোট ক্লাস",recent:"সাম্প্রতিক ক্লাস",
  myTests:"আমার পরীক্ষা",progress:"আমার অগ্রগতি",jlpt:"JLPT / পরীক্ষা",visa:"ভিসা",app:"স্কুলে আবেদন",docs:"কাগজপত্র",stage:"ধাপ",
  noNotice:"এখন কোনো নোটিশ নেই",tools:"পড়ার টুলস",mock:"JLPT N5 মক টেস্ট",check:"কাগজপত্রের চেকলিস্ট",elig:"যোগ্যতা যাচাই",web:"ওয়েবসাইট",
  contact:"অফিসে যোগাযোগ",call:"কল",wa:"হোয়াটসঅ্যাপ",logout:"লগআউট",updated:"আপডেট",errNF:"স্টুডেন্ট আইডি বা ফোন নম্বর মেলেনি। ভর্তির সময় দেওয়া নম্বর দিন।",errNet:"সংযোগ হয়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।",errFill:"স্টুডেন্ট আইডি ও ফোন নম্বর দিন",
  overdue:"মেয়াদোত্তীর্ণ",pending:"বাকি",paidS:"পরিশোধিত",waitMsg:"লোড হচ্ছে…",allStu:"সব শিক্ষার্থী",
  todayAtt:"আজকের উপস্থিতি",checkIn:"সেলফি দিয়ে চেক-ইন",checkOut:"সেলফি দিয়ে চেক-আউট",ciPending:"শিক্ষকের অনুমোদনের অপেক্ষায়",ciApproved:"শিক্ষক অনুমোদন করেছেন",ciRejected:"বাতিল হয়েছে",ciDone:"আজকের কাজ শেষ — পরের ক্লাসে দেখা হবে!",ciOff:"অফিস সেলফি চেক-ইন বন্ধ রেখেছে",
  inT:"প্রবেশ",outT:"বের",camTitleIn:"চেক-ইন সেলফি",camTitleOut:"চেক-আউট সেলফি",camHint:"মুখ বৃত্তের ভেতরে রাখুন, আলো ভালো রাখুন, মাস্ক খুলুন",shoot:"ছবি তুলুন",retake:"আবার তুলুন",submit:"জমা দিন",locating:"আপনার লোকেশন খোঁজা হচ্ছে…",locOk:"লোকেশন পাওয়া গেছে",locFar:"আপনি একাডেমি থেকে দূরে",locNo:"লোকেশন পাওয়া যায়নি",camErr:"ক্যামেরা খোলেনি। ব্রাউজার সেটিংসে ক্যামেরার অনুমতি দিয়ে আবার চেষ্টা করুন।",sending:"পাঠানো হচ্ছে…",sent:"জমা হয়েছে! শিক্ষকের অনুমোদনের অপেক্ষায়।",farBlock:"চেক-ইন করতে একাডেমিতে থাকতে হবে।",already:"আজকের উপস্থিতি শিক্ষক আগেই দিয়েছেন।",
  myCheckins:"আমার চেক-ইন (শেষ ৭ দিন)",myRoutine:"আমার ক্লাস রুটিন",fullCal:"ক্যালেন্ডার",classToday:"আজ ক্লাস আছে",startsIn:"শুরু হবে",classDone:"আজকের ক্লাস শেষ",extra:"অতিরিক্ত ক্লাস",changed:"সময় পরিবর্তন",holidayToday:"আজ ছুটি",offToday:"আজ ক্লাস বন্ধ",noClassToday:"আজ ক্লাস নেই",nextClassOn:"পরের ক্লাস:",lgClass:"ক্লাস",lgExtra:"অতিরিক্ত / পরিবর্তন",lgHol:"ছুটি / বন্ধ",lgNo:"ক্লাস নেই",weekly:"সাপ্তাহিক রুটিন",upcomingChg:"আসন্ন পরিবর্তন",ct_off:"ক্লাস বন্ধ",ct_holiday:"ছুটি",ct_extra:"অতিরিক্ত ক্লাস",ct_time:"সময় পরিবর্তন",theme:"অ্যাপ থিম",edited:"সম্পাদিত",validTill:"মেয়াদ",scanVerify:"স্ক্যান করে যাচাই করুন",tapFlip2:"কার্ডে ট্যাপ করে উল্টান",idRules:"কার্ডের নিয়ম",r1:"একাডেমি ও পরীক্ষায় সবসময় এই আইডি সাথে রাখো।",r2:"QR স্ক্যান করলে GIA থেকে লাইভ স্ট্যাটাস দেখাবে।",r3:"ফোন হারালে সাথে সাথে অফিসে জানাও।",asst:"GIA অ্যাসিস্ট্যান্ট",asstHi:"হ্যালো {n}! আমি GIA অ্যাসিস্ট্যান্ট। ফি, ক্লাস, উপস্থিতি, JLPT, ছুটি বা অফিসের তথ্য — যেকোনো প্রশ্ন করো।",asstPh:"প্রশ্ন লেখো…",asstNote:"GIA-র তথ্য থেকে স্বয়ংক্রিয় উত্তর — অন্য কিছু জানতে অফিসে যোগাযোগ করো।",leave:"ছুটি",leaveReq:"ছুটির আবেদন",leaveDate:"তারিখ",leaveWhy:"কারণ",leaveSend:"আবেদন পাঠান",leaveSent:"ছুটির আবেদন শিক্ষকের কাছে গেছে",leaveMine:"আমার ছুটির আবেদন",cancel:"বাতিল",cancelled:"বাতিল করা",leaveErr:"তারিখ ও কারণ দিন",leaveDup:"এই তারিখে আগেই আবেদন করেছেন",payOnline:"অনলাইনে পেমেন্ট",payTitle:"অনলাইন পেমেন্ট",paySoon:"শীঘ্রই আসছে",payMaint:"রক্ষণাবেক্ষণ চলছে",payOffice:"অফিসে পেমেন্ট দিন",nextClass:"ক্লাস শুরু হবে",inProgress:"ক্লাস চলছে",badges:"অর্জন",bStreak:"৫ দিনের ধারা",bStar:"সেরা উপস্থিতি",bKana:"কানা চ্যাম্পিয়ন",bFee:"ফি পরিশোধিত",bFirst:"প্রথম চেক-ইন",streak:"দিনের ধারা",jlptCd:"দিন বাকি JLPT",wod:"আজকের শব্দ",kana:"কানা কুইজ",kanaQ:"এটার রোমাজি কোনটি?",score:"স্কোর",next:"পরেরটি",idCard:"ডিজিটাল স্টুডেন্ট আইডি",showOffice:"অফিসে এই কার্ড দেখান",dark:"ডার্ক মোড",notif:"অনুমোদনের নোটিফিকেশন",notifOn:"চালু",enable:"চালু করুন",tapFlip:"অর্থ দেখতে ট্যাপ করুন",correct:"সঠিক!",wrong:"ভুল — সঠিক ছিল",approvedMsg:"আপনার উপস্থিতি অনুমোদিত হয়েছে ✅",rejectedMsg:"আপনার চেক-ইন বাতিল হয়েছে"}
};
var WORDS=[["水","みず","mizu","water","পানি"],["食べる","たべる","taberu","to eat","খাওয়া"],["学校","がっこう","gakkou","school","স্কুল"],["先生","せんせい","sensei","teacher","শিক্ষক"],["友達","ともだち","tomodachi","friend","বন্ধু"],["本","ほん","hon","book","বই"],["電車","でんしゃ","densha","train","ট্রেন"],["行く","いく","iku","to go","যাওয়া"],["来る","くる","kuru","to come","আসা"],["見る","みる","miru","to see","দেখা"],["大きい","おおきい","ookii","big","বড়"],["小さい","ちいさい","chiisai","small","ছোট"],["今日","きょう","kyou","today","আজ"],["明日","あした","ashita","tomorrow","আগামীকাল"],["仕事","しごと","shigoto","work / job","কাজ"],["お金","おかね","okane","money","টাকা"],["日本","にほん","nihon","Japan","জাপান"],["時間","じかん","jikan","time","সময়"],["名前","なまえ","namae","name","নাম"],["家","いえ","ie","house","বাড়ি"],["飲む","のむ","nomu","to drink","পান করা"],["話す","はなす","hanasu","to speak","কথা বলা"],["書く","かく","kaku","to write","লেখা"],["読む","よむ","yomu","to read","পড়া"],["新しい","あたらしい","atarashii","new","নতুন"],["高い","たかい","takai","expensive / tall","দামি / উঁচু"],["安い","やすい","yasui","cheap","সস্তা"],["朝","あさ","asa","morning","সকাল"],["夜","よる","yoru","night","রাত"],["駅","えき","eki","station","স্টেশন"],["病院","びょういん","byouin","hospital","হাসপাতাল"],["勉強","べんきょう","benkyou","study","পড়াশোনা"],["天気","てんき","tenki","weather","আবহাওয়া"],["元気","げんき","genki","healthy / fine","ভালো আছি"],["ありがとう","ありがとう","arigatou","thank you","ধন্যবাদ"],["山","やま","yama","mountain","পাহাড়"],["川","かわ","kawa","river","নদী"],["車","くるま","kuruma","car","গাড়ি"],["雨","あめ","ame","rain","বৃষ্টি"],["花","はな","hana","flower","ফুল"]];
var KANA="あa いi うu えe おo かka きki くku けke こko さsa しshi すsu せse そso たta ちchi つtsu てte とto なna にni ぬnu ねne のno はha ひhi ふfu へhe ほho まma みmi むmu めme もmo やya ゆyu よyo らra りri るru れre ろro わwa をwo んn".split(" ").map(function(x){return [x.charAt(0),x.slice(1)];});
var lang=lsGet(LS.lang)||"en", tab="home", D=null, N=[], fdb=null, ACFG=null, TODAY=null, HIST=null, pollT=null, PAY=null, CHG=[], CALM=0, POSTS=[], FAQ=null, CHAT=[], LEAVES=null, ANIM=false, KSTREAK=0;
function t(k){return (T[lang]&&T[lang][k])||T.en[k]||k;}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function money(n,cur){n=Number(n||0);var s=Math.round(n).toLocaleString("en-IN");return (cur&&cur!=="BDT"?cur+" ":"৳ ")+s;}
function digits(x){return String(x||"").replace(/[^0-9]/g,"");}
function keyOf(sid,phone){var d=digits(phone).slice(-10);if(!sid||d.length<6)return "";return sha256(_utf8("gia|"+String(sid).trim().toLowerCase()+"|"+d));}
function $(id){return document.getElementById(id);}
function ld(d){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function ldAdd(s,n){var d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return ld(d);}
function today(){return ld();}
function tsDate(x){if(!x)return null;if(typeof x.toDate==="function")return x.toDate();if(x.seconds)return new Date(x.seconds*1000);var d=new Date(x);return isNaN(d)?null:d;}
function hm(d){return d?d.toLocaleTimeString(lang==="bn"?"bn-BD":"en-GB",{hour:"2-digit",minute:"2-digit"}):"—";}
function initFB(){if(fdb)return fdb;try{if(window.firebase){var app=firebase.apps.length?firebase.app():firebase.initializeApp(CFG);fdb=firebase.firestore(app);}}catch(e){}return fdb;}
function SV(){try{return firebase.firestore.FieldValue.serverTimestamp();}catch(e){return new Date().toISOString();}}
var THEMES=[["glass","Sakura Glass","linear-gradient(160deg,#0a1a3a,#2a1440)","rgba(255,255,255,.75)"],["washi","Washi Zen","#f7f2e7","#1a1512"],["neo","Neo Tokyo","#07070d","linear-gradient(90deg,#ff2e88,#00e5ff)"],["clay","Origami Clay","#f3ecff","#7f77dd"],["urushi","Urushi Gold","#0d0a08","linear-gradient(90deg,#b8902a,#e2c15a)"],["classic","Classic","#f6f3ec","#0f2544"]];
function curTheme(){var v=lsGet(LS.theme)||"glass";return THEMES.some(function(x){return x[0]===v;})?v:"glass";}
function applyTheme(){var b=document.body,th=curTheme();["glass","t-washi","t-neo","t-clay","t-urushi"].forEach(function(c){b.classList.remove(c);});if(th==="glass")b.classList.add("glass");else if(th!=="classic")b.classList.add("t-"+th);
  var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",{glass:"#0a1a3a",washi:"#fffdf7",neo:"#07070d",clay:"#7f77dd",urushi:"#0d0a08",classic:"#0f2544"}[th]);}
function themePicker(){var cur=curTheme();return '<div class="card"><h3>🎨 '+t("theme")+'</h3><div class="thGrid">'+THEMES.map(function(x){return '<button class="thO'+(x[0]===cur?" on":"")+'" data-act="setTheme" data-v="'+x[0]+'"><div class="thS" style="background:'+x[2]+'"><i style="top:10px;background:'+x[3]+'"></i><i style="top:28px;right:26px;background:'+x[3]+';opacity:.6"></i></div>'+x[1]+'</button>';}).join("")+'</div></div>';}
function applyStatic(){document.documentElement.lang=lang==="bn"?"bn":"en";var els=document.querySelectorAll("[data-t]");for(var i=0;i<els.length;i++)els[i].textContent=t(els[i].getAttribute("data-t"));document.body.classList.toggle("dark",lsGet(LS.dark)==="1");applyTheme();}
async function fetchDoc(k){var f=initFB();if(!f)throw new Error("net");var s=await f.collection("student_portal").doc(k).get();return s.exists?s.data():null;}
async function fetchNotices(){try{var f=initFB();if(!f)return null;var s=await f.collection("student_portal").doc("notices").get();return s.exists?(s.data().list||[]):[];}catch(e){return null;}}
async function fetchPosts(){try{var f=initFB();if(!f)return;var b=(dat().batch||"");var q=b?f.collection("posts").where("batch","in",[b,""]).limit(50):f.collection("posts").where("batch","==","").limit(50);var s=await q.get();POSTS=s.docs.map(function(d){var x=d.data();x.id=d.id;return x;});lsSet(LS.posts,JSON.stringify(POSTS));}catch(e){}}
async function fetchFaq(){try{var f=initFB();if(!f)return;var s=await f.collection("student_portal").doc("faq").get();if(s.exists){FAQ=s.data();lsSet(LS.faq,JSON.stringify(FAQ));}}catch(e){}}
async function fetchChg(){try{var f=initFB();if(!f)return;var b=(dat().batch||"");var q=b?f.collection("class_changes").where("batch","in",[b,""]).limit(100):f.collection("class_changes").where("batch","==","").limit(100);var s=await q.get();CHG=s.docs.map(function(d){return d.data();});lsSet(LS.chg,JSON.stringify(CHG));if(D&&tab==="home")render();}catch(e){}}
async function fetchCfg(){fetchPosts();fetchFaq();fetchChg();try{var f=initFB();if(!f)return;f.collection("student_portal").doc("payinfo").get().then(function(p){PAY=p.exists?p.data():null;}).catch(function(){});var s=await f.collection("student_portal").doc("config").get();if(s.exists){ACFG=s.data().att||null;lsSet(LS.cfg,JSON.stringify(ACFG));}}catch(e){}}
function attRef(date){var f=initFB();return f&&f.collection("att_requests").doc(lsGet(LS.key)+"_"+(date||today()));}
async function fetchToday(){try{var r=attRef();if(!r)return;var s=await r.get();var prev=TODAY;TODAY=s.exists?s.data():null;
  if(prev&&TODAY&&prev.status==="Pending"&&TODAY.status!=="Pending")alertStatus(TODAY);}catch(e){}}
async function fetchHist(){try{var f=initFB();if(!f)return;var days=[];for(var i=0;i<7;i++)days.push(ldAdd(today(),-i));var ss=await Promise.all(days.map(function(d){return attRef(d).get().catch(function(){return null;});}));HIST=ss.map(function(s,i){return s&&s.exists?Object.assign({date:days[i]},s.data()):{date:days[i]};});}catch(e){}}
function confetti(){var C=["#c0392b","#c9a24a","#1e9e6a","#2e86de","#ff7aa2"];var w=document.createElement("div");w.className="confetti";for(var i=0;i<46;i++){var e=document.createElement("i");e.style.left=Math.random()*100+"%";e.style.background=C[i%C.length];e.style.animationDelay=(Math.random()*.4)+"s";e.style.transform="rotate("+Math.random()*360+"deg)";w.appendChild(e);}document.body.appendChild(w);setTimeout(function(){w.remove();},2600);}
function alertStatus(r){if(r.status==="Approved")confetti();var m=r.status==="Approved"?t("approvedMsg"):t("rejectedMsg")+(r.note?" — "+r.note:"");toast(m);try{navigator.vibrate&&navigator.vibrate([120,60,120]);}catch(e){}
  try{if(window.Notification&&Notification.permission==="granted"){if(navigator.serviceWorker&&navigator.serviceWorker.ready){navigator.serviceWorker.ready.then(function(reg){reg.showNotification("GIA Student",{body:m,icon:"icon-192.png",tag:"att"});});}else new Notification("GIA Student",{body:m,icon:"icon-192.png"});}}catch(e){}}
function toast(m){var el=document.createElement("div");el.className="toast";el.textContent=m;document.body.appendChild(el);setTimeout(function(){el.classList.add("out");},3200);setTimeout(function(){el.remove();},3800);}
async function login(){
  var sid=$("in_sid").value.trim(), ph=$("in_phone").value.trim(), er=$("lerr");er.textContent="";
  if(!sid||digits(ph).length<6){er.textContent=t("errFill");return;}
  var k=keyOf(sid,ph), b=$("btnLogin");b.disabled=true;b.textContent=t("waitMsg");
  try{var doc=await fetchDoc(k);if(!doc){er.textContent=t("errNF");$("login").querySelector(".lcard").classList.add("shake");setTimeout(function(){$("login").querySelector(".lcard").classList.remove("shake");},500);return;}
    lsSet(LS.key,k);lsSet(LS.cache,JSON.stringify(doc));D=doc;var n=await fetchNotices();if(n){N=n;lsSet(LS.notices,JSON.stringify(n));}
    await Promise.all([fetchCfg(),fetchToday()]);showMain();
  }catch(e){er.textContent=t("errNet");}
  finally{b.disabled=false;b.textContent=t("login");}
}
async function refresh(){
  var k=lsGet(LS.key);if(!k)return;
  try{var doc=await fetchDoc(k);if(!doc){logout();return;}D=doc;lsSet(LS.cache,JSON.stringify(doc));$("offline").hidden=true;}
  catch(e){$("offline").hidden=false;}
  var n=await fetchNotices();if(n){N=n;lsSet(LS.notices,JSON.stringify(n));}
  await Promise.all([fetchCfg(),fetchToday()]);if(tab==="att")await fetchHist();
  render();
}
function logout(){var fb=$("asstFab");if(fb)fb.hidden=true;CHAT=[];["key","cache","notices","selfie"].forEach(function(k){lsSet(LS[k],null);});D=null;TODAY=null;HIST=null;$("main").hidden=true;$("login").hidden=false;}
function dat(){return (D&&D.data)||{};}
function myNotices(){var c=(dat().course||"");var A=(N||[]).filter(function(n){return !n.course||n.course===c;}).map(function(n){return {type:"n",pin:!!n.pin,date:n.date,title:n.title,body:n.body,tag:n.course||t("allStu")};});
  var B=(POSTS||[]).map(function(p){return {type:"p",pin:!!p.pin,date:String(p.at||"").slice(0,10),at:p.at,title:p.title,body:p.body,image:p.image,by:p.by,edited:!!p.editedAt,tag:p.batch||t("allStu")};});
  return A.concat(B).sort(function(a,b){return (b.pin?1:0)-(a.pin?1:0)||String(b.at||b.date).localeCompare(String(a.at||a.date));});}
function unseen(){var s=lsGet(LS.seen)||"";return myNotices().filter(function(n){return String(n.at||(n.date+"T23:59"))>s;}).length;}
var TABS=[["home","🏠"],["fees","💳"],["att","📸"],["notices","📢"],["more","👤"]];
function showMain(){$("login").hidden=true;$("main").hidden=false;try{CHG=JSON.parse(lsGet(LS.chg)||"[]");POSTS=JSON.parse(lsGet(LS.posts)||"[]");FAQ=JSON.parse(lsGet(LS.faq)||"null");}catch(e){}render();startPoll();var fb=$("asstFab");if(fb)fb.hidden=false;}
function startPoll(){clearInterval(pollT);pollT=setInterval(function(){if(TODAY&&TODAY.status==="Pending"&&document.visibilityState!=="hidden"){fetchToday().then(function(){if(tab==="home")render();});}},30000);}
function render(){
  var d=dat();applyStatic();
  $("hName").textContent=d.name||(D&&D.name)||"—";
  var av=$("hAv");if(av){var ps=(D&&D.photo)||"";if(ps){av.src=ps;av.classList.add("me");}else{av.src="../logomark.png";av.classList.remove("me");}}
  $("hSub").textContent=[d.sid||(D&&D.sid),d.course].filter(Boolean).join(" · ");
  var u=unseen();
  $("tabs").innerHTML=TABS.map(function(x){return '<button class="'+(tab===x[0]?"on":"")+(x[0]==="att"?" mid":"")+'" data-tab="'+x[0]+'"><i>'+x[1]+'</i><span>'+t(x[0])+(x[0]==="notices"&&u?'<span class="badge">'+u+'</span>':'')+'</span></button>';}).join("");
  var bs=$("tabs").querySelectorAll("button");for(var i=0;i<bs.length;i++)bs[i].onclick=function(){go(this.getAttribute("data-tab"));};
  var v=$("view");
  if(!D.data){v.innerHTML=legacy();bind();return;}
  var di=TABORDER.indexOf(tab)-TABORDER.indexOf(LASTTAB),sl=di>0?" slR":di<0?" slL":"";LASTTAB=tab;
  v.innerHTML='<div class="fade'+sl+'">'+({home:vHome,fees:vFees7,att:vAtt7,notices:vNotices7,more:vMore7}[tab]||vHome)()+'</div>';
  bind();
  var tl=v.querySelectorAll(".hero,.idWrap,.mini,.tcCard,.ci");for(var q=0;q<tl.length;q++)tl[q].classList.add("tilt");
  if(tab==="home"&&!ANIM){ANIM=true;var cs=v.querySelectorAll(".cntv[data-v]"),cur=dat().currency;for(var j=0;j<cs.length;j++)(function(el){var to=+el.getAttribute("data-v"),i=0;var st=function(){i++;el.textContent=money(to*Math.min(1,1-Math.pow(1-i/30,3)),cur);if(i<30)requestAnimationFrame(st);};st();})(cs[j]);}
}
function bind(){var lo=$("btnOut");if(lo)lo.onclick=logout;
  var a=document.querySelectorAll("[data-act]");for(var i=0;i<a.length;i++)a[i].onclick=function(){ACT[this.getAttribute("data-act")](this);};}
var ACT={
  ci:function(){openCam("in");},co:function(){openCam("out");},
  flip:function(el){el.classList.toggle("flipped");},
  kana:function(el){kanaAnswer(el.getAttribute("data-v"));},
  knext:function(){QZ=null;render();},
  pay:function(){payModal();},
  sched:function(){openSched();},
  paygo:function(){go("fees");setTimeout(function(){if(PAY&&PAY.status!=="off")payModal();},350);},
  leavego:function(){go("att");setTimeout(function(){var d=document.querySelector(".lvD");if(d){d.open=true;d.scrollIntoView({behavior:"smooth",block:"start"});}},300);},
  nf:function(el){NF=el.getAttribute("data-v");render();},
  idgo:function(){var a=$("idAnchor");if(a)a.scrollIntoView({behavior:"smooth",block:"start"});},
  kanago:function(){var a=$("kanaAnchor");if(a)a.scrollIntoView({behavior:"smooth",block:"start"});},
  zoomimg:function(el){var z=document.createElement("div");z.className="imgZoom";z.innerHTML='<img src="'+el.src+'">';z.onclick=function(){z.remove();};document.body.appendChild(z);},
  asst:function(){openAsst();},
  leave:function(){leaveSubmit();},
  lvc:function(el){leaveCancel(el.getAttribute("data-d"));},
  setTheme:function(el){lsSet(LS.theme,el.getAttribute("data-v"));render();try{navigator.vibrate&&navigator.vibrate(20);}catch(e){}},
  dark:function(){lsSet(LS.dark,lsGet(LS.dark)==="1"?"0":"1");render();},
  notif:function(){try{Notification.requestPermission().then(function(){render();});}catch(e){}},
  lang:function(){toggleLang();}
};
function go(x){tab=x;if(x==="notices"){PREVSEEN=lsGet(LS.seen)||"0";lsSet(LS.seen,new Date().toISOString());}if(x==="att"&&!HIST){fetchHist().then(function(){if(tab==="att")render();});}if(x==="att"&&!LEAVES){fetchLeaves().then(function(){if(tab==="att")render();});}render();window.scrollTo(0,0);}
function instState(i){var s=String(i.status||"").toLowerCase();if(s==="paid")return["p-ok",t("paidS")];if(i.due&&i.due<today())return["p-bad",t("overdue")];return["p-warn",t("pending")];}
function nextInst(d){var L=(d.installments||[]).filter(function(i){return String(i.status).toLowerCase()!=="paid";}).sort(function(a,b){return String(a.due).localeCompare(String(b.due));});return L[0];}
function streak(){var r=((dat().attendance||{}).recent||[]),n=0;for(var i=0;i<r.length;i++){if(r[i].status==="Present"||r[i].status==="Late")n++;else break;}return n;}
function jlptDays(){var now=new Date();now.setHours(0,0,0,0);function firstSun(y,m){var d=new Date(y,m,1);while(d.getDay()!==0)d.setDate(d.getDate()+1);return d;}var y=now.getFullYear(),c=[firstSun(y,6),firstSun(y,11),firstSun(y+1,6)];for(var i=0;i<c.length;i++){if(c[i]>=now)return [Math.round((c[i]-now)/864e5),c[i]];}return [0,now];}
function wod(){var d=new Date(),i=(d.getFullYear()*372+d.getMonth()*31+d.getDate())%WORDS.length;return WORDS[i];}
/* ---- check-in card ---- */
function ciCard(){
  var cfg=ACFG||{};
  if(cfg.enabled===false)return '<div class="card ci off"><h3>📸 '+t("todayAtt")+'</h3><div class="empty">'+t("ciOff")+'</div></div>';
  var r=TODAY,io=r&&(tsDate(r.inTs)||tsDate(r.inAt)),oo=r&&(tsDate(r.outTs)||tsDate(r.outAt));
  if(!r)return '<div class="card ci"><div class="ciRow"><div><h3>📸 '+t("todayAtt")+'</h3><p class="muted">'+esc(new Date().toLocaleDateString(lang==="bn"?"bn-BD":"en-GB",{weekday:"long",day:"numeric",month:"long"}))+'</p></div><div class="pulse">●</div></div><button class="btn big" data-act="ci">📷 '+t("checkIn")+'</button></div>';
  var st=r.status==="Approved"?'<span class="pill p-ok">✅ '+t("ciApproved")+(r.mark&&r.mark!=="Present"?" · "+esc(t(r.mark.toLowerCase())):"")+'</span>':r.status==="Rejected"?'<span class="pill p-bad">✗ '+t("ciRejected")+(r.note?" — "+esc(r.note):"")+'</span>':'<span class="pill p-warn">⏳ '+t("ciPending")+'</span>';
  var pics=(r.inPhoto?'<img src="'+r.inPhoto+'" alt="">':'')+(r.outPhoto?'<img src="'+r.outPhoto+'" alt="">':'');
  var canOut=!oo&&r.status!=="Rejected"&&!r.manual;
  return '<div class="card ci st-'+esc(r.status)+'">'+(r.status==="Approved"?'<span class="hk">'+(r.mark==="Late"?"遅刻":"出席")+'</span>':'')+'<h3>📸 '+t("todayAtt")+'</h3><div class="ciBody">'+(pics?'<div class="ciPics">'+pics+'</div>':'')+'<div><div class="ciTimes">🟢 '+t("inT")+' <b>'+hm(io)+'</b>'+(oo?'<br>🔴 '+t("outT")+' <b>'+hm(oo)+'</b>':'')+'</div>'+st+'</div></div>'+
   (canOut?'<button class="btn big ghost" data-act="co">📷 '+t("checkOut")+'</button>':(oo?'<div class="done">🎉 '+t("ciDone")+'</div>':''))+'</div>';
}
function myLeaveDates(){try{return JSON.parse(lsGet(LS.leaves)||"[]");}catch(e){return [];}}
async function fetchLeaves(){var f=initFB();if(!f)return;var ds=myLeaveDates().filter(function(d){return d>=ldAdd(today(),-30);});try{var ss=await Promise.all(ds.map(function(d){return f.collection("leave_requests").doc(lsGet(LS.key)+"_L_"+d).get().catch(function(){return null;});}));LEAVES=ss.map(function(x,i){return x&&x.exists?Object.assign({date:ds[i]},x.data()):null;}).filter(Boolean).sort(function(a,b){return String(b.date).localeCompare(String(a.date));});}catch(e){LEAVES=[];}}
async function leaveSubmit(){var dt=($("lv_date")||{}).value,rs=(($("lv_why")||{}).value||"").trim();if(!dt||rs.length<3){toast("⚠ "+t("leaveErr"));return;}
  if(myLeaveDates().indexOf(dt)>=0&&(LEAVES||[]).some(function(l){return l.date===dt&&l.status!=="Cancelled";})){toast(t("leaveDup"));return;}
  var d=dat(),b=$("lv_btn");b.disabled=true;
  try{await initFB().collection("leave_requests").doc(lsGet(LS.key)+"_L_"+dt).set({key:lsGet(LS.key),sid:String(d.sid||""),name:String(d.name||"").slice(0,120),batch:String(d.batch||""),date:dt,reason:rs.slice(0,300),createdTs:SV(),status:"Pending"});
    var L=myLeaveDates();if(L.indexOf(dt)<0)L.push(dt);lsSet(LS.leaves,JSON.stringify(L.slice(-40)));toast("✅ "+t("leaveSent"));await fetchLeaves();render();}
  catch(e){b.disabled=false;toast(/permission/i.test(String(e&&(e.code||e.message)))?t("leaveDup"):"⚠ "+t("errNet"));}}
async function leaveCancel(dt){try{await initFB().collection("leave_requests").doc(lsGet(LS.key)+"_L_"+dt).update({status:"Cancelled"});await fetchLeaves();render();}catch(e){toast("⚠ "+t("errNet"));}}
function payBtn(){return PAY&&PAY.status!=="off"?'<button class="btn paybtn" data-act="pay">💳 '+t("payOnline")+' <span class="soon">'+t("paySoon")+'</span></button>':'';}
function payModal(){var M=(PAY&&PAY.methods&&PAY.methods.length?PAY.methods:["bKash","Nagad","Card"]),ic={bKash:"🟣",Nagad:"🟠",Rocket:"🟪",Card:"💳"};var m=document.createElement("div");m.className="sheet";
  m.innerHTML='<div class="sheetIn"><div class="grab"></div><h3>💳 '+t("payTitle")+'</h3><div class="maint"><div class="gear">⚙</div><b>🛠 '+t("payMaint")+'</b><p>'+esc((PAY&&PAY.msg)||"Online payment is under maintenance. Please pay at the office.")+'</p></div><div class="pm">'+M.map(function(x){return '<div class="pmi"><span>'+(ic[x]||"💠")+'</span>'+esc(x)+'<em>'+t("paySoon")+'</em></div>';}).join("")+'</div><a class="btn" href="tel:'+PHONE+'">📞 '+t("payOffice")+'</a><button class="btn ghost" id="sheetX">OK</button></div>';
  document.body.appendChild(m);requestAnimationFrame(function(){m.classList.add("on");});var close=function(){m.classList.remove("on");setTimeout(function(){m.remove();},300);};$("sheetX").onclick=close;m.onclick=function(e){if(e.target===m)close();};}
function badges(){var d=dat(),a=d.attendance||{},q=JSON.parse(lsGet(LS.quiz)||'{"r":0}'),B=[];
  if(lsGet(LS.ci)||TODAY)B.push(["📸",t("bFirst")]);if(streak()>=5)B.push(["🔥",t("bStreak")]);if(a.total>=5&&(a.pct||0)>=90)B.push(["🏅",t("bStar")]);if(q.r>=20)B.push(["🈁",t("bKana")]);if(d.fee&&d.due<=0)B.push(["💎",t("bFee")]);
  return B.length?'<div class="badges">'+B.map(function(b,i){return '<span class="bdg" style="animation-delay:'+(i*.08)+'s">'+b[0]+' '+esc(b[1])+'</span>';}).join("")+'</div>':'';}
var WD={en:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],bn:["রবি","সোম","মঙ্গল","বুধ","বৃহঃ","শুক্র","শনি"]};
function t12(x){if(!x)return "";var p=x.split(":").map(Number);return ((p[0]%12)||12)+":"+String(p[1]).padStart(2,"0")+(p[0]<12?" AM":" PM");}
function dayInfo(ds){var sc=dat().sched;if(!sc)return null;var dw=new Date(ds+"T12:00:00").getDay(),r={on:!!(sc.days||[])[dw],start:sc.start,end:sc.end,room:sc.room,type:"",reason:""};
  (CHG||[]).filter(function(c){return c.date===ds;}).sort(function(a,b){return (a.batch?1:0)-(b.batch?1:0);}).forEach(function(c){if(c.type==="off"||c.type==="holiday")r={on:false,type:c.type,reason:c.reason||""};else r={on:true,start:c.start||sc.start,end:c.start?(c.end||""):sc.end,room:sc.room,type:c.type,reason:c.reason||""};});return r;}
function nextOn(from){for(var i=0;i<30;i++){var d=ldAdd(from,i),x=dayInfo(d);if(x&&x.on)return [d,x];}return null;}
function todayCard(){var sc=dat().sched;if(!sc)return nextClass();var td=today(),r=dayInfo(td),now=new Date(),cur=now.getHours()*60+now.getMinutes(),html="";
  var mins=function(x){if(!x)return null;var p=x.split(":").map(Number);return p[0]*60+p[1];};
  if(r.on){var st=mins(r.start),en=mins(r.end)||(st!=null?st+120:null),df=st!=null?st-cur:null;
    var line=df!=null&&df>0?'⏳ '+t("startsIn")+' <b>'+(df>=60?Math.floor(df/60)+"h ":"")+(df%60)+'m</b>':(en!=null&&cur<en?'🔴 '+t("inProgress"):'✅ '+t("classDone"));
    html='<div class="tc on"><div class="tcIc">🏫</div><div><b>'+t("classToday")+'</b><div class="tcT">'+t12(r.start)+(r.end?' – '+t12(r.end):'')+(r.room?' · '+esc(r.room):'')+(r.type==="extra"?' · ➕ '+t("extra"):r.type==="time"?' · ⏰ '+t("changed"):'')+'</div><small>'+line+(r.reason?' · '+esc(r.reason):'')+'</small></div></div>';}
  else{var n=nextOn(ldAdd(td,1));html='<div class="tc '+(r.type?"hol":"off")+'"><div class="tcIc">'+(r.type==="holiday"?"🎌":r.type==="off"?"🚫":"😌")+'</div><div><b>'+(r.type==="holiday"?t("holidayToday"):r.type==="off"?t("offToday"):t("noClassToday"))+'</b>'+(r.reason?'<div class="tcT">'+esc(r.reason)+'</div>':'')+(n?'<small>'+t("nextClassOn")+' '+WD[lang][new Date(n[0]+"T12:00:00").getDay()]+', '+n[0].slice(8)+'/'+n[0].slice(5,7)+' · '+t12(n[1].start)+'</small>':'')+'</div></div>';}
  var strip='<div class="wk">'+[0,1,2,3,4,5,6].map(function(i){var d=ldAdd(td,i),x=dayInfo(d),dw=new Date(d+"T12:00:00").getDay();return '<div class="wd '+(x.on?(x.type?"ex":"on"):(x.type?"hol":"off"))+(i===0?" now":"")+'"><span>'+WD[lang][dw]+'</span><b>'+d.slice(8)+'</b><i></i></div>';}).join("")+'</div>';
  return '<div class="card tcCard" data-act="sched"><div class="ciRow"><h3>📅 '+t("myRoutine")+'</h3><span class="lnk2">'+t("fullCal")+' ›</span></div>'+html+strip+'</div>';}
function openSched(){if($("schS"))return;var m=document.createElement("div");m.id="schS";m.className="sheet";document.body.appendChild(m);CALM=0;drawSched();requestAnimationFrame(function(){m.classList.add("on");});m.onclick=function(e){if(e.target===m){m.classList.remove("on");setTimeout(function(){m.remove();},300);}};}
function drawSched(){var m=$("schS");if(!m)return;var base=new Date();base.setDate(1);base.setMonth(base.getMonth()+CALM);var y=base.getFullYear(),mo=base.getMonth(),first=new Date(y,mo,1).getDay(),nd=new Date(y,mo+1,0).getDate(),td=today(),sc=dat().sched||{};
  var cells="";for(var i=0;i<first;i++)cells+='<div></div>';
  for(var d=1;d<=nd;d++){var ds=y+"-"+String(mo+1).padStart(2,"0")+"-"+String(d).padStart(2,"0"),x=dayInfo(ds);cells+='<div class="cd '+(x?(x.on?(x.type?"ex":"on"):(x.type?"hol":"off")):"off")+(ds===td?" now":"")+'" title="'+esc(x&&x.reason||"")+'">'+d+(x&&x.type?'<i></i>':'')+'</div>';}
  var up=(CHG||[]).filter(function(c){return c.date>=td;}).sort(function(a,b){return String(a.date).localeCompare(String(b.date));}).slice(0,8);
  m.innerHTML='<div class="sheetIn"><div class="grab"></div><div class="calH"><button class="ib dark" id="cPrev">‹</button><b>'+base.toLocaleDateString(lang==="bn"?"bn-BD":"en-GB",{month:"long",year:"numeric"})+'</b><button class="ib dark" id="cNext">›</button></div>'+
   '<div class="calG">'+WD[lang].map(function(w){return '<div class="cw">'+w+'</div>';}).join("")+cells+'</div>'+
   '<div class="legend"><span class="on">'+t("lgClass")+'</span><span class="ex">'+t("lgExtra")+'</span><span class="hol">'+t("lgHol")+'</span><span class="off">'+t("lgNo")+'</span></div>'+
   '<div class="card" style="margin-top:10px"><b>🕘 '+t("weekly")+'</b><div class="wk2">'+WD[lang].map(function(w,i){return '<span class="'+((sc.days||[])[i]?"on":"")+'">'+w+'</span>';}).join("")+'</div><small class="muted">'+t12(sc.start)+(sc.end?' – '+t12(sc.end):'')+(sc.room?' · '+esc(sc.room):'')+'</small></div>'+
   (up.length?'<div class="card"><b>📌 '+t("upcomingChg")+'</b>'+up.map(function(c){return '<div class="row"><div>'+esc(c.date)+'<small>'+esc(c.reason||"")+'</small></div><span class="pill '+(c.type==="extra"||c.type==="time"?"p-ok":"p-bad")+'">'+({off:"🚫",holiday:"🎌",extra:"➕",time:"⏰"}[c.type]||"")+' '+t("ct_"+c.type)+(c.start?' '+t12(c.start):'')+'</span></div>';}).join("")+'</div>':'')+
   '<button class="btn ghost" id="cClose">OK</button></div>';
  $("cPrev").onclick=function(e){e.stopPropagation();CALM--;drawSched();};$("cNext").onclick=function(e){e.stopPropagation();CALM++;drawSched();};$("cClose").onclick=function(){m.classList.remove("on");setTimeout(function(){m.remove();},300);};}
function nextClass(){var c=dat().cls||{},m=String(c.time||"").match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);if(!m)return "";var h=+m[1],mi=+(m[2]||0),ap=(m[3]||"").toLowerCase();if(ap==="pm"&&h<12)h+=12;if(ap==="am"&&h===12)h=0;
  var now=new Date(),st=h*60+mi,cur=now.getHours()*60+now.getMinutes(),df=st-cur;if(df>0&&df<=600)return '<div class="nextc"><span class="dotp"></span>⏰ '+t("nextClass")+' <b>'+(df>=60?Math.floor(df/60)+"h ":"")+(df%60)+"m"+'</b> · '+esc(c.time)+'</div>';if(df<=0&&df>-120)return '<div class="nextc live"><span class="dotp"></span>🏫 '+t("inProgress")+' · '+esc(c.time)+'</div>';return "";}
function vHome(){
  var d=dat(),a=d.attendance||{},pct=d.fee?Math.min(100,Math.round(d.paid/d.fee*100)):0,ni=nextInst(d),nn=myNotices().slice(0,2),sk=streak(),jl=jlptDays(),w=wod();
  return '<div class="card hero"><div class="orb o1"></div><div class="orb o2"></div>'+(D.photo?'<img class="heroAv" src="'+D.photo+'" alt="">':'')+'<h2>'+t("hello")+', '+esc((d.name||"").split(" ")[0])+' 👋</h2><p>'+esc([d.course,d.batch].filter(Boolean).join(" · "))+'</p>'+
   '<div class="stats"><div class="stat"><b class="cntv" data-v="'+(d.fee||0)+'">'+money(d.fee,d.currency)+'</b><span>'+t("totalFee")+'</span></div><div class="stat"><b class="cntv" data-v="'+(d.paid||0)+'">'+money(d.paid,d.currency)+'</b><span>'+t("paid")+'</span></div><div class="stat"><b class="cntv" data-v="'+(d.due||0)+'">'+money(d.due,d.currency)+'</b><span>'+t("due")+'</span></div></div></div>'+
   quickRow()+todayCard()+ciCard()+badges()+
   '<div class="minis"><div class="mini"><b>🔥 '+sk+'</b><span>'+t("streak")+'</span></div><div class="mini"><b>🗾 '+jl[0]+'</b><span>'+t("jlptCd")+'</span></div><div class="mini"><b>'+(a.total?(a.pct||0)+'%':'—')+'</b><span>'+t("attendance")+'</span></div></div>'+
   '<div class="card"><h3>💳 '+pct+'% '+t("paidPct")+'</h3><div class="bar"><i style="width:'+pct+'%"></i></div>'+
   (ni?'<div class="row"><div>'+t("nextInst")+'<small>'+esc(ni.title)+' · '+esc(ni.due)+'</small></div><b>'+money(ni.amount,d.currency)+'</b></div>':'')+(d.due>0?payBtn():'')+'</div>'+
   '<div class="card wod" data-act="flip"><div class="wodIn"><div class="wf"><small>🌸 '+t("wod")+'</small><div class="jp">'+esc(w[0])+'</div><div class="kn">'+esc(w[1])+'</div><small class="muted">'+t("tapFlip")+'</small></div><div class="wb"><div class="rm">'+esc(w[2])+'</div><div class="mn">'+esc(lang==="bn"?w[4]:w[3])+'</div></div></div></div>'+
   (d.cls&&d.cls.name?'<div class="card"><h3>🏫 '+t("cls")+'</h3><div class="grid2">'+kv(t("batch"),d.cls.name)+kv(t("teacher"),d.cls.teacher)+kv(t("shift"),[d.cls.shift,d.cls.time].filter(Boolean).join(" "))+kv(t("start"),d.cls.start)+'</div></div>':'')+
   (nn.length?'<div class="card"><h3>📢 '+t("notices")+'</h3>'+nn.map(function(n){return '<div class="row"><div>'+(n.pin?"📌 ":"")+esc(n.title)+'<small>'+esc(n.date)+'</small></div></div>';}).join("")+'</div>':'')+
   '<div class="out">'+t("updated")+': '+esc(String(D.updatedAt||"").slice(0,16).replace("T"," "))+'</div>';
}
function kv(k,v){return '<div class="kv"><span>'+esc(k)+'</span>'+esc(v||"—")+'</div>';}
function vFees(){
  var d=dat(),I=d.installments||[],P=d.payments||[];
  return '<div class="card"><div class="grid2">'+kv(t("totalFee"),money(d.fee,d.currency))+kv(t("paid"),money(d.paid,d.currency))+kv(t("due"),money(d.due,d.currency))+kv(t("enroll"),d.enroll)+'</div>'+payBtn()+'</div>'+
   '<div class="card"><h3>🗓 '+t("inst")+'</h3>'+(I.length?I.map(function(i){var s=instState(i);return '<div class="row"><div>'+esc(i.title||"—")+'<small>'+esc(i.due)+'</small></div><div style="text-align:right"><b>'+money(i.amount,d.currency)+'</b><br><span class="pill '+s[0]+'">'+s[1]+'</span></div></div>';}).join(""):'<div class="empty">'+t("none")+'</div>')+'</div>'+
   '<div class="card"><h3>🧾 '+t("payHist")+'</h3>'+(P.length?P.map(function(p){return '<div class="row"><div>'+esc(p.date)+'<small>'+esc(p.method||"")+(p.receipt?' · '+t("receipt")+' '+esc(p.receipt):'')+'</small></div><b style="color:var(--ok)">'+money(p.amount,d.currency)+'</b></div>';}).join(""):'<div class="empty">'+t("none")+'</div>')+'</div>';
}
function vAtt(){
  var d=dat(),a=d.attendance||{},T2=d.tests||[];
  var st={Present:"P",Late:"L",Absent:"A",Leave:"V"};
  var hist=(HIST||[]).map(function(r){var s=r.status,io=tsDate(r.inTs)||tsDate(r.inAt),oo=tsDate(r.outTs)||tsDate(r.outAt);var p=!s?'<span class="pill p-mut">—</span>':s==="Approved"?'<span class="pill p-ok">✅ '+esc(t((r.mark||"Present").toLowerCase()))+'</span>':s==="Rejected"?'<span class="pill p-bad">✗</span>':'<span class="pill p-warn">⏳</span>';return '<div class="row"><div>'+esc(r.date)+(s?'<small>'+t("inT")+' '+hm(io)+(oo?' · '+t("outT")+' '+hm(oo):'')+'</small>':'')+'</div>'+p+'</div>';}).join("");
  var ring=a.total?(a.pct||0):0;
  return '<div class="card"><div class="ringWrap"><div class="ring" style="--p:'+ring+'"><b>'+(a.total?ring+'%':'—')+'</b></div><div class="grid2" style="flex:1">'+kv(t("present"),a.present||0)+kv(t("late"),a.late||0)+kv(t("absent"),a.absent||0)+kv(t("leave"),a.leave||0)+'</div></div></div>'+lvCard()+
   '<div class="card"><h3>📸 '+t("myCheckins")+'</h3>'+(HIST?hist:'<div class="empty">'+t("waitMsg")+'</div>')+'</div>'+
   '<div class="card"><h3>'+t("recent")+'</h3>'+((a.recent||[]).length?'<div class="dots">'+a.recent.slice().reverse().map(function(r){return '<div class="dot d-'+esc(r.status)+'" title="'+esc(r.date+" "+r.status)+'">'+(st[r.status]||"?")+'</div>';}).join("")+'</div><div class="out" style="margin-top:8px;text-align:left">P='+t("present")+' · L='+t("late")+' · A='+t("absent")+' · V='+t("leave")+'</div>':'<div class="empty">'+t("none")+'</div>')+'</div>'+
   '<div class="card"><h3>📝 '+t("myTests")+'</h3>'+(T2.length?T2.map(function(x){var ok=/pass/i.test(x.status),bad=/fail/i.test(x.status);return '<div class="row"><div>'+esc([x.exam,x.level].filter(Boolean).join(" "))+'<small>'+esc(x.date)+(x.score?' · '+esc(x.score):'')+'</small></div><span class="pill '+(ok?"p-ok":bad?"p-bad":"p-mut")+'">'+esc(x.status||"—")+'</span></div>';}).join(""):'<div class="empty">'+t("none")+'</div>')+'</div>'+
   ((d.jlpt||d.visa||d.app||d.docs||d.stage)?'<div class="card"><h3>🎯 '+t("progress")+'</h3><div class="grid2">'+(d.stage?kv(t("stage"),d.stage):'')+(d.jlpt?kv(t("jlpt"),d.jlpt):'')+(d.docs?kv(t("docs"),d.docs):'')+(d.app?kv(t("app"),d.app):'')+(d.visa?kv(t("visa"),d.visa):'')+'</div></div>':'');
}
function lvCard(){var mx=ldAdd(today(),30),L=LEAVES;
  return '<div class="card lv"><h3>🌴 '+t("leaveReq")+'</h3><div class="lvf"><label>'+t("leaveDate")+'<input type="date" id="lv_date" min="'+today()+'" max="'+mx+'" value="'+today()+'"></label><label>'+t("leaveWhy")+'<textarea id="lv_why" rows="2" maxlength="300" placeholder="e.g. sick / family program"></textarea></label><button class="btn" id="lv_btn" data-act="leave">📨 '+t("leaveSend")+'</button></div>'+
   (L&&L.length?'<h4 class="muted" style="margin:14px 0 4px">'+t("leaveMine")+'</h4>'+L.map(function(l){var p=l.status==="Approved"?'<span class="pill p-ok">✅ '+t("ciApproved")+'</span>':l.status==="Rejected"?'<span class="pill p-bad">✗ '+t("ciRejected")+(l.note?" — "+esc(l.note):"")+'</span>':l.status==="Cancelled"?'<span class="pill p-mut">'+t("cancelled")+'</span>':'<span class="pill p-warn">⏳ '+t("pending")+'</span> <button class="lnk" data-act="lvc" data-d="'+esc(l.date)+'">'+t("cancel")+'</button>';return '<div class="row"><div>'+esc(l.date)+'<small>'+esc(l.reason||"")+'</small></div><div style="text-align:right">'+p+'</div></div>';}).join(""):"")+'</div>';}
function vNotices(){
  var L=myNotices();
  return L.length?L.map(function(n){return '<div class="card notice'+(n.pin?" pin":"")+(n.type==="p"?" post":"")+'">'+(n.type==="p"?'<div class="pHead"><span class="pAv">👩‍🏫</span><div><b>'+esc(n.by||"Teacher")+'</b><small>'+esc(n.date)+' · '+esc(n.tag)+(n.edited?' · '+t("edited"):'')+'</small></div></div>':'')+'<b>'+(n.pin?"📌 ":"")+esc(n.title)+'</b>'+(n.type==="n"?'<br><small>'+esc(n.date)+' · '+esc(n.tag)+'</small>':'')+'<p>'+esc(n.body)+'</p>'+(n.image?'<img class="pImg" src="'+n.image+'" data-act="zoomimg" alt="">':'')+'</div>';}).join(""):'<div class="card empty">'+t("noNotice")+'</div>';
}
/* ---- kana quiz ---- */
var QZ=null;
function newQ(){var a=KANA[Math.floor(Math.random()*KANA.length)],opts=[a[1]];while(opts.length<4){var o=KANA[Math.floor(Math.random()*KANA.length)][1];if(opts.indexOf(o)<0)opts.push(o);}opts.sort(function(){return Math.random()-.5;});return {k:a[0],a:a[1],o:opts,ans:null};}
function kanaAnswer(v){if(!QZ||QZ.ans)return;QZ.ans=v;KSTREAK=v===QZ.a?KSTREAK+1:0;if(KSTREAK&&KSTREAK%5===0)confetti();var s=JSON.parse(lsGet(LS.quiz)||'{"r":0,"n":0}');s.n++;if(v===QZ.a)s.r++;lsSet(LS.quiz,JSON.stringify(s));try{navigator.vibrate&&navigator.vibrate(v===QZ.a?30:[60,40,60]);}catch(e){}render();}
function vKana(){if(!QZ)QZ=newQ();var s=JSON.parse(lsGet(LS.quiz)||'{"r":0,"n":0}');
  return '<div class="card"><div class="ciRow"><h3>🈁 '+t("kana")+'</h3><span class="pill p-mut">'+t("score")+' '+s.r+'/'+s.n+'</span></div><div class="kanaBig">'+QZ.k+'</div><div class="muted" style="text-align:center;margin-bottom:8px">'+t("kanaQ")+'</div><div class="kopts">'+QZ.o.map(function(o){var c=QZ.ans?(o===QZ.a?" ok":(o===QZ.ans?" bad":"")):"";return '<button class="kopt'+c+'" data-act="kana" data-v="'+o+'">'+o+'</button>';}).join("")+'</div>'+
   (QZ.ans?'<div class="kres">'+(QZ.ans===QZ.a?"🎉 "+t("correct"):"😅 "+t("wrong")+" <b>"+QZ.a+"</b>")+'</div><button class="btn" data-act="knext">'+t("next")+' →</button>':'')+'</div>';}
function bars(sid){var h="",s=String(sid||"GIA");for(var i=0;i<s.length*3;i++){var c=s.charCodeAt(i%s.length)+i*7;h+='<i style="width:'+(1+c%3)+'px;margin-right:'+(1+(c>>2)%3)+'px"></i>';}return h;}
function qrSvg(txt){try{var q=qrcode(0,"M");q.addData(txt);q.make();return q.createSvgTag(4,0);}catch(e){return "";}}
function vId(d,sf){var ph=(D&&D.photo)||sf||"",ok=!/block|inactive/i.test(d.status||"");
  var front='<div class="idF"><div class="idTop"><img src="../logomark.png" onerror="this.style.display=\'none\'" alt=""><div><b>Galaxy International Academy</b><small>銀河国際アカデミー · STUDENT ID</small></div></div><div class="idMid">'+(ph?'<img class="idPh" src="'+ph+'" alt="">':'<div class="idPh ini">'+esc((d.name||"?").charAt(0))+'</div>')+'<div style="min-width:0"><div class="idN">'+esc(d.name||"")+'</div><div class="idS">'+esc(d.sid||"")+'</div><div class="idC">'+esc([d.course,d.batch].filter(Boolean).join(" · "))+'</div><div class="idC">'+t("validTill")+': <b>'+esc(d.validTill||"—")+'</b></div><span class="idSt '+(ok?"ok":"no")+'">'+(ok?"● ACTIVE":"● INACTIVE")+'</span></div></div>'+
   (d.vcode?'<div class="idQ"><div class="qr">'+qrSvg("https://giabd.com/verify/?c="+d.vcode)+'</div><div><b>'+t("scanVerify")+'</b><small>giabd.com/verify · '+esc(d.vcode)+'</small></div></div>':'<div class="idBar">'+bars(d.sid)+'</div>')+'<div class="idFoot">'+t("tapFlip2")+'</div></div>';
  var back='<div class="idB"><b>'+t("idRules")+'</b><ol><li>'+t("r1")+'</li><li>'+t("r2")+'</li><li>'+t("r3")+'</li></ol><div class="idC">📞 '+PHONE+'<br>🌐 giabd.com<br>📍 Agrabad Access Road, Chattogram</div><div class="idFoot">'+t("tapFlip2")+'</div></div>';
  return '<div class="idWrap" data-act="flip"><div class="idc idIn">'+front+back+'</div></div>';}
function vMore(){
  var d=dat(),sf=lsGet(LS.selfie),perm=(window.Notification&&Notification.permission)||"default";
  return vId(d,sf)+
   vKana()+
   '<div class="card"><h3>📚 '+t("tools")+'</h3><div class="links"><a href="'+SITE+'n5-mock-test.html"><span>📝</span>'+t("mock")+'</a><a href="'+SITE+'checklist.html"><span>✅</span>'+t("check")+'</a><a href="'+SITE+'eligibility.html"><span>🎌</span>'+t("elig")+'</a><a href="'+SITE+'"><span>🌐</span>'+t("web")+'</a></div></div>'+
   '<div class="card"><h3>☎ '+t("contact")+'</h3><div class="links"><a href="tel:'+PHONE+'"><span>📞</span>'+t("call")+' '+PHONE+'</a><a href="https://wa.me/'+WA+'" target="_blank" rel="noopener"><span>💬</span>'+t("wa")+'</a></div></div>'+
   themePicker()+'<div class="card"><div class="row"><span>🌙 '+t("dark")+'</span><button class="sw'+(lsGet(LS.dark)==="1"?" on":"")+'" data-act="dark"><i></i></button></div>'+
   (window.Notification?'<div class="row"><span>🔔 '+t("notif")+'</span>'+(perm==="granted"?'<span class="pill p-ok">'+t("notifOn")+'</span>':'<button class="btn sm" data-act="notif">'+t("enable")+'</button>')+'</div>':'')+
   '<div class="row"><span>🌐 Language</span><button class="btn sm ghost" data-act="lang">EN / বাংলা</button></div></div>'+
   '<div class="out"><button id="btnOut">'+t("logout")+'</button></div>';
}
function legacy(){var h=D.html||{};return '<div class="card">'+(h.i||"")+'</div><div class="card">'+(h.p||"")+'</div><div class="card">'+(h.a||"")+'</div><div class="out"><button id="btnOut">'+t("logout")+'</button></div>';}
/* ---- camera (live only — gallery upload not allowed) ---- */
var CAM={stream:null,geo:null,mode:"in",photo:null,code:""};
function haversine(a,b,c,d){var R=6371000,r=Math.PI/180,x=(c-a)*r,y=(d-b)*r,h=Math.sin(x/2)*Math.sin(x/2)+Math.cos(a*r)*Math.cos(c*r)*Math.sin(y/2)*Math.sin(y/2);return 2*R*Math.asin(Math.sqrt(h));}
function camClose(){try{CAM.stream&&CAM.stream.getTracks().forEach(function(x){x.stop();});}catch(e){}CAM.stream=null;var m=$("cam");if(m)m.remove();}
async function openCam(mode){
  CAM.mode=mode;CAM.photo=null;CAM.geo=null;CAM.code=Math.random().toString(36).slice(2,6).toUpperCase();
  var m=document.createElement("div");m.id="cam";m.className="cam";
  m.innerHTML='<div class="camTop"><b>'+t(mode==="in"?"camTitleIn":"camTitleOut")+'</b><button class="ib" id="camX">✕</button></div><div class="camView"><video id="camV" playsinline autoplay muted></video><img id="camP" hidden alt=""><div class="oval"></div><div class="cnt" id="camC"></div><div class="flash" id="camF"></div></div><div class="camInfo"><span id="camGeo">📍 '+t("locating")+'</span><small>'+t("camHint")+'</small></div><div class="camBtns" id="camB"><button class="shoot" id="camS" aria-label="'+t("shoot")+'"><i></i></button></div><canvas id="camK" hidden></canvas>';
  document.body.appendChild(m);$("camX").onclick=camClose;
  getGeo();
  try{CAM.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:720},height:{ideal:960}},audio:false});$("camV").srcObject=CAM.stream;}
  catch(e){$("camGeo").textContent="⚠ "+t("camErr");$("camB").innerHTML='<button class="btn" id="camX2">OK</button>';$("camX2").onclick=camClose;return;}
  $("camS").onclick=countdown;
}
function getGeo(){if(!navigator.geolocation){setGeo(null);return;}navigator.geolocation.getCurrentPosition(function(p){setGeo({lat:+p.coords.latitude.toFixed(6),lng:+p.coords.longitude.toFixed(6),acc:Math.round(p.coords.accuracy)});},function(){setGeo(null);},{enableHighAccuracy:true,timeout:12000,maximumAge:30000});}
function setGeo(g){CAM.geo=g;var c=ACFG||{},el=$("camGeo");CAM.dist=null;if(g&&c.lat!=null&&c.lng!=null)CAM.dist=Math.round(haversine(g.lat,g.lng,c.lat,c.lng));
  if(!el)return;if(!g){el.textContent="📍 "+t("locNo");el.className="warn";return;}
  if(CAM.dist!=null&&CAM.dist>(c.radius||300)){el.textContent="📍 "+t("locFar")+" ("+(CAM.dist>=1000?(CAM.dist/1000).toFixed(1)+" km":CAM.dist+" m")+")";el.className="bad";}
  else{el.textContent="📍 "+t("locOk")+(CAM.dist!=null?" · "+CAM.dist+" m":"")+" (±"+g.acc+" m)";el.className="ok";}}
function countdown(){var n=3,c=$("camC");$("camS").disabled=true;c.textContent=n;c.classList.add("on");var iv=setInterval(function(){n--;if(n>0){c.textContent=n;}else{clearInterval(iv);c.classList.remove("on");c.textContent="";capture();}},800);}
function capture(){
  var v=$("camV"),k=$("camK"),W=480,H=640;k.width=W;k.height=H;var x=k.getContext("2d");if(!x)return;
  var vw=v.videoWidth||W,vh=v.videoHeight||H,s=Math.max(W/vw,H/vh),dw=vw*s,dh=vh*s;
  x.drawImage(v,(W-dw)/2,(H-dh)/2,dw,dh);
  var d=dat(),now=new Date(),g=CAM.geo;
  var grd=x.createLinearGradient(0,H-118,0,H);grd.addColorStop(0,"rgba(15,37,68,0)");grd.addColorStop(.35,"rgba(15,37,68,.82)");grd.addColorStop(1,"rgba(15,37,68,.95)");x.fillStyle=grd;x.fillRect(0,H-118,W,118);
  x.fillStyle="#c9a24a";x.fillRect(0,H-4,W,4);
  x.fillStyle="#fff";x.font="bold 20px sans-serif";x.fillText((d.name||"").slice(0,30),14,H-78);
  x.font="15px sans-serif";x.fillText((d.sid||"")+"  ·  "+(CAM.mode==="in"?"CHECK-IN":"CHECK-OUT")+"  ·  #"+CAM.code,14,H-55);
  x.fillText(now.toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}),14,H-33);
  x.fillStyle="rgba(255,255,255,.75)";x.font="13px sans-serif";x.fillText(g?("📍 "+g.lat+", "+g.lng+(CAM.dist!=null?"  ("+CAM.dist+" m)":"")):"📍 no location",14,H-13);
  x.fillStyle="rgba(255,255,255,.9)";x.font="bold 14px sans-serif";x.textAlign="right";x.fillText("GIA",W-14,26);x.textAlign="left";
  CAM.photo=k.toDataURL("image/jpeg",.62);
  var f=$("camF");f.classList.add("on");setTimeout(function(){f.classList.remove("on");},250);
  $("camP").src=CAM.photo;$("camP").hidden=false;$("camV").hidden=true;
  try{CAM.stream.getTracks().forEach(function(x){x.stop();});}catch(e){}
  $("camB").innerHTML='<button class="btn ghost" id="camR">↺ '+t("retake")+'</button><button class="btn" id="camOk">✓ '+t("submit")+'</button>';
  $("camR").onclick=function(){var md=CAM.mode;camClose();openCam(md);};$("camOk").onclick=submitCam;
}
async function submitCam(){
  var c=ACFG||{},b=$("camOk");
  if(c.requireGeo&&c.lat!=null&&(CAM.dist==null||CAM.dist>(c.radius||300))){toast("⚠ "+t("farBlock"));return;}
  b.disabled=true;b.textContent=t("sending");
  var d=dat(),ref=attRef(),nowIso=new Date().toISOString();
  try{
    if(CAM.mode==="in"){
      await ref.set({key:lsGet(LS.key),sid:String(d.sid||D.sid||""),name:String(d.name||D.name||"").slice(0,120),batch:String(d.batch||""),course:String(d.course||""),date:today(),inAt:nowIso,inTs:SV(),inPhoto:CAM.photo,inGeo:CAM.geo||null,inDist:CAM.dist==null?null:CAM.dist,inCode:CAM.code,device:String(navigator.userAgent||"").slice(0,150),status:"Pending"});
    } else {
      await ref.update({outAt:nowIso,outTs:SV(),outPhoto:CAM.photo,outGeo:CAM.geo||null,outDist:CAM.dist==null?null:CAM.dist});
    }
    lsSet(LS.selfie,CAM.photo);lsSet(LS.ci,"1");camClose();toast("✅ "+t("sent"));try{navigator.vibrate&&navigator.vibrate(80);}catch(e){}
    await fetchToday();HIST=null;render();
  }catch(e){b.disabled=false;b.textContent=t("submit");
    if(/permission/i.test(String(e&&(e.code||e.message)))){await fetchToday();if(TODAY){camClose();toast(t("already"));render();return;}}
    toast("⚠ "+t("errNet"));}
}
function toggleLang(){lang=lang==="en"?"bn":"en";lsSet(LS.lang,lang);applyStatic();if(D)render();}
var deferred=null;
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e;$("installBtn").hidden=false;});
async function install(){if(deferred){deferred.prompt();try{await deferred.userChoice;}catch(e){}deferred=null;$("installBtn").hidden=true;}}
window.GIA={asst:function(){openAsst();},_answer:function(q){return answer(q);},toggleLang:toggleLang,refresh:refresh,install:install,_keyOf:keyOf,_state:function(){return {D:D,N:N,tab:tab,TODAY:TODAY,HIST:HIST,CAM:CAM,ACFG:ACFG};},go:go,_capture:capture,_submit:submitCam,_open:openCam,_kana:kanaAnswer};
/* ---- GIA Assistant (rule-based, free, private: runs on the phone) ---- */
function A_(bn,en){return lang==="bn"?bn:en;}
function nf(n){return "৳ "+Math.round(Number(n||0)).toLocaleString("en-IN");}
function answer(q){var Q=String(q||"").toLowerCase(),d=dat(),a=d.attendance||{},F=FAQ||{},has=function(w){return w.some(function(x){return Q.indexOf(x)>=0;});};
  var L=[],btn=[];
  if(has(["due","বকেয়া","বাকি","কিস্তি","installment","কত টাকা বাকি","আমার ফি"])){var ni=nextInst(d);L.push(A_("তোমার মোট ফি "+nf(d.fee)+", পরিশোধ "+nf(d.paid)+", বকেয়া "+nf(d.due)+"।","Your total fee is "+nf(d.fee)+", paid "+nf(d.paid)+", due "+nf(d.due)+"."));if(ni)L.push(A_("পরের কিস্তি: "+nf(ni.amount)+" — "+ni.due,"Next installment: "+nf(ni.amount)+" — due "+ni.due));btn.push(["fees","💳 "+t("fees")]);}
  else if(has(["fee","ফি","খরচ","cost","price","দাম","কোর্স"])){var C=(F.courses||[]);L.push(C.length?A_("কোর্স ফি:","Course fees:")+"\n"+C.map(function(c){return "• "+c.n+" — "+nf(c.f);}).join("\n"):A_("কোর্স ফি জানতে অফিসে যোগাযোগ করো।","Please contact the office for course fees."));L.push(A_("ডিসকাউন্ট/কিস্তির জন্য অফিসে কথা বলো।","Ask the office about discounts or installments."));}
  if(!L.length&&d.sched&&has(["class","ক্লাস","routine","রুটিন","আজ","today","tomorrow","কাল","বন্ধ","off","holiday","ছুটির দিন"])){var r0=dayInfo(today()),n0=nextOn(ldAdd(today(),r0&&r0.on?1:0));L.push(r0.on?A_("আজ ক্লাস আছে: "+t12(r0.start)+(r0.end?" – "+t12(r0.end):"")+(r0.room?" ("+r0.room+")":"")+"।","Class today: "+t12(r0.start)+(r0.end?" – "+t12(r0.end):"")+(r0.room?" ("+r0.room+")":"")+"."):A_("আজ ক্লাস নেই"+(r0.reason?" — "+r0.reason:"")+"।","No class today"+(r0.reason?" — "+r0.reason:"")+"."));if(n0)L.push(A_("পরের ক্লাস: ","Next class: ")+n0[0]+" · "+t12(n0[1].start));btn.push(["home","📅 "+t("myRoutine")]);}
  if(!L.length&&has(["class","ক্লাস","সময়","time","teacher","শিক্ষক","batch","ব্যাচ","routine"])){var c=d.cls||{};L.push(c.name?A_("তোমার ব্যাচ "+c.name+"। সময়: "+([c.shift,c.time].filter(Boolean).join(" ")||"অফিস থেকে জেনে নাও")+"। শিক্ষক: "+(c.teacher||"—"),"Your batch is "+c.name+". Time: "+([c.shift,c.time].filter(Boolean).join(" ")||"ask the office")+". Teacher: "+(c.teacher||"—")):A_("তোমার ব্যাচ এখনো সেট হয়নি — অফিসে জানাও।","Your batch isn't set yet — please tell the office."));}
  if(!L.length&&has(["attend","উপস্থিতি","absent","অনুপস্থিত","present"])){L.push(a.total?A_("তোমার উপস্থিতি "+(a.pct||0)+"% — উপস্থিত "+a.present+", দেরি "+a.late+", অনুপস্থিত "+a.absent+(a.leave?", ছুটি "+a.leave:"")+"।","Your attendance is "+(a.pct||0)+"% — present "+a.present+", late "+a.late+", absent "+a.absent+"."):A_("এখনো কোনো উপস্থিতি রেকর্ড নেই।","No attendance records yet."));if(a.total&&(a.pct||0)<80)L.push(A_("৮০%-এর উপরে রাখার চেষ্টা করো 💪","Try to keep it above 80% 💪"));btn.push(["att","📅 "+t("att")]);}
  if(!L.length&&has(["jlpt","exam","পরীক্ষা","nat","jft","test"])){var j=jlptDays();L.push(A_("পরের JLPT: "+j[1].toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})+" (আর "+j[0]+" দিন)। রেজিস্ট্রেশনের তারিখ অফিস থেকে জেনে নাও।","Next JLPT: "+j[1].toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})+" ("+j[0]+" days left). Ask the office for registration dates."));btn.push(["link:"+SITE+"n5-mock-test.html","📝 "+t("mock")]);}
  if(!L.length&&has(["leave","ছুটি","sick","অসুস্থ"])){L.push(A_("উপস্থিতি ট্যাবে গিয়ে 'ছুটির আবেদন' — তারিখ ও কারণ দিয়ে পাঠাও। শিক্ষক অনুমোদন করলে জানতে পারবে।","Go to Attendance → 'Apply for leave', choose the date and reason. You'll see when your teacher approves."));btn.push(["att","🌴 "+t("leaveReq")]);}
  if(!L.length&&has(["check","selfie","সেলফি","চেক"])){L.push(A_("হোমে 'সেলফি দিয়ে চেক-ইন' চাপো → ক্যামেরায় মুখ বৃত্তের ভেতরে রাখো → জমা দাও। শিক্ষক অনুমোদন করবেন। ক্লাস শেষে চেক-আউট দিতে ভুলো না।","Tap 'Check in with selfie' on Home, keep your face in the circle and submit. Your teacher approves it. Don't forget to check out after class."));btn.push(["home","📸 "+t("home")]);}
  if(!L.length&&has(["pay","online","bkash","বিকাশ","নগদ","পেমেন্ট"])){L.push((PAY&&PAY.msg)||A_("অনলাইন পেমেন্ট এখন রক্ষণাবেক্ষণে আছে — অফিসে পেমেন্ট দাও।","Online payment is under maintenance — please pay at the office."));}
  if(!L.length&&has(["document","কাগজ","doc","passport","পাসপোর্ট","certificate"])){L.push(A_("দরকারি কাগজপত্রের পুরো চেকলিস্ট এখানে:","Here is the full document checklist:"));btn.push(["link:"+SITE+"checklist.html","✅ "+t("check")]);}
  if(!L.length&&has(["visa","ভিসা","ssw","japan","জাপান","job","চাকরি"])){L.push(A_("GIA জাপানে স্টুডেন্ট ভিসা ও SSW (Specified Skilled Worker)-এর জন্য গাইড করে। তোমার যোগ্যতা অনুযায়ী পরামর্শের জন্য কাউন্সেলরের সাথে কথা বলো।","GIA guides students for Japan student visas and SSW. Talk to a counsellor for advice based on your profile."));btn.push(["link:"+SITE+"eligibility.html","🎌 "+t("elig")]);}
  if(!L.length&&has(["contact","office","অফিস","ঠিকানা","address","phone","ফোন","যোগাযোগ","কোথায়","hours"])){L.push(A_("📍 "+(F.address||"Agrabad Access Road, Chattogram")+"\n📞 "+(F.phone||PHONE)+"\n🕒 রবি–বৃহস্পতি, সকাল ১০টা–বিকাল ৫টা","📍 "+(F.address||"Agrabad Access Road, Chattogram")+"\n📞 "+(F.phone||PHONE)+"\n🕒 "+(F.hours||"Sunday–Thursday, 10AM–5PM")));btn.push(["link:tel:"+PHONE,"📞 "+t("call")],["link:https://wa.me/"+WA,"💬 WhatsApp"]);}
  if(!L.length&&has(["hi","hello","হ্যালো","সালাম","assalam","hey"])){L.push(t("asstHi").replace("{n}",(d.name||"").split(" ")[0]));}
  if(!L.length&&has(["thank","ধন্যবাদ","thanks"])){L.push(A_("তোমাকেও ধন্যবাদ! পড়াশোনা চালিয়ে যাও — 頑張って! 🌸","You're welcome! Keep studying — 頑張って! 🌸"));}
  if(!L.length){L.push(A_("দুঃখিত, এটা আমি নিশ্চিত জানি না। অফিসে সরাসরি জিজ্ঞেস করো:","Sorry, I'm not sure about that. Please ask the office directly:"));btn.push(["link:tel:"+PHONE,"📞 "+t("call")],["link:https://wa.me/"+WA,"💬 WhatsApp"]);}
  return {text:L.join("\n"),btn:btn};}
var CHIPS={bn:["আমার বকেয়া","কোর্স ফি","ক্লাস কখন?","আমার উপস্থিতি","JLPT কবে?","ছুটি কীভাবে?","অফিসের ঠিকানা"],en:["My due","Course fees","Class time?","My attendance","When is JLPT?","How to take leave?","Office address"]};
function openAsst(){if($("asst"))return;var m=document.createElement("div");m.id="asst";m.className="sheet";
  if(!CHAT.length)CHAT.push({me:false,text:t("asstHi").replace("{n}",(dat().name||"").split(" ")[0]),btn:[]});
  m.innerHTML='<div class="sheetIn asIn"><div class="grab"></div><div class="asHead"><span class="asBot">🤖</span><div><b>'+t("asst")+'</b><small>'+t("asstNote")+'</small></div><button class="ib dark" id="asX">✕</button></div><div class="asLog" id="asLog"></div><div class="asChips" id="asChips"></div><div class="asIn2"><input id="asQ" placeholder="'+t("asstPh")+'"><button class="btn sm" id="asSend">➤</button></div></div>';
  document.body.appendChild(m);requestAnimationFrame(function(){m.classList.add("on");});
  var close=function(){m.classList.remove("on");setTimeout(function(){m.remove();},300);};$("asX").onclick=close;m.onclick=function(e){if(e.target===m)close();};
  $("asChips").innerHTML=(CHIPS[lang]||CHIPS.en).map(function(c){return '<button class="chip2">'+esc(c)+'</button>';}).join("");
  var cs=$("asChips").querySelectorAll(".chip2");for(var i=0;i<cs.length;i++)cs[i].onclick=function(){ask(this.textContent);};
  $("asSend").onclick=function(){ask($("asQ").value);};$("asQ").addEventListener("keydown",function(e){if(e.key==="Enter")ask(this.value);});drawChat();}
function ask(q){q=String(q||"").trim();if(!q)return;$("asQ").value="";CHAT.push({me:true,text:q});drawChat(true);setTimeout(function(){var r=answer(q);CHAT.push({me:false,text:r.text,btn:r.btn});drawChat();},550);}
function drawChat(typing){var l=$("asLog");if(!l)return;l.innerHTML=CHAT.slice(-30).map(function(c){return '<div class="msg '+(c.me?"me":"bot")+'"><div>'+esc(c.text).replace(/\n/g,"<br>")+'</div>'+((c.btn||[]).length?'<div class="mBtns">'+c.btn.map(function(b){return '<button class="mB" data-go="'+esc(b[0])+'">'+esc(b[1])+'</button>';}).join("")+'</div>':'')+'</div>';}).join("")+(typing?'<div class="msg bot typing"><i></i><i></i><i></i></div>':'');
  var bs=l.querySelectorAll(".mB");for(var i=0;i<bs.length;i++)bs[i].onclick=function(){var g=this.getAttribute("data-go");if(g.indexOf("link:")===0){location.href=g.slice(5);}else{var a=$("asst");if(a)a.remove();go(g);}};l.scrollTop=l.scrollHeight;}
function tiltFx(){var last=null;function reset(el){if(el){el.style.setProperty("--rx","0deg");el.style.setProperty("--ry","0deg");}}
  document.addEventListener("pointermove",function(e){var c=e.target.closest&&e.target.closest(".card,.mini,.idWrap");if(!c){if(last){reset(last);last=null;}return;}var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;c.style.setProperty("--gx",(x*100)+"%");c.style.setProperty("--gy",(y*100)+"%");
    var tl=e.target.closest(".tilt");if(tl&&document.body.classList.contains("glass")){if(last&&last!==tl)reset(last);last=tl;tl.style.setProperty("--rx",((.5-y)*7).toFixed(2)+"deg");tl.style.setProperty("--ry",((x-.5)*9).toFixed(2)+"deg");}},{passive:true});
  ["pointerup","pointercancel"].forEach(function(ev){document.addEventListener(ev,function(){reset(last);last=null;},{passive:true,capture:true});});}
/* ===== v7 · custom inner screens (Fees journey · Attendance studio · Notice feed · Me hub) ===== */
var NF="all", PREVSEEN="", LASTTAB="home", TABORDER=["home","fees","att","notices","more"];
var T7={en:{feeJourney:"Fee journey",paidOf:"paid",nextDue:"Next due",daysLeft:"days left",overdueBy:"overdue",allPaid:"All fees paid — thank you!",receipts:"Receipts",noReceipts:"No payments yet",step:"Installment",attStudio:"My attendance",lastClasses:"Last classes",streakT:"Current streak",daysW:"days",bestTip:"Come on time to keep your streak!",checkHist:"Check-in history",exams:"Exams & results",fAll:"All",fPin:"Pinned",fTeacher:"Teacher",fOffice:"Office",todayG:"Today",yestG:"Yesterday",earlierG:"Earlier",newB:"NEW",quick:"Quick actions",qCheck:"Check-in",qPay:"Pay",qLeave:"Leave",qRoutine:"Routine",qAsk:"Ask GIA",myId:"My ID card",settings:"Settings",study:"Study",pullR:"Release to refresh",openLeave:"Apply for leave",scoreT:"Score"},
 bn:{feeJourney:"ফি-এর যাত্রা",paidOf:"পরিশোধ",nextDue:"পরের কিস্তি",daysLeft:"দিন বাকি",overdueBy:"মেয়াদ পেরিয়েছে",allPaid:"সব ফি পরিশোধ — ধন্যবাদ!",receipts:"রসিদ",noReceipts:"এখনো কোনো পেমেন্ট নেই",step:"কিস্তি",attStudio:"আমার উপস্থিতি",lastClasses:"শেষ ক্লাসগুলো",streakT:"চলতি ধারা",daysW:"দিন",bestTip:"সময়মতো এসে ধারা ধরে রাখো!",checkHist:"চেক-ইন ইতিহাস",exams:"পরীক্ষা ও ফলাফল",fAll:"সব",fPin:"পিন করা",fTeacher:"শিক্ষক",fOffice:"অফিস",todayG:"আজ",yestG:"গতকাল",earlierG:"আগে",newB:"নতুন",quick:"দ্রুত কাজ",qCheck:"চেক-ইন",qPay:"পেমেন্ট",qLeave:"ছুটি",qRoutine:"রুটিন",qAsk:"GIA-কে জিজ্ঞেস",myId:"আমার আইডি কার্ড",settings:"সেটিংস",study:"পড়াশোনা",pullR:"ছেড়ে দিন — রিফ্রেশ",openLeave:"ছুটির আবেদন করুন",scoreT:"স্কোর"}};
function t7(k){return (T7[lang]&&T7[lang][k])||T7.en[k]||t(k);}
function daysTo(ds){if(!ds)return null;var a=new Date(today()+"T12:00:00"),b=new Date(ds+"T12:00:00");return Math.round((b-a)/864e5);}
function dmy(ds){if(!ds)return["",""];var d=new Date(ds+"T12:00:00");return [String(d.getDate()),d.toLocaleDateString(lang==="bn"?"bn-BD":"en-GB",{month:"short"})];}
/* ---------- quick actions (home) ---------- */
function quickRow(){var d=dat();var Q=[["ci","📸",t7("qCheck")],["paygo","💳",t7("qPay")],["leavego","🌴",t7("qLeave")],["sched","📅",t7("qRoutine")],["asst","💬",t7("qAsk")]];
  return '<div class="qa">'+Q.map(function(q,i){return '<button class="qaB" data-act="'+q[0]+'" style="animation-delay:'+(i*.05)+'s"><span>'+q[1]+'</span><small>'+esc(q[2])+'</small></button>';}).join("")+'</div>';}
/* ---------- FEES ---------- */
function vFees7(){var d=dat(),I=(d.installments||[]).slice().sort(function(a,b){return String(a.due).localeCompare(String(b.due));}),P=d.payments||[],pct=d.fee?Math.min(100,Math.round(d.paid/d.fee*100)):0,ni=nextInst(d),dl=ni?daysTo(ni.due):null;
  var chip=d.due<=0?'<div class="dueChip ok">🎉 '+t7("allPaid")+'</div>':(ni?'<div class="dueChip '+(dl!=null&&dl<0?"bad":dl!=null&&dl<=7?"warn":"")+'">⏳ '+t7("nextDue")+': <b>'+money(ni.amount,d.currency)+'</b> · '+(dl==null?esc(ni.due):dl<0?Math.abs(dl)+" "+t7("daysW")+" "+t7("overdueBy"):dl+" "+t7("daysLeft"))+'</div>':'');
  var dial='<div class="card fj"><h3>💳 '+t7("feeJourney")+'</h3><div class="fjRow"><div class="dial" style="--p:'+pct+'"><div><b>'+pct+'%</b><small>'+t7("paidOf")+'</small></div></div><div class="fjStats"><div><span>'+t("totalFee")+'</span><b>'+money(d.fee,d.currency)+'</b></div><div class="g"><span>'+t("paid")+'</span><b>'+money(d.paid,d.currency)+'</b></div><div class="r"><span>'+t("due")+'</span><b>'+money(d.due,d.currency)+'</b></div></div></div>'+chip+(d.due>0?payBtn():'')+'</div>';
  var steps='<div class="card"><h3>🗓 '+t("inst")+'</h3>'+(I.length?'<div class="steps">'+I.map(function(i,n){var s=String(i.status).toLowerCase()==="paid"?"paid":(i.due&&i.due<today()?"over":"due");return '<div class="step s-'+s+'"><i class="node">'+(s==="paid"?"✓":s==="over"?"!":(n+1))+'</i><div class="stInfo"><b>'+esc(i.title||t7("step")+" "+(n+1))+'</b><small>'+esc(i.due||"—")+' · '+(s==="paid"?t("paidS"):s==="over"?t("overdue"):t("pending"))+'</small></div><b class="amt">'+money(i.amount,d.currency)+'</b></div>';}).join("")+'</div>':'<div class="empty">'+t("none")+'</div>')+'</div>';
  var tix='<h4 class="sectH">🧾 '+t7("receipts")+'</h4>'+(P.length?P.map(function(p,i){var x=dmy(p.date);return '<div class="ticket" style="animation-delay:'+(i*.05)+'s"><div class="tL"><b>'+x[0]+'</b><small>'+esc(x[1])+'</small></div><div class="tR"><b>'+money(p.amount,d.currency)+'</b><small>'+esc(p.method||"")+(p.receipt?' · #'+esc(p.receipt):'')+'</small></div><span class="tOk">✓</span></div>';}).join(""):'<div class="card empty">'+t7("noReceipts")+'</div>');
  return dial+steps+tix;}
/* ---------- ATTENDANCE ---------- */
function vAtt7(){var d=dat(),a=d.attendance||{},T2=d.tests||[],ring=a.total?(a.pct||0):0,sk=streak();
  var st={Present:"P",Late:"L",Absent:"A",Leave:"V"};
  var head='<div class="card atH"><div class="ringWrap"><div class="ring big" style="--p:'+ring+'"><b>'+(a.total?ring+'%':'—')+'</b></div><div class="atChips"><span class="c p">✓ '+(a.present||0)+'<small>'+t("present")+'</small></span><span class="c l">⏰ '+(a.late||0)+'<small>'+t("late")+'</small></span><span class="c a">✕ '+(a.absent||0)+'<small>'+t("absent")+'</small></span><span class="c v">🌴 '+(a.leave||0)+'<small>'+t("leave")+'</small></span></div></div>'+
   '<div class="streak"><span class="fl">🔥</span><div><b>'+sk+' '+t7("daysW")+'</b><small>'+t7("streakT")+' · '+t7("bestTip")+'</small></div></div></div>';
  var beads='<div class="card"><h3>'+t7("lastClasses")+'</h3>'+((a.recent||[]).length?'<div class="beads">'+a.recent.slice().reverse().map(function(r,i){var x=dmy(r.date);return '<div class="bead b-'+esc(r.status)+'" style="animation-delay:'+(i*.04)+'s"><b>'+(st[r.status]||"?")+'</b><small>'+x[0]+' '+esc(x[1])+'</small></div>';}).join("")+'</div>':'<div class="empty">'+t("none")+'</div>')+'</div>';
  var hist=(HIST||[]).map(function(r){var s=r.status,io=tsDate(r.inTs)||tsDate(r.inAt),oo=tsDate(r.outTs)||tsDate(r.outAt);var p=!s?'<span class="pill p-mut">—</span>':s==="Approved"?'<span class="pill p-ok">✅ '+esc(t((r.mark||"Present").toLowerCase()))+'</span>':s==="Rejected"?'<span class="pill p-bad">✗</span>':'<span class="pill p-warn">⏳</span>';return '<div class="row tl"><i class="tlDot '+(s==="Approved"?"ok":s==="Rejected"?"bad":s?"warn":"")+'"></i><div>'+esc(r.date)+(s?'<small>'+t("inT")+' '+hm(io)+(oo?' · '+t("outT")+' '+hm(oo):'')+'</small>':'')+'</div>'+p+'</div>';}).join("");
  var histC='<div class="card"><h3>📸 '+t7("checkHist")+'</h3>'+(HIST?'<div class="tlWrap">'+hist+'</div>':'<div class="empty">'+t("waitMsg")+'</div>')+'</div>';
  var leave='<details class="card lvD"'+((LEAVES||[]).some(function(l){return l.status==="Pending";})?' open':'')+'><summary>🌴 '+t7("openLeave")+'<span>›</span></summary>'+lvCard().replace('<div class="card lv">','<div class="lvIn">')+'</details>';
  var tests='<div class="card"><h3>📝 '+t7("exams")+'</h3>'+(T2.length?T2.map(function(x){var ok=/pass/i.test(x.status),bad=/fail/i.test(x.status),sc=parseFloat(x.score)||0;return '<div class="exam '+(ok?"ok":bad?"bad":"")+'"><div class="exL">'+esc(x.level||x.exam||"")+'</div><div style="flex:1"><b>'+esc([x.exam,x.level].filter(Boolean).join(" "))+'</b><small>'+esc(x.date||"")+'</small>'+(sc?'<div class="exBar"><i style="width:'+Math.min(100,sc/1.8)+'%"></i></div><small>'+t7("scoreT")+': '+esc(x.score)+'</small>':'')+'</div><span class="pill '+(ok?"p-ok":bad?"p-bad":"p-mut")+'">'+esc(x.status||"—")+'</span></div>';}).join(""):'<div class="empty">'+t("none")+'</div>')+'</div>';
  return head+leave+beads+histC+tests;}
/* ---------- NOTICES ---------- */
function vNotices7(){var L=myNotices(),td=today(),yd=ldAdd(td,-1);
  var F=L.filter(function(n){return NF==="all"||(NF==="pin"&&n.pin)||(NF==="teacher"&&n.type==="p"&&!/office/i.test(n.by||""))||(NF==="office"&&(n.type==="n"||/office/i.test(n.by||"")));});
  var chips='<div class="nfChips">'+[["all",t7("fAll")],["pin","📌 "+t7("fPin")],["teacher","👩‍🏫 "+t7("fTeacher")],["office","🏢 "+t7("fOffice")]].map(function(c){return '<button class="nfC'+(NF===c[0]?" on":"")+'" data-act="nf" data-v="'+c[0]+'">'+c[1]+'</button>';}).join("")+'</div>';
  var last="",out="";F.forEach(function(n,i){var g=n.date===td?t7("todayG"):n.date===yd?t7("yestG"):t7("earlierG");if(g!==last){out+='<h4 class="sectH">'+g+'</h4>';last=g;}
    var isNew=String(n.at||(n.date+"T23:59"))>PREVSEEN&&PREVSEEN!=="";
    out+='<div class="card notice nf'+(n.pin?" pin":"")+(n.type==="p"?" post":"")+'" style="animation-delay:'+(i*.04)+'s">'+(isNew?'<span class="newB">'+t7("newB")+'</span>':'')+'<div class="pHead"><span class="pAv">'+(n.type==="p"?"👩‍🏫":"🏢")+'</span><div><b>'+esc(n.type==="p"?(n.by||"Teacher"):"GIA Office")+'</b><small>'+esc(n.date)+' · '+esc(n.tag)+(n.edited?' · '+t("edited"):'')+'</small></div>'+(n.pin?'<span class="pinI">📌</span>':'')+'</div><b class="nT">'+esc(n.title)+'</b><p>'+esc(n.body)+'</p>'+(n.image?'<img class="pImg" src="'+n.image+'" data-act="zoomimg" alt="">':'')+'</div>';});
  return chips+(out||'<div class="card empty">'+t("noNotice")+'</div>');}
/* ---------- ME hub ---------- */
function vMore7(){var d=dat(),sf=lsGet(LS.selfie),ph=(D&&D.photo)||sf||"",perm=(window.Notification&&Notification.permission)||"default";
  var prof='<div class="card me"><div class="meAv">'+(ph?'<img src="'+ph+'" alt="">':'<span>'+esc((d.name||"?").charAt(0))+'</span>')+'</div><div><b>'+esc(d.name||"")+'</b><small>'+esc(d.sid||"")+' · '+esc([d.course,d.batch].filter(Boolean).join(" · "))+'</small></div></div>';
  var tiles=[["idgo","🪪",t7("myId")],["kanago","🈁",t("kana")],["link:"+SITE+"n5-mock-test.html","📝",t("mock")],["link:"+SITE+"checklist.html","✅",t("check")],["link:"+SITE+"eligibility.html","🎌",t("elig")],["asst","💬",t7("qAsk")],["link:tel:"+PHONE,"📞",t("call")],["link:https://wa.me/"+WA,"🟢","WhatsApp"],["link:"+SITE,"🌐",t("web")]];
  var grid='<div class="tiles">'+tiles.map(function(x,i){var a=x[0].indexOf("link:")===0?'href="'+esc(x[0].slice(5))+'"'+(x[0].indexOf("wa.me")>0?' target="_blank" rel="noopener"':''):'data-act="'+x[0]+'"';return '<a class="tile" '+a+' style="animation-delay:'+(i*.04)+'s"><span>'+x[1]+'</span><small>'+esc(x[2])+'</small></a>';}).join("")+'</div>';
  return prof+grid+'<h4 class="sectH" id="idAnchor">🪪 '+t7("myId")+'</h4>'+vId(d,sf)+'<h4 class="sectH" id="kanaAnchor">🈁 '+t7("study")+'</h4>'+vKana()+'<h4 class="sectH">⚙ '+t7("settings")+'</h4>'+themePicker()+
   '<div class="card"><div class="row"><span>🌙 '+t("dark")+'</span><button class="sw'+(lsGet(LS.dark)==="1"?" on":"")+'" data-act="dark"><i></i></button></div>'+(window.Notification?'<div class="row"><span>🔔 '+t("notif")+'</span>'+(perm==="granted"?'<span class="pill p-ok">'+t("notifOn")+'</span>':'<button class="btn sm" data-act="notif">'+t("enable")+'</button>')+'</div>':'')+'<div class="row"><span>🌐 Language</span><button class="btn sm ghost" data-act="lang">EN / বাংলা</button></div></div><div class="out"><button id="btnOut">'+t("logout")+'</button></div>';}
/* ---------- pull to refresh ---------- */
function pullFx(){var y0=null,pr=null,on=false;
  document.addEventListener("touchstart",function(e){if(!D||$("main").hidden||document.querySelector(".sheet,.cam"))return;if((window.scrollY||document.documentElement.scrollTop)<=0){y0=e.touches[0].clientY;}},{passive:true});
  document.addEventListener("touchmove",function(e){if(y0==null)return;var dy=e.touches[0].clientY-y0;if(dy>10){if(!pr){pr=document.createElement("div");pr.className="ptr";pr.innerHTML='<i>⟳</i>';document.body.appendChild(pr);}var k=Math.min(1,dy/110);pr.style.transform="translate(-50%,"+(dy*.5)+"px) rotate("+(dy*3)+"deg)";pr.style.opacity=k;on=dy>110;pr.classList.toggle("go",on);}},{passive:true});
  document.addEventListener("touchend",function(){if(pr){var p=pr;if(on){p.classList.add("spin");refresh().then(function(){setTimeout(function(){p.remove();},300);});}else p.remove();}y0=null;pr=null;on=false;},{passive:true});}

function boot(){
  lsSet("gia_app_role","student");tiltFx();pullFx();
  setTimeout(function(){var sp=$("splash");if(sp){sp.classList.add("out");setTimeout(function(){sp.remove();},700);}},950);
  try{ACFG=JSON.parse(lsGet(LS.cfg)||"null");}catch(e){}
  applyStatic();
  $("btnLogin").onclick=login;
  $("in_phone").addEventListener("keydown",function(e){if(e.key==="Enter")login();});
  try{var q=new URLSearchParams(location.search).get("id");if(q)$("in_sid").value=q;}catch(e){}
  var k=lsGet(LS.key),c=lsGet(LS.cache);
  if(k&&c){try{D=JSON.parse(c);N=JSON.parse(lsGet(LS.notices)||"[]");}catch(e){D=null;}if(D){showMain();refresh();}}
  window.addEventListener("online",refresh);
  document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible"&&D)fetchToday().then(function(){if(tab==="home")render();});});
  try{if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(function(){});}catch(e){}
}
/* ===== v9 · My Journey (course + file processing + important dates) · monthly attendance ===== */
var T9={en:{jT:"My journey",cs:"Course",fp:"File processing",notStarted:"File processing has not started yet — talk to the office when you are ready.",doneOn:"Completed on",dates:"Important dates",today:"Today",tom:"Tomorrow",inD:"in",dW:"d",mAtt:"Monthly attendance",classDays:"class days",course:"Course plan",month:"Month",nod:"No attendance yet"},
 bn:{jT:"আমার যাত্রা",cs:"কোর্স",fp:"ফাইল প্রসেসিং",notStarted:"ফাইল প্রসেসিং এখনো শুরু হয়নি — প্রস্তুত হলে অফিসে কথা বলুন।",doneOn:"শেষ হয়েছে",dates:"গুরুত্বপূর্ণ তারিখ",today:"আজ",tom:"আগামীকাল",inD:"আর",dW:"দিন",mAtt:"মাসিক উপস্থিতি",classDays:"ক্লাসের দিন",course:"কোর্স পরিকল্পনা",month:"মাস",nod:"এখনো উপস্থিতি নেই"}};
function t9(k){return (T9[lang]&&T9[lang][k])||T9.en[k]||k;}
var MN9=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function ml9(ym){var p=String(ym).split("-");return MN9[+p[1]-1]+" "+p[0];}
function dt9(ds){var a=new Date(today()+"T12:00:00"),b=new Date(ds+"T12:00:00");return Math.round((b-a)/864e5);}
function journeyCard(){
  var d=dat(),j=d.journey,ev=(d.events||[]).filter(function(e){return !e.done;});
  if(!j&&!ev.length)return "";
  var h='<div class="card j9"><div class="j9H"><b>🧭 '+t9("jT")+'</b>'+(j?'<span class="j9C c-'+esc(String(j.course).replace(/\s/g,""))+'">'+(j.course==="Completed"?"🎓 ":"")+esc(j.course)+'</span>':'')+'</div>';
  if(j){
    if(j.course==="Completed"&&j.completedOn)h+='<div class="j9Done">🎉 '+t9("doneOn")+': <b>'+esc(j.completedOn)+'</b></div>';
    var steps=(j.steps||[]).slice(1),cur=(j.steps||[]).indexOf(j.file);
    if(cur<=0)h+='<div class="j9Ns">📂 '+t9("notStarted")+'</div>';
    else h+='<div class="j9Lbl">📂 '+t9("fp")+(j.fileType?' · '+esc(j.fileType):'')+'</div><div class="j9Steps">'+steps.map(function(s,i){var k=i+1<cur?"done":(i+1===cur?"now":"");return '<div class="j9S '+k+'"><i>'+(k==="done"?"✓":(i+1))+'</i><span>'+esc(s)+'</span></div>';}).join("")+'</div>';
  }
  if(ev.length){h+='<div class="j9Lbl">📌 '+t9("dates")+'</div>'+ev.slice(0,4).map(function(e){var n=dt9(e.date);var w=n===0?t9("today"):n===1?t9("tom"):(n>0?t9("inD")+" "+n+t9("dW"):e.date);
    return '<div class="j9E'+(n<=1?' soon':'')+'"><div class="j9Ed"><b>'+e.date.slice(8)+'</b><small>'+MN9[+e.date.slice(5,7)-1]+'</small></div><div class="j9Ei"><b>'+esc(e.type)+'</b><small>'+esc([e.time,e.note].filter(Boolean).join(" · "))+'</small></div><span class="j9Ew">'+esc(w)+'</span></div>';}).join("");}
  return h+'</div>';
}
function monthAttCard(){
  var d=dat(),M=d.attMonths||[],cm=d.courseMonths||[],cd=d.classDays||[];
  if(!M.length&&!cm.length)return "";
  var h='<div class="card m9"><b>📅 '+t9("mAtt")+'</b>';
  if(M.length)h+='<div class="m9L">'+M.map(function(m){var tot=m.p+m.a+m.l+m.lv,pc=tot?Math.round((m.p+m.l*0.5)/Math.max(1,m.p+m.a+m.l)*100):0;
    return '<div class="m9R"><span class="m9M">'+ml9(m.m)+'</span><div class="m9B">'+(tot?'<i class="p" style="flex:'+m.p+'"></i><i class="l" style="flex:'+m.l+'"></i><i class="a" style="flex:'+m.a+'"></i><i class="v" style="flex:'+m.lv+'"></i>':'')+'</div><b class="'+(pc<75?'low':'')+'">'+pc+'%</b></div>';}).join("")+'</div><div class="m9Lg"><span><i class="p"></i>P</span><span><i class="l"></i>L</span><span><i class="a"></i>A</span><span><i class="v"></i>Lv</span></div>';
  else h+='<div class="mut" style="margin-top:6px">'+t9("nod")+'</div>';
  if(cm.length){var cur=today().slice(0,7);h+='<div class="j9Lbl">🗓 '+t9("course")+'</div><div class="m9P">'+cm.map(function(m,i){return '<div class="m9Pi'+(m===cur?' now':(m<cur?' past':''))+'"><small>'+t9("month")+' '+(i+1)+'</small><b>'+ml9(m)+'</b><span>'+(cd[i]||0)+' '+t9("classDays")+'</span></div>';}).join("")+'</div>';}
  return h+'</div>';
}
(function(){var _tc=todayCard;todayCard=function(){var a="";try{a=journeyCard();}catch(e){}return a+_tc.apply(this,arguments);};})();
(function(){var _va=vAtt7;vAtt7=function(){var h=_va.apply(this,arguments),x="";try{x=monthAttCard();}catch(e){}return h+x;};})();

/* ===== v10 · new themes: GIA Night (matches website) + Soft Pro (clean light) ===== */
(function(){
  try{
    if(!THEMES.some(function(x){return x[0]==="night";})){
      THEMES.unshift(["soft","Soft Pro","#f4f5fb","linear-gradient(90deg,#5b5bf0,#8a7cff)"]);
      THEMES.unshift(["night","GIA Night","linear-gradient(160deg,#050b18,#1c3a63)","linear-gradient(90deg,#d4a531,#c0392b)"]);
    }
    var KEY=(typeof LS!=="undefined"&&LS.theme)?LS.theme:"gia_t_theme";
    curTheme=function(){ var v=lsGet(KEY); if(!v) return "soft"; return THEMES.some(function(x){return x[0]===v;})?v:"soft"; };
    var _ap=applyTheme;
    applyTheme=function(){ var b=document.body; ["t-night","t-soft","t-urushi","t-clay"].forEach(function(c){b.classList.remove(c);});
      var r=_ap.apply(this,arguments), th=curTheme();
      if(th==="night") b.classList.add("t-urushi","t-night"); else if(th==="soft") b.classList.add("t-clay","t-soft");
      var m=document.querySelector('meta[name="theme-color"]'); if(m&&th==="night") m.setAttribute("content","#050b18"); if(m&&th==="soft") m.setAttribute("content","#f4f5fb");
      return r; };
    applyTheme();
  }catch(e){}
})();

/* Illustrations from unDraw (https://undraw.co) by Katerina Limpitsouni — free to use, no attribution required (unDraw license). */
var GIA_ILL={
girl:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 582.8 640.7"><g transform="translate(-730.1 -282.7)"><path d="M966.9,643.3C874.0,685.6,754.3,682.6,754.3,682.6H624.8V657.9c52.7-14.7,125.7-23.8,206.4-23.8a945.7,945.7,0,0,1,135.7,9.3Z" transform="translate(190.3 127.5)" opacity="0.1"></path><path d="M1186.6,708.0c0,44.7-130.4,80.9-291.4,80.9s-291.4-36.2-291.4-80.9c0-22.3,32.4-42.5,85-57.1v24.7H818.3s119.6,2.9,212.6-39.2C1123.5,649.8,1186.6,676.8,1186.6,708.0Z" transform="translate(126.3 134.5)" opacity="0.1"></path><rect width="123.9" height="124.2" transform="translate(934.8 338.5)" fill="#090814"></rect><path d="M694.7,561.9s10.2,35.9-7.7,38.4a70.1,70.1,0,0,0-30.7,12.8l33.3,43.6H751.2l38.4-38.4s-51.3-38.4-41.0-61.5S694.7,561.9,694.7,561.9Z" transform="translate(286.1 -135.5)" fill="#ed9da0"></path><path d="M536.2,554.6l59.0,20.5,41.0,2.5-2.5-35.9-84.6-25.0Z" transform="translate(460.0 318.1)" fill="#ed9da0"></path><path d="M688.2,685.3s0,35.9,5.1,35.9,74.4-7.7,94.9,0S839.6,700.7,824.2,685.3s-40.5-38.4-56.1-33.3-79.8,17.9-79.8,17.9Z" transform="translate(383.7 179.8)" fill="#2f2e41"></path><path d="M654.7,651.4s-30.7,61.5-10.2,66.7,43.6-2.5,46.1-5.1,38.4-12.8,43.6-7.7,5.1-20.5,5.1-20.5Z" transform="translate(228.6 180.3)" fill="#2f2e41"></path><path d="M667.6,630.4s-48.7,66.7-12.8,84.6,207.8,17.9,220.6,0,17.9-74.4,0-79.5S667.6,630.4,667.6,630.4Z" transform="translate(241.4 116.6)" fill="#2f2e41"></path><path d="M667.6,630.4s-48.7,66.7-12.8,84.6,207.8,17.9,220.6,0,17.9-74.4,0-79.5S667.6,630.4,667.6,630.4Z" transform="translate(241.4 116.6)" opacity="0.2"></path><ellipse cx="59.0" cy="59.0" rx="59.0" ry="59.0" transform="translate(942.4 326.2)" fill="#ed9da0"></ellipse><path d="M648.0,571.6l51.3-10.2s12.8,41.0,53.8,33.3,51.3-33.3,51.3-33.3,30.7,12.8,33.3,12.8,35.9,12.8,35.9,20.5-38.4,84.6-38.4,84.6l5.1,138.5-189.8-5.1L663.4,676.8Z" transform="translate(261.0 -93.9)" fill="currentColor"></path><path d="M647.5,580.4s-15.3,135.9-5.1,146.2,51.3,38.4,51.3,38.4v-30.7L673.2,695.8l20.5-89.8Z" transform="translate(233.2 -36.0)" fill="#ed9da0"></path><path d="M746.2,579.4s-8.9,139.8-8.9,144.9S714.1,747.5,706.5,747.5s-12.8-12.8-12.8-12.8l17.9-20.5L698.8,608.9Z" transform="translate(400.1 -38.9)" fill="#ed9da0"></path><path d="M790.4,649.4s115.4-64.1,118.0,0-59.0,89.8-59.0,89.8-159.0,47.7-165.5,30.2-19.2-45.6-8.9-48.2,23.0-7.7,28.2-2.5S772.5,680.2,772.5,680.2Z" transform="translate(331.5 87.4)" fill="#2f2e41"></path><path d="M768.0,626.0S744.9,636.3,737.2,644,696.2,664.5,696.2,664.5" transform="translate(407.8 103.0)" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2" opacity="0.2"></path><path d="M695.0,569.0l-15.4-5.1s-56.4,59.0-38.4,74.4,28.2,20.5,33.3,25.6,30.7,7.7,30.7,7.7Z" transform="translate(229.4 -86.2)" fill="currentColor"></path><path d="M725.1,568.3l23.0,5.1s17.9,38.4,23.0,43.6-7.7,2.5-15.3,12.8-15.4,28.2-30.7,28.2S689.2,632.5,689.2,632.5Z" transform="translate(386.6 -72.7)" fill="currentColor"></path><path d="M750.9,661.4s-97.5-69.2-130.8-17.9S763.7,764.0,789.4,774.3s48.7,20.5,48.7,20.5,23.0-56.4,23.0-66.7-17.9-10.2-23.0-10.2-28.2-5.1-33.3-12.8S750.9,661.4,750.9,661.4Z" transform="translate(163.2 98.4)" fill="#2f2e41"></path><path d="M635.9,629.2s25.6,20.5,48.7,25.6,30.7,17.9,30.7,17.9" transform="translate(224.3 112.7)" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2" opacity="0.2"></path><path d="M644.9,615.8l2.0,108.6a13.6,13.6,0,0,0,13.7,13.3l202.1-2.2A13.6,13.6,0,0,0,876.3,722.7l6.1-106.3a13.6,13.6,0,0,0-13.5-14.3H658.5a13.6,13.6,0,0,0-13.6,13.8Z" transform="translate(251.5 29.6)" fill="#090814"></path><g transform="translate(885.1 282.7)"><path d="M662.1,702.5c5.5-12.1,12.9-23.5,16.4-36.4,4.2-15.4,2.5-31.7,2.0-47.7a149.8,149.8,0,0,1,3.5-42.1,72.4,72.4,0,0,1,20.8-36.2c26.8-24,53.2-25.7,86.1-15.7,12.9,3.9,26.7,11.4,29.9,24.5.484,1.9.7,4.0,1.2,6,2.6,9.7,12.7,15.9,16.3,25.4,4.6,12.2-2.5,25.6-3.4,38.7-1.1,15.2,6.4,29.7,13.8,43.1,4.4,7.9,8.9,16.4,8.5,25.5a32.3,32.3,0,0,1-4.4,14.1,53.7,53.7,0,0,1-45.1,25.8,28.3,28.3,0,0,1-16.9-3.9c-8.0-5.5-10.3-16.6-8.6-26.2s6.5-18.2,10.3-27.2c1.1-2.7,2.2-5.5,3.2-8.3a57.4,57.4,0,1,0-37.8,6.4,77.7,77.7,0,0,1-3.7,43.2,163.3,163.3,0,0,1-18.1,31.6,43.7,43.7,0,0,1-11.5,12.9,41.0,41.0,0,0,1-9.8,4.2c-14.4,4.6-6.9,8.4-22.0,6.3s-30.0-11.1-35.1-25.5C653.0,728.7,656.6,714.7,662.1,702.5Z" transform="translate(-655.4 -518.6)" fill="#090814"></path><ellipse cx="62.6" cy="35.4" rx="62.6" ry="35.4" transform="translate(46.6 22.3)" fill="#090814"></ellipse></g></g></svg>',
boy:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 712.4"><g transform="translate(-503.8 -308.7)"><g transform="translate(503.8 895.7)"><path d="M159.1,787.3c1.1,7.0,5.2,12.3,9.0,17.2l45.9,58.2c3.6,4.6,7.6,9.5,12.6,10.8,10.3,2.7,18.7-10.5,27.5-18.3,31.5-27.7,74.6,14.4,110.2-1.6,14.2-6.4,25.8-21.7,40.3-26.9,38.4-13.7,71.0,47.1,110.7,50.2,13.0.985,25.8-4.3,38.3-9.7l83.1-35.5c5.7-2.4,11.6-4.9,17.7-5.0,10.2-.177,19.7,6.4,29.3,11.1,38.7,19.0,81.7,8.7,121.5-5.6s79.8-33.0,121.0-29.9c10.7.808,24.8.128,27.7-13.9,1.7-8.3-21.7.4-27.2-4.1s7.5-23.2,1.1-24.0c-36.9-4.6-74.6-4.7-110.7,6.9-18.7,6.0-37.1,15.2-56.3,17.0-20.0,1.9-39.9-4.1-59.6-9.6-49.8-13.9-100.4-24.6-151.3-22.4-90.4,3.9-179.4,48.5-269.3,35.6a229.2,229.2,0,0,1-76.2-25.5c-12.1-6.5-11.6,16.6-23.9,24.4-4.0,2.5-14.5-21.1-17.7-16.6A23.1,23.1,0,0,0,159.1,787.3Z" transform="translate(-158.8 -751.5)" fill="#f2f2f2"></path></g><path d="M165.8,780.6l26.2,3.2,15.3-75.4L177.9,691.0,139.6,732.5Z" transform="translate(440.8 171.6)" fill="#ed9da0"></path><path d="M617.5,425.1l-63.4,56.8S431.7,509.3,462.3,471.0c17.3-21.6,15.0-54.5,9.7-79.0a205.0,205.0,0,0,0-9.7-32.5s157.4-95.0,135.5-22.9c-6.4,21.4-7.3,37.9-5.4,50.5C597.0,417.0,617.5,425.1,617.5,425.1Z" transform="translate(341.0 156.6)" fill="#ed9da0"></path><path d="M347.1,419.9V644.0l215.3-17.4L526.4,398.1s-50.0,42.4-94.8,47.9S347.1,419.9,347.1,419.9Z" transform="translate(437.7 176.0)" fill="#e1e7ef"></path><path d="M595.5,391.3l26.3,9.8s30.6,19.7,142.1,34.9c0,0,16.3,0,27.3,52.4l139.9,186.9s67.7,50.2,10.9,100.5L817,789.8s72.1-68.8-37.1-71.0l20.2-16.9s-31.7-29.5-38.2-48.1-60.1-39.3-60.1-39.3l6.5,157.4-98.4,15.2L595.6,494.1a194.5,194.5,0,0,1,2.3-41.3c2.9-17.3,1.7-41.4-2.3-54.4-.786-2.4.338-5.1-.084-7.0C595.4,391.0,596.1,391.6,595.5,391.3Z" transform="translate(339.0 155.4)" fill="#3f3d56"></path><path d="M469.0,401.3,330.2,437.4s-20.7-13.1-45.9,89.6l-88.5,159.6s-51.4,50.2-12.0,92.8,88.5,21.8,88.5,21.8-44.8-69.9,33.8-87.4l29.5-37.1,133.3,15.3-3.3-192.3,3.7-22.4a222.6,222.6,0,0,0,0-73.2Z" transform="translate(346.3 155.2)" fill="#3f3d56"></path><path d="M238.2,489.0l-13.1,9.8L422.9,549.2V529.5Z" transform="translate(439.5 174.6)" fill="#e4e6ed"></path><path d="M623.7,485.7l13.1,9.8L425.9,549.1V529.4Z" transform="translate(436.6 174.7)" fill="#e4e6ed"></path><path d="M212.8,489.0l183.6,42.6,13.1,266.7L248.9,748.1Z" transform="translate(439.7 174.6)" fill="currentColor"></path><path d="M645.9,489.0,450.3,533.9l10.9,267.8,181.4-55.7Z" transform="translate(436.2 174.6)" fill="currentColor"></path><path d="M489.1,553.3s32.0,19.7,65.7,0l6.5,272.1H508.7Z" transform="translate(340.6 153.0)" fill="currentColor"></path><path d="M489.1,553.3s32.0,19.7,65.7,0l6.5,272.1H508.7Z" transform="translate(340.6 153.0)" opacity="0.1"></path><path d="M339.3,506.7V514.4l180.3,36.0S427.8,516.5,339.3,506.7Z" transform="translate(342.8 153.7)" fill="#d6d6e3"></path><path d="M716.9,502.3v7.6L522.3,550.4S628.4,512.1,716.9,502.3Z" transform="translate(340.1 153.7)" fill="#d6d6e3"></path><path d="M778.9,723.0l-5.7,1.5S736.1,692.0,688.7,741.3,704.5,814.7,704.5,814.7s65.0,2.7,85.4-9.2a89.8,89.8,0,0,1,28.4-11.0,29.0,29.0,0,0,0,15.9-8.9h0a38.0,38.0,0,0,0,9.5-31.3h0a38.0,38.0,0,0,0-27.9-31.1h0A72.0,72.0,0,0,0,778.9,723.0Z" transform="translate(337.9 150.6)" fill="#ed9da0"></path><path d="M291.2,728.4s43.7-39.3,97.2,26.2-41.5,66.7-41.5,66.7-51.4,11.9-71.0-30.6S291.2,728.4,291.2,728.4Z" transform="translate(343.8 150.5)" fill="#ed9da0"></path><path d="M786.3,720.3s50.8,14.8,39.9,73.4l30.7-3.3,6.4-29.8-13.1-41.5-25.1-9.8Z" transform="translate(336.2 150.7)" fill="#3f3d56"></path><ellipse cx="99.0" cy="99.0" rx="99.0" ry="99.0" transform="translate(769.2 358.5)" fill="#ed9da0"></ellipse><path d="M580.5,229.8s25.9-49.5-31.0-54.0c0,0-48.5-44.0-98.0-8.0,0,0-27,0-41.7,30.5,0,0-21.2-8.0-25.9,13.5,0,0-15.5,45.0,0,85.5s20.7,45.0,20.7,45.0-25.5-84.9,36.6-89.4,131.7-43.3,136.9,6.1S590.9,320.8,590.9,320.8,640.1,250.1,580.5,229.8Z" transform="translate(374.4 155.1)" fill="#090814"></path></g></svg>',
teacher:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 692.7"><g transform="translate(-482.7 -115)"><g transform="translate(539.4 115)"><g transform="translate(0)"><g transform="translate(27.7 15.7)"><rect width="686.1" height="427.2" rx="7.2" transform="translate(0)" fill="#e6e6e6"></rect><rect width="670.2" height="413.0" rx="7.2" transform="translate(8.6 7.1)" fill="#fff"></rect></g><path d="M7.1,0H736.1a7.1,7.1,0,0,1,7.1,7.1v8.0a7.1,7.1,0,0,1-7.1,7.1H7.1A7.1,7.1,0,0,1,0,15.2V7.1A7.1,7.1,0,0,1,7.1,0Z" fill="#e6e6e6"></path></g><g transform="translate(129.1 83.9)"><rect width="485" height="181" rx="16" transform="translate(0.1 129.2)" fill="#f2f2f2"></rect><path d="M21.5,0A21.5,21.5,0,1,1,0,21.5,21.5,21.5,0,0,1,21.5,0Z" transform="translate(0 7.5)" fill="currentColor"></path><rect width="279" height="29" rx="14.5" transform="translate(93.1 0.2)" fill="currentColor"></rect><rect width="392" height="13" rx="6.5" transform="translate(93.1 44.2)" fill="#e6e6e6"></rect><rect width="174" height="14" rx="7" transform="translate(93.1 72.2)" fill="#e6e6e6"></rect></g></g><g transform="translate(482.7 379.9)"><path d="M15.1,488.6c0,.783.2,1.4.444,1.4H237.1c.248,0,.444-.628.4-1.4s-.2-1.4-.444-1.4H15.6C15.3,487.1,15.1,487.8,15.1,488.6Z" transform="translate(-15.1 -62.1)" fill="#f2f2f2"></path><path d="M101.4,279.4l-1.8,38.7L70.2,301.2,74,279.4Z" transform="translate(37.6 -232.3)" fill="#ed9da0"></path><path d="M341.2,543.1l2.7,5.7s15.8,21.0,6.0,24.4-14.9-20-14.9-20l-2.5-3.2Z" transform="translate(-165.9 -343.5)" fill="#ed9da0"></path><path d="M319.9,421.4l2.6-1.1s3.0,1.1,3.0,5.8-3.7,73.7-3.7,73.7l7.5,37.8L319,539.6l-16.0-34.9Z" transform="translate(-162.8 -330.8)" fill="#575a89"></path><path d="M319.9,421.4l1.8-1.1s5.6-1.3,5.4,18.5-5.4,61.0-5.4,61.0l20.3,32.6-13.2,9.4-26-37.3Z" transform="translate(-162.8 -330.8)" fill="#2f2e41"></path><path d="M308.9,543.4s6.7,7.4,5.7,16-7.6,174.9-7.6,174.9l3.7,18.9-35.9.945-.945-121.9L248.4,754.3l-33.2-.945L238.0,539.7Z" transform="translate(-153.8 -343.1)" fill="#090814"></path><path d="M313.1,773.7l8.5,8.5s19.8,3.7,15.1,10.4-53.8-1.8-53.8-1.8l.945-15.1Z" transform="translate(-160.8 -367.3)" fill="#2f2e41"></path><path d="M244.6,773.7l8.5,8.5s19.8,3.7,15.1,10.4-53.8-1.8-53.8-1.8l.945-15.1Z" transform="translate(-153.7 -367.3)" fill="#2f2e41"></path><circle cx="22.6" cy="22.6" r="22.6" transform="translate(102.2 11.2)" fill="#ed9da0"></circle><path d="M69.1,293.2l27.4,19.8,4.7-14.1,8.5,22.6-4.7,40.6Z" transform="translate(37.7 -233.7)" fill="currentColor"></path><path d="M265.8,383.7l27.3,41.5,1.1-34.7,3.3,2.6a15.5,15.5,0,0,1,5.9,12.2h0l13.2,12.2-4.7,47.2-.945,55.7s5.6,4.7,3.7,7.5S305.4,537.7,296.9,537.7s-61.4-6.6-61.4-10.4,1.8-52.9,1.8-52.9V408.2l22.6-17.0Z" transform="translate(-155.9 -327.0)" fill="#2f2e41"></path><path d="M36.4,464.2l12.2,17.9,4.7-20.8-5.6-3.7Z" transform="translate(41.1 -250.7)" fill="#ed9da0"></path><rect width="52.4" height="1.8" transform="matrix(0.3, -0.9, 0.9, 0.3, 119.0, 289.8)" opacity="0.2"></rect><path d="M269.5,332.2s2.8-14.1,18.9-11.3l-1.8.945s15.1-1.8,13.2,6.6c0,0,12.2,7.5,9.4,16.0a96.1,96.1,0,0,0-3.7,15.1l-2.8-2.8s-2.8-18.9-19.8-17.0c-12.7,1.4-17.9,7.4-19.2,11.7a38.3,38.3,0,0,1-2.3,5.9l-1.0.233S254.4,336.9,269.5,332.2Z" transform="translate(-158.3 -320.5)" fill="#090814"></path><path d="M244.2,409.9l-8.6-.4-1.7,1.3a56.6,56.6,0,0,0-5.6,6.6c-1.8,2.8-26.4,71.8-26.4,71.8a24.0,24.0,0,0,0,1.8,12.2C206.4,508.2,229.1,548,229.1,548l17.0-10.4-22.6-46.3,16.0-22.6Z" transform="translate(-152.4 -329.7)" fill="#2f2e41"></path></g></g></svg>'
};
/* original GIA characters (SVG, anime-style) — girl, boy, teacher-f, teacher-m */
var GIA_CHR=(function(){
  function eyes(y,iris){ var e='';[80,120].forEach(function(x){ e+='<ellipse cx="'+x+'" cy="'+y+'" rx="9" ry="11.5" fill="#fff"/><ellipse cx="'+x+'" cy="'+(y+1.5)+'" rx="7" ry="9.5" fill="'+iris+'"/><ellipse cx="'+x+'" cy="'+(y+3)+'" rx="4" ry="5.5" fill="#1d1430"/><circle cx="'+(x-2.5)+'" cy="'+(y-3)+'" r="2.6" fill="#fff"/><circle cx="'+(x+3)+'" cy="'+(y+5)+'" r="1.2" fill="#fff" opacity=".8"/><path d="M'+(x-10)+' '+(y-9)+' Q'+x+' '+(y-15)+' '+(x+10)+' '+(y-8)+'" stroke="#1d1430" stroke-width="2.6" fill="none" stroke-linecap="round"/>'; }); return e; }
  function head(skin,y){ return '<path d="M62 92 C60 60 80 48 100 48 C120 48 140 60 138 92 C138 120 122 136 100 136 C78 136 62 120 62 92Z" fill="'+skin+'"/>'+
    '<ellipse cx="72" cy="'+(y+16)+'" rx="7" ry="4" fill="#ff8fab" opacity=".45"/><ellipse cx="128" cy="'+(y+16)+'" rx="7" ry="4" fill="#ff8fab" opacity=".45"/><path d="M94 '+(y+22)+' Q100 '+(y+27)+' 106 '+(y+22)+'" stroke="#a0404f" stroke-width="2.4" fill="none" stroke-linecap="round"/>'; }
  function hoodie(c1,c2,c3){ return '<path d="M40 200 C40 160 62 140 100 138 C138 140 160 160 160 200Z" fill="'+c1+'"/><path d="M70 146 C78 160 122 160 130 146 C124 140 112 137 100 137 C88 137 76 140 70 146Z" fill="'+c2+'"/>'+
    '<path d="M92 156 L90 182 M108 156 L110 182" stroke="'+c3+'" stroke-width="2.5" stroke-linecap="round"/><circle cx="90" cy="184" r="2.6" fill="'+c3+'"/><circle cx="110" cy="184" r="2.6" fill="'+c3+'"/>'; }
  var bgG='<defs><radialGradient id="cbgA" cx=".5" cy=".4"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ebe4ff"/></radialGradient><radialGradient id="cbgB" cx=".5" cy=".4"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfeaff"/></radialGradient><radialGradient id="cbgC" cx=".5" cy=".4"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dcf3e9"/></radialGradient></defs>';
  var star='<path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8Z" fill="#ffd66b"/>';
  var girl='<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">'+bgG+'<circle cx="100" cy="100" r="96" fill="url(#cbgA)"/>'+
    '<g transform="translate(36 40)">'+star+'</g><g transform="translate(168 64) scale(.7)">'+star+'</g>'+
    '<path d="M54 100 C46 60 70 40 100 40 C132 40 156 60 146 104 C152 140 150 170 136 182 L64 182 C50 170 48 140 54 100Z" fill="#3b2550"/>'+
    '<circle cx="100" cy="30" r="17" fill="#3b2550"/><circle cx="94" cy="26" r="5" fill="#57386f" opacity=".7"/>'+
    hoodie("#b49cff","#9c84f5","#ffffff")+head("#ffe4d4",92)+
    '<path d="M60 92 C62 62 84 50 104 52 C96 60 92 70 86 72 C82 66 80 64 78 70 C72 76 66 82 60 92Z" fill="#3b2550"/><path d="M140 92 C138 64 120 52 102 52 C112 60 116 70 124 74 C126 68 130 70 132 76 C136 80 138 86 140 92Z" fill="#3b2550"/>'+
    '<path d="M100 52 C98 62 94 68 88 72" stroke="#57386f" stroke-width="2" fill="none"/>'+eyes(96,"#7c4dff")+
    '<g transform="translate(130 50) rotate(15)">'+star+'</g>'+
    '<g transform="rotate(-8 100 178)"><rect x="66" y="166" width="68" height="24" rx="3" fill="#ff8fb1"/><rect x="66" y="166" width="10" height="24" fill="#ff6f9b"/><rect x="80" y="172" width="44" height="3" rx="1.5" fill="#fff" opacity=".8"/></g></svg>';
  var boy='<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">'+bgG+'<circle cx="100" cy="100" r="96" fill="url(#cbgB)"/>'+
    '<g transform="translate(34 50)">'+star+'</g><g transform="translate(166 46) scale(.8)">'+star+'</g>'+
    '<path d="M40 200 C40 162 60 144 84 140 L84 200Z M160 200 C160 162 140 144 116 140 L116 200Z" fill="#d4a531"/>'+
    hoodie("#2b4f86","#203d6b","#d4a531")+'<rect x="56" y="150" width="9" height="50" rx="4" fill="#c0392b"/><rect x="135" y="150" width="9" height="50" rx="4" fill="#c0392b"/>'+head("#f8d6bd",94)+
    '<path d="M58 96 C52 58 78 40 104 42 C132 42 152 60 142 98 C140 86 134 76 126 72 C128 80 124 82 120 76 C116 84 108 84 104 76 C98 84 88 82 86 74 C80 80 72 82 70 74 C64 80 60 88 58 96Z" fill="#26213a"/>'+
    '<path d="M104 42 C112 30 126 32 130 40" fill="#26213a"/>'+eyes(98,"#3d6fd6")+
    '<path d="M70 82 l16 -3 M114 79 l16 3" stroke="#26213a" stroke-width="3.4" stroke-linecap="round"/>'+
    '<g transform="rotate(6 100 182)"><rect x="62" y="170" width="76" height="22" rx="3" fill="#ffffff"/><rect x="62" y="170" width="76" height="6" fill="#5b8def"/><text x="100" y="188" font-size="9" text-anchor="middle" font-weight="800" fill="#2b4f86" font-family="Arial">JLPT N5</text></g></svg>';
  function teacher(hair,long,c1,c2){ return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">'+bgG+'<circle cx="100" cy="100" r="96" fill="url(#cbgC)"/>'+
    (long?'<path d="M56 100 C50 58 76 42 100 42 C128 42 152 58 144 102 C148 132 144 150 136 160 L64 160 C56 150 52 132 56 100Z" fill="'+hair+'"/>':'')+
    '<path d="M40 200 C40 160 62 140 100 138 C138 140 160 160 160 200Z" fill="'+c1+'"/><path d="M86 138 L100 170 L114 138Z" fill="#fff"/>'+(long?'':'<path d="M96 146 l4 30 l4 -30z" fill="'+c2+'"/>')+
    head(long?"#f6d3bb":"#eec7a8",94)+
    (long?'<path d="M60 94 C64 62 86 50 108 54 C98 62 84 74 60 94Z M140 94 C136 66 122 54 104 54 C116 64 126 76 140 94Z" fill="'+hair+'"/>':'<path d="M62 90 C58 56 84 44 104 44 C128 44 146 58 138 90 C130 72 118 66 100 66 C84 66 70 74 62 90Z" fill="'+hair+'"/>')+
    eyes(98,"#2e8b6e")+'<circle cx="80" cy="98" r="14" fill="none" stroke="#2b1d3a" stroke-width="2.4"/><circle cx="120" cy="98" r="14" fill="none" stroke="#2b1d3a" stroke-width="2.4"/><path d="M94 98 h12" stroke="#2b1d3a" stroke-width="2.4"/>'+
    '<g transform="rotate(-6 146 172)"><rect x="128" y="146" width="36" height="46" rx="4" fill="#fff" stroke="'+c1+'" stroke-width="3"/><path d="M134 158 h24 M134 166 h24 M134 174 h16" stroke="#9fd8bd" stroke-width="3" stroke-linecap="round"/><path d="M136 182 l5 5 l10 -10" stroke="#1d9e75" stroke-width="3" fill="none" stroke-linecap="round"/></g></svg>'; }
  return {girl:girl,boy:boy,tf:teacher("#4a2c22",1,"#1d9e75","#d4a531"),tm:teacher("#2a2321",0,"#0e7c66","#d4a531")};
})();

/* ===== v12 · StudyMate-style home: character hero (male/female) · daily goal · focus timer ===== */
var T12={en:{hi:"Hi",ready:"Ready to achieve something amazing today?",goal:"Daily goal",tasks:"tasks",quote:"“Discipline today, success tomorrow.”",focus:"Focus timer",start:"Start",pause:"Pause",reset:"Reset",focusMsg:"Focus on your goal!",brk:"Short break",pomo:"Pomodoro",tapChr:"Tap to change avatar",
  g1:"✍️ Learn 10 new kanji / words",g2:"🎧 15 min listening",g3:"🗣 Kaiwa practice (self-intro)",g4:"📖 Review today's class notes",done:"Great job! All done today 🎉"},
 bn:{hi:"হাই",ready:"আজ দারুণ কিছু করার জন্য তৈরি?",goal:"আজকের লক্ষ্য",tasks:"কাজ",quote:"“আজকের নিয়মানুবর্তিতা, কালকের সাফল্য।”",focus:"ফোকাস টাইমার",start:"শুরু",pause:"থামাও",reset:"রিসেট",focusMsg:"লক্ষ্যে মন দাও!",brk:"ছোট বিরতি",pomo:"পোমোডোরো",tapChr:"অ্যাভাটার বদলাতে ট্যাপ করো",
  g1:"✍️ ১০টি নতুন কানজি / শব্দ",g2:"🎧 ১৫ মিনিট লিসেনিং",g3:"🗣 কাইওয়া অনুশীলন (পরিচিতি)",g4:"📖 আজকের ক্লাস নোট রিভিউ",done:"দারুণ! আজকের সব কাজ শেষ 🎉"}};
function t12(k){return (T12[lang]&&T12[lang][k])||T12.en[k]||k;}
function chrKind(){var o=lsGet("gia_stu_chr");if(o)return o;var g=String((dat()||{}).gender||"").toLowerCase();return /^f|female|meye|মেয়ে/.test(g)?"girl":(/^m|male|chele|ছেলে/.test(g)?"boy":"girl");}
var GK="gia_stu_goal_"+today();
function goals(){try{return JSON.parse(lsGet(GK)||"{}");}catch(e){return {};}}
var FT=window.FT||{mode:"pomo",left:25*60,run:false,iv:null};window.FT=FT;
function ftFmt(s){return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");}
function ftTotal(){return FT.mode==="pomo"?25*60:5*60;}
function ftPaint(){var e=document.getElementById("ftTime");if(e)e.textContent=ftFmt(FT.left);var r=document.getElementById("ftRing");if(r)r.style.setProperty("--p",(1-FT.left/ftTotal())*100);var b=document.getElementById("ftGo");if(b)b.textContent=FT.run?t12("pause"):t12("start");}
function ftToggle(){if(FT.run){clearInterval(FT.iv);FT.run=false;}else{FT.run=true;FT.iv=setInterval(function(){FT.left--;if(FT.left<=0){clearInterval(FT.iv);FT.run=false;FT.left=0;try{navigator.vibrate&&navigator.vibrate([200,100,200]);}catch(e){}try{toast("⏰ "+(FT.mode==="pomo"?t12("brk"):t12("pomo")));}catch(e){}FT.mode=FT.mode==="pomo"?"brk":"pomo";FT.left=ftTotal();}ftPaint();},1000);}ftPaint();}
function heroX(){var d=dat(),first=esc((d.name||"").split(" ")[0]);
  return '<div class="card hero sx"><div class="sxT"><small>'+t12("hi")+', '+first+'! 👋</small><h2>'+t12("ready")+'</h2><p>'+esc([d.course,d.batch].filter(Boolean).join(" · "))+'</p>'+
   '<div class="sxS"><div><b>'+money(d.fee,d.currency)+'</b><span>'+t("totalFee")+'</span></div><div><b>'+money(d.paid,d.currency)+'</b><span>'+t("paid")+'</span></div><div><b>'+money(d.due,d.currency)+'</b><span>'+t("due")+'</span></div></div></div>'+
   '<button class="sxChr ill" id="sxChr" title="'+t12("tapChr")+'">'+(GIA_ILL[chrKind()]||GIA_ILL.girl)+'</button></div>';}
function goalCard(){var g=goals(),K=["g1","g2","g3","g4"],n=K.filter(function(k){return g[k];}).length,p=Math.round(n/K.length*100);
  return '<div class="card gx"><div class="gxTop"><div><small>'+t12("goal")+'</small><b>'+n+' / '+K.length+' '+t12("tasks")+'</b></div><div class="gxMini">'+GIA_CHR[chrKind()]+'</div></div><div class="gxBar"><i style="width:'+p+'%"></i></div>'+
   K.map(function(k){return '<label class="gxI'+(g[k]?' on':'')+'"><input type="checkbox" data-goal="'+k+'"'+(g[k]?' checked':'')+'><span>'+t12(k)+'</span></label>';}).join("")+
   '<div class="gxQ">'+(n===K.length?t12("done"):t12("quote"))+'</div></div>';}
function focusCard(){return '<div class="card fx"><div class="fxH"><b>⏱ '+t12("focus")+'</b><div class="fxSeg"><button data-ft="pomo" class="'+(FT.mode==="pomo"?"on":"")+'">'+t12("pomo")+'</button><button data-ft="brk" class="'+(FT.mode==="brk"?"on":"")+'">'+t12("brk")+'</button></div></div>'+
  '<div class="fxRing" id="ftRing" style="--p:'+((1-FT.left/ftTotal())*100)+'"><div><span class="fxChr">'+GIA_CHR[chrKind()]+'</span></div></div><div class="fxTime" id="ftTime">'+ftFmt(FT.left)+'</div><div class="fxMsg">'+t12("focusMsg")+'</div>'+
  '<div class="fxBtns"><button class="fxGo" id="ftGo">'+(FT.run?t12("pause"):t12("start"))+'</button><button class="fxRs" id="ftRs">↺ '+t12("reset")+'</button></div></div>';}
(function(){
  var _vh=vHome;
  vHome=function(){var h=_vh.apply(this,arguments);try{var a=h.indexOf('<div class="card hero">'),q=quickRow(),b=h.indexOf(q);if(a>=0&&b>a)h=h.slice(0,a)+heroX()+h.slice(b,b+q.length)+goalCard()+focusCard()+h.slice(b+q.length);}catch(e){}return h;};
  document.addEventListener("click",function(e){
    var c=e.target.closest&&e.target.closest("#sxChr");if(c){lsSet("gia_stu_chr",chrKind()==="girl"?"boy":"girl");render();return;}
    var f=e.target.closest&&e.target.closest("[data-ft]");if(f){clearInterval(FT.iv);FT.run=false;FT.mode=f.getAttribute("data-ft");FT.left=ftTotal();render();return;}
    if(e.target.id==="ftGo"){ftToggle();return;} if(e.target.id==="ftRs"){clearInterval(FT.iv);FT.run=false;FT.left=ftTotal();ftPaint();return;}
  });
  document.addEventListener("change",function(e){var k=e.target.getAttribute&&e.target.getAttribute("data-goal");if(!k)return;var g=goals();g[k]=e.target.checked;lsSet(GK,JSON.stringify(g));if(Object.keys(g).filter(function(x){return g[x];}).length===4){try{confetti();}catch(x){}}render();});
})();

/* v13 clean login: add illustration + trust line */
(function(){
  function init(){ var lg=document.getElementById("login"); if(!lg) return; var c=lg.querySelector(".lcard"); if(!c||c.querySelector(".lgIll")) return;
    var t=/teacher/i.test(location.pathname); var ill=(typeof GIA_ILL!=="undefined")?(t?GIA_ILL.teacher:GIA_ILL.girl):"";
    if(ill){ var d=document.createElement("div"); d.className="lgIll"; d.innerHTML=ill; c.insertBefore(d,c.firstChild); }
    var tr=document.createElement("div"); tr.className="lgTrust"; tr.innerHTML="<span>🔒 Secure login</span><span>☁️ Synced with office</span>"; c.appendChild(tr); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();

/* ===== v13 · clean home layout: essentials on home, study tools in a sheet ===== */
var T13={en:{tools:"Study tools",goalT:"Daily goal",focusT:"Focus timer",wordT:"Word of the day",close:"Close",streakS:"day streak",attS:"attendance",jlS:"days to JLPT",fee:"Fees",next:"Next installment",allPaid:"All fees paid ✓",notice:"Latest notices",seeAll:"See all"},
 bn:{tools:"পড়াশোনার টুলস",goalT:"আজকের লক্ষ্য",focusT:"ফোকাস টাইমার",wordT:"আজকের শব্দ",close:"বন্ধ",streakS:"দিনের ধারা",attS:"উপস্থিতি",jlS:"JLPT পর্যন্ত দিন",fee:"ফি",next:"পরের কিস্তি",allPaid:"সব ফি পরিশোধ ✓",notice:"সাম্প্রতিক নোটিশ",seeAll:"সব দেখুন"}};
function t13(k){return (T13[lang]&&T13[lang][k])||T13.en[k]||k;}
var SHEET=null;
function wordCard(){var w=wod();return '<div class="card wod" data-act="flip"><div class="wodIn"><div class="wf"><small>🌸 '+t("wod")+'</small><div class="jp">'+esc(w[0])+'</div><div class="kn">'+esc(w[1])+'</div><small class="muted">'+t("tapFlip")+'</small></div><div class="wb"><div class="rm">'+esc(w[2])+'</div><div class="mn">'+esc(lang==="bn"?w[4]:w[3])+'</div></div></div></div>';}
function sheetHTML(k){return k==="goal"?goalCard():k==="focus"?focusCard():wordCard();}
function openSheet(k){SHEET=k;var o=document.getElementById("tSheet");if(!o){o=document.createElement("div");o.id="tSheet";o.className="tSheet";document.body.appendChild(o);o.addEventListener("click",function(e){if(e.target===o||e.target.closest(".tsX"))closeSheet();});}
  o.innerHTML='<div class="tsBox"><div class="tsBar"></div><div class="tsHead"><b>'+({goal:"🎯 "+t13("goalT"),focus:"⏱ "+t13("focusT"),word:"🌸 "+t13("wordT")}[k])+'</b><button class="tsX">✕</button></div><div class="tsBody">'+sheetHTML(k)+'</div></div>';o.classList.add("on");}
function closeSheet(){SHEET=null;var o=document.getElementById("tSheet");if(o)o.classList.remove("on");}
vHome=function(){
  var d=dat(),a=d.attendance||{},sk=streak(),jl=jlptDays(),ni=nextInst(d),nn=myNotices().slice(0,2),pct=d.fee?Math.min(100,Math.round(d.paid/d.fee*100)):0,g=goals(),gn=["g1","g2","g3","g4"].filter(function(k){return g[k];}).length,w=wod();
  return heroX()+quickRow()+ciCard()+todayCard()+
   '<div class="hS"><div><b>🔥 '+sk+'</b><span>'+t13("streakS")+'</span></div><div><b>'+(a.total?(a.pct||0)+'%':'—')+'</b><span>'+t13("attS")+'</span></div><div><b>🗾 '+jl[0]+'</b><span>'+t13("jlS")+'</span></div></div>'+
   '<div class="secT">'+t13("tools")+'</div><div class="hT">'+
     '<button class="hTi" data-sheet="goal"><i>🎯</i><b>'+gn+'/4</b><span>'+t13("goalT")+'</span><em style="--p:'+(gn*25)+'"></em></button>'+
     '<button class="hTi" data-sheet="focus"><i>⏱</i><b>'+ftFmt(FT.left)+'</b><span>'+t13("focusT")+'</span></button>'+
     '<button class="hTi" data-sheet="word"><i>🌸</i><b class="jp">'+esc(w[0])+'</b><span>'+t13("wordT")+'</span></button></div>'+
   '<div class="card hF"><div class="hFt"><b>💳 '+t13("fee")+'</b><span>'+pct+'%</span></div><div class="bar"><i style="width:'+pct+'%"></i></div>'+
     (ni?'<div class="hFn"><div><small>'+t13("next")+'</small><b>'+esc(ni.title)+' · '+esc(ni.due)+'</b></div><b>'+money(ni.amount,d.currency)+'</b></div>':'<div class="hFn"><b>'+t13("allPaid")+'</b></div>')+(d.due>0?payBtn():'')+'</div>'+
   (nn.length?'<div class="card hN"><div class="hFt"><b>📢 '+t13("notice")+'</b><button class="lnk" data-tab="notices">'+t13("seeAll")+' →</button></div>'+nn.map(function(n){return '<div class="hNi"><i>'+(n.pin?"📌":"📄")+'</i><div><b>'+esc(n.title)+'</b><small>'+esc(n.date)+'</small></div></div>';}).join("")+'</div>':'')+
   '<div class="out">'+t("updated")+': '+esc(String(D.updatedAt||"").slice(0,16).replace("T"," "))+'</div>';
};
(function(){var _r=render;render=function(){var x=_r.apply(this,arguments);try{if(SHEET){var b=document.querySelector("#tSheet .tsBody");if(b)b.innerHTML=sheetHTML(SHEET);}}catch(e){}return x;};
  document.addEventListener("click",function(e){var s=e.target.closest&&e.target.closest("[data-sheet]");if(s){openSheet(s.getAttribute("data-sheet"));return;}var tb=e.target.closest&&e.target.closest(".hN [data-tab]");if(tb){go(tb.getAttribute("data-tab"));}});})();

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();

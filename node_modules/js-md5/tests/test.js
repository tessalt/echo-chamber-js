(function(md5) {
  describe('md5', function() {
    describe('ascii', function() {
      describe('less than 64 bytes', function() {
        it('should be successful', function() {
          expect(md5('')).to.be('d41d8cd98f00b204e9800998ecf8427e');
          expect(md5('The quick brown fox jumps over the lazy dog')).to.be('9e107d9d372bb6826bd81d3542a419d6');
          expect(md5('The quick brown fox jumps over the lazy dog.')).to.be('e4d909c290d0fb1ca068ffaddf22cbd0');
        });
      });

      describe('more than 64 bytes', function() {
        it('should be successful', function() {
          expect(md5('The MD5 message-digest algorithm is a widely used cryptographic hash function producing a 128-bit (16-byte) hash value, typically expressed in text format as a 32 digit hexadecimal number. MD5 has been utilized in a wide variety of cryptographic applications, and is also commonly used to verify data integrity.')).to.be('f63872ef7bc97a8a8eadba6f0881de53');
        });
      });
    });

    describe('UTF8', function() {
      describe('less than 64 bytes', function() {
        it('should be successful', function() {
          expect(md5('中文')).to.be('a7bac2239fcdcb3a067903d8077c4a07');
          expect(md5('aécio')).to.be('ec3edbf3b05a449fc206a0138c739c3b');
          expect(md5('𠜎')).to.be('b90869aaf121210f6c563973fa855650');
        });
      });

      describe('more than 64 bytes', function() {
        it('should be successful', function() {
          expect(md5('訊息摘要演算法第五版（英語：Message-Digest Algorithm 5，縮寫為MD5），是當前電腦領域用於確保資訊傳輸完整一致而廣泛使用的雜湊演算法之一')).to.be('edce615b179e6e29be23145b77ebbd61');
          expect(md5('訊息摘要演算法第五版（英語：Message-Digest Algorithm 5，縮寫為MD5），是當前電腦領域用於確保資訊傳輸完整一致而廣泛使用的雜湊演算法之一（又譯雜湊演算法、摘要演算法等），主流程式語言普遍已有MD5的實作。')).to.be('ad36c9ab669a0ba9ce46d3ce9134de34');
        });
      });
    });

    describe('special length', function() {
      it('should be successful', function() {
        expect(md5('0123456780123456780123456780123456780123456780123456780')).to.be('a119de63e4b2398427da06dd780263b3');
        expect(md5('01234567801234567801234567801234567801234567801234567801')).to.be('ddafd84ebe63aebc4626b037a569d78b');
        expect(md5('0123456780123456780123456780123456780123456780123456780123456780')).to.be('9ea04d743618797ce464445b5785a630');
        expect(md5('01234567801234567801234567801234567801234567801234567801234567801234567')).to.be('658d914ae42c4938874b2e786ccda479');
        expect(md5('012345678012345678012345678012345678012345678012345678012345678012345678')).to.be('a083a3710d685793f1f17988bfe3c175');
        expect(md5('012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678')).to.be('2b21a843cfc31c8026a0d835bc91bc98');
      });
    });
  });

  describe('Array', function() {
    describe('Array', function() {
      it('should be successful', function() {
        expect(md5([])).to.be('d41d8cd98f00b204e9800998ecf8427e');
        expect(md5([0])).to.be('93b885adfe0da089cdf634904fd59f71');
        expect(md5([84, 104, 101, 32, 113, 117, 105, 99, 107, 32, 98, 114, 111, 119, 110, 32, 102, 111, 120, 32, 106, 117, 109, 112, 115, 32, 111, 118, 101, 114, 32, 116, 104, 101, 32, 108, 97, 122, 121, 32, 100, 111, 103])).to.be('9e107d9d372bb6826bd81d3542a419d6');
      });
    });

    describe('Uint8Array', function() {
      it('should be successful', function() {
        expect(md5(new Uint8Array([]))).to.be('d41d8cd98f00b204e9800998ecf8427e');
        expect(md5(new Uint8Array(371))).to.be('58f494c2a0fb65332110fb62ae5c4a74');
      });
    });

    describe('ArrayBuffer', function() {
      it('should be successful', function() {
        expect(md5(new ArrayBuffer(0))).to.be('d41d8cd98f00b204e9800998ecf8427e');
        expect(md5(new ArrayBuffer(1))).to.be('93b885adfe0da089cdf634904fd59f71');
      });
    });
  });
})(md5);

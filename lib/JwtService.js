/* 
  JWT's are created with 3 parts:
  * header (base64 encoded) - informs about the hashing algorythm and the type of the token
  * payload (base64 encoded) - Contains the data structure, usually an id, entity (ex. user) a
                                and metadata. The metadata are usually the claims that the entity can
                                request (ex. iss (issuer), exp (expiration time), sub (subject), aud (audience), etc.)
  * signature - created by hashing a concatenated string consisting of:
      - header
      - payload
      - secret (some secret string)
      
  In the end a JWT is a string with the form "header.payload.signature"
  
  ============ EXAMPLE ============
  Encoded JWT:
  -------------
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
  
  Decoded JWT:
  ------------
  HEADER:ALGORITHM & TOKEN TYPE
      {
        "alg": "HS256",
        "typ": "JWT"
      }
      
  PAYLOAD:DATA
      {
        "sub": "1234567890",
        "name": "John Doe",
        "admin": true
      }
      
  VERIFY SIGNATURE
      HMACSHA256(
        base64UrlEncode(header) + "." +
        base64UrlEncode(payload),
        secret
      )  
*/
const { base64Encode, base64Decode, verify, sign } = require('../utils/cryptoUtils');
const config = require('../config');

class JWT {
  encode (payload, secret) {
    let header = {
        typ: 'JWT',
        alg: 'HS256'
    };
    let jwt;
    
    // create first two parts - header.payload
    jwt = base64Encode(JSON.stringify(header)) + '.' + base64Encode(JSON.stringify(payload));

    // add 3rd part - signature
    jwt += '.' + sign(jwt, secret);
    
    return jwt;
  }
  
  decode (token, secret) {
    let segments = token.split('.');
    
    if (segments.length !== 3) {
      throw new Error('Token structure incorrect');
    }
    
    let header = JSON.parse(base64Decode(segments[0]));
    let payload = JSON.parse(base64Decode(segments[1]));
    
    // chech if the signature is correct
    let rawSignature = segments[0] + '.' + segments[1];
    if ( !verify(rawSignature, secret, segments[2]) ) {
      throw new Error('Verification failed');
    }
    
    // if everything is fine, get
    return payload;
  }

  createToken (user) {
    let payload = {
      email: user.email,
      id: user.username,
    }
    return this.encode(payload, config.hashingSecret);
  }

  checkToken (token) {
    let payload = this.decode(token, config.hashingSecret);
    
    // chcek if id and email are there
    return !!payload.id && !!payload.email;
  }
}


module.exports = JWT;
package world.inclub.appnotification.infraestructure.security.jwt.service;

import lombok.RequiredArgsConstructor;
import org.jose4j.jwa.AlgorithmConstraints;
import org.jose4j.jwa.AlgorithmConstraints.ConstraintType;
import org.jose4j.jwe.ContentEncryptionAlgorithmIdentifiers;
import org.jose4j.jwe.JsonWebEncryption;
import org.jose4j.jwe.KeyManagementAlgorithmIdentifiers;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.AesKey;
import org.jose4j.lang.JoseException;
import world.inclub.appnotification.infraestructure.security.jwt.beans.DecodedToken;
import world.inclub.appnotification.infraestructure.security.jwt.beans.KeolaRole;
import world.inclub.appnotification.infraestructure.security.jwt.beans.TokenBusinessInfo;
import world.inclub.appnotification.infraestructure.security.jwt.enumerations.LoggerEnum;
import world.inclub.appnotification.infraestructure.security.jwt.exception.TokenJwtException;


import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class JwtService
{

    final String secretHex;
    final String keyHex;

    public String buildJWT(TokenBusinessInfo tBKTokenData, String subject, String jti, Integer refreshCount, Long time,
                           Integer initialRefreshCount) throws JoseException
    {
        JwtClaims claims = new JwtClaims();
        claims.setExpirationTimeMinutesInTheFuture(time);
        claims.setJwtId(jti); // a unique identifier for the token
        claims.setIssuedAtToNow(); // when the token was issued/created (now)
        claims.setNotBeforeMinutesInThePast(2); // time before which the token is not yet valid (2 minutes ago)
        claims.setSubject(subject);
        claims.setClaim("email", tBKTokenData.getEmail());
        claims.setClaim("userId", tBKTokenData.getUserId());
        claims.setClaim("refreshCount", initialRefreshCount);
        claims.setStringListClaim("scope", tBKTokenData.getRoles().stream().map(KeolaRole::getAuthority).collect(Collectors.toList()));
        JsonWebSignature jws = new JsonWebSignature();
        SecretKeySpec keySign = new SecretKeySpec(secretHex.getBytes(), AlgorithmIdentifiers.HMAC_SHA256);
        jws.setPayload(claims.toJson());
        jws.setKey(keySign);
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.HMAC_SHA256);
        String jwt = jws.getCompactSerialization();

        return jwt;
    }

    public String encryptJWE(String payload) throws JoseException
    {
        Key key = new AesKey(hexStringToByteArray(keyHex));
        JsonWebEncryption jwe = new JsonWebEncryption();
        jwe.setPayload(payload);
        jwe.setAlgorithmHeaderValue(KeyManagementAlgorithmIdentifiers.A128GCMKW);
        jwe.setEncryptionMethodHeaderParameter(ContentEncryptionAlgorithmIdentifiers.AES_128_GCM);
        jwe.setKey(key);
        String serializedJwe = jwe.getCompactSerialization();
        return serializedJwe;
    }

    private String unencryptJWE(String payload) throws JoseException
    {
        Key key = new AesKey(hexStringToByteArray(keyHex));
        JsonWebEncryption jwe = new JsonWebEncryption();
        jwe.setAlgorithmConstraints(
                new AlgorithmConstraints(ConstraintType.WHITELIST, KeyManagementAlgorithmIdentifiers.A128GCMKW));
        jwe.setContentEncryptionAlgorithmConstraints(
                new AlgorithmConstraints(ConstraintType.WHITELIST, ContentEncryptionAlgorithmIdentifiers.AES_128_GCM));
        jwe.setKey(key);
        jwe.setCompactSerialization(payload);
        return jwe.getPayload();
    }

    
    private JwtClaims parseToken(String jwt) throws InvalidJwtException {
    	SecretKeySpec keySign = new SecretKeySpec(secretHex.getBytes(), AlgorithmIdentifiers.HMAC_SHA256);
        JwtConsumer jwtConsumer = new JwtConsumerBuilder().setRequireExpirationTime().setAllowedClockSkewInSeconds(30)
                .setRequireSubject().setVerificationKey(keySign).build();
        JwtClaims jwtClaims = jwtConsumer.processToClaims(jwt);
    	return jwtClaims;
    }
    
    public JwtClaims parseExpiredToken(String jwt) throws InvalidJwtException
    {
        SecretKeySpec keySign = new SecretKeySpec(secretHex.getBytes(), AlgorithmIdentifiers.HMAC_SHA256);
        JwtConsumer jwtConsumer = new JwtConsumerBuilder().setSkipAllValidators().setVerificationKey(keySign).build();
        JwtClaims jwtClaims = jwtConsumer.processToClaims(jwt);
        return jwtClaims;
    }

    private DecodedToken verifyJWT(String jwt) throws JoseException, InvalidJwtException, MalformedClaimException
    {
        JwtClaims jwtClaims = parseToken(jwt);
        DecodedToken user = new DecodedToken(jwtClaims);
        return user;
    }
    
    private DecodedToken verifyJWTExpired(String jwt) throws JoseException, InvalidJwtException, MalformedClaimException
    {
        JwtClaims jwtClaims = parseExpiredToken(jwt);
        DecodedToken user = new DecodedToken(jwtClaims);
        return user;
    }
    
    private boolean existInBlackList(DecodedToken jwtData) {
        return false;
    }

    public DecodedToken decodeJWT(String jweString) throws TokenJwtException
    {
        try
        {
            String jsonString = unencryptJWE(jweString);
            DecodedToken userJwt = verifyJWT(jsonString);
            if (!existInBlackList(userJwt)) 
            {
                return userJwt;
            }
            else
            {
                throw new TokenJwtException(LoggerEnum.JWT_EXPIRED);
            }
        }
        catch (JoseException | InvalidJwtException | MalformedClaimException e)
        {
            throw new TokenJwtException(LoggerEnum.JWT_SIGNATURE_INVALID, e);
        }
        catch (TokenJwtException e)
        {
            throw e;
        }
        catch (Exception e)
        {
            throw new TokenJwtException(LoggerEnum.PROCESS_ERROR, e.getMessage(), e);
        }
    }
    
    
    public DecodedToken decodeJWTNotBlacklistCheck(String jweString) throws TokenJwtException
    {
        try
        {
            String jsonString = unencryptJWE(jweString);
            DecodedToken userJwt = verifyJWTExpired(jsonString);
            return userJwt;
        }
        catch (JoseException | InvalidJwtException | MalformedClaimException e)
        {
            throw new TokenJwtException(LoggerEnum.JWT_SIGNATURE_INVALID, e);
        }
        catch (Exception e)
        {
            throw new TokenJwtException(LoggerEnum.PROCESS_ERROR, e.getMessage(), e);
        }
    }
	
    private static byte[] hexStringToByteArray(String s)
    {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2)
        {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4) + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }

}



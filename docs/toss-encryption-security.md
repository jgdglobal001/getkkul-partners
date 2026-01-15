# 토스페이먼츠 ENCRYPTION 보안 가이드

## 📌 개요

지급대행은 토스페이먼츠와 직접 계약하지 않은 셀러에게 돈을 지급하는 서비스입니다.
- **KYC 등 강화된 리스크 검토 절차** 적용
- **ENCRYPTION 보안** 필수 적용

### ENCRYPTION 보안이란?
- 토스페이먼츠에서 발급하는 **보안 키**를 사용
- API의 Request Body를 **JWE(JSON Web Encryption)**로 암호화
- 응답도 암호화되어 돌아옴 → 동일한 보안 키로 복호화 필요

---

## 🔐 ENCRYPTION 보안 적용 API

| API | 적용 여부 | 비고 |
|-----|----------|------|
| **셀러 등록** (`POST /v2/sellers`) | ✅ 적용 | Request Body 암호화 |
| **셀러 수정** (`POST /v2/sellers/{sellerId}`) | ✅ 적용 | Request Body 암호화 |
| **지급대행 요청** (`POST /v2/payouts`) | ✅ 적용 | Request Body 암호화 |
| **지급대행 요청 취소** (`POST /v2/payouts/{payoutId}/cancel`) | ❌ 미적용 | Request Body 없음 |

---

## 🔑 보안 키

### 발급 위치
- 토스페이먼츠 개발자센터 > **API 키 메뉴** > **API 개별 키** > **보안 키**

### 형식
- **64자 Hexadecimal 문자열**
- 예: `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`

### ⚠️ 주의사항
- 보안 키는 **절대 외부에 노출되면 안 됩니다**
- 환경 변수로 관리: `TOSS_PAYMENTS_SECURITY_KEY`

### 바이트 변환
JWE 암호화 시 보안 키를 바이트로 변환해야 합니다.

```javascript
// JavaScript/TypeScript
const securityKey = process.env.TOSS_PAYMENTS_SECURITY_KEY;
const key = new Uint8Array(
  securityKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
);
```

```python
# Python
import binascii
key = binascii.unhexlify(security_key)
```

```kotlin
// Kotlin
fun hexDecode(securityKey: String): ByteArray {
  return Hex.decode(securityKey)
}
```

---

## 🔒 암호화 (Encryption)

### JWE 헤더 필수 값

| 헤더 | 값 | 설명 |
|------|-----|------|
| `alg` | `dir` | 보안 키 암호화 알고리즘 (토스 키는 암호화 안 됨) |
| `enc` | `A256GCM` | JWE 암호화 알고리즘 |
| `iat` | ISO 8601 형식 | Request Body 생성 시간 |
| `nonce` | UUID | JWE 고유 식별자 |

### iat 형식
```
yyyy-MM-dd'T'HH:mm:ss±hh:mm
예: 2024-01-24T14:40:10+09:00
```
⚠️ **밀리초(.SSS) 포함하지 않음!**

### JavaScript/TypeScript 예제
```javascript
import * as jose from 'jose';

async function encrypt(payload: object, securityKey: string): Promise<string> {
  // 보안 키를 바이트로 변환
  const key = new Uint8Array(
    securityKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
  );

  // iat 생성 (KST, 밀리초 제외)
  const now = new Date();
  const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  const pad = (n: number) => n.toString().padStart(2, '0');
  const iat = `${kstDate.getUTCFullYear()}-${pad(kstDate.getUTCMonth() + 1)}-${pad(kstDate.getUTCDate())}T${pad(kstDate.getUTCHours())}:${pad(kstDate.getUTCMinutes())}:${pad(kstDate.getUTCSeconds())}+09:00`;

  // nonce 생성
  const nonce = crypto.randomUUID();

  // JWE 암호화
  const encryptedBody = await new jose.CompactEncrypt(
    new TextEncoder().encode(JSON.stringify(payload))
  )
    .setProtectedHeader({
      alg: 'dir',
      enc: 'A256GCM',
      iat: iat,
      nonce: nonce
    })
    .encrypt(key);

  return encryptedBody;
}
```

### Java 예제
```java
public static String encrypt(Object target, String securityKey) throws Exception {
  // 보안 키를 바이트 배열로 변환
  byte[] key = Hex.decode(securityKey);

  // JWE 헤더 생성
  JWEHeader jweHeader = new JWEHeader.Builder(JWEAlgorithm.DIR, EncryptionMethod.A256GCM)
    .customParam("iat", OffsetDateTime.now(ZoneId.of("Asia/Seoul")).toString())
    .customParam("nonce", UUID.randomUUID().toString())
    .build();

  // Request Body 암호화
  String payload = objectMapper.writeValueAsString(target);
  JWEObject jweObject = new JWEObject(jweHeader, new Payload(payload));
  jweObject.encrypt(new DirectEncrypter(key));
  return jweObject.serialize();
}
```

---

## 🔓 복호화 (Decryption)

ENCRYPTION 보안이 적용된 요청은 **응답도 암호화**되어 돌아옵니다.
- 성공 응답, 실패 응답 **모두 암호화**
- 암호화에 사용한 **같은 보안 키**로 복호화

### JavaScript/TypeScript 예제
```javascript
import * as jose from 'jose';

async function decrypt(encryptedResponse: string, securityKey: string): Promise<object> {
  // 보안 키를 바이트로 변환
  const key = new Uint8Array(
    securityKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
  );

  // JWE 복호화
  const { plaintext } = await jose.compactDecrypt(encryptedResponse, key);
  return JSON.parse(new TextDecoder().decode(plaintext));
}
```

### Java 예제
```java
public static String decrypt(String encryptedTarget, String securityKey) throws Exception {
  // 보안 키를 바이트로 변환
  byte[] key = Hex.decode(securityKey);

  // JWE 응답 복호화
  JWEObject jweObject = JWEObject.parse(encryptedTarget);
  jweObject.decrypt(new DirectDecrypter(key));

  if (jweObject.getState() == JWEObject.State.DECRYPTED) {
    return jweObject.getPayload().toString();
  } else {
    throw new JOSEException("Failed to decrypt");
  }
}
```

---

## 📋 API 호출 흐름

```
1. Request Body 생성
      ↓
2. JWE 헤더 생성 (alg, enc, iat, nonce)
      ↓
3. 보안 키로 Request Body 암호화
      ↓
4. 암호화된 Body로 API 호출
   - Header: Authorization: Basic {base64(secretKey:)}
   - Header: TossPayments-api-security-mode: ENCRYPTION
   - Body: {암호화된 JWE 문자열}
      ↓
5. 암호화된 응답 수신
      ↓
6. 보안 키로 응답 복호화
      ↓
7. JSON 응답 파싱
```

---

## 🛠️ 환경 변수

```env
# .env.local
TOSS_PAYMENTS_SECRET_KEY=test_sk_...     # 시크릿 키 (Basic Auth용)
TOSS_PAYMENTS_SECURITY_KEY=0123456...    # 보안 키 (JWE 암호화용, 64자 Hex)
```

---

## ⚠️ 주의사항

1. **iat 형식**: 밀리초 포함하면 안 됨
   - ❌ `2024-01-24T14:40:10.123+09:00`
   - ✅ `2024-01-24T14:40:10+09:00`

2. **nonce**: 매 요청마다 새로운 UUID 생성

3. **보안 키 노출 금지**: 환경 변수로만 관리

4. **응답 복호화 필수**: 성공/실패 모두 암호화됨

---

## 📚 참고 링크

- [토스페이먼츠 지급대행 문서](https://docs.tosspayments.com/guides/payouts/encryption)
- [토스페이먼츠 개발자센터](https://developers.tosspayments.com/)


# 토스페이먼츠 지급대행 요청 가이드

## 📌 개요

셀러에게 지급할 정산 금액을 확인했다면 **지급대행 요청 API**를 호출해주세요.

### ⚠️ 주의사항
- 최대 **100건**의 지급대행 요청을 한 번에 보낼 수 있음
- 1건의 지급대행 요청에는 **10억 미만**의 정산 금액을 이체할 수 있음
- 지급대행으로 셀러에게 지급한 정산 금액은 **회수하기 어려움**
- 토스페이먼츠는 지급 관련 책임이 없음
- ⚠️ **라이브 환경에서 테스트하면 수수료가 부과됩니다!**

---

## 📅 지급 유형 (scheduleType)

### 1️⃣ EXPRESS (바로지급)
- 요청 **당일**에 셀러에게 정산금 지급
- 지급 요청(`REQUESTED`) → 배치 시간에 맞춰 지급 처리 시작(`IN_PROGRESS`)
- **영업일 08:00~15:00** 사이에만 요청 가능
- ❌ 휴일·공휴일에는 오류 발생

### 2️⃣ SCHEDULED (예약지급)
- `payoutDate` 파라미터로 설정한 날짜에 정산금 지급
- **익일 오전 9시부터 1년 이내의 영업일**로만 설정 가능
- ❌ 휴일·공휴일 또는 과거 일자 입력 시 오류 발생

```
                    지급대행 유형 흐름

                      지급 요청
                         │
           ┌─────────────┴─────────────┐
           ▼                           ▼
      ┌─────────┐                ┌───────────┐
      │ EXPRESS │                │ SCHEDULED │
      │(바로지급)│                │ (예약지급) │
      └────┬────┘                └─────┬─────┘
           │                           │
           ▼                           ▼
    영업일 08:00~15:00           익일~1년 이내 영업일
           │                           │
           ▼                           ▼
      ┌─────────┐                ┌───────────┐
      │REQUESTED│                │ REQUESTED │
      └────┬────┘                └─────┬─────┘
           │ 배치 시간                  │ payoutDate
           ▼                           ▼
      ┌───────────┐              ┌───────────┐
      │IN_PROGRESS│              │IN_PROGRESS│
      └─────┬─────┘              └─────┬─────┘
            │                          │
            └──────────┬───────────────┘
                       ▼
                 ┌───────────┐
                 │ COMPLETED │
                 │  또는     │
                 │  FAILED   │
                 └───────────┘
```

---

## 📋 Request Body

### JSON 데이터
```json
{
  "refPayoutId": "my-payout-1",
  "destination": "seller-1",
  "scheduleType": "SCHEDULED",
  "payoutDate": "2024-08-08",
  "amount": {
    "currency": "KRW",
    "value": 5000
  },
  "transactionDescription": "8월대금지급",
  "metadata": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `refPayoutId` | string | ✅ | 가맹점에서 관리하는 지급대행 ID |
| `destination` | string | ✅ | 셀러 ID (토스페이먼츠에서 발급) |
| `scheduleType` | string | ✅ | `EXPRESS` (바로지급) 또는 `SCHEDULED` (예약지급) |
| `payoutDate` | string | ⚠️ | 예약지급 날짜 (SCHEDULED일 때 필수, `YYYY-MM-DD`) |
| `amount.currency` | string | ✅ | 통화 (`KRW`만 지원) |
| `amount.value` | number | ✅ | 지급 금액 (10억 미만) |
| `transactionDescription` | string | ❌ | 거래 설명 (통장에 표시) |
| `metadata` | object | ❌ | 추가 데이터 (key-value) |

---

## 🔐 API 호출

### cURL 예제
```bash
curl --request POST \
--url https://api.tosspayments.com/v2/payouts \
--header 'Authorization: Basic dGVzdF9za19vRWpiMGdtMjNQVzE5azc2QjRtbzhwR3dCSm41Og==' \
--header 'Content-Type: text/plain' \
--header 'TossPayments-api-security-mode: ENCRYPTION' \
--data '{JWE로 암호화된 데이터}'
```

### 필수 헤더

| 헤더 | 값 | 설명 |
|------|-----|------|
| `Authorization` | `Basic {base64(secretKey:)}` | API 개별 연동 키 > 시크릿 키 |
| `Content-Type` | `text/plain` | JWE 문자열이므로 text/plain |
| `TossPayments-api-security-mode` | `ENCRYPTION` | 암호화 모드 필수 |
| `Idempotency-Key` | `{uuid}` | 멱등키 (중복 지급 방지, 선택) |

### 💡 멱등키 사용 시 주의
- 멱등키를 추가하면 **중복 지급 없이 안전하게 처리**됨
- ⚠️ 멱등한 요청에서 에러가 반환되었을 때 **멱등키를 변경해서 재시도하는 것은 위험**
- 정확한 오류 원인을 토스페이먼츠로부터 확인한 다음에 다시 요청

---

## 📤 응답

지급대행이 성공적으로 요청되면 **JWE로 암호화된 Payout 객체**가 돌아옵니다.

### 복호화된 응답 예시
```json
{
  "version": "2022-11-16",
  "traceId": "13da4a1212d21f8b123bf90cb0da456d",
  "entityType": "payout-list",
  "entityBody": {
    "items": [
      {
        "id": "FPA_12345",
        "refPayoutId": "my-payout-1",
        "destination": "seller-1",
        "scheduleType": "SCHEDULED",
        "payoutDate": "2024-08-08",
        "amount": {
          "currency": "KRW",
          "value": 5000.0
        },
        "transactionDescription": "8월대금지급",
        "requestedAt": "2024-08-07T22:00:00+09:00",
        "status": "REQUESTED",
        "error": null,
        "metadata": {
          "key1": "value1",
          "key2": "value2"
        }
      }
    ]
  }
}
```

### 응답 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | 토스페이먼츠 지급대행 ID |
| `refPayoutId` | string | 가맹점 지급대행 ID |
| `destination` | string | 셀러 ID |
| `scheduleType` | string | `EXPRESS` 또는 `SCHEDULED` |
| `payoutDate` | string | 지급 예정일 |
| `amount` | object | 지급 금액 |
| `transactionDescription` | string | 거래 설명 |
| `requestedAt` | string | 요청 시각 (ISO 8601) |
| `status` | string | 지급대행 상태 |
| `error` | object | 에러 정보 (실패 시) |

---

## ⚠️ 에러 처리

### 요청 실패 시
- 지급대행 요청에 실패하면 **JWE로 암호화된 에러 객체**가 돌아옴
- 요청 건 **모두 실패**하고, **첫 번째 에러**에 대한 에러 객체가 반환됨
- 예: 3번, 51번 오류 → 전체 실패 + 3번 에러 객체 응답

### 은행 오류로 실패할 수 있어요
- 지급대행 요청이 끝났다고 **항상 성공하지는 않음**
- **한도 초과** 또는 **원천사 점검 중**에는 지급대행 실패
- `status`가 `FAILED`로 바뀌고, `error` 필드에서 에러 확인 가능
- 최종 성공/실패 상태는 **`payout.changed` 웹훅 이벤트**로 확인

---

## 🧪 실패 테스트용 계좌

은행 오류로 실패하는 케이스를 테스트하려면 아래 계좌를 셀러에 등록하세요:

| 계좌번호 | 은행 | 은행코드 |
|----------|------|----------|
| `77701777777` | 우리종합금융 | 295 |
| `3025353430761` | 농협 | 011 |
| `02004240994312` | 산업은행 | 002 |

---

## 🚫 지급대행 취소

### 취소 가능 조건
- **예약 지급대행(`SCHEDULED`)만** 취소 가능
- `REQUESTED` 상태일 때만 취소 가능
- `IN_PROGRESS` 이후에는 취소 불가

### 상태 변화 확인
- 지급대행 요청의 상태 변화는 **`payout.changed` 웹훅**으로 확인

---

## 🔔 웹훅

지급대행 상태 변경은 `payout.changed` 웹훅 이벤트로 받을 수 있습니다.

```json
{
  "eventType": "payout.changed",
  "payoutId": "FPA_12345",
  "status": "COMPLETED"
}
```

---

## 📚 참고 링크

- [토스페이먼츠 지급대행 문서](https://docs.tosspayments.com/guides/payouts/payout)
- [잔액 조회 가이드](./toss-balance-check.md)
- [셀러 등록 가이드](./toss-seller-registration.md)
- [ENCRYPTION 보안 가이드](./toss-encryption-security.md)

### 💡 멱등키 사용 시 주의
- 멱등키를 추가하면 **중복 지급 없이 안전하게 처리**됨
- ⚠️ 멱등한 요청에서 에러가 반환되었을 때 **멱등키를 변경해서 재시도하는 것은 위험**
- 정확한 오류 원인을 토스페이먼츠로부터 확인한 다음에 다시 요청


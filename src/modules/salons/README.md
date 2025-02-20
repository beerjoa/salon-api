# Salons module

## 개요

Salons 모듈은 살롱과 관련된 비즈니스 로직을 관리합니다.
과제에서 제공한 데이터를 기반으로 살롱의 예약 가능한 타임슬롯 목록을 반환합니다.


## 구조

- [dto](./dto): 과제에서 제공된 데이터를 기반으로 살롱의 예약 가능한 타임슬롯 목록을 반환하는 API의 요청 및 응답 데이터 타입을 정의한 DTO가 있습니다.
- [types](./types): 살롱 도메인 특화 타입 정의가 있습니다.
- [controllers](./controllers): 살롱의 예약 가능한 타임슬롯 목록을 반환하는 API의 컨트롤러가 있고, 정의된 DTO를 사용합니다.
- [services](./services): 살롱의 예약 가능한 타임슬롯 목록을 반환하는 비즈니스 로직이 있습니다.
  - [salons.service.ts](./services/salons.service.ts) 파일에는 살롱의 예약 가능한 타임슬롯 목록을 반환하는 비즈니스 로직이 있습니다.

## 구현 내용

### POST [/api/salons/getTimeSlots](./src/modules/salons/README.md)

## Example
### Request

```json
{
  "start_day_identifier" : "20210509",
  "days": 3,
  "service_duration": 3600,
  "timeslot_interval": 1800,
  "is_ignore_schedule": false,
  "is_ignore_workhour": true,
  "timezone_identifier": "Asia/Seoul"
}
```

### Response
```json
[
  {
    "start_of_day": 1620486000,
    "day_modifier": 7,
    "is_day_off": false,
    "timeslots": [
      {
        "begin_at": 1620534600,
        "end_at": 1620535500,
      },
      ...,
      {
        "begin_at": 1620567000,
        "end_at": 1620570600,
      }
    ]
  },
  {
    "start_of_day": 1620572400,
    "day_modifier": 1,
    "is_day_off": false,
    "timeslots": [
      {
        "begin_at": 1620572400,
        "end_at": 1620576000,
      },
      ...,
      {
        "begin_at": 1620653400,
        "end_at": 1620657000,
      }
    ]
  },
  {
    "start_of_day": 1620658800,
    "day_modifier": 2,
    "is_day_off": false,
    "timeslots": [
      {
        "begin_at": 1620658800,
        "end_at": 1620662400,
      },
      ...,
      {
        "begin_at": 1620739800,
        "end_at": 1620743400,
      }
    ]
  }
]
```

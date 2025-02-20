# Shared

## 개요

Shared 모듈은 공통 로직을 관리합니다.
공통 로직을 추상화하여 도메인에 상관없이 사용할 수 있도록 합니다.

## 폴더 구조

- [services](./services)
  - [business-hours.service.ts](./services/business-hours.service.ts): 특정 도메인의 영업시간 정보를 관리하는 서비스가 있습니다.
  - [time-slot.service.ts](./services/time-slot.service.ts): 특정 도메인의 예약 가능한 타임슬롯 목록을 반환하는 비즈니스 로직이 있습니다.
- [types](./types): 공통 로직을 사용하는 모듈에서 사용할 수 있는 타입 정의가 있습니다.
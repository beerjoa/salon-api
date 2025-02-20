# Salon API

## 소개

살롱의 고객이 예약을 잡을 수 있는 `DayTimetable` 리스트를 반환하는 백엔드 서버입니다.

- [data/workhours.json](./data/workhours.json) 파일에 살롱의 영업 시간 정보가 있습니다.
- [data/events.json](./data/events.json) 파일에 살롱의 이미 예약된 Event 정보가 있습니다.

## 기술 스택

- Node.js
- NestJS
- TypeScript

## 구조
- [data](./data): 과제에서 제공된 데이터 파일 (event, workhours)
- [src/modules/salons](./src/modules/salons/README.md): 살롱 모듈
- [src/shared](./src/shared/README.md): 공통 모듈
- [src/common](./src/common/README.md): 공통 유틸리티 및 전역 설정

## 실행 방법

1. 프로젝트 루트 디렉토리에서 다음 명령을 실행합니다.

```bash
$ npm install
$ npm run start
```

2. Health Check

```bash
$ curl -X GET 'http://localhost:3000/api'
```

3. 살롱의 예약 가능한 타임슬롯 목록 조회

```bash
$ curl -X POST 'http://localhost:3000/api/salons/getTimeSlots' \
  -H 'Content-Type: application/json' \
  -d '{
    "start_day_identifier": "20210509",
    "days": 3,
    "service_duration": 3600,
    "timeslot_interval": 1800,
    "is_ignore_schedule": false,
    "is_ignore_workhour": true,
    "timezone_identifier": "Asia/Seoul"
  }'
```

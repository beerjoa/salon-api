import { DateTime } from 'luxon';

import { IWorkHour } from '#shared/types/work-hour.interface';

/**
 * 영업 시간 관련 모의 데이터를 정의한 상수들
 */

// 영업일 시작 식별자
export const MOCKED_START_DAY_IDENTIFIER: string = '20250217';

// 타임존 식별자
export const MOCKED_TIMEZONE_IDENTIFIER: string = 'Asia/Seoul';

// 워크 아워 정보
export const MOCKED_WORK_HOUR: IWorkHour = {
  weekday: 1,
  open_interval: 32400,
  close_interval: 64800,
  is_day_off: false,
};

// mock된 날짜 객체 (Luxon DateTime)
export const MOCKED_DATE: DateTime = DateTime.fromFormat(
  MOCKED_START_DAY_IDENTIFIER,
  'yyyyMMdd',
  { zone: MOCKED_TIMEZONE_IDENTIFIER },
);

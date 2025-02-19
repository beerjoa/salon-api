import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { join } from 'path';
import { readFileSync } from 'fs';

import { GetTimeSlotsRequestDto } from '##salons/dto/request/get-time-slots.request.dto';
import { DayTimetable } from '##salons/dto/day-timetable.dto';
import { Timeslot } from '##salons/dto/timeslot.dto';

/**
 * 요일 문자열 매핑
 */
export type TDay = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

/**
 * 요일 식별자 Enum
 */
export enum EDayModifier {
  sun = 1,
  mon = 2,
  tue = 3,
  wed = 4,
  thu = 5,
  fri = 6,
  sat = 7,
}

/**
 * 이벤트 데이터 타입
 * @type {Object} TEvent
 * @property {number} begin_at - 이벤트 시작 시간 (Unix 타임스탬프)
 * @property {number} end_at - 이벤트 종료 시간 (Unix 타임스탬프)
 * @property {number} created_at - 이벤트 생성 시간 (Unix 타임스탬프)
 * @property {number} updated_at - 이벤트 업데이트 시간 (Unix 타임스탬프)
 */
export type TEvent = {
  begin_at: number;
  end_at: number;
  created_at: number;
  updated_at: number;
};

/**
 * 영업시간 데이터 타입
 * @type {Object} TWorkHour
 * @property {number} close_interval - 영업시간 종료 시간 (Unix 타임스탬프)
 * @property {boolean} is_day_off - 휴무일 여부
 * @property {string} key - 요일 식별자
 * @property {number} open_interval - 영업시간 시작 시간 (Unix 타임스탬프)
 * @property {number} weekday - 요일 식별자
 */
export type TWorkHour = {
  close_interval: number;
  is_day_off: boolean;
  key: TDay;
  open_interval: number;
  weekday: EDayModifier;
};

/**
 * 영업시간 시작/종료 시간 타입
 * @type {Object} TBusinessHours
 * @property {DateTime} openTime - 영업시간 시작 시간
 * @property {DateTime} closeTime - 영업시간 종료 시간
 */
export type TBusinessHours = {
  openTime: DateTime;
  closeTime: DateTime;
};

/**
 * 비즈니스 시간 정보 타입 - 영업시간과 휴무 여부 포함
 * @type {Object} TBusinessHoursInfo
 * @property {TBusinessHours} businessHours - 영업시간 정보
 * @property {boolean} isDayOff - 휴무 여부
 */
export type TBusinessHoursInfo = {
  businessHours: TBusinessHours;
  isDayOff: boolean;
};

/**
 * 살롱 서비스
 * @class SalonsService
 * @description 살롱 서비스 클래스
 *
 * @constructor
 */
@Injectable()
export class SalonsService {
  private readonly workHours: TWorkHour[];
  private readonly events: TEvent[];

  constructor() {
    // workhours.json 파일은 [{ "close_interval": number, "is_day_off": boolean, "key": string, "open_interval": number, "weekday": number }, ...] 형식임
    const workHoursPath: string = join(process.cwd(), 'data', 'workhours.json');
    this.workHours = JSON.parse(readFileSync(workHoursPath, 'utf8'));

    // events.json 파일은 [ { "begin_at": number, "end_at": number, ... }, ... ] 형식임
    const eventsPath: string = join(process.cwd(), 'data', 'events.json');
    this.events = JSON.parse(readFileSync(eventsPath, 'utf8'));
  }

  /**
   * 타임슬롯 조회
   * @method getTimeSlots
   * @description 요청 날짜 및 옵션에 따라 타임슬롯을 계산하여 반환
   *
   * @param {GetTimeSlotsRequestDto} body - 요청 파라미터
   * @returns {Array<DayTimetable>} 각 날짜별 타임슬롯 배열
   */
  public getTimeSlots(body: GetTimeSlotsRequestDto): Array<DayTimetable> {
    const dayTimetables: Array<DayTimetable> = [];
    const startDay: DateTime = DateTime.fromFormat(
      body.start_day_identifier,
      'yyyyMMdd',
      {
        zone: body.timezone_identifier,
      },
    );

    // 각 날짜에 대해 타임슬롯 계산
    for (let i = 0; i < body.days; i++) {
      const currentDay: DateTime = startDay.plus({ days: i });
      const { businessHours, isDayOff } = this.resolveBusinessHoursForDay(
        currentDay,
        body.is_ignore_workhour,
      );

      const dayTimetable: DayTimetable = {
        start_of_day: currentDay.toSeconds(),
        day_modifier: currentDay.weekday,
        is_day_off: isDayOff,
        timeslots: [],
      };

      // 휴무일은 타임슬롯 계산하지 않음
      if (!isDayOff) {
        dayTimetable.timeslots = this.calculateTimeSlotsForBusinessHours(
          businessHours,
          body.timeslot_interval,
          body.service_duration,
          body.is_ignore_schedule,
        );
      }
      dayTimetables.push(dayTimetable);
    }
    return dayTimetables;
  }

  /**
   * 영업시간 및 휴무 여부 결정
   *
   * - is_ignore_workhour가 true인 경우 하루 전체(00:00 ~ 23:59:59)를 영업시간으로 설정하고, 휴무 여부는 false로 반환
   * - is_ignore_workhour가 false인 경우 workhours.json을 참조하여 영업시간 및 휴무 여부를 반환
   *
   * @param {DateTime} date - 타겟 날짜
   * @param {boolean} isIgnoreWorkHour - workhours 무시 여부
   * @returns {TBusinessHoursInfo} 비즈니스 시간 정보 (영업시간, 휴무 여부)
   */
  private resolveBusinessHoursForDay(
    date: DateTime,
    isIgnoreWorkHour: boolean,
  ): TBusinessHoursInfo {
    if (isIgnoreWorkHour) {
      return {
        businessHours: {
          openTime: date.startOf('day'),
          closeTime: date.endOf('day'),
        },
        isDayOff: false,
      };
    } else {
      const workHour: TWorkHour = this.getWorkHourForDay(date);
      return {
        businessHours: this.getBusinessHours(date, workHour),
        isDayOff: workHour.is_day_off,
      };
    }
  }

  /**
   * 특정 날짜의 영업시간 조회
   *
   * @param {DateTime} date - 타겟 날짜
   * @returns {TWorkHour} 해당 날짜의 영업시간 데이터
   * @throws 영업시간 정보가 없는 경우 오류 발생
   */
  private getWorkHourForDay(date: DateTime): TWorkHour {
    // Luxon: Monday = 1, …, Sunday = 7
    // workhours.json: Sunday = 1, Monday = 2, …, Saturday = 7
    const mappedWeekday: EDayModifier = (date.weekday % 7) + 1;
    const workHour: TWorkHour | undefined = this.workHours.find(
      (period: TWorkHour) => period.weekday === mappedWeekday,
    );
    if (!workHour) {
      throw new Error(`Work period not found for weekday ${mappedWeekday}`);
    }
    return workHour;
  }

  /**
   * 영업시간 내의 개점 및 마감 시간 계산
   *
   * @param {DateTime} date - 타겟 날짜
   * @param {TWorkHour} workHour - 타겟 날짜의 영업시간 데이터
   * @returns {TBusinessHours} 영업시간의 시작 및 종료 시간
   */
  private getBusinessHours(
    date: DateTime,
    workHour: TWorkHour,
  ): TBusinessHours {
    const startOfDay: DateTime = date.startOf('day');
    const openTime: DateTime = startOfDay.plus({
      seconds: workHour.open_interval,
    });
    const closeTime: DateTime = startOfDay.plus({
      seconds: workHour.close_interval,
    });
    return { openTime, closeTime };
  }

  /**
   * 영업시간 내 예약 가능한 타임슬롯 계산
   *
   * - 예약 시작 시간에 서비스 소요 시간(service_duration)을 더한 시간이 영업 마감 시간 이내여야 함
   * - is_ignore_schedule가 false인 경우 기존 예약 이벤트와 겹치지 않는 타임슬롯만 반환
   *
   * @param {TBusinessHours} businessHours - 영업시간의 시작 및 종료 시간
   * @param {number} slotInterval - 후보 타임슬롯 간격 (초)
   * @param {number} serviceDuration - 예약 서비스 소요 시간 (초)
   * @param {boolean} ignoreSchedule - 이벤트 데이터 고려 여부 (true이면 무시)
   * @returns 예약 가능한 타임슬롯 배열
   */
  private calculateTimeSlotsForBusinessHours(
    businessHours: TBusinessHours,
    slotInterval: number,
    serviceDuration: number,
    ignoreSchedule: boolean,
  ): Timeslot[] {
    const timeslots: Timeslot[] = [];
    let candidateTime: DateTime = businessHours.openTime;

    while (
      candidateTime.plus({ seconds: serviceDuration }) <=
      businessHours.closeTime
    ) {
      const candidateFinish: DateTime = candidateTime.plus({
        seconds: serviceDuration,
      });
      // ignoreSchedule가 true이면 이벤트 충돌 검사 없이 타임슬롯 추가
      if (
        ignoreSchedule ||
        this.isTimeSlotAvailable(candidateTime, candidateFinish)
      ) {
        timeslots.push({
          begin_at: candidateTime.toSeconds(),
          end_at: candidateFinish.toSeconds(),
          begin_at_formatted: candidateTime.toFormat('yyyyMMdd HH:mm:ss'),
          end_at_formatted: candidateFinish.toFormat('yyyyMMdd HH:mm:ss'),
        });
      }
      candidateTime = candidateTime.plus({ seconds: slotInterval });
    }
    return timeslots;
  }

  /**
   * 후보 타임슬롯이 예약된 이벤트와 겹치는지 확인
   *
   * 두 시간 간격 [slotStart, slotEnd]와 [event.begin_at, event.end_at]이 겹치면 false 반환
   *
   * @param slotStart - 후보 타임슬롯 시작 시간
   * @param slotEnd - 후보 타임슬롯 종료 시간 (시작 시간 + serviceDuration)
   * @returns 겹치지 않으면 true, 겹치면 false
   */
  private isTimeSlotAvailable(slotStart: DateTime, slotEnd: DateTime): boolean {
    return !this.events.some((event: TEvent): boolean => {
      const eventStart: DateTime = DateTime.fromSeconds(event.begin_at);
      const eventEnd: DateTime = DateTime.fromSeconds(event.end_at);
      return slotStart < eventEnd && eventStart < slotEnd;
    });
  }
}

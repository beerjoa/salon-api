import { Injectable } from '@nestjs/common';
import { GetTimeSlotsRequestDto } from '../dto/request/get-time-slots.request.dto';
import { DayTimetable } from '../dto/day-timetable.dto';
import { DateTime } from 'luxon';
import { join } from 'path';
import { readFileSync } from 'fs';
import { Timeslot } from '@/modules/salons/dto/timeslot.dto';

/**
 * 요일 문자열 매핑
 */
enum EDay {
  SUNDAY = 'sun',
  MONDAY = 'mon',
  TUESDAY = 'tue',
  WEDNESDAY = 'wed',
  THURSDAY = 'thu',
  FRIDAY = 'fri',
  SATURDAY = 'sat',
}

/**
 * 요일 숫자 매핑
 * Luxon: Monday = 1, …, Sunday = 7
 * workhours.json: Sunday = 1, Monday = 2, …, Saturday = 7
 */
enum EDayModifier {
  sun = 1,
  mon = 2,
  tue = 3,
  wed = 4,
  thu = 5,
  fri = 6,
  sat = 7,
}

/**
 * 이벤트 데이터
 */
interface IEvent {
  begin_at: number;
  end_at: number;
  created_at: number;
  updated_at: number;
}

/**
 * 영업 시간 (workhours에서 사용 가능한 기간)
 */
interface IWorkHour {
  close_interval: number;
  is_day_off: boolean;
  key: EDay;
  open_interval: number;
  weekday: EDayModifier;
}

type TBusinessHours = {
  openTime: DateTime;
  closeTime: DateTime;
};

/**
 * 살롱 서비스
 */
@Injectable()
export class SalonsService {
  private readonly workHours: IWorkHour[];
  private readonly events: IEvent[];

  constructor() {
    // workhours.json 파일은 [{ "close_interval": number, "is_day_off": boolean, "key": string, "open_interval": number, "weekday": number }, ...] 형식임
    const workHoursPath: string = join(process.cwd(), 'data', 'workhours.json');
    this.workHours = JSON.parse(readFileSync(workHoursPath, 'utf8'));

    // events.json 파일은 [ { "begin_at": number, "end_at": number, ... }, ... ] 형식임
    const eventsPath: string = join(process.cwd(), 'data', 'events.json');
    this.events = JSON.parse(readFileSync(eventsPath, 'utf8'));
  }

  /**
   * 타임슬롯 계산
   *
   * @param body - 요청 파라미터
   * @returns 각 날짜의 타임슬롯 배열
   */
  public getTimeSlots(body: GetTimeSlotsRequestDto): DayTimetable[] {
    const {
      start_day_identifier,
      service_duration,
      timezone_identifier,
      days = 1,
      timeslot_interval = 1800, // 30 minutes
    } = body;

    const dayTimetables: DayTimetable[] = [];
    const startDay: DateTime = DateTime.fromFormat(
      start_day_identifier,
      'yyyyMMdd',
      {
        zone: timezone_identifier,
      },
    );

    for (let i = 0; i < days; i++) {
      const currentDay: DateTime = startDay.plus({ days: i });
      const workHour: IWorkHour = this.getWorkHourForDay(currentDay);
      const dayTimetable: DayTimetable = {
        start_of_day: currentDay.toSeconds(),
        day_modifier: currentDay.weekday,
        is_day_off: workHour.is_day_off,
        timeslots: [],
      };

      // 휴무일은 타임슬롯이 없음
      if (!workHour.is_day_off) {
        const businessHours: TBusinessHours = this.getBusinessHours(
          currentDay,
          workHour,
        );
        dayTimetable.timeslots = this.calculateTimeSlotsForBusinessHours(
          businessHours,
          timeslot_interval,
          service_duration,
        );
      }

      dayTimetables.push(dayTimetable);
    }

    return dayTimetables;
  }

  /**
   * 특정 날짜의 영업 시간 조회
   *
   * @param date - 타겟 날짜
   * @returns 타겟 날짜의 영업 시간
   * @throws 영업 시간이 없는 경우 오류 발생
   */
  private getWorkHourForDay(date: DateTime): IWorkHour {
    // Luxon: Monday = 1, …, Sunday = 7
    // workhours.json: Sunday = 1, Monday = 2, …, Saturday = 7
    const mappedWeekday: EDayModifier = (date.weekday % 7) + 1;
    const workHour: IWorkHour | undefined = this.workHours.find(
      (period: IWorkHour) => period.weekday === mappedWeekday,
    );
    if (!workHour) {
      throw new Error(`Work period not found for weekday ${mappedWeekday}`);
    }
    return workHour;
  }

  /**
   * 영업 시간 계산
   *
   * @param date - 타겟 날짜
   * @param workHour - 타겟 날짜의 영업 시간
   * @returns 영업 시간 포함 시작 및 종료 시간
   */
  private getBusinessHours(
    date: DateTime,
    workHour: IWorkHour,
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
   * - 예약 시간 간격([start, start + service_duration])이 기존 예약 이벤트와 겹치지 않아야 함
   *
   * @param businessHours - 영업시간의 시작 및 마감 시간
   * @param slotInterval - 각 후보 타임슬롯 간격 (초)
   * @param serviceDuration - 예약 서비스 소요 시간 (초)
   * @returns 예약 가능한 타임슬롯 배열
   */
  private calculateTimeSlotsForBusinessHours(
    businessHours: TBusinessHours,
    slotInterval: number,
    serviceDuration: number,
  ): Timeslot[] {
    const timeslots: Timeslot[] = [];
    let candidateTime: DateTime = businessHours.openTime;
    // 후보 타임슬롯의 예약 종료시간이 영업 마감 시간 이내인지 확인
    while (
      candidateTime.plus({ seconds: serviceDuration }) <=
      businessHours.closeTime
    ) {
      const candidateFinish: DateTime = candidateTime.plus({
        seconds: serviceDuration,
      });
      // 이미 예약된 이벤트와 겹치는지 확인 (겹치지 않을 경우에만 타임슬롯 추가)
      if (this.isTimeSlotAvailable(candidateTime, candidateFinish)) {
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
    return !this.events.some((event: IEvent): boolean => {
      const eventStart: DateTime = DateTime.fromSeconds(event.begin_at);
      const eventEnd: DateTime = DateTime.fromSeconds(event.end_at);
      // 두 시간 간격이 겹치는지 여부 (겹치면 true)
      return slotStart < eventEnd && eventStart < slotEnd;
    });
  }
}

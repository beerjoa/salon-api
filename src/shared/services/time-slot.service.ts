import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

import type { IBusinessHours } from '#shared/types/business-hours.interface';
import type { IEvent } from '#shared/types/event.interface';
import type { ITimeSlot } from '#shared/types/time-slot.interface';

/**
 * 예약 타임슬롯 생성 서비스
 *
 * @class TimeSlotService<TBusinessHours, TTimeSlot>
 */
@Injectable()
export class TimeSlotService<
  TBusinessHours extends IBusinessHours = IBusinessHours,
  TTimeSlot extends ITimeSlot = ITimeSlot,
> {
  private readonly events: IEvent[];

  constructor() {
    const eventsPath: string = join(process.cwd(), 'data', 'events.json');
    this.events = JSON.parse(readFileSync(eventsPath, 'utf8'));
  }

  /**
   * 예약 가능한 타임슬롯 목록 계산
   *
   * @param {TBusinessHours} businessHours - 영업시간 정보
   * @param {number} slotInterval - 후보 타임슬롯 간격(초)
   * @param {number} serviceDuration - 서비스 소요시간(초)
   * @param {boolean} isIgnoreSchedule - 기존 예약 무시 여부
   * @returns {TTimeSlot[]} 예약 가능한 타임슬롯 배열
   */
  public calculateTimeSlotsForBusinessHours(
    businessHours: TBusinessHours,
    slotInterval: number,
    serviceDuration: number,
    isIgnoreSchedule: boolean,
  ): TTimeSlot[] {
    const timeslots: TTimeSlot[] = [];
    let candidateTime: DateTime = businessHours.openTime;
    while (
      candidateTime.plus({ seconds: serviceDuration }) <=
      businessHours.closeTime
    ) {
      const candidateFinish: DateTime = candidateTime.plus({
        seconds: serviceDuration,
      });
      if (
        isIgnoreSchedule ||
        this.isTimeSlotAvailable(candidateTime, candidateFinish)
      ) {
        const newTimeSlot = {
          begin_at: candidateTime.toSeconds(),
          end_at: candidateFinish.toSeconds(),
          begin_at_formatted: candidateTime.toFormat('yyyyMMdd HH:mm:ss'),
          end_at_formatted: candidateFinish.toFormat('yyyyMMdd HH:mm:ss'),
        } as TTimeSlot;
        timeslots.push(newTimeSlot);
      }
      candidateTime = candidateTime.plus({ seconds: slotInterval });
    }
    return timeslots;
  }

  /**
   * 검사 후보 타임슬롯과 예약 이벤트의 시간 충돌 여부
   *
   * @param {DateTime} slotStart - 후보 타임슬롯 시작 시간
   * @param {DateTime} slotEnd - 후보 타임슬롯 종료 시간
   * @returns {boolean} 충돌 없으면 true, 있으면 false
   */
  private isTimeSlotAvailable(slotStart: DateTime, slotEnd: DateTime): boolean {
    return !this.events.some((event: IEvent): boolean => {
      const eventStart: DateTime = DateTime.fromSeconds(event.begin_at);
      const eventEnd: DateTime = DateTime.fromSeconds(event.end_at);
      return slotStart < eventEnd && eventStart < slotEnd;
    });
  }
}

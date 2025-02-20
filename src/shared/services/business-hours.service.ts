import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

import type {
  IBusinessHours,
  IBusinessHoursInfo,
} from '#shared/types/business-hours.interface';
import type { IWorkHour } from '#shared/types/work-hour.interface';

/**
 * 비즈니스 시간 계산 서비스
 *
 * @class BusinessHoursService<TBusinessHoursInfo>
 */
@Injectable()
export class BusinessHoursService<
  TBusinessHoursInfo extends IBusinessHoursInfo = IBusinessHoursInfo,
> {
  private readonly workHours: IWorkHour[];

  constructor() {
    const workHoursPath: string = join(process.cwd(), 'data', 'workhours.json');
    this.workHours = JSON.parse(readFileSync(workHoursPath, 'utf8'));
  }

  /**
   * 지정 날짜의 영업시간 조회 및 휴무 여부 결정
   *
   * @param {DateTime} date - 타겟 날짜
   * @param {boolean} isIgnoreWorkHour - workhours 무시 여부
   * @returns {TBusinessHoursInfo} 영업시간 정보 및 휴무 여부
   */
  public resolveBusinessHoursForDay(
    date: DateTime,
    isIgnoreWorkHour: boolean,
  ): TBusinessHoursInfo {
    let businessHoursInfo: TBusinessHoursInfo;
    if (isIgnoreWorkHour) {
      const defaultBusinessHours: IBusinessHours = {
        openTime: date.startOf('day'),
        closeTime: date.endOf('day'),
      };
      businessHoursInfo = {
        businessHours: defaultBusinessHours,
        isDayOff: false,
      } as TBusinessHoursInfo;
    } else {
      const workHour: IWorkHour = this.getWorkHourForDay(date);
      businessHoursInfo = {
        businessHours: this.getBusinessHours(date, workHour),
        isDayOff: workHour.is_day_off,
      } as TBusinessHoursInfo;
    }
    return businessHoursInfo;
  }

  /**
   * 조회 특정 날짜의 영업시간 데이터
   *
   * @param {DateTime} date - 타겟 날짜
   * @returns {IWorkHour} 해당 날짜의 영업시간 데이터
   * @throws {Error} 영업시간 정보 없음
   */
  private getWorkHourForDay(date: DateTime): IWorkHour {
    const mappedWeekday: number = (date.weekday % 7) + 1;
    const workHour: IWorkHour | undefined = this.workHours.find(
      (period: IWorkHour) => period.weekday === mappedWeekday,
    );
    if (!workHour) {
      throw new Error('영업시간 정보가 없습니다.');
    }
    return workHour;
  }

  /**
   * 계산 지정 날짜의 영업 시작 및 종료 시간
   *
   * @param date - 타겟 날짜
   * @param workHour - 해당 날짜의 영업시간 데이터
   * @returns 영업시간 정보
   */
  private getBusinessHours(
    date: DateTime,
    workHour: IWorkHour,
  ): IBusinessHours {
    const startOfDay: DateTime = date.startOf('day');
    const openTime: DateTime = startOfDay.plus({
      seconds: workHour.open_interval,
    });
    const closeTime: DateTime = startOfDay.plus({
      seconds: workHour.close_interval,
    });
    return { openTime, closeTime };
  }
}

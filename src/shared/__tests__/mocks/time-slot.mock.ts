import {
  MOCKED_DATE,
  MOCKED_WORK_HOUR,
} from '#shared/__tests__/mocks/business-hours.mock';
import { IBusinessHours } from '#shared/types/business-hours.interface';

export const MOCKED_BUSINESS_HOURS: IBusinessHours = {
  openTime: MOCKED_DATE.plus({ seconds: MOCKED_WORK_HOUR.open_interval }),
  closeTime: MOCKED_DATE.plus({ seconds: MOCKED_WORK_HOUR.close_interval }),
};

export const MOCKED_SLOT_INTERVAL: number = 3600;
export const MOCKED_SERVICE_DURATION: number = 1800;

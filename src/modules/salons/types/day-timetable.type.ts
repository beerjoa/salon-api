import { TTimeslot } from '##salons/types/timeslot.type';

export type TDayTimetable = {
  start_of_day: number; // Unixstamp seconds
  day_modifier: number;
  is_day_off: boolean;
  timeslots: TTimeslot[];
};

/**
 * 과제 내 관련 모델에 명시된,
 * 예약 타임슬롯 정보를 나타내는 인터페이스
 * 도메인 특화 확장이 필요할 경우, 추가 필드를 확장하여 사용 가능
 * *_formatted 필드는 표시 용도로 사용되며, 실제 데이터베이스에는 저장되지 않음 > 제거 필요
 *
 * @interface ITimeSlot
 * @property {number} begin_at - 타임슬롯 시작 시간
 * @property {number} end_at - 타임슬롯 종료 시간
 * @property {string} begin_at_formatted - 타임슬롯 시작 시간 표시 형식 > 제거 필요
 * @property {string} end_at_formatted - 타임슬롯 종료 시간 표시 형식 > 제거 필요
 */
export interface ITimeSlot {
  begin_at: number;
  end_at: number;
  begin_at_formatted: string;
  end_at_formatted: string;
}

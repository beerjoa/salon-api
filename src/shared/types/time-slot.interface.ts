/**
 * 과제 내 관련 모델에 명시된,
 * 예약 타임슬롯 정보를 나타내는 인터페이스
 * 도메인 특화 확장이 필요할 경우, 추가 필드를 확장하여 사용 가능
 *
 * @interface ITimeSlot
 * @property {number} begin_at - 타임슬롯 시작 시간
 * @property {number} end_at - 타임슬롯 종료 시간
 */
export interface ITimeSlot {
  begin_at: number;
  end_at: number;
}

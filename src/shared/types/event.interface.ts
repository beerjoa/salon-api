/**
 * 과제 내 관련 모델에 명시된,
 * 이벤트 정보를 나타내는 인터페이스
 * 필요한 경우 도메인 특화 필드를 추가할 수 있음
 * @interface IEvent
 * @property {number} begin_at - 이벤트 시작 시간
 * @property {number} end_at - 이벤트 종료 시간
 * @property {number} created_at - 이벤트 생성 시간
 * @property {number} updated_at - 이벤트 수정 시간
 */
export interface IEvent {
  begin_at: number;
  end_at: number;
  created_at: number;
  updated_at: number;
}

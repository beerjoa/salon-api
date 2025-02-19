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

import { RuleConfigSeverity } from '@commitlint/types';

const Configuration = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'build', // 빌드 시스템이나 외부 종속성에 영향을 주는 변경 사항 (예시: gulp, broccoli, npm)
        'chore', // src 또는 test 파일을 수정하지 않는 변경 사항
        'ci',    // CI 구성 파일 또는 스크립트에 대한 변경 사항 (예시: Travis, Circle, BrowserStack, SauceLabs)
        'docs',  // 문서 관련 변경 사항만 포함된 커밋
        'feat',  // 새로운 기능 추가
        'fix',   // 버그 수정
        'perf',  // 성능 향상을 위한 코드 변경
        'refactor', // 버그 수정이나 기능 추가 외에 코드 개선
        'revert',   // 이전 커밋 되돌리기
        'style', // 코드의 의미에 영향을 주지 않는 수정 (공백, 포매팅, 누락된 세미콜론 등)
        'test',  // 누락된 테스트 추가 또는 기존 테스트 수정,
        'ops',   // 운영 컴포넌트에 영향을 주는 변경 사항 (인프라, 배포, 백업, 복구 등)
      ],
    ],
    'subject-case': [
      RuleConfigSeverity.Error,
      'never',
      [
        'sentence-case', // Sentence case
        'start-case', // Start Case
        'pascal-case', // PascalCase
        'upper-case', // UPPERCASE
      ],
    ],
  },
};

export default Configuration;

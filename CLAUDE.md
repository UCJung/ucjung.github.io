# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Al-folio 테마 기반 GitHub Pages 기술 블로그. 다크모드(네이비/오렌지) 기본.

## Common Commands

```bash
# 로컬 개발 서버 (포트 24000)
export PATH="/c/Ruby33-x64/bin:$PATH"
bundle exec jekyll serve --port 24000 --livereload

# 의존성 설치
bundle install
```

## Deployment

- `main` push → `.github/workflows/deploy.yml` → `gh-pages` 브랜치로 빌드/배포
- GitHub Pages 소스: `gh-pages` 브랜치
- 로컬에서는 `imagemagick` 비활성화 상태 (CI에서만 동작)

## Git Workflow

- `main`: 운영 브랜치
- `dev`: 개발 브랜치 (main과 동기화)
- 작업 완료 후 항상 main push + dev merge

## 작업로그 기록 지침

`_devlog/` 폴더에 날짜별 마크다운으로 기록 (`YYYY-MM-DD.md`)

### 형식

```markdown
## N. 제목
- **현상**: 사용자가 관찰한 증상
- **문제**: 파악된 문제
- **원인**: 근본 원인
- **해결**: 적용한 해결 방법
```

- 현상부터 시작: 어떤 현상이 있었고 → 파악해보니 이런 문제 → 원인은 이것 → 이렇게 해결
- 단순 작업은 **작업** + **이슈** + **결과** 형태로 기록 가능
- 작업 세션 종료 시 해당 날짜 로그 작성

## CSS 수정 시 주의사항

- MDB(Material Design Bootstrap)가 heading, table 등에 스타일을 강제함 → `!important` 필요한 경우 많음
- `_distill.scss`가 table border를 `!important`로 덮어씀
- syntax highlight CSS(`jekyll-pygments-themes-native.css`)가 코드 블록 배경 강제
- 다크모드 셀렉터: `html[data-theme="dark"]`
- 라이트모드 한정: `html:not([data-theme="dark"])`

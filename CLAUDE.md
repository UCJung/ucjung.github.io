# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Al-folio 테마 기반 GitHub Pages 기술 블로그. 다크모드(네이비/오렌지) 기본.

## Local Development

```bash
bundle exec jekyll serve --port 24000 --livereload
```

## Deployment (배포 지침)

사용자가 "배포해줘"라고 하면 아래 순서대로 수행:

1. 변경된 파일 `git add`
2. 커밋 메시지 작성 후 `git commit` (Co-Authored-By: Claude Code 포함)
3. `git push origin main`
4. `git checkout dev && git merge main && git push origin dev && git checkout main`
5. `_devlog/YYYY-MM-DD.md` 작업로그 작성 (없으면 신규 생성, 있으면 항목 추가)
6. 작업로그 커밋 및 push + dev merge

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

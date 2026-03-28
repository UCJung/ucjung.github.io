# 2장. 프로젝트 생성 및 설정

> AI Agent 사용자 교육 시리즈 | 작성일: 2026-03-25 | v1.0

---

## 2.1 사전 준비

| 항목 | 확인 방법 |
|------|----------|
| Claude Code 설치 완료 | `claude --version` |
| Git 설치 완료 | `git --version` |
| 인증 완료 | `claude` 실행 시 프롬프트 정상 표시 |
| 진단 정상 | `claude doctor` |

---

## 2.2 프로젝트 폴더 생성

### Windows PowerShell

```powershell
mkdir C:\Projects\my-first-project
cd C:\Projects\my-first-project
git init
```

### Ubuntu Terminal

```bash
mkdir ~/projects/my-first-project
cd ~/projects/my-first-project
git init
```

> Git 초기화(`git init`)는 필수입니다. Claude Code는 Git 저장소 루트를 프로젝트 경계로 인식합니다.

---

## 2.3 /init — 프로젝트 초기화

프로젝트 폴더에서 Claude Code를 실행한 뒤 `/init` 명령을 입력합니다.

```bash
cd ~/projects/my-first-project
claude
```

```
> /init
```

### /init이 하는 일

1. 프로젝트 디렉토리 구조를 스캔
2. `package.json`, `tsconfig.json`, `pyproject.toml` 등 설정 파일 분석
3. 기술 스택, 빌드/테스트 명령, 코드 컨벤션 감지
4. 분석 결과를 기반으로 **CLAUDE.md** 파일을 프로젝트 루트에 자동 생성

> 기존 CLAUDE.md가 있으면 덮어쓰지 않고 개선 사항을 제안합니다.

---

## 2.4 CLAUDE.md란?

**CLAUDE.md**는 Claude Code가 세션 시작 시 자동으로 읽는 프로젝트 지시 파일입니다.

프로젝트의 기술 스택, 빌드 명령, 코드 컨벤션, 아키텍처 정보를 마크다운으로 작성하면, Claude Code가 매 세션마다 이 맥락을 자동으로 로드하여 일관된 작업을 수행합니다.

### CLAUDE.md에 포함할 내용

| 항목 | 예시 |
|------|------|
| 프로젝트 개요 | "NestJS 11 + React 18 기반 주간업무보고 시스템" |
| 기술 스택 | TypeScript, PostgreSQL, Prisma |
| 빌드/테스트 명령 | `npm run build`, `npm test`, `npm run lint` |
| 코드 컨벤션 | strict mode, 2-space indent, no default exports |
| 핵심 디렉토리 | `src/api/`, `src/components/`, `tests/` |
| 주의사항 | "main 브랜치에 직접 커밋 금지" |

### CLAUDE.md에 넣지 말아야 할 내용

- 린터/포매터가 이미 처리하는 규칙 (ESLint, Prettier 등)
- 전체 파일 구조 목록 (탐색으로 알 수 있는 것)
- 일반적인 개발 상식 ("변수명은 의미 있게 지으세요")

> 💡 **핵심 원칙**: CLAUDE.md는 **200줄 이하**로 간결하게 유지합니다.  
> 너무 길면 지시 준수율이 떨어집니다.

### CLAUDE.md 작성 예시

```markdown
# My Project

## Tech Stack
- NestJS 11 + React 18 + TypeScript
- PostgreSQL + Prisma ORM
- Jest for testing

## Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm test` | 전체 테스트 |
| `npm run lint` | 린트 검사 |

## Architecture
- `src/api/` — API 라우트 및 컨트롤러
- `src/components/` — React 컴포넌트
- `src/services/` — 비즈니스 로직
- `prisma/` — DB 스키마 및 마이그레이션

## Rules
- TypeScript strict mode
- 커밋 전 반드시 `npm test` 통과
- main 브랜치 직접 커밋 금지
```

---

## 2.5 CLAUDE.md 계층 구조

CLAUDE.md는 여러 위치에 둘 수 있으며, Claude Code가 세션 시작 시 모두 병합하여 로드합니다.

```
┌─────────────────────────────────────────────────────────┐
│  ① 글로벌 (개인)     ~/.claude/CLAUDE.md                │
│     → 모든 프로젝트에 적용되는 개인 선호                │
├─────────────────────────────────────────────────────────┤
│  ② 프로젝트 (팀 공유) ./CLAUDE.md                       │
│     → Git에 커밋, 팀 전체 공유                          │
├─────────────────────────────────────────────────────────┤
│  ③ 프로젝트 로컬     ./CLAUDE.local.md                  │
│     → 개인용, Git에 커밋하지 않음                       │
├─────────────────────────────────────────────────────────┤
│  ④ 하위 디렉토리     ./frontend/CLAUDE.md               │
│     → 해당 폴더 작업 시에만 온디맨드 로드               │
└─────────────────────────────────────────────────────────┘

우선순위: 구체적인 것이 우선 (④ > ③ > ② > ①)
동일 지시가 충돌하면 더 구체적인 레벨이 적용됩니다.
```

### 실전 활용 예시

```
~/.claude/CLAUDE.md              ← "응답은 한국어로", "커밋 메시지는 Conventional Commits"
~/projects/my-app/CLAUDE.md      ← 프로젝트 스택, 빌드 명령, 아키텍처
~/projects/my-app/CLAUDE.local.md ← "나는 백엔드 담당, 프론트 코드 수정 시 확인 요청"
~/projects/my-app/frontend/CLAUDE.md ← "React Query 사용, Tailwind 클래스 순서 규칙"
```

---

## 2.6 Memory (Claude.ai) vs CLAUDE.md (Claude Code)

이 둘은 이름이 비슷하지만 **완전히 다른 시스템**입니다.

### 비교표

| 구분 | Memory (Claude.ai) | CLAUDE.md (Claude Code) |
|------|:---:|:---:|
| **동작 환경** | Claude.ai 웹/앱 대화 | Claude Code CLI 터미널 |
| **적용 단위** | 사람 (모든 대화에 적용) | 프로젝트 (해당 리포에서만) |
| **저장 위치** | Anthropic 서버 | 로컬 파일 (프로젝트 내) |
| **편집 방법** | "이거 기억해줘" (자연어) | 마크다운 파일 직접 편집 |
| **자동 생성** | ✅ 대화에서 자동 파생 | `/init`으로 초기 생성 |
| **버전 관리** | ❌ | ✅ Git 커밋 가능 |
| **팀 공유** | ❌ 개인 전용 | ✅ Git으로 팀 공유 |
| **내용 성격** | 개인 프로필, 선호도, 작업 이력 | 프로젝트 규칙, 스택, 명령어 |

### 관점별 설정 방법

**개인(Personal) 관점 — "나"에 대한 설정**

| 설정 대상 | Memory (Claude.ai) | CLAUDE.md (Claude Code) |
|-----------|-----------|-----------|
| 작업 스타일 | "발표자료는 두괄식 요약 선호" | `~/.claude/CLAUDE.md`에 작성 |
| 언어 설정 | "응답은 한국어로" | `~/.claude/CLAUDE.md`에 작성 |
| 역할 정보 | "P&T 선행연구개발팀 R&D 담당" | `~/.claude/CLAUDE.md`에 작성 |

> Memory는 대화 중 "기억해줘"로 설정하고, 글로벌 CLAUDE.md는 파일을 직접 편집합니다.

**프로젝트(Project) 관점 — "이 프로젝트"에 대한 설정**

| 설정 대상 | Memory (Claude.ai) | CLAUDE.md (Claude Code) |
|-----------|-----------|-----------|
| 기술 스택 | 대화 맥락으로 자동 축적 | `./CLAUDE.md`에 명시 |
| 빌드/테스트 명령 | ❌ 해당 없음 | `./CLAUDE.md`에 명시 |
| 코드 컨벤션 | ❌ 해당 없음 | `./CLAUDE.md`에 명시 |
| 아키텍처 규칙 | ❌ 해당 없음 | `./CLAUDE.md`에 명시 |

### 설정 파일 위치 요약

```
[개인 설정]
  Claude.ai Memory     → Settings > Memory (웹 UI)
  글로벌 CLAUDE.md      → ~/.claude/CLAUDE.md

[프로젝트 설정]
  프로젝트 CLAUDE.md    → {프로젝트 루트}/CLAUDE.md        (팀 공유, Git 커밋)
  로컬 CLAUDE.md        → {프로젝트 루트}/CLAUDE.local.md  (개인용, Git 제외)
```

---

## 2.7 글로벌 CLAUDE.md 설정하기

모든 프로젝트에 공통 적용할 개인 선호를 설정합니다.

### 파일 생성

**Windows PowerShell**

```powershell
notepad $env:USERPROFILE\.claude\CLAUDE.md
```

**Ubuntu Terminal**

```bash
mkdir -p ~/.claude
nano ~/.claude/CLAUDE.md
```

### 작성 예시

```markdown
# Global Preferences

## Language
- 응답은 한국어로 작성
- 커밋 메시지는 영문 Conventional Commits

## Work Style
- 결과물 변경 시 승인 후 진행
- 근거 부족 시 추측임을 명시
- 코드 변경 전 영향 범위 설명

## Git
- 브랜치명: feature/, fix/, refactor/ 접두사
- PR 설명에 변경 사유 포함
```

---

## 2.8 프로젝트 CLAUDE.md 설정하기

### 방법 1: /init 자동 생성 (권장)

```bash
cd ~/projects/my-project
claude
> /init
```

생성된 파일을 검토하고 팀 컨벤션에 맞게 수정합니다.

### 방법 2: 수동 생성

```bash
# 프로젝트 루트에 직접 작성
nano ~/projects/my-project/CLAUDE.md
```

### Git에 커밋

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md for project context"
```

> `CLAUDE.local.md`는 자동으로 `.gitignore`에 추가됩니다.

---

## 2.9 CLAUDE.md가 길어질 경우 조치방법

CLAUDE.md가 200줄을 넘기면 지시 준수율이 떨어집니다. 아래 방법으로 관리합니다.

### 방법 1: 불필요한 지시 정리 (가장 우선)

Claude가 지시 없이도 이미 잘 하는 것은 삭제합니다.

```markdown
# ❌ 삭제 대상 (당연한 것)
- 의미 있는 변수명을 사용할 것
- 에러 핸들링을 잘 할 것
- API 키를 코드에 포함하지 말 것

# ✅ 유지 대상 (코드로 알 수 없는 것)
- 커밋 전 반드시 npm test 통과
- API 응답은 항상 { success, data, error } 형식
```

### 방법 2: 하위 디렉토리 분리

모노레포나 대규모 프로젝트는 CLAUDE.md를 디렉토리별로 분리합니다.  
하위 CLAUDE.md는 해당 폴더 작업 시에만 온디맨드 로드되어 컨텍스트를 절약합니다.

```
my-project/
├── CLAUDE.md                  ← 공통 규칙만 (간결하게)
├── frontend/
│   └── CLAUDE.md              ← React, Tailwind 관련
├── backend/
│   └── CLAUDE.md              ← NestJS, Prisma 관련
└── infra/
    └── CLAUDE.md              ← Docker, CI/CD 관련
```

### 방법 3: @import로 외부 문서 참조

CLAUDE.md에 모든 내용을 넣는 대신, 기존 문서를 참조하게 합니다.

```markdown
# Commands
@README.md 의 Scripts 섹션 참조

# API Convention
@docs/api-convention.md 참조

# Git Workflow
@docs/git-workflow.md 참조
```

> Claude Code가 필요할 때 해당 파일을 읽으므로, CLAUDE.md 자체는 가볍게 유지됩니다.

### 방법 4: 린터/훅으로 이관

반복 규칙은 CLAUDE.md 지시 대신 도구로 강제합니다.

| CLAUDE.md에서 삭제 | 대체 수단 |
|---|---|
| "세미콜론 사용" | ESLint/Prettier 설정 |
| "커밋 메시지 포맷" | commitlint + husky |
| "저장 시 포매팅" | Hooks (`PostToolUse`) |
| "테스트 통과 후 커밋" | Hooks (`PreToolUse`) |

---

## 2.10 빠른 참조

```bash
# 프로젝트 초기화
cd ~/my-project
git init
claude
> /init                              # CLAUDE.md 자동 생성

# CLAUDE.md 계층
~/.claude/CLAUDE.md                  # 글로벌 (개인, 전 프로젝트)
./CLAUDE.md                          # 프로젝트 (팀 공유)
./CLAUDE.local.md                    # 프로젝트 로컬 (개인)
./subfolder/CLAUDE.md                # 하위 디렉토리 (온디맨드)

# 세션 중 메모리 추가 (Claude Code 내에서)
# (대화 중 # 키를 누르면 CLAUDE.md에 즉시 추가)

# Memory (Claude.ai) 설정
# Settings > Memory 에서 확인·편집
# 대화 중 "이거 기억해줘"로 추가
```

---

> 📌 **다음 장**: 3장 — Claude Code CLI 기본 사용법과 주요 명령어  
> **참고**: https://code.claude.com/docs/en/best-practices | https://claude.com/blog/using-claude-md-files


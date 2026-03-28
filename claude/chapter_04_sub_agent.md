# 4장. 활용 방법 — Sub Agent

> AI Agent 사용자 교육 시리즈 | 작성일: 2026-03-25 | v1.0

---

## 4.1 Sub Agent란?

**Sub Agent(서브에이전트)** 는 Claude Code 세션 안에서 특정 작업을 전담하는 **전문화된 AI 보조 에이전트**입니다.

메인 Claude Code가 "총괄 매니저"라면, Sub Agent는 각각 전문 분야를 가진 "팀원"입니다.  
각 Sub Agent는 **독립된 컨텍스트 윈도우**, **자체 시스템 프롬프트**, **제한된 도구 접근 권한**을 가지고 동작합니다.

```
┌──────────────────────────────────────────────┐
│  메인 Claude Code 세션 (총괄)                │
│                                              │
│  "이 코드를 리뷰해줘"                        │
│      ↓ 위임 (delegate)                       │
│  ┌──────────────────────────────────┐        │
│  │  Sub Agent: code-reviewer        │        │
│  │  • 독립 컨텍스트 윈도우           │        │
│  │  • Read 전용 도구만 허용          │        │
│  │  • 코드 리뷰 전용 시스템 프롬프트 │        │
│  └──────────────┬───────────────────┘        │
│                 ↓ 결과 반환                   │
│  "리뷰 결과: 3건의 개선 사항 발견"            │
└──────────────────────────────────────────────┘
```

---

## 4.2 사용 목적 및 역할

### 왜 Sub Agent를 사용하는가?

| 목적 | 설명 |
|------|------|
| **컨텍스트 보존** | 탐색·분석 결과가 메인 대화를 오염시키지 않음. Sub Agent가 요약만 반환하므로 메인 컨텍스트가 깨끗하게 유지됨 |
| **전문화** | 코드 리뷰, 테스트 작성, 보안 분석 등 역할별 시스템 프롬프트로 정확도 향상 |
| **도구 제한** | 리뷰 에이전트에게는 Read만, 구현 에이전트에게는 Write/Edit 허용 등 최소 권한 원칙 적용 |
| **재사용** | 한 번 만든 Sub Agent를 모든 프로젝트에서 활용 가능 (user scope) |

### 기본 내장 Sub Agent

Claude Code에는 자동으로 사용되는 내장 Sub Agent가 있습니다.

| 이름 | 도구 | 역할 |
|------|------|------|
| **Explore** | Read 전용 | 코드베이스 검색·탐색. 파일 변경 없음 |
| **Plan** | Read 전용 | Plan Mode에서 구현 전 코드베이스 분석 |
| **General-purpose** | 전체 | 복잡한 다단계 작업 (탐색 + 수정) |
| **Bash** | 터미널 | 별도 컨텍스트에서 명령 실행 |

> 이 내장 에이전트들은 Claude가 자동으로 판단하여 위임합니다.  
> 사용자가 직접 호출할 필요 없이, 작업 성격에 따라 자동 선택됩니다.

---

## 4.3 설치 및 확인 방법

### 생성 방법 1: /agents 명령 (권장)

```
> /agents
```

인터랙티브 메뉴에서 다음을 수행할 수 있습니다:

1. **Create new agent** 선택
2. **Personal** (모든 프로젝트) 또는 **Project** (현재 프로젝트만) 선택
3. **Generate with Claude** 선택 → 역할 설명 입력
4. 도구 접근 범위 선택 (Read-only, 전체 등)
5. 모델 선택 (Sonnet, Opus, Haiku)
6. 배경색 선택 → 저장

**예시: 코드 리뷰 에이전트 생성**

```
> /agents
→ Create new agent
→ Personal
→ Generate with Claude
→ "코드를 분석하고 가독성, 성능, 모범사례 관점에서 개선사항을 제안하는 에이전트"
→ Read-only tools만 선택
→ Sonnet
→ 저장
```

### 생성 방법 2: 마크다운 파일 직접 작성

```bash
# 개인용 (모든 프로젝트)
mkdir -p ~/.claude/agents
nano ~/.claude/agents/code-reviewer.md

# 프로젝트용 (현재 프로젝트만)
mkdir -p .claude/agents
nano .claude/agents/code-reviewer.md
```

### 확인 방법

```bash
# CLI에서 목록 확인 (세션 밖)
claude agents

# 세션 내에서 확인
> /agents
```

### 호출 방법

```
# 자동 위임 — Claude가 설명(description)을 보고 자동 판단
> 이 프로젝트의 코드 품질을 분석해줘

# 명시적 호출 — 이름을 직접 지정
> code-reviewer 에이전트를 사용해서 src/api/ 폴더를 리뷰해줘
```

---

## 4.4 Sub Agent 파일 구조

Sub Agent는 **YAML 프론트매터 + 마크다운 본문**으로 구성됩니다.

### 파일 예시: `.claude/agents/code-reviewer.md`

```markdown
---
name: code-reviewer
description: 코드 품질을 분석하고 가독성, 성능, 보안 관점에서 개선사항을 제안합니다. 코드 리뷰, 품질 분석 요청 시 사용됩니다.
tools: Read, Grep, Glob
model: sonnet
---

# Code Reviewer Agent

## 역할
당신은 시니어 소프트웨어 엔지니어로서 코드 리뷰를 전담합니다.

## 리뷰 기준
- 가독성: 변수명, 함수 구조, 주석
- 성능: 불필요한 반복, 메모리 누수 가능성
- 보안: SQL 인젝션, XSS, 하드코딩된 비밀 값
- 모범사례: 프로젝트 컨벤션 준수 여부

## 출력 형식
각 이슈에 대해:
1. 파일 경로와 라인 번호
2. 현재 코드
3. 문제점 설명
4. 개선된 코드 제안
```

### YAML 프론트매터 필드

| 필드 | 필수 | 설명 |
|------|:---:|------|
| `name` | ✅ | 에이전트 식별자 (영문, 하이픈 가능) |
| `description` | ✅ | 언제 이 에이전트를 사용할지 설명. Claude가 이 설명을 보고 자동 위임 판단 |
| `tools` | ❌ | 허용 도구 목록. 생략 시 메인 세션의 모든 도구 상속 |
| `model` | ❌ | 사용 모델 (`sonnet`, `opus`, `haiku`). 기본값: 메인 세션 모델 |

### 도구 제한 예시

```yaml
# Read-only (리뷰·분석용)
tools: Read, Grep, Glob

# 코드 수정 가능 (구현용)
tools: Read, Write, Edit, Bash, Grep, Glob

# 전체 도구 상속 (생략)
# tools 필드를 아예 쓰지 않음
```

### 저장 위치별 범위

```
~/.claude/agents/             ← 개인용: 모든 프로젝트에서 사용 가능
.claude/agents/               ← 프로젝트용: 해당 프로젝트에서만 사용
                                 (Git 커밋하면 팀 공유)
```

> 같은 이름의 Sub Agent가 두 위치에 모두 있으면 **프로젝트 레벨이 우선**됩니다.

### 전체 파일 구조 예시

```
my-project/
├── .claude/
│   ├── agents/                    ← 프로젝트 Sub Agent
│   │   ├── code-reviewer.md
│   │   ├── test-writer.md
│   │   └── security-auditor.md
│   ├── settings.json              ← 프로젝트 설정 (hooks, 권한)
│   └── commands/                  ← 슬래시 커맨드
├── CLAUDE.md                      ← 프로젝트 메모리
└── .mcp.json                      ← MCP 서버 설정 (팀 공유)

~/.claude/
├── agents/                        ← 개인 Sub Agent (전 프로젝트)
│   └── general-assistant.md
├── CLAUDE.md                      ← 글로벌 메모리 (개인)
└── settings.json                  ← 개인 전역 설정
```

---

## 4.5 Sub Agent vs MCP — 차이점

| 구분 | Sub Agent | MCP 서버 |
|------|:---:|:---:|
| **정체** | 특화된 Claude 인스턴스 | 외부 도구/서비스 연결 |
| **동작 방식** | 독립 컨텍스트에서 Claude가 작업 수행 | 외부 프로세스가 도구 기능 제공 |
| **컨텍스트** | 자체 컨텍스트 윈도우 (메인과 분리) | 메인 컨텍스트 윈도우를 공유·소모 |
| **설정 형식** | 마크다운 파일 (YAML + 프롬프트) | JSON 설정 (command, args, env) |
| **저장 위치** | `.claude/agents/` | `.claude.json` 또는 `.mcp.json` |
| **호출 방식** | Claude가 자동 위임 또는 이름 지정 | Claude가 도구(tool)로 호출 |
| **할 수 있는 일** | 코드 분석, 리뷰, 구현, 테스트 작성 등 AI 추론 작업 | DB 조회, GitHub PR, 브라우저 자동화 등 외부 시스템 연동 |
| **비용** | 별도 토큰 소모 (독립 컨텍스트) | 도구 설명만큼 컨텍스트 소모 |
| **서로의 관계** | MCP 도구를 사용할 수 있음 | Sub Agent와 무관하게 동작 |

### 언제 무엇을 쓰는가?

```
"GitHub PR을 자동으로 만들어줘"         → MCP (github 서버)
"이 코드를 리뷰해줘"                    → Sub Agent (code-reviewer)
"DB에서 사용자 데이터를 조회해줘"       → MCP (postgresql 서버)
"테스트 코드를 작성해줘"                → Sub Agent (test-writer)
"심볼 단위로 함수를 찾아줘"             → MCP (serena 서버)
"보안 취약점을 분석해줘"                → Sub Agent (security-auditor)
```

> **핵심 구분**: MCP는 **외부 시스템과 연결하는 도구**, Sub Agent는 **AI가 전문 역할로 작업하는 인스턴스**입니다.  
> 둘은 대체 관계가 아니라 **조합**하여 사용합니다.  
> 예: security-auditor Sub Agent가 Serena MCP의 `find_symbol` 도구를 사용하여 취약 함수를 추적

---

## 4.6 빠른 참조

```bash
# ── Sub Agent 관리 ──────────────────────────────────
> /agents                              # 생성·조회·편집·삭제 (세션 내)
claude agents                          # 목록 조회 (CLI)

# ── 파일 위치 ───────────────────────────────────────
~/.claude/agents/                      # 개인용 (전 프로젝트)
.claude/agents/                        # 프로젝트용 (팀 공유 가능)

# ── 호출 ────────────────────────────────────────────
> code-reviewer 에이전트로 분석해줘     # 명시적 호출
> 이 코드 리뷰해줘                      # 자동 위임 (description 매칭)

# ── 파일 형식 ───────────────────────────────────────
# .claude/agents/my-agent.md
---
name: my-agent
description: 언제 사용할지 설명
tools: Read, Grep, Glob            # 생략 시 전체 상속
model: sonnet                      # sonnet / opus / haiku
---
시스템 프롬프트 내용 (마크다운)
```

---

> 📌 **다음 장**: 5장 — Claude Code 실전 팁과 워크플로우  
> **참고**: https://code.claude.com/docs/en/sub-agents


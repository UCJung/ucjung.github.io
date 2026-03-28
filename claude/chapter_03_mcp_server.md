# 3장. 활용 방법 — MCP 서버

> AI Agent 사용자 교육 시리즈 | 작성일: 2026-03-25 | v1.0

---

## 3.1 MCP란?

**MCP (Model Context Protocol)** 는 Claude Code가 외부 도구·데이터베이스·API에 연결하는 개방형 표준 프로토콜입니다.

기본 Claude Code는 파일 읽기/쓰기, Bash 실행, 검색 정도만 가능합니다. MCP 서버를 연결하면 GitHub PR 관리, DB 조회, 브라우저 자동화, 심볼 수준 코드 분석 등으로 기능이 확장됩니다.

```
┌──────────────┐     MCP 프로토콜     ┌──────────────────┐
│  Claude Code  │ ◄──────────────────► │   MCP 서버        │
│  (클라이언트) │                      │  (도구 제공자)     │
└──────────────┘                      └──────────────────┘
                                        ↕
                                      외부 서비스
                                      (GitHub, DB, IDE 등)
```

---

## 3.2 MCP 기본 명령어

```bash
# 서버 추가
claude mcp add <이름> -- <실행 명령>

# JSON 형식으로 추가 (복잡한 설정 시)
claude mcp add-json <이름> '{ JSON 설정 }'

# 서버 목록 확인
claude mcp list

# 서버 상태 확인 (Claude Code 내에서)
> /mcp

# 서버 제거
claude mcp remove <이름>

# 서버 상세 정보
claude mcp get <이름>
```

### 설정 범위 (scope)

| scope | 저장 위치 | 공유 범위 |
|-------|----------|----------|
| `local` (기본) | 현재 프로젝트 | 나만 사용 |
| `project` | `.mcp.json` | 팀 공유 (Git 커밋) |
| `user` | `~/.claude.json` | 내 모든 프로젝트 |

```bash
# 모든 프로젝트에서 사용 (user scope)
claude mcp add --scope user <이름> -- <명령>

# 팀과 공유 (project scope)
claude mcp add --scope project <이름> -- <명령>
```

### Windows 주의사항

Windows에서 `npx`를 사용하는 MCP 서버는 반드시 `cmd /c` 래퍼가 필요합니다.

```powershell
# ❌ 오류 발생
claude mcp add my-server -- npx -y @some/package

# ✅ 올바른 방법
claude mcp add my-server -- cmd /c npx -y @some/package
```

---

## 3.3 유용한 MCP 서버

### ① Serena — 심볼 수준 코드 인덱싱

**용도**: 대규모 코드베이스에서 심볼(함수, 클래스, 변수) 단위로 코드를 검색·편집합니다.  
기본 Claude Code는 파일 전체를 읽지만, Serena는 필요한 심볼만 정확히 찾아 컨텍스트를 절약합니다.

**주요 기능**

| 도구 | 설명 |
|------|------|
| `find_symbol` | 심볼 정의 위치 검색 |
| `find_referencing_symbols` | 참조하는 코드 검색 |
| `insert_after_symbol` | 심볼 뒤에 코드 삽입 |
| `replace_symbol_body` | 심볼 본문 교체 |
| `write_memory` / `read_memory` | 세션 간 메모리 저장·읽기 |

**사전 준비 — uv 설치**

Serena는 Python 기반이므로 `uv` 패키지 관리자가 필요합니다.

```bash
# Ubuntu
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows PowerShell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**설치**

```bash
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project $(pwd)
```

> Windows의 경우 `$(pwd)` 대신 절대 경로를 사용합니다.

**설치 후 초기 설정**

```
# Claude Code 내에서
> Serena 온보딩을 시작해줘        ← 프로젝트 분석 + 메모리 생성
> Serena 인덱싱을 실행해줘        ← 심볼 인덱스 생성 (대규모 프로젝트)
```

또는 CLI에서 직접 인덱싱:

```bash
uvx --from git+https://github.com/oraios/serena serena project index
```

> 💡 온보딩 과정은 많은 파일을 읽으므로 토큰을 상당량 소모합니다.  
> 대규모 프로젝트는 CLI 인덱싱을 먼저 실행하는 것을 권장합니다.

---

### ② Sequential Thinking — 구조화된 사고

**용도**: 복잡한 문제를 단계별로 분해하여 체계적으로 사고하게 합니다.  
아키텍처 설계, 디버깅 전략 수립, 복잡한 리팩토링 계획 시 유용합니다.

**설치**

```bash
# Ubuntu / macOS
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking

# Windows (cmd /c 래퍼 필수)
claude mcp add sequential-thinking -- cmd /c npx -y @modelcontextprotocol/server-sequential-thinking
```

**또는 JSON으로 직접 설정** (`~/.claude.json` 편집)

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

> Windows는 `"command": "cmd"`, `"args": ["/c", "npx", "-y", "@modelcontextprotocol/server-sequential-thinking"]`로 변경

**활용 예시**

```
> 이 프로젝트의 인증 시스템을 OAuth2로 마이그레이션하는 계획을 세워줘.
  sequential-thinking을 사용해서 단계별로 분석해줘.
```

---

## 3.4 주의사항 — MCP 과다 설치 문제

### 문제점

MCP 서버를 많이 설치할수록 다음 문제가 발생합니다.

| 문제 | 설명 |
|------|------|
| **컨텍스트 소모** | 각 MCP 서버의 도구 설명이 컨텍스트 윈도우를 차지합니다. 서버가 많을수록 실제 작업에 쓸 수 있는 공간이 줄어듭니다. |
| **도구 이름 충돌** | 서로 다른 MCP 서버가 동일한 이름의 도구를 제공하면 예기치 않은 동작이 발생합니다. (예: Serena와 Filesystem 서버의 파일 읽기 도구 충돌) |
| **세션 시작 지연** | 모든 MCP 서버가 세션 시작 시 초기화되므로, 서버가 많으면 시작이 느려집니다. |
| **도구 선택 정확도 하락** | 사용 가능한 도구가 너무 많으면 Claude가 적절한 도구를 고르는 정확도가 떨어집니다. |

> ⚠️ **권장**: 동시에 활성화하는 MCP 서버는 **3~5개 이내**로 유지합니다.

### 컨텍스트 확인 및 압축

Claude Code는 200K 토큰의 컨텍스트 윈도우를 가지며, 시스템 프롬프트·도구 설명·MCP 서버·대화 내역이 모두 이 공간을 공유합니다. MCP 서버가 많을수록 남은 작업 공간이 줄어듭니다.

**컨텍스트 사용량 확인 — `/context`**

```
> /context

Context Usage
claude-opus-4-6 • 51k/200k tokens (26%)

  System prompt:     2.6k tokens (1.3%)
  System tools:     17.6k tokens (8.8%)
  MCP tools:          907 tokens (0.5%)    ← MCP 서버가 차지하는 공간
  Custom agents:      935 tokens (0.5%)
  Memory files:       302 tokens (0.2%)
  Messages:         30.5k tokens (15.3%)   ← 대화가 길어지면 증가
  Free space:         114k (57.0%)
  Autocompact buffer: 33k tokens (16.5%)   ← 자동 압축용 예약 공간
```

> MCP tools 항목이 클수록 도구 설명만으로 컨텍스트를 많이 소모하고 있다는 뜻입니다.  
> `/mcp` 명령으로 서버별 세부 비용을 확인할 수 있습니다.

**컨텍스트 압축 — `/compact`**

대화가 길어져 Free space가 30% 이하로 떨어지면 수동 압축을 실행합니다.

```
> /compact                              # 전체 대화 압축
> /compact API 변경 내용 중심으로 보존    # 특정 내용 보존 지시
```

| 명령 | 설명 |
|------|------|
| `/context` | 현재 토큰 사용량을 카테고리별로 표시 |
| `/compact` | 대화 내역을 요약·압축하여 공간 확보 |
| `/compact <지시>` | 지정한 내용을 보존하면서 압축 |
| `/clear` | 대화 컨텍스트 완전 초기화 (작업 전환 시) |
| `/cost` | 현재 세션의 토큰 비용 확인 |

> 💡 자동 압축(auto-compact)은 사용량이 약 83.5%에 도달하면 자동 실행됩니다.  
> 하지만 수동으로 `/compact`를 먼저 실행하면 보존할 내용을 직접 제어할 수 있습니다.

### Serena의 토큰 절감 효과

Serena는 파일 전체를 읽는 대신 심볼 단위로 필요한 코드만 조회하므로 토큰을 크게 절약합니다.

| 항목 | 기본 Claude Code | Serena 사용 시 |
|------|:---:|:---:|
| 코드 탐색 방식 | 파일 전체 읽기 (Read) | 심볼 단위 조회 (find_symbol) |
| 심볼 조회 속도 | ~45초 (grep 기반) | ~100ms (인덱스 기반) |
| 토큰 절감율 | — | **약 70~80%** (대규모 프로젝트 기준) |
| 효과가 큰 경우 | — | 10만줄+ 대규모 프로젝트 |
| 효과가 작은 경우 | — | 소규모 프로젝트 (수백 줄) |

> 커뮤니티 사용자 보고에 따르면 Serena 적용 시 최대 70~80%의 토큰 절감이 가능하며,  
> 이는 컨텍스트 윈도우 소진 전까지 더 오래 작업할 수 있음을 의미합니다.  
> 다만 소규모 프로젝트에서는 인덱싱 오버헤드로 인해 효과가 크지 않을 수 있습니다.

### 해결 방법 — 용도별 비활성화(disable)

사용하지 않는 MCP 서버는 제거하지 않고 **비활성화**하여 필요할 때 다시 켤 수 있습니다.

**방법 1: `.claude.json`에서 `disabled: true` 설정**

```json
{
  "mcpServers": {
    "serena": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/oraios/serena", "serena", "start-mcp-server"],
      "disabled": false
    },
    "sequential-thinking": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-sequential-thinking"],
      "disabled": true
    }
  }
}
```

> `"disabled": true`로 설정하면 설정은 남아 있지만 세션에서 로드되지 않습니다.

**방법 2: 작업 유형별 프로필 운영**

```
[코딩 작업]     serena ✅   sequential-thinking ❌
[설계/분석]     serena ❌   sequential-thinking ✅
[전체 작업]     serena ✅   sequential-thinking ✅   ← 컨텍스트 소모 주의
```

작업 전환 시 `.claude.json`의 `disabled` 값을 토글하거나, 프로젝트별 `.mcp.json`으로 분리 운영합니다.

---

## 3.5 MCP 설정 파일 위치 요약

| 파일 | 위치 | 용도 |
|------|------|------|
| `~/.claude.json` | 홈 디렉토리 | 개인 전역 MCP 설정 |
| `.mcp.json` | 프로젝트 루트 | 팀 공유 MCP 설정 (Git 커밋) |
| `.claude/settings.json` | 프로젝트 `.claude/` | 프로젝트 로컬 설정 |

```bash
# 설정 파일 열기
# Windows
notepad $env:USERPROFILE\.claude.json

# Ubuntu
nano ~/.claude.json
```

---

## 3.6 빠른 참조

```bash
# ── MCP 기본 명령어 ─────────────────────────────────
claude mcp add <이름> -- <명령>         # 추가
claude mcp add-json <이름> '{ JSON }'   # JSON으로 추가
claude mcp list                         # 목록
claude mcp remove <이름>                # 제거
> /mcp                                  # 상태 확인 (세션 내)

# ── Serena 설치 ─────────────────────────────────────
# 사전: uv 설치 필요
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project $(pwd)

# ── Sequential Thinking 설치 ────────────────────────
# Ubuntu/macOS
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
# Windows
claude mcp add sequential-thinking -- cmd /c npx -y @modelcontextprotocol/server-sequential-thinking

# ── 비활성화 ────────────────────────────────────────
# ~/.claude.json 에서 "disabled": true 설정
```

---

> 📌 **다음 장**: 4장 — Claude Code 실전 팁과 워크플로우  
> **참고**: https://code.claude.com/docs/en/mcp | https://github.com/oraios/serena


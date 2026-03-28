# 1장. Claude Code CLI 설치 가이드

> AI Agent 사용자 교육 시리즈 | 작성일: 2026-03-25 | v1.0

---

## 1.1 Claude Code CLI란?

터미널에서 자연어로 AI에게 코딩을 시키는 명령줄 도구입니다.  
웹 브라우저의 Claude.ai와는 별도 프로그램이며, 설치 후 `claude` 명령으로 실행합니다.

---

## 1.2 설치 전 확인사항

| 항목 | 조건 |
|------|------|
| 운영체제 | Windows 10+, Ubuntu 20.04+, macOS 10.15+ |
| 계정 | Claude Pro / Max / Teams / Enterprise (무료 플랜 불가) |
| 인터넷 | 설치·실행 시 필수 |
| RAM / 디스크 | 4GB+ / 500MB+ |

### 설치 방법 비교

| 방법 | Node.js | 자동 업데이트 | 비고 |
|------|:---:|:---:|------|
| ① 네이티브 | 불필요 | ✅ | ⭐ **공식 권장** |
| ② WinGet (Win 전용) | 불필요 | ❌ 수동 | |
| ③ npm | 18+ 필요 | ❌ 수동 | ⛔ **Deprecated (지원 중단 예정)** |

---

## 1.3 Windows PowerShell

### ① 네이티브 설치 (권장)

**사전 준비 — Git for Windows 설치**

Claude Code는 내부적으로 Git Bash를 사용하므로 필수입니다.

1. https://git-scm.com 에서 다운로드 → 기본값으로 설치
2. 확인:
   ```powershell
   git --version
   ```

**설치**

```powershell
irm https://claude.ai/install.ps1 | iex
```
> `irm`(웹에서 스크립트 다운로드) → `iex`(실행)

**확인 — PowerShell을 닫고 새로 연 뒤 실행**

```powershell
claude --version
```

**"claude를 인식할 수 없습니다" 오류 시**

```powershell
[Environment]::SetEnvironmentVariable("PATH", "$env:PATH;$env:USERPROFILE\.local\bin", [EnvironmentVariableTarget]::User)
```
→ PowerShell 재시작 후 다시 확인

---

### ② WinGet 설치

```powershell
winget install Anthropic.ClaudeCode
```

> 자동 업데이트 미지원. 수동 업데이트: `winget upgrade Anthropic.ClaudeCode`

---

### ③ npm 설치 (⛔ Deprecated)

> 🚨 **지원 중단 예정.** 신규 설치에는 사용하지 마세요.

```powershell
# Node.js 18+ 사전 설치 필요 (https://nodejs.org LTS 버전)
npm install -g @anthropic-ai/claude-code
claude --version
```

**기존 npm → 네이티브 전환**

```powershell
irm https://claude.ai/install.ps1 | iex          # 네이티브 설치
npm uninstall -g @anthropic-ai/claude-code        # npm 제거
```
> 설정 파일(`~/.claude/`)은 전환 시에도 보존됩니다.

---

## 1.4 Ubuntu Terminal

### ① 네이티브 설치 (권장)

**설치**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```
> `curl`(웹에서 스크립트 다운로드) → `bash`(실행)

**확인 — 터미널 재시작 또는 `source ~/.bashrc` 후 실행**

```bash
claude --version
```

**"command not found" 오류 시**

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

---

### ② npm 설치 (⛔ Deprecated)

> 🚨 **지원 중단 예정.** 신규 설치에는 사용하지 마세요.

```bash
# Node.js 설치
sudo apt update && sudo apt install -y nodejs npm

# sudo 없이 글로벌 설치를 위한 설정
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Claude Code 설치
npm install -g @anthropic-ai/claude-code
claude --version
```

**기존 npm → 네이티브 전환**

```bash
curl -fsSL https://claude.ai/install.sh | bash    # 네이티브 설치
npm uninstall -g @anthropic-ai/claude-code         # npm 제거
```

---

## 1.5 최초 실행 및 인증 (공통)

```bash
cd ~/my-project    # 프로젝트 폴더로 이동
claude             # 실행
```

1. 브라우저가 자동으로 열림 → Claude.ai 계정으로 로그인
2. 인증 완료 → 터미널에 자동 반영 (이후 재인증 불필요)

> 브라우저 없는 환경(서버 등):
> ```bash
> export ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
> ```

---

## 1.6 진단 · 업데이트 · 삭제

**진단**

```bash
claude doctor
```

**업데이트**

| 방법 | 명령어 |
|------|--------|
| 네이티브 | 자동 (조치 불필요) |
| WinGet | `winget upgrade Anthropic.ClaudeCode` |
| npm | `npm update -g @anthropic-ai/claude-code` |

**삭제**

```bash
claude uninstall                                   # 네이티브
winget uninstall Anthropic.ClaudeCode              # WinGet (Windows)
npm uninstall -g @anthropic-ai/claude-code         # npm
rm -rf ~/.claude                                   # 설정 파일 삭제 (선택)
```

---

## 1.7 명령어 빠른 참조

### Windows PowerShell

```powershell
# 네이티브 (권장)
irm https://claude.ai/install.ps1 | iex

# WinGet
winget install Anthropic.ClaudeCode

# npm (⛔ Deprecated)
npm install -g @anthropic-ai/claude-code

# 공통
claude --version    # 버전 확인
claude              # 실행
claude doctor       # 진단
claude uninstall    # 삭제
```

### Ubuntu Terminal

```bash
# 네이티브 (권장)
curl -fsSL https://claude.ai/install.sh | bash

# npm (⛔ Deprecated)
npm install -g @anthropic-ai/claude-code

# 공통
claude --version    # 버전 확인
claude              # 실행
claude doctor       # 진단
claude uninstall    # 삭제
```

---

## 1.8 용어 정리

| 용어 | 설명 |
|------|------|
| CLI | 키보드 명령어로 컴퓨터를 조작하는 방식 |
| 터미널 | CLI 명령어를 입력하는 프로그램 (PowerShell, Terminal 등) |
| PATH | OS가 프로그램을 찾는 경로 목록 |
| npm | Node.js 패키지 관리자 |
| WinGet | Windows 공식 패키지 관리자 |
| Deprecated | 지원 중단 예정. 현재 동작하나 향후 제거 가능 |
| OAuth | 브라우저를 통한 인증 방식 |
| API Key | 서비스 접속용 인증 열쇠 |

---

> 📌 **다음 장**: 2장 — Claude Code CLI 기본 사용법과 주요 명령어  
> **참고**: https://code.claude.com/docs/en/setup | https://github.com/anthropics/claude-code


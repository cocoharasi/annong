# ANNNONG ARCHIVE — GitHub Pages 블로그

**화이트/잉크/버건디 팔레트**와 안농(Unown) 문자·눈 모티프를 활용한 개인 보안 기록실입니다. 이미지, UI 컴포넌트, 검색 기능 모두 정적 HTML/CSS/JavaScript로 동작합니다. 별도 서버나 npm, 데이터베이스가 필요하지 않습니다.

> 디자인에 활용한 안농 모티프는 개인적 팬 표현이며, Pokémon의 공식 사이트나 상품이 아닙니다. 외부 포켓몬 이미지를 무단 핫링크하지 않고 자체 제작한 벡터 문양을 사용합니다.

## 1. 사이트 주소

GitHub 저장소: https://github.com/cocoharasi/annong

Pages 게시 후 기본 주소: **https://cocoharasi.github.io/annong/**

이 주소는 Pages 설정을 켜고 배포가 완료되었을 때 사용할 수 있습니다. 저장소가 공개되어 있어도 Pages 배포가 아직 설정되지 않았다면 사이트는 열리지 않습니다.

## 2. GitHub Pages 켜는 방법

1. [저장소 Settings](https://github.com/cocoharasi/annong/settings)에 접속합니다.
2. 왼쪽 메뉴에서 **Pages**를 클릭합니다.
3. **Build and deployment** → **Source: Deploy from a branch**를 선택합니다.
4. **Branch: main / Folder: /(root)** 로 지정하고 **Save**를 클릭합니다.
5. `https://cocoharasi.github.io/annong/`에 접속합니다. 초기 배포는 잠시 걸릴 수 있습니다.

GitHub 공식 문서: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 3. 게시글 작성 및 수정

1. GitHub 저장소에서 **`posts.js`**를 엽니다.
2. 연필(Edit) 버튼을 눌러 `window.ANNNONG_POSTS` 배열 안에 있는 글 객체를 복사합니다.
3. 새 글의 `slug`, `category`, `title`, `date`, `excerpt`, `tags`, `type`, `body`를 수정합니다.
4. 아래와 같이 저장하고 **Commit changes**를 누릅니다. 배포가 완료되면 검색 및 목록에 자동 반영됩니다.

```js
{
  slug: 'my-first-ctf-writeup',  // 영어/숫자/하이픈, 각 글마다 고유
  category: 'ctf',
  title: '첫 번째 CTF 풀이',
  date: '2026-10-29',
  excerpt: '문제 조건과 풀이 과정 요약',
  tags: ['CTF', 'Web'],
  type: 'WRITE-UP',
  body: `# 문제 설명

본문은 **Markdown** 형식으로 작성할 수 있습니다.

## 해결 과정

- 첫 번째 시도
- 두 번째 시도

\`\`\`bash
curl -I https://example.com
\`\`\`
`
},
```

**중요:** 객체 사이에는 쉼표(`,`)가 필요하고, 다른 글과 `slug`가 겹치면 안 됩니다. 본문에 백틱(`\``) 기호를 직접 넣을 때는 `\`` 앞에 역슬래시(`\`)를 붙입니다. 기본적인 제목, 문단, 목록, 링크, 표, 인라인 코드, 코드 블록을 지원합니다.

### 카테고리 고정 ID

| 화면에 표시되는 카테고리 | category 값 |
| --- | --- |
| 개발 | `development` |
| CTF / Wargame | `ctf` |
| Bug Bounty | `bugbounty` |
| 블로그 / 기술문서 | `docs` |
| 논문 / 컨퍼런스 | `papers` |
| 공모전 / 자격증 | `growth` |

### 게시글의 성격

처음 포함한 6개 글은 **실제 실험 성과나 수상 이력을 주장하지 않는 학습 메모/글쓰기 템플릿**입니다. 개인 경험에 맞게 수정하거나 삭제하고 실제 기록을 추가하세요.

## 4. 블로그 개인화

- 사이트 이름·문구·자기소개: `index.html` 수정
- 색상·레이아웃·모바일 화면: `styles.css` 수정
- 카테고리 이름·소개: `site.js` 상단 `categoryList` 수정
- 게시글 데이터: `posts.js` 수정
- 파비콘: `favicon.svg` 수정
- GitHub 연결 주소: `index.html` 안의 `https://github.com/cocoharasi` 및 `https://github.com/cocoharasi/annong` 수정

## 5. 로컬 미리보기

`index.html`을 웹 브라우저에서 직접 열면 대부분의 화면과 글 검색 기능을 사용할 수 있습니다. 로컬 서버를 쓰고 싶다면 폴더에서 다음 명령을 실행합니다.

```bash
python -m http.server 8000
```

그다음 http://localhost:8000 으로 접속합니다.

## 6. 기능 및 주의사항

- 6개 카테고리 / 카테고리별 글 수 / 최근 기록 / 전체 글 검색 / 분야별 필터
- 모바일 메뉴, 키보드 `/` 검색 단축키, 글 URL 직접 공유 및 복사
- 접근성(본문 바로가기, 포커스 표시, 필터 상태), 모션 감소 설정 대응
- GitHub Pages 프로젝트 하위 경로(`/annong`)에서도 hash URL 방식으로 작동
- **정적 블로그**이므로 로그인·댓글·서버 측 검색은 제공하지 않습니다.
- 외부 서비스에 공개되는 글에 비밀번호, 토큰, 민감한 개인정보를 올리지 마세요.

---

© 2026 ANNNONG. 개인 팬 모티프 기반의 독립적인 학습 블로그.

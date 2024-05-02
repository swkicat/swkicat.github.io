---
emoji: 🔎
title: Compose Internal (1) - 기본 시스템 원리
date: '2023-11-07'
tags: 블로그 github-pages gatsby
categories: 컴포즈내부시리즈
---

## Compose 분류
  - 작업 방향에 따라 `Compose Compiler` ➡️ `Compose Runtime` ➡️ `Compose UI`
  - Compose Compiler와 Compose Runtime은 코틀린 네이티브에 속하기 때문에 멀티 플랫폼으로 사용 가능하다.
  - 그로 인해서, Compose UI는 각각의 플랫폼에 따라서 다른 UI 규칙을 가져가게 된다.

## 컴포즈 시스템의 기본
 - 컴포즈 시스템은 [`위치 메모이제이션`](/compose-internal-3) 과 [`Slot Table`](/compose-internal-2) 을 기반으로 작동한다.
 - `위치 메모이제이션`은 멱등성 개념과 비슷하다. 같은 위치에서 input으로 호출되면 같은 output이 나오는 것이며, 값을 캐싱하고 재사용하는 기술이다.
 - `Slot Table`은 발생한 컴포지션에 대한 정보들을 저장되는 공간이며 `Gap Buffer` 자료구조에 `Anchor` 라는 개념을 더해서 활용한다.


## 컴포저블이 UI로 그려지는 원리

- `컴포지션` - `방출` - `구체화` 과정을 통해 컴포저블이 UI로 그려지게 된다.
- **컴포지션**
  - slot table에 초기 gap이 할당되고 최초 상태의 컴포저블 데이터가 등록되는 상태
  - 리컴포지션은 컴포지션 이후 상태가 변경으로 컴포저블이 변경되어 slot table에 값을 업데이트하는 것을 지칭한다.
- **방출**
  - slot table의 값을 읽고 UI 트리를 구축하는 과정을 방출이라 지칭한다.
- **구체화**
  - 방출된 UI 트리를 읽어드려, 실제로 UI를 그리는 과정을 구체화라 지칭한다. 구체화는 컴포즈에서 설계한 Canvas을 통해 그려진다.

### 상태 변경 추적
- 컴포지션 이후 상태가 변경되는 경우 리컴포지션이 일어난다고 위에서 언급했다.
- 상태가 변경되는 것을 컴포즈에서는 `snapshot system`을 통해 알 수 있게 된다.
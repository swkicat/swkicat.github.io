---
emoji: 🔎
title: Compose Internal (3) - 위치메모이제이션
date: '2023-11-08'
tags: 블로그 github-pages gatsby
categories: 컴포즈내부시리즈
---

## Positional Memoization

Compose는 컴파일러가 함수의 input에 의하여 반환되는 결과를 cache하는 Global Memoization을 가지고 있습니다.

> 같은 위치에서 input으로 호출되면 같은 output이 나오게됨을 가정하고, 값을 cache하고 재사용하는 방법입니다.

```kotlin
@Composable
fun ItemText(items: List<String>, item: String) {
    val result = items.find { it == item }
    Text(text = "$result")
}
```

composable function은 파라미터로 items과 item을 받아서 find 연산을 진행하고 있습니다.  
위 연산을 `remember` 키워드를 활용하면, items과 item은 slot table에 저장하게 됩니다. 연산을 진행한 result 결과 값도 slot table에 저장됩니다. 한마디로, input과 output이 slot에 저장되게 됩니다.

위치 메모이제이션은 composable 함수가 두 번째 호출할 때 remember에 의해 저장되어 있는 input 값을 보고 새로 들어오는 값과 비교해 변경된 것이 없다면 이전에 저장한 데이터를 활용합니다.

위치 키는 함수의 시그니쳐와 call-site, 실행 순서 기준으로 고유한 값으로 결정됩니다.

```
⛳️ tip
call-site는 함수가 호출된 위치라고 생각하면 됩니다.
```

```kotlin
@Composable
fun Example() {
    repeat(10) {
        Text(text = "stitch")
    }
}
```

같은 call-site 이지만, 컴포저블 데이터가 실제로 다 다른 공간에 배치됩니다. 저장될 때에는 컴포저블의 위치 키 값으로 remember 값, 등을 저장하게 되는 것이다.  
기본적으로 컴포즈는 위치 메모이제이션과 멱등성을 보장된다는 하에 설계가 되었습니다.

> 컴파일러는 이전 수행에 값들을 한 번은 저장해야 하지만, 연산 자체는 매우 가벼워집니다.
> 연산은 함수가 재활용됨에 따라 전체 UI에 걸쳐서 발생할 수 있지만 이전 연산들에 대한 정보는
> 해당 위치에 대응되어 저장되므로 여러 곳에서 호출되더라도 각각의 호출 위치가 다르므로 문제가 되지 않습니다.

### 예시

우리는 이미 코드를 작성하면서 경험을 해보았습니다.
`LazyList` 키워드를 사용하면, 아이템의 배치가 달라지면, 해당 컴포저블을 리컴포지션이 일어났을 것입니다.  
그러한 이유는 데이터를 저장할 키가 변경되었기 때문입니다. 그래서 리컴포지션을 최소화하고 방지하기 위해서 `key` 키워드를 사용합니다.
`key` 키워드는 LazyListScope 내에서만 사용하는 것이 아니라, 일반적으로 컴포저블 함수 내에서 사용이 가능합니다.
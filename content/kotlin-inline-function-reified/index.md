---
emoji: 🧢
title: inline function과 reified
date: '2023-11-22'
tags: 블로그 github-pages gatsby
categories: Kotlin
---

## inline function


> Using higher-order functions imposes certain runtime penalties: each function is an object, and it captures a closure. A closure is a scope of variables that can be accessed in the body of the function. Memory allocations (both for function objects and classes) and virtual calls introduce runtime overhead.


`inline functions`은 코틀린에서만 제공하는 키워드입니다.  

공식 문서에서 고차함수를 사용하면 패널티가 발생하며, 추가적인 메모리 할당 함수 호출로 런 타임 오버헤드가 발생한다고 합니다.  
람다를 사용하게 될 시, 각 함수는 객체로 변환되어 메모리 할당과 가상 호출 단계를 거치게 되고 이 과정 속에서 오버헤드가 발생합니다.

하지만, `inline functions`은 내부적으로 함수 내용을 호출되는 위치해 복사해 런 타임 오버헤드를 줄여주게 됩니다.

<br>

### 어떤 오버헤드가 발생할까?

고차함수란 함수를 인자로 전달하거나 함수의 반환값으로 처리되는 경우라고 볼 수 있습니다.  
코틀린으로 작성된 코드를 디컴파일해서 자바코드로 확인이 가능합니다.
> IDE에서 `Tool` - `Kotlin` - `Kotlin BytesCode` - `Decompile`을 통해 확인이 가능합니다.  

```kotlin
fun test(lambda: () -> Unit) {
    println("first")
    lambda()
}

fun main() {
    println("start")
    test {
        println("~ing")
    }
    println("end")
}
```

```java
public final class MainKt {
   public static final void test(@NotNull Function0 lambda) {
      Intrinsics.checkNotNullParameter(lambda, "lambda");
      String var1 = "first";
      System.out.println(var1);
      lambda.invoke();
   }

   public static final void main() {
      String var0 = "start";
      System.out.println(var0);
      test((Function0)null.INSTANCE);
      var0 = "end";
      System.out.println(var0);
   }

   public static void main(String[] var0) {
      main();
   }
}
```

test 함수 인자로 Function0 타입의 객체를 생성하고 이 객체의 invoke 호출을 통해 실행되고 있습니다.

<br>

### inline

코틀린 언어로 작성한 코드에 `inline` 키워드를 추가하게 되면 살짝 달리질 수 있습니다.

```java
public final class MainKt {
   public static final void test(@NotNull Function0 lambda) {
      int $i$f$test = 0;
      Intrinsics.checkNotNullParameter(lambda, "lambda");
      String var2 = "first";
      System.out.println(var2);
      lambda.invoke();
   }

   public static final void main() {
      String var0 = "start";
      System.out.println(var0);
      int $i$f$test = false;
      String var1 = "first";
      System.out.println(var1);
      int var2 = false;
      String var3 = "~ing";
      System.out.println(var3);
      var0 = "end";
      System.out.println(var0);
   }

   public static void main(String[] var0) {
      main();
   }
}
```

inline 키워드를 추가한 후 디컴파일된 자바 코드를 보면 함수의 코드가 직접 추가된 것을 확인이 가능합니다.

<br>

## noinline function

인자 앞에 `noinline` 키워드가 추가된다면 해당 인자는 `inline`에서 제외가 됩니다.
`noinline` 키워드가 붙은 인자는 다른 함수의 인자로 전달하는 것이 가능해집니다.

```kotlin
inline fun test(lambda1: () -> Unit, noinline lambda2: () -> Unit) {
    test1()
    test2(lambda2)
}

fun test1() {
    // ... 생략
}

fun test2(lambda: () -> Unit) {
    lambda()
}

fun main() {
    test(
        { println("1")},
        { println("2")}
    )
}
```

<br>

## non-local control flow

- 코틀린에서 lambda function에서는 라벨을 통한 return을 제외하곤 return 문을 사용하면 에러가 발생합니다.
- 'return' is not allowed here 문구와 함께 return 허용이 되지 않는다고 발생합니다.

```kotlin
val lambda = {
    println("hello stitch")
    return // 'return' is not allowed here
}
```

inline 함수의 인자로 넘어가는 경우에는 return의 사용문이 가능해집니다.  

inline 키워드를 사용하면 위에서 볼 수 있듯이 코드가 직접 삽입됩니다. return을 만나게 되면 inline 함수를 호출하는 상위 함수가 return되면서 실행이 종료됩니다. 그로 인해 그 이후에 작성된 코드가 출력되지 않을 수 있습니다.

하지만, non-local return의 문제점도 존재한다.
1. 람다나 내부 함수에서 외부 함수를 종료할 수 있기 때문에 예기치 않은 흐름 제어가 발생할 수 있다.
2. 람다 혹은 내부 함수에서 외부 함수까지 반환되는 비지역 반환은 코드 연결성을 떨어뜨리고, 수정, 확장에 어려움이 존재한다.
3. 특정한 람다나 함수 동작을 독립적으로 테스트하기가 어려워진다. 외부 스코프에 의존하게 되기 때문이다.
4. 직접 작성자가 아닌 이상 반환의 흐름을 이해하기 어려울 수 있다.
5. 1번에서와 같이 예상치 못한 방식으로 종료가 되면, 부작용이 발생하고 결국 코드의 안정성이 사라질 수 있다.

> 비지역 반환의 문제점을 crossinline을 통해 해결이 가능하며, 기존처럼 'return' is not allowed here 라는 오류를 만나게 될 것이다.

<br>

## crossinline

`inline` 함수에서 인자로 받은 lambda를 다른 객체를 만들어 할당하게 된다면, 에러가 발생합니다.  
즉, 파라미터로 전달받은 lambda를 호출 할 때 함수 몸체에서 직접 호출하지 않고 block 등 다른 실행 컨텍스트를 통해 호출해야하는 경우가 존재한다. 이 경우 람다 내에서 비지역 반환을 제어할 수 없게 됩니다. 이를 지정하기 위해서는 crossinline를 사용하게 됩니다.

<br>

## reified

inline과 함께 reified 키워드를 사용하면 제네릭를 사용하는 메서드까지 손쉽게 처리가 가능합니다. 범용성 좋은 메소드를 만들기 위해 <T>를 주로 사용하게 됩니다.

```kotlin
fun <T> test(value : T)
```

위의 코드는 T 객체는 타입에 대한 정보가 런타임에서 `Type Erase` 됩니다. 그래서 정보를 알 수가 없습니다.

일반적으로 Class를 함께 넘겨서 type을 확인 후 casting 하는 과정으로 코드를 작성합니다. 하지만, `inline`과 `reified`를 함께 사용하면 T 타입을 런타임에 접근할 수 있게 해줍니다.

컴파일러는 type argument로 사용된 실제 타입을 알고 만들어진 바이트코드를 직접 클래스에 대응되도록 바꿔줍니다.

```kotlin
fun <T> String.toKotlinObject(): T {
    val mapper = jacksonObjectMapper()
    return mapper.readValue(this, T::class.java)
}
```

- 위 코드는 JsonObject를 파싱하는데 사용합니다. 타입 파라미터 T의 Class를 얻으려고하면 컴파일 에러가 발생합니다.

```kotlin
fun <T : Any> String.toKotlinObject(c: KClass<T>): T {
  val mapper = jacksonObjectMapper()
  return mapper.readValue(this, c.java)
}
```

- 에러를 없애기 위해서 Class 자체를 직접 넘겨줌으로써 해결을 할 수 있습니다.

```kotlin
inline fun <reified T : Any> String.toKotlinObject(): T {
  val mapper = jacksonObjectMapper()
  return mapper.readValue(this, T::class.java)
}
```

- inline과 reified을 함께 사용한다면, T의 Class를 받을 필요도 없고, T는 일반적인 클래스로 사용이 될 수 있습니다.

<br>

### 참고자료

- [Kotlin Docs](https://kotlinlang.org/docs/inline-functions.html)
- [예시 설명](https://zoiworld.tistory.com/403)
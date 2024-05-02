---
emoji: ⛓️
title: 의존성 주입이란
date: '2024-01-15'
tags: 블로그 github-pages gatsby
categories: 의존성주입
---

## 의존성 주입이란?


### 의존성

**의존성**을 한 문장으로 표현하면 어떤 대상이 참조하는 객체(또는 함수)라고 부를 수 있습니다.

```kotlin
class Engine

class Car {
    val engine = Engine()
}
```

- 위의 코드를 보면 `Car는 Engine에 의존한다(의존적이다)` 라고 표현을 합니다.
- Car의 입장에서 Engine에 의존하고 Engine는 의존성이 됩니다.

### 의존성 주입

**의존성 주입**은 대상 객체에 의존성을 제공하는 기술이라고 부를 수 있습니다.

```kotlin
class Engine

class Car {
    val engine = Engine()
}
```

- Car 클래스 내에서 직접 Engine을 생성하고 있으며, Car는 Engine 인스턴스를 생성하는 책임을 가지고 있습니다.

```kotlin
class Engine

class Car(val engine: Engine) {

}
```

- Engine 생성 책임을 제거해보면, 위와 같은 코드로 변경할 수 있습니다.
- Engine을 **외부에서 전달** 받을 수 있게 됩니다.
- Car는 Engine 생성에 대한 **책임 없게** 됩니다.

위와 같은 설계 패턴을 IoC(제어의 역전) 이라고 부릅니다. 객체 생성의 책임을 내부에서 외부로 뒤집으면서 Engine에 대한 제어를 역전 시킨다는 의미를 가지게 됩니다. 이것을 의존성 주입이라고 부를 수 있습니다.


```kotlin
fun main() {
    val gasolineCar = Car(GasolineEngine())
    val dieselCar = Car(DieseEngine())
}
```
- 엔진을 게속해서 생서시켜 주입한다면, Car 객체에는 변경점이 생기지 않게 된다.
- 재사용: Car 객체를 변경하지 않게 될 수 있다.
- 디커플링: 결합도를 낮춰 준다

```kotlin
class Car(
    val engine: Engine,
    val battery: Battery,
    ...
)
```

- 위와 같이 필요한 의존성을 외부에서 주입받을 수 있게 되며, 기존 Car 클래스가 가지고 있는 책임들이 줄어들게 된다.
- 외부에서 주입해주는 객체들을 보면 하나의 기능만을 책임 줄 수 있는 캡슐화할 수 있도록 단일 책임 원칙을 지킬 수 있게 된다.

```kotlin
class CarTest {
    @Test
    fun `Car 테스트`() {
        val car = Car(FakeEngine())
        ...
        val car2 = Car(FakeBrokenEngine())
    }
}
```

- 의존성 주입의 또 다른 장점은 테스트를 쉽게 만들어 준다.
- 엔진을 밖에서 주입해주기 때문에 Car 객체의 테스트와 실패를 확인할 수 있게 된다.

### Injector

Injector는 **의존성을 클라이언트에게 제공하는 역할**이라고 부릅니다.  
Injector는 때로는 Container, Assembler, Provider, Factory라고 부르기도 합니다.

```kotlin
class Injector {
    fun getEngine() {
        return Engine()
    }
}

fun main() {
    // Injector가 없는 경우
    val engine = Engine()
    val car = Car(engine)

    // Injector가 있는 경우
    val engine = Injector().getEngine()
    val car = Car(engine)
}
```

- Car는 Engine를 참조
- Injector는 Engine을 의존
- Injector는 Car에 주입

- injector.getEngine()을 통해 새로운 엔진을 계속해서 만들어낼 수 있습니다.
- 만일, 동일한 엔진을 가지고 싶다면, `val engine = Engine()`로 injector 클래스에 만들어서 `injector.engine` 이라는 변수에 접근하면 됩니다.

### 정리

- 의존성 주입은 클래스간 결합도가 낮아집니다.
- 재상용성이 가능하다.
- 보일러플레이트 감소한다.
- 테스트가 간편해진다.
- 자원공유 하는 등의 의존성 관리가 용이하다.
# TypeORM + MySQL

TypeORM 으로 MySQL 과 연결하여 두 테이블 간의 JOIN 을 통해 데이터를 추출해보는 연습을 해보았다.

<br>

### 테스트 코드 에러

테스트 코드를 작성해보려 했으나 기본 단위 테스트 실행에서부터 에러가 발생해서 아직 해결하지 못한 상태다.

<br>

### 테스트 코드 에러 해결

위에서 언급한 테스트 코드 에러를 해결했다. 주 원인은 테스트 코드에도 의존성을 실행 코드와 마찬가지로 구성해주었어야 했는데 그렇게 하지 못했다.

그리고 entity 를 찾지 못하는 에러도 있었으나 이는 [몇가지 방법](*https://stackoverflow.com/questions/63865678/nestjs-test-suite-failed-to-run-cannot-find-module-src-article-article-entity*)이 존재했는데 여기서는 위치를 상대 경로로 바꿔서 해결했다.

<br>

테스트 코드에서 의존성을 구성할때 repository의 경우 실제 DB에 접근하지 않고 테스트를 하기 위해 [모킹(Mocking)](https://www.daleseo.com/jest-fn-spy-on/)을 활용했다.

<br>

현재 시점에서는 테스트를 아직 제대로 진행하지 못했지만 그간 기본 테스트 코드에서 발생한 에러 때문에 테스트를 제대로 시작할 수도 없었던 상황에서 벗어났다는 것에 의의를 두고 싶다.

<br>

### 특정 파일만 테스트

작성한 모든 테스트 코드 파일들을 테스트 하는게 아니라 특정 파일만 테스트 하고 싶다면 파일의 경로를 추가로 입력해주면 된다.

```
npm run test 'path'
ex> npm run test src/users/users.service.spec.ts
```

<br>

### returning a Promise from "describe" is not supported. Tests must be defined synchronously.

describe 만 작성하고 안에 it 을 정의하고 async 함수로 작성하지 않아서 에러 발생했다.

describe 를 async 로 작성한다고 해결되는게 아니다.

<br>

### service 테스트

service의 메소드들을 테스트하면서 mocking을 하는 방법이나 결과 값을 어떻게 설정하고 테스트 해야하는지, querybuilder는 어떻게 mocking하고 테스트해야 하는지 등을 경험해볼 수 있었다.

테스트 코드를 작성하는게 아직 익숙하지 않고 방법도 잘 몰라서 구글링에 많이 의존했다.

controller 테스트 방법도 학습하여 추가적으로 진행해보고 싶다.

<br>

### controller 테스트

무작정 controller를 테스트 해보려 했는데 (역시나) 에러가 발생했다.

```javascript
describe('findAllUsers', () => {
  it('it is called as get method', async () => {
    const a = await controller.findAllUsers();
    expect(a).toHaveBeenCalled();
  });
});
```

<br>

위의 코드는 아래와 같은 에러를 발생시킨다.

```
expect(received).toBeCalled()
Matcher error: received value must be a mock or spy function
Received has value: undefined
```

<br>

에러 메시지에 나와있듯이 expect에 spy function을 넣으니 해결됐다.

```javascript
describe('findAllUsers', () => {
  it('it is called as get method', async () => {
    const serviceCall = jest.spyOn(service, 'findAllUsers');
    await controller.findAllUsers();
    expect(serviceCall).toBeCalledTimes(1);
  });
});
```

<br>

<참고>

https://velog.io/@1yongs_/NestJS-Testing-Jest

https://velog.io/@hkja0111/NestJS-10-Unit-Test-JEST

https://velog.io/@hkja0111/NestJS-11-Unit-Test-QueryBuilder

https://stackoverflow.com/questions/63865678/nestjs-test-suite-failed-to-run-cannot-find-module-src-article-article-entity

https://jhyeok.com

https://www.daleseo.com/jest-fn-spy-on/

https://stackoverflow.com/questions/57045201/run-single-test-of-a-specific-test-suite-in-jest


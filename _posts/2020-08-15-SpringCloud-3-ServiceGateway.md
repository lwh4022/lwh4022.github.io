---
layout: post
title: 스프링 클라우드 / Service Routing
categories: [Develop, MSA]
tags: [MSA]
---

> 스프링 마이크로 서비스 코딩 공작소

# 목차
### 1장 Spring Cloud Config Server
### 2장 Service Discovery
### 3장 Client Recovery Pattern
### 4장 Service Routing
### 5장 MSA Security
### 6장 Spring Cloud Stream을 사용한 Event Driven Architecture
### 7장 Spring Cloud Slueth와 Zipkins를 이용한 분산추적
### 8장 Publishing

***

# Service Routing

## 간단요약
#### 1. MSA는 Service Gateway 구축을 단순화
#### 2. Zuul Service는 Netflix Eureka서버와 통합하고 Eureka에 등록된 서비스를 자동으로 주울 경로에 매핑
#### 3. Zuul은 관리하는 모든 경로 앞에 /api와 같은 Prefix를 서비스 경로에 쉽게 추가 가능
#### 4. Zuul을 사용하면 수동으로 경로 매핑을 정의 가능, 이러한 경로 매핑은 Application 구성 파일에 정의
#### 5. Spring Cloud Config Server를 사용해 주울 서버를 재시작하지 않고 경로 매핑을 동적으로 다시 로드 가능
#### 6. Zuul의 Hystrix와 Ribbon timeout을 전체 및 개별 서비스 수준으로 사용자 정의할 수 있음
#### 7. Zuul Filter로 사용자 정의 비즈니스 로직을 구현할 수 있다. Zuul은 3개의 Zuul Filter인 사전필터와 사후필터, 경로 필터를 제공
#### 8. Zuul의 사전 필터는 상관관계 ID를 생성해 주울로 연결되는 모든 서비스에 주입
#### 9. Zuul의 사후 필터는 Service Client에 대한 모든 Http 서비스 응답에 상관관계 ID를 삽입
#### 10. 사용자 정의된 주울의 경로 필터는 유레카 서비스 ID에 기반을 둔 동적 라우팅을 수행해 동일 서비스의 다른 버전에 대해 A/B 테스팅을 수행 가능

<br/>
<br/>

## Service Gateway
#### 1. 하나의 URL 뒤에 모든 서비스를 배치하고 서비스 디스커버리를 이용해 모든 호출을 실제 서비스 인스턴스로 매핑
#### 2. 서비스 게이트웨이를 경유하는 모든 서비스 호출에 상관관계 ID를 삽입
#### 3. 호출할 때 생성된 상관관계 ID를 HTTP 응답에 삽입하고 클라이언트에 회신
#### 4. 대중이 사용 중인 것과 다른 조직 서비스 인스턴스 엔드포인트로 라우팅하는 동적 라우팅 메커니즘을 구축

<br/>
<br/>

## Service Gateway의 역할
#### 1. 정적 라우팅 : 개발자는 하나의 서비스 엔드포인트(게이트웨이)만 알면 됨
#### 2. 동적 라우팅
#### 3. 인증과 인가
#### 4. 측정 지표 수집과 로깅

## Service Gateway 구축시 유의사항
#### 1. 로드 밸런서는 서비스 게이트웨이 인스턴스 앞에 두는 것이 적절한 설계
#### 2. 서비스 게이트웨이 정보를 메모리애 저장하지 말 것

## @EnableZuulProxy vs. @EnableZuulServer
#### 1. @EnableZuulServer
- Zuul Reverse Proxy 필터를 로드하지 않은 Zuul 서버 생성 가능
- Netflix 유레카를 사용하는 Zuul 서버 생성 가능
- 자체 라우팅 서비스를 만들고 내장된 주울 기능도 사용하지 않을 수 있음(유레카외 사용시)

## Zuul Path matching mechanism
#### 1. 서비스 디스커버리를 이용한 자동 경로 매핑
#### 2. 서비스 디스커버리를 이용한 수동 경로 매핑
```yaml
zuul:
  ignored-service: 'organizationservice'
  routes:
    organizationservice: /organization/**
```
* 자동 경로 매핑만 사용할 시 실행 중인 서비스 인스턴스 가 없으면 경로를 노출하지 않음
* 수동 서비스 디스커버리 사용시 서비스 인스턴스가 없더라도 주울은 그 경로 그대로 표시, 호출 시 500 발생

#### 3. 정적 URL을 이용한 수동 경로 매핑
```yaml
zuul:
  routes:
    licensestatic:
      path: /licensestatic/**
      serviceId: licensestatic
ribbon:
  eureka:
    enabled: false
licensestaic:
  ribbon:
    listOfServers: http://licenseservice-static1:8081, http://licenseservice-static2:8082
```

#### 4. JVM 기반이 아닌 인스턴스 : 스프링 사이트카로 주울 서버에 등록

<br/>
<br/>

## 경로 구성을 동적으로 로딩
#### POST 기반 엔드포인트 기반인 /refresh를 노출해 경로 구성을 다시 적용 가능

<br/>
<br/>

## 주울과 서비스 타임아웃
#### 기본적으로 Zuul은 요청을 처리하는데 1초 이상 걸리는 모든 호출을 종료하고 500에러 반환
#### Custom timeout
```yaml
zuul.prefix: /api
zuul.routes.organizationservice: /organization/**
zuul.routes.licensingservice: /licensing/**
zuul.debug.request: true
hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds: 7000
licensingservice.ribbon.ReadTimeout: 7000
# 일부 서비스 만 변경시 *.default.*를 서비스 이름으로 대체
# hystrix.command.licensingservice.execution.isolation.thread.timeoutInMilliseconds: 3000
```
### * **5초 이상의 타임아웃 구성은 히스트릭스와 리본 모두 설정해야 한다**

<br/>
<br/>

## 사전 필터
```java
package app;

import org.springframework.stereotype.Component;

@Component
public class UserContext {

	public static final String CORRELATION_ID = "tmx-correlation-id";
	public static final String AUTH_TOKEN = "tmx-auth-token";
	public static final String USER_ID = "tmx-user-id";
	public static final String ORG_ID = "tmx-org-id";
	
	private String correlationID = new String();
	private String authToken = new String();
	private String userId = new String();
	private String orgId = new String();
	
	public UserContext() {}
	
	public String getCorrelationID() {
		return correlationID;
	}
	public void setCorrelationID(String correlationID) {
		this.correlationID = correlationID;
	}
	public String getAuthToken() {
		return authToken;
	}
	public void setAuthToken(String authToken) {
		this.authToken = authToken;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getOrgId() {
		return orgId;
	}
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}	
}
```
<br/>

```java
package app;

import org.springframework.util.Assert;

public class UserContextHolder {

	private static final ThreadLocal<UserContext> userContext = new ThreadLocal<UserContext>();
	
	public static final UserContext getContext() {
		UserContext context = userContext.get();
		if (context == null) {
			context = createEmptyContext();
			userContext.set(context);
		}
		return userContext.get();
	}
	
	public static final void setContext(UserContext context) {
		Assert.notNull(context, "Only non-null UserContext instances are permitted");
		userContext.set(context);
	}
	
	public static final UserContext createEmptyContext() {
		return new UserContext();
	}
}
```
<br/>
#### 상관관계  ID의 전파를 보장하는 사용자 정의 RestTemplate과 UserContextInterceptor

```java
package app;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

public class UserContextInterceptor  implements ClientHttpRequestInterceptor{

	@Override
	public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution)
			throws IOException {
		HttpHeaders headers = request.getHeaders();
		headers.add(UserContext.CORRELATION_ID, UserContextHolder.getContext().getCorrelationID());
		headers.add(UserContext.AUTH_TOKEN, UserContextHolder.getContext().getAuthToken());
		return execution.execute(request, body);
	}

}
```
<br/>

```java
@SpringBootApplication
@EnableZuulProxy
public class MsaApplication {

	@LoadBalanced
	@Bean
	public RestTemplate getRestTemplate() {
		RestTemplate template = new RestTemplate();
		List interceptors = template.getInterceptors();
		if (interceptors == null) {
			template.setInterceptors(Collections.singletonList(new UserContextInterceptor()));
		} else {
			interceptors.add(new UserContextInterceptor());
			template.setInterceptors(interceptors);
		}
		return template;
	}
	public static void main(String[] args) {
		SpringApplication.run(MsaApplication.class, args);
	}
}
```
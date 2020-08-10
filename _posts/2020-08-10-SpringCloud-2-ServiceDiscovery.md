---
layout: post
title: 스프링 클라우드 / ServiceDiscovery
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

# Service Discovery

## 간단요약
#### 1. Service Discovery Pattern은 서비스의 물리적 위치를 추상화하는데 사용한다
#### 2. Eureka같은 Service Discovery Engine은 Service client에 영향을 주지 않고 해당 환경의 서비스 인스턴스를 원할하게 추가ㆍ삭제할 수 있다
#### 3. Client측 부하 분산을 사용하면 서비스를 호출하는 Client에서 물리적 위치를 캐싱해 더 나은 성능과 회복성을 제공할 수 있다
#### 4. Eureka는 넷플릭스 프로젝트의 Spring Cloud와 사용하면 쉽게 구축하고 구성할 수 있다.
#### 5. 스프링 클라우드와 넷플릭스 유레카, 그리고 서비스를 호출하는 넷플릭스 리본으로 다음 세가지 메커니즘 사용
#### - Spring Cloud와 DiscoveryClient
#### - Spring Cloud와 리본 지원 RestTemplate
#### - Spring Cloud와 Netflix Feign 클라이언트

<br/>
<br/>

## Service Discovery의 장점
#### 1. 해당 환경에서 실행하는 서비스 인스턴스 갯수를 신속하게 수평하거나 확장할 수 있다.
#### 2. 애플리케이션의 회복성을 향상하는데 도움이 된다.

<br/>
<br/>

## Service Discovery Mechanism
#### 1. 고가용성
##### - 서비스 검색 정보를 서비스 디스커버리 클러스터의 여러 노드가 공유하는 'hot' 클러스터링 환경 지원
##### - 한 노드가 사용할 수 없게 되면 클러스터의 다른 노드가 인계 가능
#### 2. Peer-To-Peer : 각 노드는 서비스 인스턴스의 상태를 공유
#### 3. 부하분산 : 요청을 동적으로 부하 분산해서 서비스 디스커버리가 관리하는 모든 서비스 인스턴스에 분배
#### 4. 회복성 : 클라이언트는 서비스 정보를 로컬에 캐시한다.
#### 5. 장애내성 : 서비스 인스턴스의 비정상을 탐지하고 서비스 목록에서 제거. 사람의 개입없이 조치되어야 함

<br/>
<br/>

## Service Discovery Architecture
#### 1. Service Registration : 서비스를 Service Discovery Agent에 어떻게 등록하는가?
#### 2. Client Lookup of service address : 서비스 클라이언트가 어떻게 서비스 정보를 검색하는가?
#### 3. Information sharing : 서비스 정보를 노드 간에 어떻게 공유하는가?
##### - 서비스는 일반적으로 1개의 서비스 디스커버리 인스턴스에만 등록
##### - 전파메커니즘 : 하드 코딩된 목록 사용, Gossip과 같은 multicast protocol, infection-style protocol 사용
#### 4. Health monitoring : 서비스가 자신으 상태 정보를 서비스 디스버커리 에이전트에 어떻게 전달하는가?

<br/>
<br/>

## 클라이언트측 분산
#### 1. 서비스 소비자가 요청한 데이터를 서비스 소비자 기기에 로컬 캐시
#### 2. 서비스 소비자는 캐시에서 위치 정보 검색, 일반적으로 '라운드 로빈'등으로 서비스 호출을 여러 인스턴스로 분산
#### 3. 서비스 소비자는 주기적으로 서비스 디스커버리 서비스에 접속해 서비스 인스턴스 캐시를 새로고침
<br/>
<br/>

## 서버 구성
```gradle
// https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-netflix-eureka-server
compile group: 'org.springframework.cloud', name: 'spring-cloud-starter-netflix-eureka-server', version: '2.2.4.RELEASE'
```
<br/>
```yaml
server:
  port: 8761 --- 유레카 서버가 수신 대기할 포트

eurka:
  client:
    registerWithEureka: false --- 유레카 서비스에 자신을 등록하지 않음
    fetchRegistry: false --- 레지스트리 정보를 로컬에 캐싱하지 않음
  server:
    waitTimeInMsWhenSyncEmpty: 5 --- 서버가 요청을 받기 전 대기할 초기 시간
  serviceUrl:
    defaultZone: http://localhost:8761
``` 
- waitTimeInMsWhenSyncEmpty는 모든 서비스가 등록할 기회를 갖도록 5분을 기다린 후 등록된 서비스 정보를 공유
- Eureka는 등록된 서비스에서 10초 간격으로 연속 3회의 상태정보를 받아야 함

<br/>

```java
@SpringBootApplicatin
@EnableEurekaServer
public class EurekaServerApplication {
  public static void main(String[] args){
    SpringApplication.run(EurekaServerApplication.class, args);
  }
}
```
<br/>
<br/>

## 서비스 등록
```gradle
// https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-netflix-eureka-server
compile group: 'org.springframework.cloud', name: 'spring-cloud-starter-netflix-eureka-client', version: '2.2.4.RELEASE'
```
<br/>
```yaml
spring:
  appliction:
    name: organizationservice --- 유레카에 등록할 서비스의 논리 이름
  profiles:
    active: default
  cloud: 
    config:
      enabled: true
eureka:
  intance:
    preferIpAddress: true --- 서비스 이름 대신 IP주소 등록
  client:
    registerWithEureka: true --- 유레카에 서비스 등록
    fetchRegistry: true --- 유레카를 검색할 때 마다 레지스트리가 로컬로 캐시
    serviceUrl:
      defaultZone: http://localhost:8761/eureka --- 레지스트리 사본을 로컬로 가져오기
``` 
- 컨테이너 기반의 배포에서는 컨테이너는 DNS가 없는 임의로 생성된 호스트 이름을 부여받아 시작
- preferIpAddress를 true로 하면 IP주소로 검색
- 30초마다 클라이언트 소프트웨어는 유레카 서비스에 레지스트리 변경 사항 여부를 재확인
- defaultZone은 클라이언트가 위치를 확인하는데 사용할 유레카 서비스 목록을 쉼표로 구분해 보관
<br/>
<br/>

## 서비스 검색
#### 1. Spring Discovery Client
#### 2. Rest Template이 활성화된 Spring Discovery Client
#### 3. Netfilx Feign Client

### 1. Spring Discovery Client
#### - 리본 클라이언트와 해당 URL에 등록된 모든 서비스에 대해 질의할 수 있다.
#### - URL 하나를 검색 한후 표준 RestTemplate 클래스로 서비스 호출
<br/>

```java
@EnableDiscoveryClient
public class Application{
  public static void main(String[] args){
    SpringApplication.run(Application.class, args);
  }
}
```

<br/>
### 2. 리본 지원 스프링 RestTemplate을 사용한 서비스 호출
<br/>
```java
public class Application{ 
  
  @LoadBalanced
  @Bean
  public RestTemplate getRestTemplate(){
    return new RestTemplate();
  }

  public static void main(String[] args){
    SpringApplication.run(Application.class, args);
  }
}
```
<br/>
```java
@Component
public class OrganizationRestTemplateClient{

  @Autowired
  RestTemplate restTemplate;

  public Organization getOrganization(String organizationId){
    ResposeEntity<Organization> restExchange = 
      restTemplate.exchange(
        "http://organizationservice/v1/organizations/{organizationId}",
        HttpMethod.GET,
        null, Organization.class, organizationId);
      )
    
    return restExchange.getBody();
  }
}
```
- 라운드 로빈 방식으로 부하 분산
<br/>
### 3. NetFlix Feign 클라이언트로 서비스 호출
#### - 스프링 클라우드 프레임워크는 대상 REST 서비스를 호출하는 데 사용되는 프록시 클래스를 동적으로 생성

```java
@EnableFeignClients
public class Application{
  public static void main(String[] args){
    SpringApplication.run(Application.class, args);
  }
}

@FeignClient("organizationservice") // Feign애너테이션으로 조직 서비스를 Feign에서 확인
public interface OrganizationFeignClient{

  @RestMapping(method=RequestMethod.GET, value="/v1/organizations/{organizationId}", consumes="application/json")
  Organization getOrganization(
    @PathVariable("organizationId" String organizationId);
  )
}
```
- RestTemplate 클래스를 사용할 때 모든 서비스 호출의 HTTP 상태 코드는 getStatus()로 반환
- Feign 클라이언트를 사용하면 호출된 서비스에서 반환하는 HTTP 4xx-5xx 상태 코드는 FeignException에 매핑
- FeignException에 특정 에러 메시지로 파싱할 수 있는 JSON 바디가 포함
- Feign은 에러를 사용자 정의 Exception 클래스로 재매핑하는 에러 디코더 작성 기능 제공
<br/>
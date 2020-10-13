---
layout: post
title: 스프링 클라우드 #0
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

# 간단 요약

## 1장 Spring Cloud Config Server
#### 1. Spring Cloud Config Server를 사용한 Application's properties를 환경별로 설정 가능
#### 2. Spring은 Spring Profile을 사용해 Spring Cloud Config Service에서 조회할 Env Properties를 결정하고 서비스를 시작
#### 3. Spring Cloud Config Services는 file이나 Git 기반의 Application 저장소를 사용해 Application Properties를 저장할 수 있다
#### 4. Spring Cloud Config service는 대칭 및 비대칭 암호화를 사용해 중요한 정보를 암호화 할 수 있음

## 2장 Service Discovery
#### 1. Service Discovery Pattern은 서비스의 물리적 위치를 추상화하는데 사용한다
#### 2. Eureka같은 Service Discovery Engine은 Service client에 영향을 주지 않고 해당 환경의 서비스 인스턴스를 원할하게 추가ㆍ삭제할 수 있다
#### 3. Client측 부하 분산을 사용하면 서비스를 호출하는 Client에서 물리적 위치를 캐싱해 더 나은 성능과 회복성을 제공할 수 있다
#### 4. Eureka는 넷플릭스 프로젝트의 Spring Cloud와 사용하면 쉽게 구축하고 구성할 수 있다.
#### 5. 스프링 클라우드와 넷플릭스 유레카, 그리고 서비스를 호출하는 넷플릭스 리본으로 다음 세가지 메커니즘 사용
#### - Spring Cloud와 DiscoveryClient
#### - Spring Cloud와 리본 지원 RestTemplate
#### - Spring Cloud와 Netflix Feign 클라이언트

## 3장 Client Recovery Pattern
#### 1. MSA에 기반을 둔 Application처럼 고도로 분산된 Application을 설계할 때는 Client 회복성이 고려되어야 함
#### 2. 심각한 서비스 장애(예를 들어 서버 비정상 종료)는 탐지하고 처리하기 쉽다.
#### 3. 성능이 나쁜 서비스 하나가 호출을 완료할 때까지 호출 클라이언트를 대기시키므로 연쇄적인 자원 고갈을 유발
#### 4. 핵심적인 패턴 : 회로차단기, 폴백, 벌크헤드
#### 5. 회로차단기 : 느리게 실행되고 성능 저하도니 시스템 호출을 종료해 빨리 실패시키고 자원 고갈을 방지
#### 6. 폴백 패턴 : 개발자가 원격 서비스 호출이 실패하거나 호출에 대한 회로 차단기가 실패할 때 대체할 코드 경로 정의 가능
#### 7. 벌크헤드 패턴 : 원격 호출을 서로 격리하고 원격 서비스 호출을 자체 스레드 풀로 분리, 일련의 서비스 호출이 실패할 때 애플리케이션 컨테이너의 모든 자원이 고갈되어서는 안됨
#### 8. Hystrix Library는 구성 기능이 뛰어나며, Application 전역과 Class, Thread pool레벨로 설정 가능
#### 9. Hustrix는 THREAD와 SEMAPHORE 격리 모델을 지원
#### 10. THREAD 모델(Hystrix의 기본 격리 모델) : Hystrix로 보호된 호출을 완벽히 격리해서 부모 스레드 컨텍스트를 히스트릭스가 관리하는 스레드에 전파하지 않음
#### 11. SEMAPHORE 모델 : Hystrix 호출을 위해 별도의 스레드를 사용하지 않음. 더 효율적이지만 히스트릭스가 호출을 중단할 때 서비스가 예상하지 않은 동작도 유발할 수 있음

## 4장 Service Routing
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


## 5장 MSA Security
#### 1. OAuth2는 사용자를 인증하는 토큰 기반의 인증 프레임 워크
#### 2. OAuth2를 이용하면 사용자 요청을 처리하는 각 마이크로 서비스를 호출할 때마다 사용자 자격 증명을 제공할 필요가 없음
#### 3. OAuth2는 Grant라는 다양한 매커니즘을 제공해 웹 서비스 호출을 보호
#### 4. OAuth2를 스프링에서 사용하려면 OAuth2 기반의 인증 서비스를 설정해야 한다.
#### 5. 서비스를 호출하려는 모든 애플리케이션은 OAuth2 인증 서비스에 등록되어야 한다.
#### 6. Application 고유 Application 이름과 Secret Key가 있다.
#### 7. 사용자 자격 증명과 역할은 메모리나 데이터 저장소에 있고 Spring 보안으로 접근
#### 8. 각 서비스는 역할이 수행할 행위를 정의
#### 9. Spring Cloud Security는 JWT 명세를 지원
#### 10. JWT는 OAuth2 토큰을 생성하기 위해 서명된 Javascript 표준을 정의
#### 11. JWT를 사용하면 사용자 정의 필드를 명세에 삽입 가능
#### 12. MSA Security는 OAuth2를 사용하는 것 이상을 포함
#### 13. HTTPS를 사용해 서비스 간 호출을 암호화
#### 14. Service Gateway를 사용해 서비스에 접근 가능한 지점을 줄이자
#### 15. 서비스가 실행되는 운영 체제의 인바운드 및 아웃바운드 포트 수를 제한해 서비스 공격 지점을 제한

## 6장 Spring Cloud Stream을 사용한 Event Driven Architecture
#### 1. Messaging을 사용한 비동기식 통신은 MSA의 중요한 부분
#### 2. Application에서 Messaging을 사용하면 서비스를 확장하고 결함에 더 잘 견디게(Fault-tolerant) 만들 수 있다
#### 3. Spring Cloud Stream은 간단한 에너테이션을 사용하고 하부 메시지 플랫폼별 세부 정보를 추상화 해 메시지 발행과 소비를 단순화
#### 4. Spring Cloud Stream의 Message Source는 Annotation된 자바 Method로 Message Broker Queue에 메시지를 발행
#### 5. Spring Cloud Stream의 Message Sync는 Annotation된 Java Method로 Message Broker에서 Message를 수신한다
#### 6. Redis는 DB와 Cache로 사용될 수 있는 Key-value 저장소

## 7장 Spring Cloud Slueth와 Zipkins를 이용한 분산추적
#### 1. Spring Cloud Sleuth를 사용하면 MSA 호출에 추적 정보(상관관계 ID)를 완벽하게 추가할 수 있다.
#### 2. 상관관계 ID는 여러 서비스 사이에서 로그 항목을 연결하는 데 사용. 이 ID로 한 트랜잭션에 연관된 여러 서비스에서 트랙잭션 동작을 확인 가능
#### 3. 상관관계 ID가 강력하지만, 다양한 출처에서 오는 로그를 수집하고 수집된 내용을 검색하며 질의할 수 있는 수집 플랫폼과 상관관계 ID 개념은 짝을 이루어야 함
#### 4. 여러 가지 사내 구축형 로그 수집 플랫폼이 존재하지만, 클라우드 기반 서비스를 사용하면 대규모 Infrastructure를 갖추지 않고도 로그를 관리할 수 있따. 애플리케이션의 로깅 용량이 증가해도 쉽게 확장할 수 있다.
#### 5. Log 수집 Platform과 Docker Container를 통합해 Container의 표준 출력ㆍ에러(stdout/stderr)로 기록되는 모든 로그 데이터를 수집. Docker Container를 Logspout와 클라우드 Logging platform(Papertrail)과 통합해 로그를 수집하고 쿼리할 수 있음
#### 6. 통합된 Logging Platform이 중요하지만 MSA 사이의 트랜잭션을 시각적으로 추적할 수 있는 기능도 매우 소중한 도구
#### 7. Zipkin을 사용하면 서비스 호출이 이루어질 때 서비스 사이에 존재하는 의존성을 볼 수 있음
#### 8. Spring Cloud Sleuth는 Zipkin과 통합. Zipkin은 트랜잭션 흐름을 그래픽으로 보여주고, 사용자 트랜잭션에 연관된 MSA 성능 특성을 이해할 수 있게 함
#### 9. Spring Cloud Sleuth는 Sleuth가 활성화도니 서비스에 사용되는 HTTP 호출과 Inboud/outbound 메시지 채널에 대한 추적 데이터를 자동으로 포착
#### 10. Spring Cloud Sleuth는 각 서비스 호출을 Span 개념에 매핑. Zipkin에서 각 Span의 성능을 볼 수 있음
#### 11. Spring Cloud Sleuth와 Zipkin에서 Spring 기반이 아닌 지원(Postgres나 Redis 같은 Database Server)의 성능을 파악하도록 사용자 정의 Span을 재정의할 수 있다.

## 8장 Publishing
#### 1. Build 및 배포 Pipeline은 MSA 제공을 위해 매우 중요한 부분이다. 제대로 작동하는 빌드 및 배포 파이프라인을 통해ㅐ 새로운 기능과 버그 수정을 몇 분 안에 배포할 수 있다.
#### 2. Build 및 배포 Pipeline은 서비스를 제공하는 데 사람의 직접적인 개입 없이 자동화되어야 한다. 프로세스의 수동 부분은 변동 및 실패 가능성을 나타낸다.
#### 3. Build 및 배포 Pipeline의 자동화에는 많은 Scripting과 올바른 구성이 필요한다. 자동화 구축을 위해 필요한 일의 양을 과소평가해서는 안 된다.
#### 4. Build 및 배포 Pipeline은 불변 가상 머신 또는 컨테이너 이미지를 제공해야 한다. 서버 이미지가 생성된 후에는 절대 변경되면 안된다.
#### 5. 환경별 서버 구성은 서버가 설정될 때 매개변수로 전달되어야 함
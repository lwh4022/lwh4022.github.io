---
layout: post
title: 스프링 클라우드 / Config-Server
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

# Spring Cloud Config Server

## 간단요약
#### 1. Spring Cloud Config Server를 사용한 Application's properties를 환경별로 설정 가능
#### 2. Spring은 Spring Profile을 사용해 Spring Cloud Config Service에서 조회할 Env Properties를 결정하고 서비스를 시작
#### 3. Spring Cloud Config Services는 file이나 Git 기반의 Application 저장소를 사용해 Application Properties를 저장할 수 있다
#### 4. Spring Cloud Config service는 대칭 및 비대칭 암호화를 사용해 중요한 정보를 암호화 할 수 있음

<br/>
<br/>

## 컨피그 서버의 원칙
#### 1. 분리 : 서비스 구성정보와 서비스 배포를 분리한다.
#### 2. 추상화 : Application이 REST 기반의 JSON 서비스를 사용해 구성데이터를 조회한다.
#### 3. 중앙집중화 : Application 구성정보를 가능한 소수 저장소에 집중화한다.
#### 4. 견고성 : Application 구성정보 저장소는 어떠한 환경에도 구성 정보를 제공해야 한다.

<br/>
<br/>

## application.properties 구성법
```yaml
server.port: 8888
spring.cloud.config.server.git.uri: file//${user.home}/config-repo
#{user.home}은 git repository
# window에서는 file:///${user.home}/config-repo로 /추가
```
#### - 실제 서버는 호스팅된 git을 권장

<br/>
<br/>

## 환경저장소 (Environment Repository)

<br/>

#### 1. Environment 객체 구성
##### - {application} <-> Client의 spring.application.name 
##### - {profile} <-> Client의 spring.files.active (쉼표로 구분, comma-sepreated list)
###### * profile이 여러 개일 경우 가장 마지막 것이 적용
##### - {label} <-> version 정보 등
#### 2. 환경저장소는 기본 적으로 Git을 사용

```properties
spring.cloud.config.server.git.uri=${위치}
spring.cloud.config.server.git.uri=file:${위치} 
# 로컬 git 사용시
```
###### * {application}, {label}에 브랜치를 지정할 시 : '/' 대신 '(_)'을 사용 

<br/>

#### 2. SSL 검증 무시
```properties
spring.cloud.config.server.git.url=https://example.com /my/repo
spring.cloud.config.server.git.skipSslValidation=true
```

<br/>

#### 3. Http Connection Timeout(단위 : 초)
```properties
spring.cloud.config.server.git.url=https://example.com /my/repo
spring.cloud.config.server.git.timout=4
```

<br/>

#### 4. 다양한 저장소와 매칭
```yaml
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/spring-cloud-samples/config-repo
          repos:
            simple: https://github.com/simple/config-repo
            special:
              pattern: special*/dev*,*special*/dev*
              uri: https://github.com/special/config-repo
            local:
              pattern: local*
              uri: file:/home/configsvc/config-repo
```
###### * simple은 simple/*로 매칭
###### * 아무 것도 해당되지 않을 경우 spring.config.server.git.uri에서 구성정보 획득

<br/>

```yaml
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/spring-cloud-samples/config-repo
          repos:
            development:
              pattern:
                - '*/development'
                - '*/staging'
              uri: https://github.com/development/config-repo
            staging:
              pattern:
                - '*/qa'
                - '*/production'
              uri: https://github.com/staging/config-repo
```

<br/>

###### * 저장소 내 폴더 접근시
```yaml
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/spring-cloud-samples/config-repo
          searchPaths: foo,bar*
```
###### * 저장소 내 foo폴더와 bar 폴더내에서 구성정보를 찾음

<br/>

###### * 다른 서버에 Config Server를 추가시
```yaml
spring:
  application:
    name: configserver
  profiles:
    active: composite
  cloud:
    config:
      server:
        composite:
          - type: native
            search-locations: ${HOME}/Desktop/config
        bootstrap: true
```
###### * bootstrap이 true일시, bootstrap.yml내의 repository URI에서 구성 정보 획득
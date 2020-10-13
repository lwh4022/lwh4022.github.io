---
layout: post
title: 스프링 클라우드 / Security
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

<br/>
<br/>

## OAuth2 소개
#### 1. Protected Resource : 적절한 권한을 부여받은 인증된 사용자만 Access할 수 있음
#### 2. resource owner : 등록한 애플리케이션에서 식별 가능한 secret key를 받음
#### 3. application: 사용자를 대신해 서비를 호출
#### 4. OAuth2 authentication server : application과 소비되는 서비스 사이의 중개자
<br/>
<br/>

## OAuth2의 Grant Type
#### 1. Password
#### 2. Client credential
#### 3. Authorization code
#### 4. implicit


---
layout: post
title: Service Discovery with Spring Cloud and Eureka
categories: [Develop, MSA]
tags: [MSA, Develop]    
---
> 스프링 마이크로 서비스 코딩 공작소 참조

## Monolithic의 단점

1. 단일 장애 지점 : 주 Load Balancer와 보조 LoadBalancer 모두 다운될 경우 장애 발생
<br/>
<br/>
2. 수평확장의 제약 : 상용 Load Balancer 하나만 부하분산 기능, Licensing 비용 발생
<br/>
<br/>
3. 동적 관리에 제약
<br/>
<br/>
4. 상용 Load Balancer의 API에 의존

## Service Discovery의 장점

1. 고가용성: 서비스 검색정보를 서비스 디스커버리 클러스터의 여러 노도가 공유하는 'Hot' 클러스터링 환경 지원
2. P2P: 서비스 디스커버리 클러스터의 각 노드는 서비스 인스턴의 상태 공유
3. 부하분산 : 동적 관리에 유용
4. 회복성 : Service Discovery Client는 서비스 정보를 Local에 Caching, Service Discovery 미가용시 Caching된 정보로 탐색
5. 장애내성 : 서비스 장애 팀지 및 제외를 사람의 개입없이 조회

##  Service Discovery Architecture
1. Service Registration: 서비스 인스턴스를 서비스 디스커버리에 어떻게 등록하는가?
2. Client lookup of service address : 서비스 클라이언트가 어떻게 서비스 정보를 검색하는가?
3. Information Sharing: 서비스 정보를 노드간에 어떻게 공유하는가?
4. Health monitoring: 서비스가 자신의 상태를 서비스 디스커버리 에이전트에 어떻게 전달하는가?

## Spring과 Netflix Uereka를 사용한 Service Discovery
1. Service instance 시작 -> Physical IP, Port, Service ID를 등록
2. 1개의 Service Discovery instance에 등록 -> P2P로 전파(**Gossip, infection-style protocol**)
3. Client측 Load-balancing


# AGENTS.md — Public Portfolio Asset

This repository is a public portfolio asset tracked by the cross-agent deploy registry.



## Public Asset Deploy Return Rule

- Managed source: `/Users/godju/Claude/Projects/포트폴리오 리뉴얼/_커리어전략/PUBLIC-ASSET-AGENTS-SHARED.md`
- Registry SSOT: `/Users/godju/Claude/Projects/포트폴리오 리뉴얼/_커리어전략/DEPLOY-REGISTRY.yml`
- Asset id: `learning-atlas`
- 배포 완료 시: push 후 `git rev-parse HEAD`를 RETURN에 명시(자산 id·HEAD·변경요약·live URL). Job Hub가 캐시우회 검증 후 `DEPLOY-REGISTRY.yml`에 기입 — 자가 직접기입 금지.

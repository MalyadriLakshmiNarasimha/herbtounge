# Herbal AI Authenticity Dashboard Optimization Plan

## Quick Wins (1-3 days)
- [ ] Measure and identify slowest endpoints using browser DevTools, curl -w, wrk/hey
- [ ] Convert high-latency pages to CSR with examples
- [ ] Add client-side login component optimizations
- [ ] Add caching for expensive read endpoints with Redis and HTTP headers
- [ ] Add database indexes for common WHERE/JOIN columns
- [ ] Add gzip/Brotli compression & Cache-Control headers with nginx config

## Medium-term (1-2 weeks)
- [ ] Profile and optimize FastAPI queries: use SQLAlchemy debug toolbar, EXPLAIN queries, select_related/prefetch_related examples
- [ ] Replace heavy synchronous tasks with background workers (Celery + Redis)
- [ ] Provide code for asynchronous password hashing verification
- [ ] Bundle analysis & code splitting in Next.js (commands and next/dynamic examples)
- [ ] Use next/script for third-party scripts and defer/idle them
- [ ] Add rate limiting on API routes (FastAPI + slowapi or nginx/Lua)

## Long-term / Architectural (2+ weeks)
- [ ] Criteria for moving from serverless to persistent backend
- [ ] Scale plan: load balancer + multiple Uvicorn workers + Redis session store + Celery workers + object store
- [ ] Database scaling: read replicas, partitioning/sharding, move heavy analytics to warehouse
- [ ] Consider microservices for distinct modules (payment, reporting) - migration strategy

## Observability & Testing
- [ ] Add structured logging (JSON logs) for FastAPI and Next.js
- [ ] Metrics & tracing: Prometheus metrics + Grafana dashboards, OpenTelemetry tracing
- [ ] Distributed tracing with OpenTelemetry setup
- [ ] Log retention and error alerting (Sentry)
- [ ] Load testing commands and thresholds (wrk, hey, artillery)

## Deployment & Infra
- [ ] Dockerfile for FastAPI + Uvicorn + static collection
- [ ] docker-compose.yml with redis, postgres, celery, nginx
- [ ] Nginx config for gzip/brotli, caching, proxy buffering
- [ ] Uvicorn config (worker class, worker count formula)
- [ ] Systemd / PM2 for persistent service

## Security, Resilience, Edge Cases
- [ ] Circuit breaker or bulkhead patterns for downstream services
- [ ] Backpressure strategy for slow endpoints
- [ ] Graceful degradation: return cached stale data while refreshing

## Verification & Metrics
- [ ] Collect before/after metrics: P95/P99 latency, average response time, TTFB, backend CPU/memory, DB slow query count
- [ ] Prometheus queries and Grafana panel ideas
- [ ] Final checklist with smoke tests and verification commands

## Example Code & Snippets
- [ ] Next.js: client-side login page, token storage (httpOnly cookie vs localStorage), API call example
- [ ] FastAPI: fast login API view, DB index migration, Celery tasks
- [ ] Redis caching decorator for FastAPI views
- [ ] Nginx config for caching, gzip, timeouts
- [ ] Docker and docker-compose examples
- [ ] wrk/hey load test command examples

## Implementation Checklist
- [ ] Numbered items, exact commands, file edits, tests after changes
- [ ] Risk levels (LOW, MEDIUM, HIGH) and expected impact

## Rollout Plan
- [ ] 10-step prioritized rollout for production
- [ ] Monitoring thresholds that trigger alerts

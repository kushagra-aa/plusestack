# PulseStack Roadmap

This roadmap outlines the evolution of PulseStack from its current assignment-compliant state to a production-ready Developer SaaS platform.

## Phase 1: Foundation (Current Implementation)
- Core REST API for Notifications and Workspaces.
- JWT-based authentication for Security.
- Basic Role-Based Access Control (RBAC).
- Real-time delivery via namespaced WebSockets.
- Per-user read tracking using the Receipt Pattern.
- Client-side infinite scrolling and real-time UI synchronization.

## Phase 2: Professionalization (Immediate Future)
- **Database Migration**: Fully transition to Postgres.
- **Background Workers**: Implement BullMQ for asynchronous receipt generation during large broadcasts.
- **Enhanced RBAC**: Granular permissions for creating/deleting workspace-wide notifications.
- **Search & Filters**: Full-text search for notifications and advanced filtering (by type, date range).

## Phase 3: SaaS Readiness (Middle Term)
- **API Keys**: Allow developers to generate scoped API keys for external event ingestion.
- **Webhook Integration**: Support for outgoing webhooks to notify external services.
- **Email/SMS Fallback**: Intelligent delivery engine that routes notifications to Slack, Email, or SMS if a user is offline.
- **Notification Templates**: Dynamic templates with variable substitution for rich content.
- **Tenant Billing**: Integration with Stripe for workspace-based subscription management.

## Phase 4: Enterprise Infrastructure (Long Term)
- **Microservices Split**: Decouple the Notification Engine from the Auth and Workspace services.
- **Event-Driven Architecture**: Fully migrate to an event bus (e.g., Kafka) for internal communication.
- **Advanced Analytics**: Real-time dashboards showing delivery rates, open rates, and user engagement metrics.
- **Compliance & Auditing**: Detailed logs and data retention policies for enterprise requirements.
- **Edge Deployment**: Deploy notification workers to the edge for ultra-low latency worldwide.

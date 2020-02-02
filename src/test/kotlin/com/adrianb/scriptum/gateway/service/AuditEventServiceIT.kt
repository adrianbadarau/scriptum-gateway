
package com.adrianb.scriptum.gateway.service

import com.adrianb.scriptum.gateway.domain.PersistentAuditEvent
import com.adrianb.scriptum.gateway.repository.PersistenceAuditEventRepository
import com.adrianb.scriptum.gateway.GatewayApp
import io.github.jhipster.config.JHipsterProperties
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.time.Instant
import java.time.temporal.ChronoUnit

import org.assertj.core.api.Assertions.assertThat

/**
 * Integration tests for {@link AuditEventService}.
 */
@SpringBootTest(classes = [GatewayApp::class])
class AuditEventServiceIT {
    @Autowired
    private lateinit var auditEventService: AuditEventService

    @Autowired
    private lateinit var persistenceAuditEventRepository: PersistenceAuditEventRepository

    @Autowired
    private lateinit var jHipsterProperties: JHipsterProperties

    private lateinit var auditEventOld: PersistentAuditEvent

    private lateinit var auditEventWithinRetention: PersistentAuditEvent

    private lateinit var auditEventNew: PersistentAuditEvent

    @BeforeEach
    fun init() {
        auditEventOld = PersistentAuditEvent()
        auditEventOld.auditEventDate = Instant.now().minus((jHipsterProperties.auditEvents.retentionPeriod + 1).toLong(), ChronoUnit.DAYS)
        auditEventOld.principal = "test-user-old"
        auditEventOld.auditEventType = "test-type"

        auditEventWithinRetention = PersistentAuditEvent()
        auditEventWithinRetention.auditEventDate = Instant.now().minus((jHipsterProperties.auditEvents.retentionPeriod - 1).toLong(), ChronoUnit.DAYS)
        auditEventWithinRetention.principal = "test-user-retention"
        auditEventWithinRetention.auditEventType = "test-type"

        auditEventNew = PersistentAuditEvent()
        auditEventNew.auditEventDate = Instant.now()
        auditEventNew.principal = "test-user-new"
        auditEventNew.auditEventType = "test-type"
    }

    @Test
    fun verifyOldAuditEventsAreDeleted() {
        persistenceAuditEventRepository.deleteAll()
        persistenceAuditEventRepository.save(auditEventOld)
        persistenceAuditEventRepository.save(auditEventWithinRetention)
        persistenceAuditEventRepository.save(auditEventNew)
        
        auditEventService.removeOldAuditEvents()
        
        assertThat(persistenceAuditEventRepository.findAll().size).isEqualTo(2)
        assertThat(persistenceAuditEventRepository.findByPrincipal("test-user-old")).isEmpty()
        assertThat(persistenceAuditEventRepository.findByPrincipal("test-user-retention")).isNotEmpty()
        assertThat(persistenceAuditEventRepository.findByPrincipal("test-user-new")).isNotEmpty()
    }
}

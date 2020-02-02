package com.adrianb.scriptum.gateway.web.rest

import com.adrianb.scriptum.gateway.GatewayApp
import io.github.jhipster.config.JHipsterProperties
import com.adrianb.scriptum.gateway.config.audit.AuditEventConverter
import com.adrianb.scriptum.gateway.domain.PersistentAuditEvent
import com.adrianb.scriptum.gateway.repository.PersistenceAuditEventRepository

import com.adrianb.scriptum.gateway.service.AuditEventService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.MockitoAnnotations
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.web.PageableHandlerMethodArgumentResolver
import org.springframework.format.support.FormattingConversionService
import org.springframework.http.MediaType
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import java.time.Instant

import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.hamcrest.Matchers.hasItem
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

private const val SAMPLE_PRINCIPAL = "SAMPLE_PRINCIPAL"
private const val SAMPLE_TYPE = "SAMPLE_TYPE"
private val SAMPLE_TIMESTAMP = Instant.parse("2015-08-04T10:11:30Z")
private const val SECONDS_PER_DAY = (60 * 60 * 24).toLong()

/**
 * Integration tests for the [AuditResource] REST controller.
 */
@SpringBootTest(classes = [GatewayApp::class])
class AuditResourceIT {

    @Autowired
    private lateinit var auditEventRepository: PersistenceAuditEventRepository

    @Autowired
    private lateinit var auditEventConverter: AuditEventConverter

    @Autowired
    private lateinit var jacksonMessageConverter: MappingJackson2HttpMessageConverter

    @Autowired
    private lateinit var jhipsterProperties: JHipsterProperties

    @Autowired
    @Qualifier("mvcConversionService")
    private lateinit var formattingConversionService: FormattingConversionService

    @Autowired
    private lateinit var pageableArgumentResolver: PageableHandlerMethodArgumentResolver

    private lateinit var auditEvent: PersistentAuditEvent

    private lateinit var restAuditMockMvc: MockMvc

    @BeforeEach
    fun setup() {
        MockitoAnnotations.initMocks(this)
        val auditEventService = AuditEventService(auditEventRepository, auditEventConverter, jhipsterProperties)
        val auditResource = AuditResource(auditEventService)
        this.restAuditMockMvc = MockMvcBuilders.standaloneSetup(auditResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setConversionService(formattingConversionService)
            .setMessageConverters(jacksonMessageConverter).build()
    }

    @BeforeEach
    fun initTest() {
        auditEventRepository.deleteAll()
        auditEvent = PersistentAuditEvent(
            auditEventType = SAMPLE_TYPE,
            principal = SAMPLE_PRINCIPAL,
            auditEventDate = SAMPLE_TIMESTAMP
        )
    }

    @Test
    @Throws(Exception::class)
    fun getAllAudits() {
        // Initialize the database
        auditEventRepository.save(auditEvent)

        // Get all the audits
        restAuditMockMvc.perform(get("/management/audits"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("\$.[*].principal").value(hasItem(SAMPLE_PRINCIPAL)))
    }

    @Test
    @Throws(Exception::class)
    fun getAudit() {
        // Initialize the database
        auditEventRepository.save(auditEvent)

        // Get the audit
        restAuditMockMvc.perform(get("/management/audits/{id}", auditEvent.id))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("\$.principal").value(SAMPLE_PRINCIPAL))
    }

    @Test
    @Throws(Exception::class)
    fun getAuditsByDate() {
        // Initialize the database
        auditEventRepository.save(auditEvent)

        // Generate dates for selecting audits by date, making sure the period will contain the audit
        val fromDate = SAMPLE_TIMESTAMP.minusSeconds(SECONDS_PER_DAY).toString().substring(0, 10)
        val toDate = SAMPLE_TIMESTAMP.plusSeconds(SECONDS_PER_DAY).toString().substring(0, 10)

        // Get the audit
        restAuditMockMvc.perform(get("/management/audits?fromDate=$fromDate&toDate=$toDate"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("\$.[*].principal").value(hasItem(SAMPLE_PRINCIPAL)))
    }

    @Test
    @Throws(Exception::class)
    fun getNonExistingAuditsByDate() {
        // Initialize the database
        auditEventRepository.save(auditEvent)

        // Generate dates for selecting audits by date, making sure the period will not contain the sample audit
        val fromDate = SAMPLE_TIMESTAMP.minusSeconds(2 * SECONDS_PER_DAY).toString().substring(0, 10)
        val toDate = SAMPLE_TIMESTAMP.minusSeconds(SECONDS_PER_DAY).toString().substring(0, 10)

        // Query audits but expect no results
        restAuditMockMvc.perform(get("/management/audits?fromDate=$fromDate&toDate=$toDate"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(header().string("X-Total-Count", "0"))
    }

    @Test
    @Throws(Exception::class)
    fun getNonExistingAudit() {
        // Get the audit
        restAuditMockMvc.perform(get("/management/audits/{id}", java.lang.Long.MAX_VALUE))
            .andExpect(status().isNotFound)
    }

    @Test
    @Throws(Exception::class)
    fun testPersistentAuditEventEquals() {
        equalsVerifier(PersistentAuditEvent::class)
        val auditEvent1 = PersistentAuditEvent(id = "id1")
        val auditEvent2 = PersistentAuditEvent(id = auditEvent1.id)
        assertThat(auditEvent1).isEqualTo(auditEvent2)
        auditEvent2.id = "id2"
        assertThat(auditEvent1).isNotEqualTo(auditEvent2)
        auditEvent1.id = null
        assertThat(auditEvent1).isNotEqualTo(auditEvent2)
    }
}

package com.adrianb.scriptum.gateway.gateway.responserewriting

import com.netflix.zuul.context.RequestContext
import org.apache.commons.io.IOUtils
import org.junit.jupiter.api.Test
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse

import java.io.ByteArrayInputStream
import java.nio.charset.StandardCharsets
import java.util.zip.GZIPInputStream

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import springfox.documentation.swagger2.web.Swagger2Controller.DEFAULT_URL

/**
 * Tests [SwaggerBasePathRewritingFilter] class.
 */
class SwaggerBasePathRewritingFilterTest {

    private val filter = SwaggerBasePathRewritingFilter()

    @Test
    fun shouldFilter_on_default_swagger_url() {
        val request = MockHttpServletRequest("GET", DEFAULT_URL)
        RequestContext.getCurrentContext().request = request

        assertTrue(filter.shouldFilter())
    }

    /**
     * Zuul DebugFilter can be triggered by "deug" parameter.
     */
    @Test
    fun shouldFilter_on_default_swagger_url_with_param() {
        val request = MockHttpServletRequest("GET", DEFAULT_URL)
        request.setParameter("debug", "true")
        RequestContext.getCurrentContext().request = request

        assertTrue(filter.shouldFilter())
    }

    @Test
    fun shouldNotFilter_on_wrong_url() {
        val request = MockHttpServletRequest("GET", "/management/info")
        RequestContext.getCurrentContext().request = request

        assertFalse(filter.shouldFilter())
    }

    @Test
    @Throws(Exception::class)
    fun run_on_valid_response() {
        val request = MockHttpServletRequest("GET", "/service1$DEFAULT_URL")
        val context = RequestContext.getCurrentContext()
        context.request = request

        val response = MockHttpServletResponse()
        context.responseGZipped = false
        context.response = response

        val `in` = IOUtils.toInputStream("{\"basePath\":\"/\"}", StandardCharsets.UTF_8)
        context.responseDataStream = `in`

        filter.run()

        assertEquals("UTF-8", response.characterEncoding)
        assertEquals("{\"basePath\":\"/service1\"}", context.responseBody)
    }

    @Test
    @Throws(Exception::class)
    fun run_on_valid_response_gzip() {
        val request = MockHttpServletRequest("GET", "/service1$DEFAULT_URL")
        val context = RequestContext.getCurrentContext()
        context.request = request

        val response = MockHttpServletResponse()
        context.responseGZipped = true
        context.response = response

        context.responseDataStream = ByteArrayInputStream(gzipData("{\"basePath\":\"/\"}"))

        filter.run()

        assertEquals("UTF-8", response.characterEncoding)

        val responseDataStream = GZIPInputStream(context.responseDataStream)
        val responseBody = IOUtils.toString(responseDataStream, StandardCharsets.UTF_8)
        assertEquals("{\"basePath\":\"/service1\"}", responseBody)
    }
}

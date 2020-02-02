package com.adrianb.scriptum.gateway.config

import io.github.jhipster.config.JHipsterProperties

import com.adrianb.scriptum.gateway.gateway.accesscontrol.AccessControlFilter
import com.adrianb.scriptum.gateway.gateway.responserewriting.SwaggerBasePathRewritingFilter

import org.springframework.cloud.netflix.zuul.filters.RouteLocator
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class GatewayConfiguration {

    @Configuration
    class SwaggerBasePathRewritingConfiguration {
        @Bean
        fun swaggerBasePathRewritingFilter() = SwaggerBasePathRewritingFilter()
    }

    @Configuration
    class AccessControlFilterConfiguration {
        @Bean
        fun accessControlFilter(routeLocator: RouteLocator, jHipsterProperties: JHipsterProperties) =
            AccessControlFilter(routeLocator, jHipsterProperties)
    }

}

package com.adrianb.scriptum.gateway.repository

import com.adrianb.scriptum.gateway.domain.Authority
import org.springframework.data.mongodb.repository.MongoRepository


/**
 * Spring Data MongoDB repository for the [Authority] entity.
 */

interface AuthorityRepository : MongoRepository<Authority, String>

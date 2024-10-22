package com.coremedia.labs.studio.rest;

import com.coremedia.cap.content.ContentRepository;
import com.coremedia.cap.undoc.common.spring.CapRepositoriesConfiguration;
import com.coremedia.labs.studio.rest.query.QueryResource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration(
	proxyBeanMethods = false
)
@Import({
        CapRepositoriesConfiguration.class
})
public class QueryRestConfiguration {

  @Bean
  public QueryResource queryResource(ContentRepository contentRepository) {
    return new QueryResource(contentRepository);
  }


}

package com.coremedia.labs.studio.rest;

import com.coremedia.cap.common.CapConnection;
import com.coremedia.cms.common.plugins.beans_for_plugins2.CommonBeansForPluginsConfiguration;
import com.coremedia.labs.studio.rest.query.QueryResource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration(
	proxyBeanMethods = false
)
@Import({
        CommonBeansForPluginsConfiguration.class,
})
public class QueryRestConfiguration {

  @Bean
  public QueryResource queryResource(CapConnection connection) {
    return new QueryResource(connection.getContentRepository());
  }


}

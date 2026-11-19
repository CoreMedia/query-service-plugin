package com.coremedia.labs.studio.rest;

import com.coremedia.cap.common.CapConnection;
import com.coremedia.cms.common.plugins.beans_for_plugins2.CommonBeansForPluginsConfiguration;
import com.coremedia.labs.studio.rest.query.QueryAccessPolicy;
import com.coremedia.labs.studio.rest.query.QueryResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import java.util.List;

@Configuration(
	proxyBeanMethods = false
)
@Import({
        CommonBeansForPluginsConfiguration.class,
})
public class QueryRestConfiguration {

  @Bean
  public QueryAccessPolicy queryAccessPolicy(CapConnection connection,
                                             @Value("${query-service.allowed-groups:administratoren,developer,query-tool-user}") String allowedGroups) {
    return new QueryAccessPolicy(connection.getUserRepository(), List.of(allowedGroups.split(",")));
  }

  @Bean
  public QueryResource queryResource(CapConnection connection, QueryAccessPolicy queryAccessPolicy) {
    return new QueryResource(connection.getContentRepository(), queryAccessPolicy);
  }


}

package com.coremedia.labs.studio.rest.context;

import com.coremedia.cap.test.xmlrepo.XmlRepoConfiguration;
import com.coremedia.cap.test.xmlrepo.XmlUapiConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Scope;

import static org.springframework.beans.factory.config.BeanDefinition.SCOPE_SINGLETON;

@Configuration(
	proxyBeanMethods = false
)
@Import({
  XmlRepoConfiguration.class
})
public class QueryTestConfiguration {

  private static final String CONTENT_REPOSITORY = "classpath:/testing/contenttest.xml";

  @Bean
  @Scope(SCOPE_SINGLETON)
  public XmlUapiConfig xmlUapiConfig() {
    return new XmlUapiConfig(CONTENT_REPOSITORY);
  }
}

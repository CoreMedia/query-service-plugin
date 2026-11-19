package com.coremedia.labs.studio.rest.query;

import com.coremedia.cap.user.Group;
import com.coremedia.cap.user.User;
import com.coremedia.cap.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Principal;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Decides whether a user may use the query tool. Access is granted to members of any of the allowed groups.
 */
public class QueryAccessPolicy {

  private static final Logger LOG = LoggerFactory.getLogger(QueryAccessPolicy.class);

  public static final String GROUP_ADMINISTRATORS = "administratoren";
  public static final String GROUP_DEVELOPER = "developer";
  public static final String GROUP_QUERY_TOOL_USER = "query-tool-user";

  public static final List<String> DEFAULT_ALLOWED_GROUPS =
    List.of(GROUP_ADMINISTRATORS, GROUP_DEVELOPER, GROUP_QUERY_TOOL_USER);

  private final UserRepository userRepository;
  private final Set<String> allowedGroups;

  public QueryAccessPolicy(UserRepository userRepository, Collection<String> allowedGroups) {
    this.userRepository = userRepository;
    this.allowedGroups = allowedGroups.stream().map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toSet());
  }

  public boolean isAllowed(Principal principal) {
    String principalName = principal == null ? null : principal.getName();
    if (principalName == null) {
      LOG.debug("Query Tool access denied: no authenticated principal name");
      return false;
    }
    if (userRepository == null) {
      LOG.debug("Query Tool access denied: user repository is unavailable");
      return false;
    }
    if (allowedGroups.isEmpty()) {
      LOG.debug("Query Tool access denied: no groups configured in query-service.allowed-groups");
      return false;
    }
    User user = userRepository.getUserByName(principalName);
    if (user == null) {
      LOG.debug("Query Tool access denied: authenticated principal could not be resolved to a user");
      return false;
    }
    for (String groupName : allowedGroups) {
      Group group = userRepository.getGroupByName(groupName);
      if (group == null) {
        LOG.debug("Query Tool access check: configured group '{}' could not be resolved", groupName);
      } else if (user.isMemberOf(group)) {
        return true;
      }
    }
    LOG.debug("Query Tool access denied: no membership in any resolved allowed group; configured groups: {}", allowedGroups);
    return false;
  }
}

package com.coremedia.labs.studio.rest.query;

import com.coremedia.cap.user.Group;
import com.coremedia.cap.user.User;
import com.coremedia.cap.user.UserRepository;

import java.security.Principal;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Decides whether a user may use the query tool. Access is granted to members of any of the allowed groups.
 */
public class QueryAccessPolicy {

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
    if (principal == null || principal.getName() == null || userRepository == null) {
      return false;
    }
    User user = userRepository.getUserByName(principal.getName());
    if (user == null) {
      return false;
    }
    for (String groupName : allowedGroups) {
      Group group = userRepository.getGroupByName(groupName);
      if (group != null && user.isMemberOf(group)) {
        return true;
      }
    }
    return false;
  }
}

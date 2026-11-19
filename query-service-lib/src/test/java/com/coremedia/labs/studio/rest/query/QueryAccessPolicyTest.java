package com.coremedia.labs.studio.rest.query;

import com.coremedia.cap.user.Group;
import com.coremedia.cap.user.User;
import com.coremedia.cap.user.UserRepository;
import org.junit.Test;

import java.lang.reflect.Proxy;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class QueryAccessPolicyTest {

  private static final Map<String, Group> GROUPS = Map.of(
    "administratoren", proxy(Group.class, (m, a) -> null),
    "developer", proxy(Group.class, (m, a) -> null),
    "query-tool-user", proxy(Group.class, (m, a) -> null),
    "other", proxy(Group.class, (m, a) -> null)
  );

  @SuppressWarnings("unchecked")
  private static <T> T proxy(Class<T> type, java.util.function.BiFunction<String, Object[], Object> handler) {
    return (T) Proxy.newProxyInstance(type.getClassLoader(), new Class<?>[]{type},
      (p, method, args) -> switch (method.getName()) {
        case "hashCode" -> System.identityHashCode(p);
        case "equals" -> p == args[0];
        default -> handler.apply(method.getName(), args);
      });
  }

  private static QueryAccessPolicy policy(Set<String> userGroups, List<String> allowed) {
    User user = proxy(User.class, (m, a) -> m.equals("isMemberOf") && userGroups.stream().anyMatch(g -> GROUPS.get(g) == a[0]));
    UserRepository repo = proxy(UserRepository.class, (m, a) -> switch (m) {
      case "getUserByName" -> "alice".equals(a[0]) ? user : null;
      case "getGroupByName" -> GROUPS.get((String) a[0]);
      default -> null;
    });
    return new QueryAccessPolicy(repo, allowed);
  }

  @Test
  public void membersOfAllowedGroupsAreGranted() {
    for (String group : QueryAccessPolicy.DEFAULT_ALLOWED_GROUPS) {
      assertTrue(group, policy(Set.of(group), QueryAccessPolicy.DEFAULT_ALLOWED_GROUPS).isAllowed(() -> "alice"));
    }
  }

  @Test
  public void otherUsersAreDenied() {
    QueryAccessPolicy policy = policy(Set.of("other"), QueryAccessPolicy.DEFAULT_ALLOWED_GROUPS);
    assertFalse(policy.isAllowed(() -> "alice"));
    assertFalse(policy.isAllowed(() -> "unknown"));
    assertFalse(policy.isAllowed(null));
  }

  @Test
  public void configuredGroupsAreRespected() {
    assertFalse(policy(Set.of("developer"), List.of("query-tool-user")).isAllowed(() -> "alice"));
    assertTrue(policy(Set.of("other"), List.of(" other ")).isAllowed(() -> "alice"));
  }
}

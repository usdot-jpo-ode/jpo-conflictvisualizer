package us.dot.its.jpo.ode.api.keycloak;

import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import us.dot.its.jpo.ode.api.ConflictMonitorApiProperties;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

/**
 * Provides keycloak based spring security configuration.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class KeycloakConfig  {

    final ConflictMonitorApiProperties properties;
    final KeycloakJwtAuthenticationConverter keycloakJwtAuthenticationConverter;

    @Value("${security.enabled:true}")
    private boolean securityEnabled;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.resource}")
    private String resource;

    @Value("${keycloak.auth-server-url}")
    private String authServer;

    @Value("${keycloak_username}")
    private String username;

    @Value("${keycloak_password}")
    private String password;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        if(securityEnabled){
            System.out.println("Running with KeyCloak Authentication");

            return httpSecurity
                    //.addFilterBefore(corsFilter(), SessionManagementFilter.class)
                    .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .cors(this::configureCors)
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(request -> request
                            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow CORS preflight
                            .requestMatchers("/**").access(AccessController::checkAccess)
                            .anyRequest().authenticated()
                    )
                    .oauth2ResourceServer(resourceServerConfigurer -> resourceServerConfigurer.jwt(
                            jwtConfigurer -> jwtConfigurer.jwtAuthenticationConverter(keycloakJwtAuthenticationConverter)

                    ))
                    .build();


        }else{
            System.out.println("Running without KeyCloak Authentication");
            return httpSecurity
                    //.addFilterBefore(corsFilter(), SessionManagementFilter.class)
                    .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .cors(this::configureCors)
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(
                        request -> request.anyRequest().permitAll()
                    )
                    .oauth2Client(withDefaults())
                    .build();
        }
    }



    // Keycloak admin client used for email
    @Bean
    public Keycloak keyCloakBuilder() {
        System.out.println("Auth Server: " + authServer);
        System.out.println("Realm: " + realm);
        System.out.println("Resource: " + resource);
        return KeycloakBuilder.builder()
                .serverUrl(authServer)
                .grantType("password")
                .realm("master")
                .clientId("admin-cli")
                .username(username)
                .password(password)
                .build();
    }

    /**
     * Configures CORS
     *
     * @param cors mutable cors configuration
     *
     *
     */
    protected void configureCors(CorsConfigurer<HttpSecurity> cors) {

        UrlBasedCorsConfigurationSource defaultUrlBasedCorsConfigSource = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration().applyPermitDefaultValues();
        corsConfiguration.addAllowedOrigin(properties.getCors());
        List.of("GET", "POST", "PUT", "DELETE", "OPTIONS").forEach(corsConfiguration::addAllowedMethod);
        defaultUrlBasedCorsConfigSource.registerCorsConfiguration("/**", corsConfiguration);

        cors.configurationSource(req -> {

            CorsConfiguration config = new CorsConfiguration();

            config = config.combine(defaultUrlBasedCorsConfigSource.getCorsConfiguration(req));

            // check if request Header "origin" is in white-list -> dynamically generate cors config

            return config;
        });
    }

    @Bean
    AccessController accessController() {
        return new AccessController();
    }

//    // This condition allows for disabling security
//    @ConditionalOnProperty(prefix = "security",
//            name = "enabled",
//            havingValue = "true")
//    @EnableMethodSecurity(prePostEnabled = true, jsr250Enabled = true) // Allow @PreAuthorize and @RoleAllowed annotations
//    static class Dummy {
//        public Dummy(){
//            System.out.println("Initializing Security");
//        }
//
//    }

//    private static final String GROUPS = "groups";
//    private static final String REALM_ACCESS_CLAIM = "realm_access";
//    private static final String ROLES_CLAIM = "roles";
//
//    /**
//     * Needed to get role-based authorization to work.
//     * @see <a href="https://www.baeldung.com/spring-boot-keycloak">https://www.baeldung.com/spring-boot-keycloak</a>
//     */
//    @Bean
//    public GrantedAuthoritiesMapper userAuthoritiesMapperForKeycloak() {
//        return authorities -> {
//            System.out.printf("Authorities: %s%n", authorities);
//            Set<GrantedAuthority> mappedAuthorities = new HashSet<>();
//            var authority = authorities.iterator().next();
//            boolean isOidc = authority instanceof OidcUserAuthority;
//
//            if (isOidc) {
//                var oidcUserAuthority = (OidcUserAuthority) authority;
//                var userInfo = oidcUserAuthority.getUserInfo();
//
//                // Tokens can be configured to return roles under
//                // Groups or REALM ACCESS hence have to check both
//                if (userInfo.hasClaim(REALM_ACCESS_CLAIM)) {
//                    var realmAccess = userInfo.getClaimAsMap(REALM_ACCESS_CLAIM);
//                    var roles = (Collection<String>) realmAccess.get(ROLES_CLAIM);
//                    mappedAuthorities.addAll(generateAuthoritiesFromClaim(roles));
//                } else if (userInfo.hasClaim(GROUPS)) {
//                    Collection<String> roles = (Collection<String>) userInfo.getClaim(
//                            GROUPS);
//                    mappedAuthorities.addAll(generateAuthoritiesFromClaim(roles));
//                }
//            } else {
//                var oauth2UserAuthority = (OAuth2UserAuthority) authority;
//                Map<String, Object> userAttributes = oauth2UserAuthority.getAttributes();
//
//                if (userAttributes.containsKey(REALM_ACCESS_CLAIM)) {
//                    Map<String, Object> realmAccess = (Map<String, Object>) userAttributes.get(
//                            REALM_ACCESS_CLAIM);
//                    Collection<String> roles = (Collection<String>) realmAccess.get(ROLES_CLAIM);
//                    mappedAuthorities.addAll(generateAuthoritiesFromClaim(roles));
//                }
//            }
//            System.out.printf("Mapped Authorities: %s%n", mappedAuthorities);
//            return mappedAuthorities;
//        };
//    }
//
//        Collection<GrantedAuthority> generateAuthoritiesFromClaim(Collection<String> roles) {
//            return roles.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role)).collect(
//                    Collectors.toList());
//        }



}